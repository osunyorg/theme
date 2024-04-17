class Note {
    constructor (note) {
        this.note = note;
        this.active = false;
        this.call = this.note.querySelector('.note__call');
        this.content = this.note.querySelector('.note__content');
        this.call.addEventListener('click', this.toggle.bind(this));
        
        this.note.addEventListener('keydown', (event) => {
            if (event.keyCode === 13 || event.key === 'Enter' || event.keyCode === 32 || event.key === 'Space') {
                event.preventDefault();
                this.toggle();
            }
        });
    }

    toggle () {
        if (this.active) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    activate () {
        this.deactivateAllNotes();
        this.active = true;
        this.note.classList.add('note--active');
        this.content.removeAttribute('aria-hidden');
        this.definePosition();
        this.a11yDisabling();
    }

    deactivate () {
        this.active = false;
        this.content.setAttribute('aria-hidden', 'true');
        this.note.classList.remove('note--active');
        this.removeA11yDisabling();
    }

    deactivateAllNotes () {
        window.notes.forEach(note => {
            note.deactivate();
        });
    }

    a11yDisabling () {
        this.closeWithKeyboard = (event) => {
            if (event.keyCode === 27 || event.key === 'Escape' || event.key === 'Tab' || event.keyCode === 9) {
                this.deactivateAllNotes();
                this.call.focus();
            }
        };

        this.closeWithClick = (event) => {
            if (!event.target.closest('.note--active')) {
                this.deactivateAllNotes();
            }
        };

        window.addEventListener('keydown', this.closeWithKeyboard);
        document.addEventListener('click', this.closeWithClick);
    }

    removeA11yDisabling () {
        window.removeEventListener('keydown', this.closeWithKeyboard);
        document.removeEventListener('click', this.closeWithClick);
    }

    definePosition () {
        let isOnTheLeftSide = this.note.offsetLeft < window.innerWidth / 2;
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
    const notes = document.querySelectorAll('.note');
    notes.forEach(note => {
        window.notes.push(new Note(note));
    });
}());
