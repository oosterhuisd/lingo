class Message {

    static push(message, level) {
        Vue.toasted.show(message, {
            position: 'bottom-center',
            duration: 2000,
            keepOnHover: true,
            theme: 'bubble'
        });
    }

}
export default Message;
