import Message from "./Message";

class Lingo {

    constructor(props) {
        this.id = props.id; // the id of the word we are looking for
        this.maxAttempts = 5;
        this.extraAttempts = 1;
        this.isExtraAttempt = false;
        this.wordLength = props.length;
        this.inPlace = props.firstLetter;
        this.correctLetters = [];
        this.completed = false;
        this.lastResult = {};
        this.attempts = [
            { prefill: {0: props.firstLetter}, typed: {}, correct: [0], contains: [] },
            this.newAttempt(),
            this.newAttempt(),
            this.newAttempt(),
            this.newAttempt()
        ];
        this.currentAttempt = 0;
    }

    newAttempt() {
        return { prefill: {}, typed: {}, correct: [], contains: [] };
    }

    async verifyCurrentAttempt(axios) {
        let game = this;
        let currentAttempt = this.getCurrentAttempt();
        let word = '';
        for (let l in currentAttempt.typed) word += currentAttempt.typed[l];
        let result = {};
        this.lastResult = {};
        await axios.post('/api/lingo/validate', {
            id: this.id,
            guess: word
        }).then((response) => {
            if (response.data.win) {
                for (let i = 0; i < this.wordLength; i++) currentAttempt.correct.push(i);
                game.completed = true;
                document.dispatchEvent(new Event('LingoSuccess'));
            } else {
                currentAttempt.contains = response.data.contains;
                currentAttempt.correct = response.data.correct;
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
        if (!game.completed) {
            if (this.isExtraAttempt) { // this was an extra attempt, you won't lose your turn
                this.showWord();
                return document.dispatchEvent(new Event('LingoWordNotGuessed'));
            }
            this.nextAttempt();
            document.dispatchEvent(new Event('LingoTurnCompleted'));
        }
        return result;
    }

    setChar(position, letter) {
        let _attempts = {...this.attempts};
        let a = _attempts[this.currentAttempt];
        a.typed[position] = letter;
        this.attempts = _attempts; // this so Vue detects the change and re-renders
    }

    getCurrentAttempt() {
        return this.attempts[this.currentAttempt];
    }

    nextAttempt() {
        let nextAttempt = JSON.parse(JSON.stringify(this.getCurrentAttempt())); // deep clone
        nextAttempt.contains = []; // reset contains list, but keep correct list
        nextAttempt.correct.forEach(pos => {
            nextAttempt.prefill[pos] = nextAttempt.prefill[pos] || nextAttempt.typed[pos];
        }); // existing prefills are kept, only add new ones
        nextAttempt.typed = {}; // now clear typed buffer

        this.attempts[++this.currentAttempt] = nextAttempt;
        if (this.currentAttempt == this.maxAttempts) {
            this.isExtraAttempt = true;
            // refresh for Vue
            this.attempts = {...this.attempts}; // this so Vue detects the change and re-renders
        }
    }

    async getBonusLetter() {
        if (this.getCurrentAttempt().correct.length >= this.wordLength - 1) {
            // never give away the last letter
            return true;
        }
        let attempt = this.getCurrentAttempt();
        let nextEmptyPosition;
        for (let i = 0; i < this.wordLength; i++) {
            if (!attempt.prefill[i]) {
                nextEmptyPosition = i;
                break;
            }
        }
        if (nextEmptyPosition > 0) {
            await axios.post('/api/lingo/getBonusLetter/' + this.id + '/' + nextEmptyPosition)
                .then(response => {
                    attempt.prefill[nextEmptyPosition] = response.data.letter;
                    attempt.correct.push(nextEmptyPosition);
                });
            return true;
        }
    }

    async showWord() {
        await axios.post('/api/lingo/getSolution/' + this.id)
            .then(response => {
                let attempt;
                for (let i=0; i < response.data.word; i++) {
                    attempt.prefill[i] = response.data.word[i];
                    attempt.correct.push(i);
                }
                this.attempts.push(attempt);
            });
       return true;
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

    static async newGame(axios, round) {
        const response = await axios.get(`/api/lingo/getWord/` + Lingo.getWordLengthForRound(round));
        return new Lingo(response.data);
    }

}
export default Lingo;
