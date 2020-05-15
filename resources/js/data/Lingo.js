class Lingo {

    constructor(props) {
        this.id = props.id;
        this.wordLength = props.length;
        this.inPlace = props.firstLetter;
        this.correctLetters = [];
        this.guesses = [];
        this.completed = false;
        this.lastResult = {};
    }

    async verify(axios, word) {
        let game = this;
        this.guesses.push(word);
        this.lastResult = {};
        return axios.post('/api/lingo/validate', {
            id: this.id,
            guess: word
        }).then(function(response) {
            if (response.status === 200) {
                game.completed = true;
            } else if (response.status === 206) { // partial result
                game.inPlace = response.data.inPlace;
                game.correctLetters = response.data.correctLetters;
            }
        }).catch(function(response) {
            if (response.status === 400) {
                game.lastResult.invalidWord = true;
            } else {
                game.lastResult.unknownWord = true;
            }
        });
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
