<template>
    <div class="lingo-board">
<!--        <div class="debug">-->
<!--            <button class="btn btn-primary" @click="wordGuessed">-->
<!--                Woord is geraden-->
<!--            </button>-->
<!--            <button class="btn btn-secondary" @click="invalidWord">-->
<!--                Verkeerd woord-->
<!--            </button>-->
<!--        </div>-->

        <div class="attempts" :class="orientation">
            <div v-for="attempt in game.attempts" class="d-flex justify-content-center word">
                <div v-for="(letter, index) in attempt" class="letter" :class="getClass(letter)">
                    <div class="face front">{{ letter.get() }}</div>
                </div>
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
            },
            orientation: {
                type: String,
                required: true
            }
        },
        watch: {
            'game.attempts': {
                deep: true,
                handler(game) {
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
            getClass(letter) {
                let css = '';
                if (letter.animate) { // this will create the "sweep" effect
                    css += 'animate ';
                }
                if (!letter.checked) return css;
                if (letter.contained) return css + 'contains';
                if (letter.typed === letter.confirmed) {
                    return css + 'correct';
                }
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
                    this.invalidWord();
                }
                this.cursorAt = 0;
            },
            input: function (letter) {
                if (this.game.setChar(this.cursorAt, letter)) {
                    this.cursorAt++;
                }
            },
            backspace: function () {
                if (this.cursorAt > 0) {
                    this.game.setChar(--this.cursorAt, ' ');
                }
            }
        },
        mounted() {
        }
    }
</script>
<style lang="scss" scoped>
    .attempts {
        transition: all .75s ease-in-out;
        &.left {
            /*transform: rotate3d(0, 1, 0.1, 12deg)*/
        }
        &.right {
            /*transform: rotate3d(0, 1, -0.1, 12deg)*/
        }
    }
    .letter {
        position: relative;
        transition: transform 0.3s;
        transform-style: preserve-3d;
        backface-visibility: hidden;
        &.animate {
            transform: rotateY(360deg);
        }
    }
</style>
