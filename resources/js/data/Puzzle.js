import Message from "./Message";

class Puzzle {

    constructor(props, greenBalls) {
        this.id = props.id;
        this.letters = props.letters;
        this.confirmedPositions = [];
        this.completed = false;
        this.balls = ['red','red'];
        for (let i=0; i < greenBalls; i++) this.balls.push('green');
        for (let i=0; i < this.letters.length; i++) this.balls.push(this.letters[i]);

        this.ballsDrawn = 0;
    }

    async verify(axios, word) {
        return axios.post('/api/puzzle/validate/' + this.id, {
            guess: word
        }).then(response => {
            this.completed = true;
            document.dispatchEvent(new Event('PuzzleSuccess'));
        }).catch(error => {
            document.dispatchEvent(new CustomEvent('PuzzleBadGuess', { guessed: word }));
            Message.push(word.toUpperCase() + " is niet het juiste woord. Helaas!");
        });
    }

    async drawBall(axios) {
        let pos = Math.floor(Math.random() * this.balls.length);
        let ball = this.balls[pos];
        this.balls.splice(pos, 1); // remove drawn ball

        if (ball == 'red') {
            document.dispatchEvent(new Event('RedBallDrawn'));
            return;
        } else if (ball == 'green') {
            document.dispatchEvent(new Event('RedBallDrawn'));
            return;
        }
        let position = await axios.post('/api/puzzle/getLetterPosition/' + this.id + '/' + ball, {
            knownPositions: this.confirmedPositions
        }).then(response => {
            let properPosition = response.data.position;
            if (this.letters[properPosition] !== ball) { // it's already in the right spot
                for (let i = 0; i < this.letters.length; i++) {
                    if (this.confirmedPositions.includes(i)) continue;
                    if (this.letters[i] == ball) { // switcheroo
                        let lt = this.letters;
                        lt = lt.replaceAt(i, this.letters[properPosition]);
                        lt = lt.replaceAt(properPosition, ball);
                        this.letters = lt;
                    }
                }
            }
            this.confirmedPositions.push(response.data.position);
        });
        return position;
    }

    timeOut() {
        document.dispatchEvent(new Event('PuzzleTimeout'));
    }

    /**
     * Players start with a 11 letter word, then get a 12 letter word, then a 13 letter word.
     * If they guess all three words, the start back at 11 letters.
     * @param axios
     * @param puzzlesCompleted
     * @returns {Promise<Puzzle>}
     */
    static async newGame(axios, puzzlesCompleted, greenBallsDrawn) {
        let wordLength;
        if (puzzlesCompleted % 3 == 0) wordLength = 11;
        else if (puzzlesCompleted % 3 == 1) wordLength = 12;
        else if (puzzlesCompleted % 3 == 2) wordLength = 13;
        const response = await axios.get(`/api/puzzle/getWord/` + wordLength);
        return new Puzzle(response.data, 2 - greenBallsDrawn);
    }

    async init(axios, wordLength) {
        const response = await axios.get(`/api/puzzle/getWord/` + wordLength);
        this.id = response.id;
        this.wordLength = response.length;
    }
}
export default Puzzle;
