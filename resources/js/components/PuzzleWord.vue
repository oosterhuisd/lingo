<template>
    <div class="puzzle">
        <h1>Puzzelwoord</h1>

        <div class="col-10">
            <div class="mb-5">
                <div class="d-flex justify-content-between">
                    <button class="btn btn-lg btn-primary" @click="drawBall" :disabled="!canDraw">
                        Pak een bal
                    </button>
                </div>
            </div>

            <div class="d-flex justify-content-center word">
                <div v-for="(letter, index) in game.letters" :key="index" :class="getClass(index)" class="letter">
                    <div>{{ letter }}</div>
                </div>
            </div>

            <div class="d-flex justify-content-center word guess">
                <div v-for="(letter, index) in guess" :key="index" class="letter">
                    <div>{{ letter }}</div>
                </div>
            </div>
        </div>

        <h1 class="text-muted">{{ timer }}</h1>

    </div>
</template>

<script>
    import Puzzle from "../data/Puzzle";
    import keyEventsMixin from "../mixins/keyEventsMixin";
    import { gsap } from "gsap";

    export default {
        mixins: [keyEventsMixin],

        props: {
            game: {
                type: Puzzle,
                required: true
            }
        },
        data() {
            return {
                guess: '',
                timeRemaining: 0,
                pauseTimer: true,
                acceptInput: false
            }
        },
        watch: {
            timeRemaining: {
                handler(value) {
                    if (!this.pauseTimer && value > 0) {
                        setTimeout(()=>{
                            this.timeRemaining--;
                        }, 100);
                    } else if (value <= 0) {
                        this.game.timeOut();
                    }
                },
                // immediate: true
            },
            pauseTimer: {
                handler(pause) {
                    if (pause === false) {
                        this.timeRemaining--;
                    }
                }
            }
        },
        computed: {
            canDraw() {
                return this.game.ballsToDraw() > 0;
            },
            timer() {
                if (this.timeRemaining === false) {
                    return '-';
                } else {
                    return Number.parseFloat(this.timeRemaining / 10).toFixed(1);
                }
            }
        },
        methods: {
            setTypingTimer() {
                this.pauseTimer = true;
                setTimeout(() => this.pauseTimer = false, 7000);
            },
            getClass(i) {
                if (this.game.confirmedPositions.includes(i)) {
                    return 'correct';
                }
                return 'contains';
            },
            async drawBall() {
                this.pauseTimer = true;
                await this.game.drawBall(axios);
                this.pauseTimer = false;
            },
            giveUp() {
                this.game.timeOut();
            },
            async submit() {
                this.pauseTimer = true;
                await this.game.verify(axios, this.guess);
            },
            input: function (letter) {
                if (!this.acceptInput) return false;
                this.guess += letter;
            },
            backspace: function () {
                if (this.guess.length === 0) return false;
                this.guess = this.guess.slice(0, -1);
            },
            start() {
                this.timeRemaining = this.game.time*10;
                this.pauseTimer = false;
                this.acceptInput = true;
            }
        },
        mounted() {
            this.guess = '';
            const letters = document.getElementsByClassName('letter');
            gsap.from(letters, 1, {
                scale: 0.5,
                opacity: 0,
                stagger: 0.05,
                ease: "back",
                force3D: true
            }).then(this.start);

        }
    }
</script>
<style lang="scss" scoped>
.letter {
    position: relative;
    width: 65px;
    height: 65px;
    font-size: 45px;
    line-height: 65px;
    transition: transform 0.3s;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    &.animate {
        transform: rotateY(360deg);
    }
}
</style>
