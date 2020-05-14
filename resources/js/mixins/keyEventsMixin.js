// define a mixin object
export default {
    created: function () {
        console.log("Capturing keyboard events");
    },
    methods: {
        undo: function () {
            console.log('No undo implemented');
        },
        submit: function () {
            console.log('No submit implemented');
        },
        input: function () {
            console.log('No input implemented');
        },
        backspace: function () {
            console.log('No backspace implemented');
        }
    }
}
