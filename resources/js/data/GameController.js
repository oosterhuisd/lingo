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

    switchTeams() {
        this.activeTeam = (this.activeTeam == this.team1) ? this.team2 : this.team1;
    }

    lingoCompleted() {

    }

    setGameListeners() {
        document.addEventListener('LingoCompleted', evt => {
            console.log("A Lingo game was completed!");
            this.activeTeam.score += 25;
            this.gamePhase = 'puzzle';
        });
        document.addEventListener('LingoBadWordInput', evt => {
            console.log("A Lingo bad word");
            this.switchTeams();
        });
        document.addEventListener('LingoTimeout', evt => {
            console.log("A Lingo timeout");
            this.switchTeams();
        });
        document.addEventListener('LingoAttempt', evt => {
            console.log("A Lingo attempt was submitted");
        });
        document.addEventListener('PuzzleWordGuessed', evt => {
            console.log("A Puzzle word was guessed!");
            this.activeTeam.puzzlesCompleted++;
            if (this.activeTeam == this.team1) {
                this.puzzleGame1 = Puzzle.newGame(axios, 11);
            } else {
                this.puzzleGame2 = Puzzle.newGame(axios, 11);
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

        // load games
        this.lingoGame = await Lingo.newGame(axios, this.currentRound);
        this.puzzleGame1 = await Puzzle.newGame(axios, 11);
        this.puzzleGame2 = await Puzzle.newGame(axios, 11);

        this.gamePhase = 'lingo';
        this.setGameListeners();
    }

}

export default GameController;
