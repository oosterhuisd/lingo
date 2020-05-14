<template>
    <div class="card">
        <div class="card-header">Lingo</div>

        <div class="card-body">
            <button class="btn btn-primary" @click="wordGuessed">
                Woord is geraden
            </button>
            <button class="btn btn-secondary" @click="invalidWord">
                Verkeerd woord
            </button>
        </div>
    </div>
</template>

<script>
    import Lingo from "../data/Lingo";

    export default {
        props: {
            game: {
                type: Lingo,
                required: true
            }
        },
        methods: {
            wordGuessed() {
                this.$emit('wordGuessed');
            },
            invalidWord() {
                this.$emit('invalidWord');
            },
        },
        mounted() {
            console.log('Word length is ' + this.game.wordLength)
        }
    }
</script>
