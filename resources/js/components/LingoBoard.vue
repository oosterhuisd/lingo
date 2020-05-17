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

        <div v-for="attempt in game.attempts" class="d-flex justify-content-center word">
            <div v-for="index in game.wordLength" :key="index" class="letter" :class="getClass(index - 1, attempt)">
                {{ getLetter(index - 1, attempt) }}
            </div>
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
            game: {
                type: Lingo,
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
                cursorAt: 0
            }
        },
        computed: {
        },
        methods: {
            getLetter(position, attempt) {
                return attempt.typed[position] || attempt.prefill[position] || '';
            },
            getClass(position, attempt) {
                if (attempt.correct.includes(position)) return 'correct';
                if (attempt.contains.includes(position)) return 'contains';
            },
            wordGuessed() {
                document.dispatchEvent(new Event('LingoSuccess'));
                this.$emit('wordGuessed');
            },
            invalidWord() {
                this.$emit('invalidWord');
            },
            maxTurnsReached() {
                this.$emit('maxTurnsReached');
            },
            undo: function () {
                this.game.undo();
            },
            submit: async function () {
                let result = await this.game.verifyCurrentAttempt(axios);
                if (result.invalidWord || result.unknownWord) {
                    Message.push("De beurt gaat naar het andere team");
                    this.invalidWord();
                }
                this.cursorAt = 0;
            },
            input: function (letter) {
                console.log("Handling input for lingo game")
                if (this.cursorAt >= this.game.wordLength) {
                    return false; // too long
                }
                this.game.setChar(this.cursorAt, letter);
                this.cursorAt++;
            },
            backspace: function () {
                if (this.cursorAt > 0) {
                    this.game.setChar(--this.cursorAt, '');
                }
            }
        },
        mounted() {
        }
    }
</script>
<style lang="scss" scoped>

</style>
