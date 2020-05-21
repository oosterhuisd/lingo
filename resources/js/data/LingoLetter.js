class LingoLetter {

    constructor(letter) {
        this.confirmed = letter;
        this.typed = '';
        this.contained = false;
        this.checked = false;
        this.animate = false;
    }

    get() {
        return this.typed !== '' ? this.typed : this.confirmed;
    }
}

export default LingoLetter;
