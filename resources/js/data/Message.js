class Message {

    static push(message, options) {
        let defaults = {
            position: 'bottom-center',
            duration: 3000,
            keepOnHover: true,
            theme: 'bubble',
            iconPack: 'fontawesome',
        };
        Vue.toasted.show(message, {...defaults, ...options});
    }

}
export default Message;
