<template>
    <div class="card">
        <div class="card-header">Lingo</div>

        <div class="card-body">
            <button class="btn btn-primary" @click="wordGuessed">
                Woord is geraden
            </button>
            <button class="btn btn-secondary" @click="invalidWord">
                Verkeerd woord
            </button>
        </div>

        <!-- keep track of past guesses -->
        <div v-for="guess in game.guesses" class="d-flex word">
            <div v-for="index in game.wordLength" :key="index" class="justify-content-between letter">
                {{ guess[index] }}
            </div>
        </div>
        <div class="d-flex word">
            <div v-for="(number, index) in game.wordLength" :key="index" class="justify-content-between letter">
                {{ getLetter(index) }}
            </div>
        </div>
    </div>
</template>

<script>
    import Lingo from "../data/Lingo";
    import keyEventsMixin from "../mixins/keyEventsMixin";

    export default {
        mixins: [keyEventsMixin],
        props: {
            game: {
                type: Lingo,
                required: true
            }
        },
        data() {
            return {
                nextGuess: ''
            }
        },
        computed: {
        },
        methods: {
            getLetter(position) {
                return this.nextGuess[position] || '';
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
                    console.log("Undid last action");
                } else {
                    console.log("Nothing to undo");
                }
            },
            submit: function () {
                this.game.verify(this.nextGuess).then(function() {
                    this.nextGuess = this.game.getHint();
                }).catch(function(e) {
                    this.invalidWord();
                });
            },
            input: function (letter) {
                if (this.nextGuess.length < this.game.wordLength) {
                    this.nextGuess += letter;
                } else {
                    console.log("Word length reached");
                }
            },
            backspace: function () {
                if (this.nextGuess.length > 0) {
                    this.nextGuess = this.nextGuess.slice(0, -1);
                }
                console.log('Backspace implemented!');
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
    width: 2em;
}
</style>
