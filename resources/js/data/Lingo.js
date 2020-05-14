class Lingo {

    constructor(props) {
        this.id = props.id;
        this.wordLength = props.length;
        this.inPlace = props.firstLetter;
        this.correctLetters = [];
        this.guesses = [];
    }

    async verify(axios, word) {
        this.guesses.push(word);
        return axios.post('/api/lingo/validate', {
            id: this.id,
            guess: word
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
