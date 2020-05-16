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

    /**
     * Players start with a 11 letter word, then get a 12 letter word, then a 13 letter word.
     * If they guess all three words, the start back at 11 letters.
     * @param axios
     * @param puzzlesCompleted
     * @returns {Promise<Puzzle>}
     */
    static async newGame(axios, puzzlesCompleted) {
        let wordLength;
        if (puzzlesCompleted % 3 == 0) wordLength = 11;
        else if (puzzlesCompleted % 3 == 1) wordLength = 12;
        else if (puzzlesCompleted % 3 == 2) wordLength = 13;
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
