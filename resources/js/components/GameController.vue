<template>
    <div class="container">
        <div class="row justify-content-center" v-if="this.initialized">

            <div class="col-md-2">
                <team :name="'Team 1'" :data="gameController.team1" :isPlaying="team1Active"></team>
            </div>
            <div class="col-md-8">
                <lingo-board v-if="doLingo"
                             :game="gameController.lingoGame"
                             ref="lingo"
                             @wordGuessed="lingoWordGuessed"
                             @invalidWord="lingoWordInvalid">
                </lingo-board>
                <puzzle-word
                    v-if="gameController.gamePhase == 'puzzle'"
                    ref="puzzle"
                    :game="puzzleInstance">
                </puzzle-word>
                <bingo-card v-if="gameController.gamePhase == 'bingo'"></bingo-card>
            </div>
            <div class="col-md-2">
                <team :name="'Team 2'" :data="gameController.team2" :isPlaying="team2Active"></team>
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
    import GameController from "../data/GameController";

    export default {
        data() {
            return {
                initialized: false,
                loading: true,
                gameController: null
            }
        },
        watch: {
            gameController: {
                deep: true,
                handler(game) {
                    console.debug("A game updated was detected");
                }
            }
        },
        computed: {
            team1Active() {
                return this.gameController.activeTeam == this.gameController.team1;
            },
            team2Active() {
                return this.gameController.activeTeam == this.gameController.team2;
            },
            puzzleInstance() {
                if (this.activeTeam == this.team1) {
                    return this.gameController.puzzleGame1;
                } else {
                    return this.gameController.puzzleGame2;
                }
            },
            doLingo() {
                return this.gameController.gamePhase == 'lingo' && !this.loading;
            }
        },
        methods: {
            lingoWordGuessed() {
                // Message.push("Word was guessed by " + this.activeTeam.name)
                // this.activeTeam.score += 25;
                // this.gamePhase = 'puzzle';
                // this.newLingoGame();
            },
            lingoWordInvalid() {
                // this.switchActiveTeam();
            },
            puzzleWordGuessed() {
                // this.activeTeam.score += 100;
                // this.gamePhase = 'lingo';
                Message.push("Puzzle word was guessed by " + this.activeTeam.name)
            },
            puzzleWordNotGuessed() {
                this.gamePhase = 'lingo';
                Message.push("Puzzle word was not guessed by " + this.activeTeam)
            },
            getActiveGameElement() {
                if (this.gameController.gamePhase == 'lingo') {
                    return this.$refs.lingo;
                } else if (this.gameController.gamePhase == 'puzzle') {
                    return this.$refs.puzzle;
                } else if (this.gameController.gamePhase == 'bingo') {

                } else {
                    // set user names etc
                }
            },
            setInputListener() {
                let controller = this;
                document.onkeydown = function(evt) {
                    let activeGame = controller.getActiveGameElement();
                    if (!activeGame) {
                        console.log("No active game. Abort key.")
                        return true;
                    }

                    evt = evt || window.event;
                    if (evt.ctrlKey && evt.keyCode === 90) {
                        return activeGame.undo();
                    }
                    if (evt.ctrlKey) { // allow [CTRL + *] for easy dev page refresh
                        return true;
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
                    console.debug("Ignoring keystroke " + evt.keyCode);
                    return false; // ignore all other keystrokes
                };
            }
        },
        async mounted() {
            this.gameController = new GameController();
            this.gameController.init();
            this.setInputListener();
            this.initialized = true;
            this.loading = false;
        }
    }
</script>
