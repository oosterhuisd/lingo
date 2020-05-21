import Sound from "./Sound";

class ResultAnimator {

    constructor() {
        this.lingoFail = new Sound('/media/sounds/lingo-invalid-word.mp3');
        this.lingoTimeout = new Sound('/media/sounds/lingo-invalid-word.mp3');
        this.lingoLetterCorrect = new Sound('/media/sounds/lingo-letter-correct.mp3');
        this.lingoLetterContained = new Sound('/media/sounds/lingo-letter-wrong.mp3');
        this.lingoLetterWrong = new Sound('/media/sounds/lingo-letter-wrong.mp3');
    }

    async handleLingoGuess(attempt) {
        let delay = 300;
        let promise = Promise.resolve();
        for (let letter of attempt) { /* @var LingoLetter letter */
            promise = promise.then(() => {
                if (letter.typed === letter.confirmed) {
                    this.lingoLetterCorrect.play();
                } else if (letter.contained) {
                    this.lingoLetterContained.play();
                } else {
                    this.lingoLetterWrong.play();
                }
                letter.checked = true;
                return new Promise((resolve, reject) => setTimeout(resolve, delay));
            });
        }
        return promise;
    }

}
export default ResultAnimator;
