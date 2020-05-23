<template>
    <div class="container-fluid p-5" v-if="this.initialized">
        <div class="row justify-content-center">

            <div class="col-md-8">
                <lingo-board v-if="doLingo"
                             :game="gameController.lingoGame"
                             :orientation="team1Active ? 'left' : 'right'"
                             ref="lingo"
                             >
                </lingo-board>
                <puzzle-word
                    v-if="gameController.gamePhase == 'puzzle'"
                    ref="puzzle"
                    :game="puzzleInstance">
                </puzzle-word>
                <bingo-card v-if="gameController.gamePhase == 'bingo'"></bingo-card>
            </div>
        </div>
        <div class="fixed-bottom d-flex justify-content-between">
            <div class="col-md-2">
                <team :name="'Team 1'" :data="gameController.team1" :isPlaying="team1Active"></team>
            </div>
            <div class="col-md-6">
                <img src="/media/images/jan.svg" class="host" title="" alt="Host" />
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
                return this.gameController.getActiveGame();
            },
            doLingo() {
                return this.gameController.gamePhase == 'lingo' && !this.loading;
            }
        },
        methods: {
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
                    if (!activeGame || activeGame.completed === true) {
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
<style lang="scss" scoped>
    .container-fluid {
        height: 100vh;
    }
    img.host {
        max-width: 300px;
        max-height: 200px;
    }
</style>
