/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

import Vuex from 'vuex';
Vue.use(Vuex);

import Toasted from 'vue-toasted';
Vue.use(Toasted);

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('game-controller', require('./components/GameController.vue').default);
Vue.component('team', require('./components/Team.vue').default);
Vue.component('lingo-board', require('./components/LingoBoard.vue').default);
Vue.component('puzzle-word', require('./components/PuzzleWord.vue').default);
Vue.component('bingo-card', require('./components/BingoCard.vue').default);

// create store
const store = new Vuex.Store({
    state: {
        currentGame: '',
        loading: false
    },
    mutations: {
        changeGame(toGame) {
            state.currentGame = toGame;
        },
    }
})

// initialize Vue app
const app = new Vue({
    el: '#app',
    store: store
});

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
