class Note {
    constructor (note) {
        this.note = note;
        this.active = false;
        this.call = this.note.querySelector('.note__call');
        this.call.addEventListener('click', this.toggle.bind(this));
    }
    toggle () {
        if (this.active) {
            this.deactivate();
        } else  {
            this.activate();
        }
    }
    activate () {
        this.deactivateAllNotes();
        this.active = true;
        this.note.classList.add('note--active');
        this.definePosition();
    }
    deactivate () {
        this.active = false;
        this.note.classList.remove('note--active');
    }
    deactivateAllNotes () {
        window.notes.forEach(note => {
            note.deactivate();
        })
    }
    definePosition () {
        let isOnTheLeftSide = this.note.offsetLeft < (window.innerWidth / 2)
        if (isOnTheLeftSide) {
            this.note.classList.add('note--left');
            this.note.classList.remove('note--right');
        } else {
            this.note.classList.add('note--right');
            this.note.classList.remove('note--left');
        }
    }
}

(function () {
    window.notes = [];
    const notes = document.querySelectorAll(".note");
    notes.forEach(note => {
        window.notes.push(new Note(note));
    })
})();