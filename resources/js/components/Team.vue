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
                return this.data.player1;
            },
            player2() {
                return this.data.player2;
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
            console.log(this.name + ' initiated')
        }
    }
</script>
