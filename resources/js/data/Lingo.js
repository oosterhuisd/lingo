import Message from "./Message";

class Lingo {

    constructor(props) {
        const maxAttempts = 5;
        const extraAttempts = 1;
        this.id = props.id; // the id of the word we are looking for
        this.wordLength = props.length;
        this.inPlace = props.firstLetter;
        this.correctLetters = [];
        this.completed = false;
        this.lastResult = {};
        this.attempts = [
            { prefill: {0: props.firstLetter}, typed: {}, correct: [0], contains: [] },
            { prefill: {}, typed: {}, correct: [], contains: [] },
            { prefill: {}, typed: {}, correct: [], contains: [] },
            { prefill: {}, typed: {}, correct: [], contains: [] },
            { prefill: {}, typed: {}, correct: [], contains: [] }
        ];
        this.currentAttempt = 0;
    }

    async verifyCurrentAttempt(axios) {
        let game = this;
        let currentAttempt = this.getCurrentAttempt();
        let word = '';
        for (let l in currentAttempt.typed) word += currentAttempt.typed[l];
        let result = {};
        await axios.post('/api/lingo/validate', {
            id: this.id,
            guess: word
        }).then((response) => {
            if (response.data.win) {
                game.completed = true;
                document.dispatchEvent(new Event('LingoCompleted'));
                for (let i = 0; i < this.wordLength; i++) currentAttempt.correct.push(i);
            } else {
                currentAttempt.contains = response.data.contains;
                currentAttempt.correct = response.data.correct;
            }
        }).catch((error) => {
            if (error.response.data.invalidWord) {
                result.invalidWord = true;
                Message.push("Het woord is niet geldig");
            } else {
                Message.push("Het woord staat niet in het woordenboek");
                result.unknownWord = true;
            }
            document.dispatchEvent(new Event('LingoBadWordInput'));
        });
        return result;
    }

    setChar(position, letter) {
        let _attempts = {...this.attempts};
        let a = _attempts[this.currentAttempt];
        a.typed[position] = letter;
        this.attempts = _attempts; // this so Vue detects the change and rerenders
    }

    getCurrentAttempt() {
        return this.attempts[this.currentAttempt];
    }

    nextAttempt() {
        let nextAttempt = {...this.getCurrentAttempt()};
        nextAttempt.contains = []; // reset contains list, but keep correct list
        nextAttempt.correct.forEach(pos => {
            nextAttempt.prefill[pos] = nextAttempt.typed[pos];
        }); // all other prefills are kept, add new ones
        nextAttempt.typed = {}; // now clear typed buffer
        this.attempts[++this.currentAttempt] = nextAttempt;
    }

    getHint() {
        return this.inPlace;
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
