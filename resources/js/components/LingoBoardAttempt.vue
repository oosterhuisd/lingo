<template>
    <div>
        <div v-for="index in game.wordLength" :key="index" class="justify-content-between letter">
            {{ getLetter(index - 1, attempt) }}
        </div>
    </div>
</template>

<script>
    import Lingo from "../data/Lingo";
    import keyEventsMixin from "../mixins/keyEventsMixin";
    import Message from "../data/Message";

    export default {
        mixins: [keyEventsMixin],
        props: {
            attempt: {
                required: true
            }
        },
        watch: {
            'game.attempts': {
                deep: true,
                handler(game) {
                    console.log("Game changed");
                }
            }
        },
        data() {
            return {
                nextGuess: '',
                cursorAt: 0
            }
        },
        computed: {
        },
        methods: {
            getLetter(position, attempt) {
                console.log(attempt);
                return attempt.typed[position] || attempt.prefill[position] || '';
            },
            wordGuessed() {
                this.$emit('wordGuessed');
            },
            invalidWord() {
                this.$emit('invalidWord');
            },
            undo: function () {
                if (this.game.guesses.length > 1) {
                    this.game.guesses.pop();
                    Message.push("Undid last action");
                } else {
                    Message.push("Nothing to undo");
                }
            },
            submit: async function () {
                await this.game.verify(axios, this.nextGuess);
                if (this.game.completed) {
                    this.wordGuessed();
                }
                if (this.game.lastResult.invalidWord) {
                    this.invalidWord();
                }
                this.nextGuess = '';
                this.hasTyped = false;

            },
            input: function (letter) {
                if (this.cursorAt >= this.game.wordLength) {
                    return false; // too long
                }
                this.game.setChar(this.cursorAt, letter);
                this.cursorAt++;
            },
            backspace: function () {
                if (this.cursorAt > 0) {
                    this.game.getCurrentAttempt().typed[this.cursorAt] = '';
                    this.cursorAt--;
                }
            }
        },
        mounted() {
            this.nextGuess = this.game.inPlace;
        }
    }
</script>
<style type="text/scss" scoped>
.letter {
    border: 2px solid #ccc;
    width: 4em;
    height: 4em;
    line-height: 4em;
    font-size: 2em;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    &.correct {
        background-color: blue;
        color: white;
    }
}
</style>
