import Message from "./Message";
import LingoLetter from "./LingoLetter";

class Lingo {

    constructor(props, resultAnimator) {
        this.id = props.id; // the id of the word we are looking for
        this.resultAnimator = resultAnimator;
        this.maxAttempts = 5;
        this.extraAttempts = 1;
        this.isExtraAttempt = false;
        this.wordLength = props.length;
        this.completed = false;
        this.lastResult = {};
        this.currentAttempt = 0;
        this.attempts = [
            this.newAttempt(),
            this.newAttempt(),
            this.newAttempt(),
            this.newAttempt(),
            this.newAttempt()
        ];
        // prefill the first position
        for (let i in this.getCurrentAttempt()) this.getCurrentAttempt()[i].typed = '.'; // prefill
        this.getCurrentAttempt()[0].confirmed = props.firstLetter;
        this.getCurrentAttempt()[0].typed = props.firstLetter;
    }

    newAttempt() {
        let letters = [];
        for (let i = 0; i < this.wordLength; i++) letters.push(new LingoLetter());
        return letters;
    }

    async verifyCurrentAttempt(axios) {
        let game = this;
        let currentAttempt = this.getCurrentAttempt();
        let word = '';
        for (let l of currentAttempt) word += l.typed;
        let result = {};
        this.lastResult = {};
        await axios.post('/api/lingo/validate/' + this.id, {
            guess: word
        }).then((response) => {
            if (response.data.win) {
                game.completed = true;
                currentAttempt.forEach(l => { l.confirmed = l.typed });
            } else {
                for (let c of response.data.contains) {
                    currentAttempt[c].contained = true;
                }
                for (let c of response.data.correct) {
                    currentAttempt[c].confirmed = currentAttempt[c].typed;
                }
            }
        }).catch((error) => {
            if (error.response.data.invalidWord) {
                result.invalidWord = true;
                Message.push("Het woord is niet geldig");
            } else {
                result.unknownWord = true;
                Message.push("Het woord staat niet in het woordenboek");
            }
            this.lastResult = result;
        });

        // now process the result
        if (result.invalidWord || result.unknownWord) {
            await this.resultAnimator.lingoAttemptFailed(currentAttempt);
            currentAttempt.forEach(l => { if (!l.confirmed) l.typed = '.' });
            this.currentAttempt--;
            // the turn will be handed over to the other team by the game controller
            // but it should not count, so the other team plays the same turn again
        } else {
            await this.resultAnimator.lingoAttemptCompleted(currentAttempt);
            if (game.completed) {
                // flip the letters etc
                await this.resultAnimator.lingoWordGuessed(currentAttempt);
                document.dispatchEvent(new Event('LingoSuccess'));
                return result;
            } else {
                if (this.isExtraAttempt) { // this was an extra attempt, you won't lose your turn
                    await this.showWord();
                    return document.dispatchEvent(new Event('LingoWordNotGuessed'));
                }
            }
        }
        this.nextAttempt();
        document.dispatchEvent(new Event('LingoTurnCompleted'));
        return result;
    }

    setChar(position, letter) {
        letter = letter.toLowerCase();
        let _attempts = {...this.attempts};
        let a = _attempts[this.currentAttempt];

        if (letter.match(/j/i) && position > 0 && a[position-1].typed.match(/i/i)) {
            a[position-1].typed = '\u0133'; // IJ ligatuur
            return false;
        }

        if (position >= this.wordLength) {
            return false;
        }

        a[position].typed = letter;
        return true;
    }

    getCurrentAttempt() {
        return this.attempts[this.currentAttempt];
    }

    nextAttempt() {
        let lastAttempt = this.getCurrentAttempt();
        this.currentAttempt++;
        if (this.currentAttempt === this.maxAttempts) {
            this.isExtraAttempt = true;
            this.attempts.push(this.newAttempt());
        }

        let nextAttempt = this.getCurrentAttempt();
        for (let i in lastAttempt) {
            nextAttempt[i].confirmed = lastAttempt[i].confirmed;
            nextAttempt[i].typed = nextAttempt[i].confirmed || '.';
        }
    }

    async getBonusLetter() {
        if (this.getCurrentAttempt().filter(l => l.confirmed).length >= this.wordLength - 1) {
            console.log("Refusing to give the last letter");
            // never give away the last letter
            return true;
        }
        let attempt = this.getCurrentAttempt();
        let nextEmptyPosition;
        for (let i = 0; i < this.wordLength; i++) {
            if (!attempt[i].confirmed) {
                nextEmptyPosition = i;
                break;
            }
        }
        if (nextEmptyPosition > 0) {
            let response = await axios.post('/api/lingo/getBonusLetter/' + this.id + '/' + nextEmptyPosition);
            attempt[nextEmptyPosition].confirmed = response.data.letter;
            attempt[nextEmptyPosition].typed = response.data.letter;
            return true;
        }
        return false;
    }

    async showWord() {
        let response = await axios.get('/api/lingo/getSolution/' + this.id)
        let newLine = this.newAttempt();
        this.attempts.push(newLine);

        return this.resultAnimator.revealSolution(response.data.word, newLine);
    }

    undo() {
        if (this.currentAttempt > 0) {
            // TODO undo switch teams
            this.attempts[this.currentAttempt] = this.newAttempt();
            this.currentAttempt--;
            this.attempts[this.currentAttempt].typed = {};
        }
    }

    static getWordLengthForRound(round) {
        switch (round) {
            case 3: return 7;
            case 2: return 6;
            default: return 5;
        }
    }

    static async newGame(axios, round, resultAnimator) {
        const response = await axios.get(`/api/lingo/newWord/` + Lingo.getWordLengthForRound(round));
        return new Lingo(response.data, resultAnimator);
    }

}
export default Lingo;
