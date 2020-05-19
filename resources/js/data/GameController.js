import Lingo from "./Lingo";
import Puzzle from "./Puzzle";
import Message from "./Message";

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

        this.lingoWordsPlayed = 0;
    }

    getActiveGame() {
        if (this.gamePhase == 'lingo') {
            return this.lingoGame;
        } else if (this.gamePhase == 'puzzle') {
            if (this.activeTeam == this.team1) {
                return this.puzzleGame1;
            } else {
                return this.puzzleGame2;
            }
        } else if (this.gamePhase == 'bingo') {
            // return this.bingoGame;
        }
        return null;
    }

    switchTeams(getBonusLetter) {
        this.activeTeam = (this.activeTeam == this.team1) ? this.team2 : this.team1;
        if (getBonusLetter === true && this.getActiveGame() instanceof Lingo) {
            if (this.lingoGame.getBonusLetter()) {
                Message.push(this.activeTeam.name + " krijgt een bonusletter!");
            }
        }
    }

    lingoCompleted() {

    }

    doPuzzleRound() {
        this.gamePhase = 'puzzle';
        this.getActiveGame().ballsDrawn = 0;
    }

    newLingoRound(delay) {
        return Lingo.newGame(axios, this.currentRound).then(game => {
            this.lingoGame = game;
            setTimeout(() => {
                this.gamePhase = 'lingo';
            }, delay || transitionDelay);
        });
    }

    setGameListeners() {
        document.addEventListener('LingoSuccess', evt => {
            Message.push("Dat is het goede woord!");
            this.activeTeam.score += 25;
            this.lingoWordsPlayed++;

            setTimeout(() => {
                this.doPuzzleRound();
            }, transitionDelay);
        });
        document.addEventListener('LingoTurnCompleted', evt => {
            // this event is triggered when a lingo turn is completed without success
            if (this.lingoGame.isExtraAttempt) {
                Message.push("Het maximaal aantal beurten is bereikt. De beurt gaat naar het " +
                    "andere team!");
            }
            if (this.lingoGame.lastResult.invalidWord
                  || this.lingoGame.lastResult.unknownWord
                  || this.lingoGame.isExtraAttempt) {
                this.switchTeams(true);
            }
        });
        document.addEventListener('LingoWordNotGuessed', evt => {
            Message.push("Geeft niks! We gaan gewoon verder met een nieuw woord.");
            this.newLingoRound();
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
            Lingo.newGame(axios, this.currentRound).then(game => {
                this.lingoGame = game;
                setTimeout(() => {
                    this.gamePhase = 'lingo';
                    this.switchTeams();
                }, transitionDelay);
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
                Puzzle.newGame(axios, this.activeTeam.puzzlesCompleted, this.activeTeam.greenBallsDrawn)
                    .then(game => this.puzzleGame1 = game);
            } else {
                Puzzle.newGame(axios, this.activeTeam.puzzlesCompleted, this.activeTeam.greenBallsDrawn)
                    .then(game => this.puzzleGame2 = game);
            }
            Message.push("De beurt gaat over naar het andere team.");
            setTimeout(() => {
                this.switchTeams();
                this.newLingoRound();
                }, transitionDelay);
        });
        document.addEventListener('PuzzleBadGuess', e => {
            Message.push(e.detail.toUpperCase() + " is helaas niet het goede woord. De beurt gaat naar het andere team, dat begint met een nieuw woord.");
            this.switchTeams();
            this.newLingoRound();
        });
        document.addEventListener('PuzzleTimeout', evt => {
            this.newLingoRound();
        });
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
        this.puzzleGame1 = await Puzzle.newGame(axios, 0, 0);
        this.puzzleGame2 = await Puzzle.newGame(axios, 0, 0);

        this.newLingoRound(0);
    }

}

export default GameController;
