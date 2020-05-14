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
                {{ guess[index-1] }}
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
                nextGuess: '',
                hasTyped: false
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
                let instance = this;
                this.game.verify(axios, this.nextGuess).then(function() {
                    instance.nextGuess = instance.game.getHint();
                }).catch(function(e) {
                    instance.invalidWord();
                }).then(()=>{
                    instance.hasTyped = false;
                });
            },
            input: function (letter) {
                if (!this.hasTyped) {
                    this.nextGuess = '';
                    this.hasTyped = true;
                }
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
