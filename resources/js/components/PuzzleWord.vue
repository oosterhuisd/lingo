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
            <button class="btn btn-secondary" @click="drawLetter">
                Pak een letter!
            </button>
        </div>
        <div class="d-flex word">
            <div v-for="(letter, index) in game.letters" :key="index" :class="getClass(index - 1)" class="justify-content-between letter">
                <div>{{ letter }}</div>
            </div>
        </div>
        <input type="text" class="form-control form-control-lg" v-model="guess" autofocus />

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
            },
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
            drawLetter() {
                this.game.drawLetter(axios);
            },
        },
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
<style lang="scss" scoped>

</style>
