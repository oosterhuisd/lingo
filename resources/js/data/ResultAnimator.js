import Sound from "./Sound";

class ResultAnimator {

    constructor() {
        this.lingoFail = new Sound('/media/sounds/lingo-invalid-word.mp3');
        this.lingoTimeout = new Sound('/media/sounds/lingo-invalid-word.mp3');
        this.lingoLetterCorrect = new Sound('/media/sounds/lingo-letter-correct.mp3');
        this.lingoLetterContained = new Sound('/media/sounds/lingo-letter-wrong.mp3');
        this.lingoLetterWrong = new Sound('/media/sounds/lingo-letter-wrong.mp3');
    }

    async lingoAttemptFailed(attempt) {
        return this.lingoTimeout.play();
    }

    async lingoAttemptCompleted(attempt, delayAfterComplete) {
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

        if (delayAfterComplete) {
            promise = promise.then(() => this.delay(delayAfterComplete));
        }

        return promise;
    }

    /**
     * @param attempt
     * @returns {Promise<void>}
     */
    async lingoWordGuessed(attempt) {
        let sweepDelay = 200;
        let timeToEnjoyTheMoment = 1000;
        let promise = Promise.resolve();
        for (let i=0; i < 2; i++) { // flip twice
            for (let letter of attempt) { /* @var LingoLetter letter */
                promise = promise.then(() => {
                    letter.animate = !letter.animate;
                    return new Promise((resolve, reject) => setTimeout(resolve, sweepDelay));
                });
            }
        }

        // after the animation, wait a while
        promise = promise.then(() => this.delay(timeToEnjoyTheMoment));

        return promise;
    }

    async revealSolution(word, attempt) {
        let delay = 300;
        let timeToEnjoyTheMoment = 1000;
        let promise = Promise.resolve();
        for (let i=0; i < word.length; i++) {
            promise = promise.then(() => {
                this.lingoLetterCorrect.play();
                attempt[i].typed = word[i];
                attempt[i].checked = true;
                return new Promise((resolve, reject) => setTimeout(resolve, delay));
            });
        }
        // some more delay
        promise = promise.then(() => this.delay(timeToEnjoyTheMoment));
        return promise;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }

}
export default ResultAnimator;
