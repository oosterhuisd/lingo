class Puzzle {

    constructor(props) {
        this.id = props.id;
        this.wordLength = props.length;
        this.inPlace = props.firstLetter;
        this.letters = props.letters;
        this.guesses = [];
        this.completed = false;
        this.lastResult = {};
    }

    async verify(axios, word) {
        return axios.post('/api/puzzle/validate', {
            id: this.id,
            guess: word
        });
    }

    async getNextLetter(axios) {
        return axios.post('/api/puzzle/getLetter', {
            id: this.id,
            currentLetters: this.inPlace
        }).then(function(response) {
            this.inPlace = response.data.letters;
        });
    }

    static async newGame(axios, wordLength) {
        const response = await axios.get(`/api/puzzle/getWord/` + wordLength);
        return new Puzzle(response.data);
    }

    async init(axios, wordLength) {
        const response = await axios.get(`/api/puzzle/getWord/` + wordLength);
        this.id = response.id;
        this.wordLength = response.length;
    }
}
export default Puzzle;
