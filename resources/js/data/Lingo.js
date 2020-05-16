class Lingo {

    constructor(props) {
        this.id = props.id;
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
        this.currentAttempt = 1;
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
        }).then(function(response) {
            if (response.data.win) {
                game.completed = true;
            } else {
                currentAttempt.contains = response.data.contains;
                currentAttempt.correct = response.data.correct;
                game.nextAttempt();
            }
        }).catch(function(response) {
            if (response.data.invalidWord) {
                result.invalidWord = true;
            } else {
                result.unknownWord = true;
            }
        });
        return result;
    }

    setChar(position, letter) {
        let _attempts = {...this.attempts};
        let a = _attempts[this.currentAttempt - 1];
        a.typed[position] = letter;
        this.attempts = _attempts; // this so Vue detects the change and rerenders
    }

    getCurrentAttempt() {
        return this.attempts[this.currentAttempt - 1];
    }

    nextAttempt() {
        this.currentAttempt++;
    }

    getHint() {
        return this.inPlace;
    }
    static async newGame(axios, wordLength) {
        const response = await axios.get(`/api/lingo/getWord/` + wordLength);
        return new Lingo(response.data);
    }
    async init(axios, wordLength) {
        const response = await axios.get(`/api/lingo/getWord/` + wordLength);
        this.id = response.data.id;
        this.wordLength = response.data.length;
        this.inPlace = response.data.firstLetter;
        this.correctLetters = [];
    }
}
export default Lingo;
