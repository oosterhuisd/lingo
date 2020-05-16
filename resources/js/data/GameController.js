import Lingo from "./Lingo";
import Puzzle from "./Puzzle";
import Message from "./Message";

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

    setGameListeners() {
        document.addEventListener('LingoCompleted', evt => {
            Message.push("Dat is het goede woord!");
            this.activeTeam.score += 25;
            this.lingoWordsPlayed++;
            setTimeout(() => { this.gamePhase = 'puzzle'; }, 2500);
        });
        document.addEventListener('LingoTurnCompleted', evt => {
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
            Lingo.newGame(axios, this.currentRound)
                .then(game => this.lingoGame = game);
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
        document.addEventListener('PuzzleWordGuessed', evt => {
            console.log("A Puzzle word was guessed!");
            this.activeTeam.puzzlesCompleted++;
            if (this.activeTeam == this.team1) {
                this.puzzleGame1 = Puzzle.newGame(axios, this.activeTeam.puzzlesCompleted);
            } else {
                this.puzzleGame2 = Puzzle.newGame(axios, this.activeTeam.puzzlesCompleted);
            }
            this.gamePhase = 'lingo';
        });
    }

    async init() {
        this.team1 = {
            name: 'Team 1',
            score: 0,
            players: ['P1', 'P2'],
            puzzlesCompleted: 0
        };
        this.team2 = {
            name: 'Team 2',
            score: 0,
            players: ['P3', 'P4'],
            puzzlesCompleted: 0
        };
        this.currentRound = 1;
        this.activeTeam = this.team1;

        // load games
        this.lingoGame = await Lingo.newGame(axios, this.currentRound);
        this.puzzleGame1 = await Puzzle.newGame(axios, 11);
        this.puzzleGame2 = await Puzzle.newGame(axios, 11);

        this.gamePhase = 'lingo';
        this.setGameListeners();
    }

}

export default GameController;
