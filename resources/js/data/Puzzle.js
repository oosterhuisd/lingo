class Puzzle {

    constructor(axios, wordLength) {
        this.wordLength = wordLength;
        this.init(axios, wordLength);
    }

    async verify(axios, word) {
        return axios.post('/api/puzzle/validate', {
            id: this.id,
            guess: word
        });
    }

    static newWord(axios, wordLength) {
        return new Lingo(axios, wordLength);
    }

    async init(axios, wordLength) {
        const response = await axios.get(`/api/puzzle/getWord/` + wordLength);
        this.id = response.id;
        this.wordLength = response.length;
    }
}
export default Puzzle;
