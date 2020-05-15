<template>
    <div class="card">
        <div class="card-header">Puzzelwoord</div>

        <div class="card-body">
            <button class="btn btn-secondary" @click="greenBall">
                Groene bal
            </button>
            <button class="btn btn-secondary" @click="redBall">
                Rode bal
            </button>
            <button class="btn btn-secondary" @click="drawLetter">
                Letter pakken
            </button>
        </div>
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
        methods: {
            drawLetter() {
                this.game.getNextLetter(axios);
            },
            greenBall() {
                this.game.getNextLetter(axios);
            },
            redBall() {
                this.game.getNextLetter(axios);
            },
        },
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
