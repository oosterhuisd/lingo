<template>
    <div class="container">
        <div class="row justify-content-center">

            <div class="col-md-2">
                <team :name="'Team 1'" :data="team1" :isPlaying="activeTeam == team1"></team>
            </div>
            <div class="col-md-8">
                <lingo-board v-if="doLingo"
                             :game="lingoGame"
                             ref="lingo"
                             @wordGuessed="lingoWordGuessed"
                             @invalidWord="lingoWordInvalid">
                </lingo-board>
                <puzzle-word
                    v-if="gamePhase == 'puzzle'"
                    ref="puzzle"
                    :game="puzzleInstance">
                </puzzle-word>
                <bingo-card v-if="gamePhase == 'bingo'"></bingo-card>
            </div>
            <div class="col-md-2">
                <team :name="'Team 2'" :data="team2" :isPlaying="activeTeam == team2"></team>
            </div>
        </div>
    </div>
</template>

<script>
    import Lingo from "../data/Lingo";
    import Puzzle from "../data/Puzzle";

    const axios = require('axios').default;
    import './Team';
    import './LingoBoard';
    import './PuzzleWord';
    import './BingoCard';
    import Message from "../data/Message";

    export default {
        data() {
            return {
                loading: true,
                gamePhase: null,
                wordLength: 5,
                lingoGame: null,
                puzzle1: null,
                puzzle2: null,
                team1: {
                    name: 'Team 1',
                    player1: 'p1',
                    player2: 'p2',
                    score: 0
                },
                team2: {
                    name: 'Team 2',
                    player1: 'p3',
                    player2: 'p4',
                    score: 0
                },
                activeTeam: null
            }
        },
        computed: {
            puzzleInstance() {
                if (this.activeTeam == this.team1) {
                    return this.puzzle1;
                } else {
                    return this.puzzle2;
                }
            },
            doLingo() {
                return this.gamePhase == 'lingo' && !this.loading;
            }
        },
        methods: {
            switchActiveTeam() {
                this.activeTeam = (this.activeTeam == this.team1) ? this.team2 : this.team1;
            },
            newLingoGame() {
                this.loading = true;
                Lingo.newGame(axios, this.wordLength).then(game => {
                    this.lingoGame = game;
                    this.loading = false;
                });
            },
            lingoWordGuessed() {
                Message.push("Word was guessed by " + this.activeTeam.name)
                this.activeTeam.score += 25;
                this.gamePhase = 'puzzle';
                this.newLingoGame();
            },
            lingoWordInvalid() {
                this.switchActiveTeam();
            },
            puzzleWordGuessed() {
                this.activeTeam.score += 100;
                this.switchActiveTeam();
                this.gamePhase = 'lingo';
                Message.push("Puzzle word was guessed by " + this.activeTeam.name)
            },
            puzzleWordNotGuessed() {
                this.gamePhase = 'lingo';
                Message.push("Puzzle word was not guessed by " + this.activeTeam)
            },
            getActiveGame() {
                if (this.gamePhase == 'lingo') {
                    return this.$refs.lingo;
                } else if (this.gamePhase == 'puzzle') {
                    return this.$refs.puzzle;
                } else if (this.gamePhase == 'bingo') {
                    // return this.bingoGame;
                }
                return null;
            },
            getUserInput() {
                let controller = this;
                document.onkeydown = function(evt) {
                    let activeGame = controller.getActiveGame();
                    if (!activeGame) {
                        return true;
                    }

                    evt = evt || window.event;
                    let keycode;
                    if (evt.ctrlKey && evt.keyCode === 90) {
                        return activeGame.undo();
                    }
                    if (evt.keyCode > 64 && evt.keyCode < 91) {
                        // a valid letter was typed
                        return activeGame.input(String.fromCharCode(evt.keyCode));
                    }
                    if (evt.keyCode === 13) {
                        // Enter was pressed
                        return activeGame.submit();
                    }
                    if (evt.keyCode === 8) {
                        // Backspace was pressed
                        return activeGame.backspace();
                    }
                    if (evt.ctrlKey) { // allow [CTRL + *] for easy dev page refresh
                        return true;
                    }
                    Message.push("Ignoring keystroke " + evt.keyCode);
                    return false; // ignore all other keystrokes
                };
            }
        },
        async mounted() {
            this.activeTeam = this.team1;
            this.gamePhase = 'lingo';

            this.loading = true;
            this.lingoGame = await Lingo.newGame(axios, this.wordLength);
            this.puzzle1 = await Puzzle.newGame(axios, 11);
            this.puzzle2 = await Puzzle.newGame(axios, 11);

            this.loading = false;
            this.getUserInput();
        }
    }
</script>
