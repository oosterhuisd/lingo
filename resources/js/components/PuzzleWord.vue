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

    export default {
        props: {
            puzzleInstance: {
                type: Puzzle,
                required: true
            }
        },
        methods: {
            greenBall() {

            }
        },
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
