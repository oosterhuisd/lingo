<template>
    <div class="card" :class="isPlaying ? '' : 'inactive'">
        <div class="card-header h3" :class="isPlaying ? 'bg-primary text-white' : ''">
            {{ name }}
        </div>

        <div class="card-body">
            <div>{{ player1 }} en {{ player2 }}</div>
        </div>
        <div class="card-body h2 scoreboard text-center">€ {{ score }}</div>
        <div v-for="i in data.greenBallsDrawn" class="green-ball">
        </div>
    </div>
</template>

<script>
    import Message from "../data/Message";

    export default {
        props: {
            name: {
                type: String,
                required: true
            },
            data: {
                type: Object,
                required: true,
            },
            isPlaying: {
                type: Boolean,
                required: true
            }
        },
        computed: {
            player1() {
                return this.data.players[0];
            },
            player2() {
                return this.data.players[1];
            },
            score() {
                return this.data.score;
            }
        },
        data() {
            return {}
        },
        mounted() {
        }
    }
</script>
<style lang="scss" scoped>
    @import "resources/sass/variables";

    .green-ball {
        display: inline-block;
        width: 2em;
        height: 2em;
        background-color: $green;
        border-radius: 50%;
        margin: 0.5em;
        background: radial-gradient(circle at 10px 10px, $green, #555);
    }

    .card {
        transition: all 1s ease-in-out;

        &.inactive {

        }
    }
</style>
