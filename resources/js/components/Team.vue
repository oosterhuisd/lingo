<template>
    <div class="card">
        <div class="card-header">{{ name }}</div>

        <div class="card-body">
            I'm an example component.
        </div>
    </div>
</template>

<script>
    export default {
        props: ['name'],
        data() {
            return {

            }
        },
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
