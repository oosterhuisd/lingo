class Message {

    static push(message, level) {
        Vue.toasted.show(message, {
            position: 'bottom-center',
            duration: 3000,
            keepOnHover: true,
            theme: 'bubble',
            iconPack: 'fontawesome',
        });
    }

}
export default Message;
