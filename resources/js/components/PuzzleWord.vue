<template>
    <div class="card">
        <div class="card-header">Puzzelwoord</div>

        <div class="card-body">
<!--            <button class="btn btn-secondary" @click="greenBall">-->
<!--                Groene bal-->
<!--            </button>-->
<!--            <button class="btn btn-secondary" @click="redBall">-->
<!--                Rode bal-->
<!--            </button>-->
            <div class="d-flex justify-content-between">
                <button class="btn btn-lg btn-primary" @click="drawBall">
                    Pak een bal
                </button>
                <button class="btn btn-lg btn-danger" @click="giveUp">
                    Ik geef het op
                </button>
            </div>

            <div class="d-flex justify-content-between word">
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
        methods: {
            getClass(i) {
                if (this.game.confirmedPositions.includes(i)) {
                    return 'correct';
                }
                return '';
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
            console.debug('Puzzle component mounted.')
        }
    }
</script>
<style lang="scss" scoped>

</style>
