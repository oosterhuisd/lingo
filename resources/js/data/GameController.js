import Lingo from "./Lingo";
import Puzzle from "./Puzzle";
import Message from "./Message";
import ResultAnimator from "./ResultAnimator";

let transitionDelay = 0;

class GameController {

    constructor() {
        this.activeTeam = null;
        this.team1 = null;
        this.team2 = null;
        this.gamePhase = null;
        this.lingoGame = null;
        this.puzzleGame1 = null;
        this.puzzleGame2 = null;

        this.resultAnimator = new ResultAnimator();

        this.lingoWordsPlayed = 0;
        this.finalRoundPlayed = false;
    }

    getActiveGame() {
        if (this.gamePhase === 'lingo') {
            return this.lingoGame;
        } else if (this.gamePhase === 'puzzle') {
            if (this.activeTeam === this.team1) {
                return this.puzzleGame1;
            } else {
                return this.puzzleGame2;
            }
        } else if (this.gamePhase === 'bingo') {
            // return this.bingoGame;
        }
        return null;
    }

    switchTeams(getBonusLetter) {
        this.activeTeam = (this.activeTeam === this.team1) ? this.team2 : this.team1;
        Message.push("De beurt gaat naar " + this.activeTeam.name + ".");
        if (getBonusLetter === true && this.getActiveGame() instanceof Lingo) {
            if (this.lingoGame.getBonusLetter()) {
                Message.push(this.activeTeam.name + " krijgt een bonusletter!");
            } else {
                Message.push("Jullie krijgen er geen bonusletter bij.");
            }
        }
    }

    lingoCompleted() {

    }

    doPuzzleRound() {
        this.gamePhase = 'puzzle';
        this.getActiveGame().ballsDrawn = 0;
        this.getActiveGame().time = 20;
        setTimeout(this.nextGamePhase, 10000);
    }

    nextGamePhase() {
        if (this.gamePhase === 'lingo') {
            this.gamePhase = 'puzzle';
        } else if (this.gamePhase === 'puzzle' && this.round === 3) {
            this.round++;
            this.gamePhase = 'final1';
        } else if (this.gamePhase === 'puzzle') {
            this.gamePhase = 'lingo';
        }
    }

    getWinner() {
        if (!this.isThereAWinner()) return null;
        if (this.team1.score > this.team2.score) return this.team1;
        return this.team2;
    }

    newLingoGame(delay) {
        if (this.isThereAWinner()) {
            Message.push(this.getWinner().name + " heeft gewonnen!!!", {duration: 30000});
            return Promise.reject("Er is een winnaar");
        }
        return Lingo.newGame(axios, this.currentRound, this.resultAnimator).then(game => {
            this.lingoGame = game;
            setTimeout(() => {
                this.gamePhase = 'lingo';
            }, delay || transitionDelay);
        });
    }

    setGameListeners() {
        document.addEventListener('LingoSuccess', evt => {
            Message.push("Dat is het goede woord!");
            if (this.currentRound === 3) {
                this.activeTeam.score += 50;
                this.finalRoundPlayed = true;
            } else {
                this.activeTeam.score += 25;
            }
            this.lingoWordsPlayed++;
            if (this.lingoWordsPlayed === 4) {
                this.currentRound = 2; // go to 6 letter words
            }
            if (this.lingoWordsPlayed === 10) {
                this.currentRound = 3; // go to the 7 letter tiebreak round
            }
            setTimeout(() => {
                this.doPuzzleRound();
            }, transitionDelay);
        });
        document.addEventListener('LingoTurnCompleted', evt => {
            // this event is triggered when a lingo turn is completed without success
            if (this.lingoGame.isExtraAttempt) {
                Message.push("Het maximaal aantal beurten is bereikt.");
            }
            if (this.lingoGame.lastResult.invalidWord
                  || this.lingoGame.lastResult.unknownWord
                  || this.lingoGame.lastResult.timeout
                  || this.lingoGame.isExtraAttempt) {
                this.switchTeams(true);
            } else if (this.currentRound === 3) {
                // in the third round, you switch after every turn
                this.switchTeams(false);
            }

        });
        document.addEventListener('LingoWordNotGuessed', evt => {
            Message.push("Geeft niks! We gaan gewoon verder met een nieuw woord.");
            this.newLingoGame();
        });
        document.addEventListener('LingoTimeout', evt => {
            console.log("A Lingo timeout was caught");
            this.switchTeams(true);
        });
        document.addEventListener('LingoMaxAttemptsReached', evt => {
            console.log("Max attempts was reached");
            this.switchTeams(true);
        });
        document.addEventListener('LingoAttempt', evt => {
            console.log("A Lingo attempt was submitted");
        });
        document.addEventListener('RedBallDrawn', evt => {
            Message.push("Rukkie! Da's de rode bal!");
            this.newLingoGame().then(()=> {
                this.switchTeams();
            });
        });
        document.addEventListener('GreenBallDrawn', evt => {
            this.activeTeam.greenBallsDrawn++;
            this.activeTeam.score += 10;
            Message.push("Dat is een groene bal! " + this.activeTeam.name + ' krijgt er 10 EUR bij.');
        });
        document.addEventListener('PuzzleSuccess', evt => {
            Message.push("Dat is het juiste woord! Jullie krijgen er 100 EUR bij!");
            this.activeTeam.puzzlesCompleted++;
            this.activeTeam.score += 100;
            if (this.activeTeam === this.team1) {
                Puzzle.newGame(axios, this.activeTeam.puzzlesCompleted, this.activeTeam.greenBallsDrawn, this.resultAnimator)
                    .then(game => this.puzzleGame1 = game);
            } else {
                Puzzle.newGame(axios, this.activeTeam.puzzlesCompleted, this.activeTeam.greenBallsDrawn, this.resultAnimator)
                    .then(game => this.puzzleGame2 = game);
            }
            this.newLingoGame().then(() => {
                this.switchTeams();
            });
        });
        document.addEventListener('PuzzleBadGuess', e => {
            Message.push(e.detail.toUpperCase() + " is helaas niet het goede woord.");
            this.newLingoGame().then(() => {
                this.switchTeams();
            });
        });
        document.addEventListener('PuzzleTimeout', evt => {
            this.newLingoGame();
        });
    }

    isThereAWinner() {
        return this.finalRoundPlayed && this.team1.score !== this.team2.score;
    }

    async init() {
        this.team1 = {
            name: 'Team 1',
            score: 0,
            players: ['P1', 'P2'],
            puzzlesCompleted: 0,
            greenBallsDrawn: 0
        };
        this.team2 = {
            name: 'Team 2',
            score: 0,
            players: ['P3', 'P4'],
            puzzlesCompleted: 0,
            greenBallsDrawn: 0
        };
        this.currentRound = 1;
        this.activeTeam = this.team1;

        // load games
        this.setGameListeners();
        await Promise.all([
            this.puzzleGame1 = await Puzzle.newGame(axios, 0, 0, this.resultAnimator),
            this.puzzleGame2 = await Puzzle.newGame(axios, 0, 0, this.resultAnimator),
            this.newLingoGame(0)
        ]).then(() => {
            console.log("Good to go!");
        });
    }

}

export default GameController;
