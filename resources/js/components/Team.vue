<template>
    <div class="card">
        <div class="card-header" :class="isPlaying ? 'bg-primary text-white' : ''">{{ name }}</div>

        <div class="card-body">

            <div>{{ player1 }} en {{ player2 }}</div>
        </div>
        <div class="card-footer">Score: {{ score }}</div>
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
            return {

            }
        },
        mounted() {
            Message.push(this.name + ' initiated')
        }
    }
</script>
