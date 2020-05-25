class Message {

    static push(message, options) {
        let defaults = {
            position: 'bottom-center',
            duration: 3000,
            keepOnHover: true,
            theme: 'bubble',
            iconPack: 'fontawesome',
            onComplete: Message.isOpen = false
        };
        Message.isOpen = true;
        Vue.toasted.show(message, {...defaults, ...options});
    }

}
export default Message;
