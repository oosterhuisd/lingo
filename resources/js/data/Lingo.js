class Lingo {

    constructor(axios, wordLength) {
        this.wordLength = wordLength;
        this.init(axios, wordLength);
    }

    async verify(axios, word) {
        return axios.post('/api/lingo/validate', {
            id: this.id,
            guess: word
        });
    }

    async init(axios, wordLength) {
        const response = await axios.get(`/api/lingo/getWord/` + wordLength);
        this.id = response.id;
        this.wordLength = response.length;
    }
}
export default Lingo;
