window.osuny = window.osuny || {};

window.osuny.Note = function (element) {
    this.note = element;
    this.active = false;
    this.call = this.note.querySelector('.note__call');
    this.content = this.note.querySelector('.note__content');
    this.call.addEventListener('click', this.toggle.bind(this));

    this.note.addEventListener('keydown', function (event) {
        if (event.keyCode === 13 || event.key === 'Enter' || event.keyCode === 32 || event.key === 'Space') {
            event.preventDefault();
            this.toggle();
        }
    }.bind(this));
};

window.osuny.Note.prototype.toggle = function () {
    if (this.active) {
        this.deactivate();
    } else {
        this.activate();
    }
}

window.osuny.Note.prototype.activate = function () {
    this.deactivateAllNotes();
    this.active = true;
    this.note.classList.add('note--active');
    this.content.removeAttribute('aria-hidden');
    this.call.setAttribute('aria-expanded', 'true');
    this.definePosition();
    this.a11yDisabling();
}

window.osuny.Note.prototype.deactivate = function () {
    this.active = false;
    this.content.setAttribute('aria-hidden', 'true');
    this.note.classList.remove('note--active');
    this.call.setAttribute('aria-expanded', 'false');
    this.removeA11yDisabling();
}

window.osuny.Note.prototype.deactivateAllNotes = function () {
    var notes = window.osuny.page.getComponents('note');
    notes.forEach(function (note) {
        note.deactivate();
    });
}

window.osuny.Note.prototype.a11yDisabling = function () {
    this.closeWithKeyboard = function (event) {
        if (event.keyCode === 27 || event.key === 'Escape' || event.key === 'Tab' || event.keyCode === 9) {
            this.deactivateAllNotes();
            this.call.focus();
        }
    }.bind(this);

    this.closeWithClick = function (event) {
        if (!event.target.closest('.note--active')) {
            this.deactivateAllNotes();
        }
    }.bind(this);

    window.addEventListener('keydown', this.closeWithKeyboard);
    document.addEventListener('click', this.closeWithClick);
}

window.osuny.Note.prototype.removeA11yDisabling = function () {
    window.removeEventListener('keydown', this.closeWithKeyboard);
    document.removeEventListener('click', this.closeWithClick);
}

window.osuny.Note.prototype.definePosition = function () {
    var isOnTheLeftSide = this.note.offsetLeft < window.innerWidth / 2;
    if (isOnTheLeftSide) {
        this.note.classList.add('note--left');
        this.note.classList.remove('note--right');
    } else {
        this.note.classList.add('note--right');
        this.note.classList.remove('note--left');
    }
};

window.osuny.page.registerComponent({
    name: 'note',
    selector: '.note',
    klass: window.osuny.Note
});