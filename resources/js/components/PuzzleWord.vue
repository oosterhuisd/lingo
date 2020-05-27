<template>
    <div class="card puzzle">
        <div class="card-header">Puzzelwoord</div>

        <div class="card-body">
            <div class="mb-5">
                <div class="d-flex justify-content-between">
                    <button class="btn btn-lg btn-primary" @click="drawBall" :disabled="!canDraw">
                        Pak een bal
                    </button>
                    <button class="btn btn-lg btn-danger" @click="giveUp">
                        Ik geef het op
                    </button>
                </div>
            </div>

            <div class="d-flex justify-content-center word">
                <div v-for="(letter, index) in game.letters" :key="index" :class="getClass(index)" class="letter">
                    <div>{{ letter }}</div>
                </div>
            </div>
        </div>
        <input placeholder="Typ hier je poging" type="text" class="form-control form-control-lg" v-model="guess" autofocus />

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
                guess: ''
            }
        },
        computed: {
            canDraw() {
                return this.game.ballsToDraw() > 0;
            }
        },
        methods: {
            getClass(i) {
                if (this.game.confirmedPositions.includes(i)) {
                    return 'correct';
                }
                return 'contains';
            },
            drawBall() {
                this.game.drawBall(axios);
            },
            giveUp() {
                this.game.timeOut();
            },
            async submit() {
                await this.game.verify(axios, this.guess);
                this.guess = '';
            }
        },
        mounted() {
            const letters = document.getElementsByClassName('letter');
            gsap.from(letters, 1, {
                scale: 0.5,
                opacity: 0,
                stagger: 0.05,
                ease: "back",
                force3D: true
            });
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
