import { focusTrap } from '../../utils/focus-trap';

var CLASSES = {
    modalOpened: 'has-modal-opened',
    modalIsOpened: 'is-opened'
};

window.osuny = window.osuny || {};

window.osuny.Modal = function (button) {
    this.button = button;
    this.id = this.button.getAttribute('data-open-modal');
    this.element = document.getElementById(this.id);
    this.closeButtons = this.element.querySelectorAll('.close');
    this.state = {
        opened: false
    }

    if (!this.element) {
        return;
    }

    this.listen();
};

window.osuny.Modal.prototype.listen = function () {
    this.button.addEventListener('click', function () {
        this.toggle(true);
    }.bind(this));

    this.closeButtons.forEach( function (button) {
        button.addEventListener('click', function () {
            this.toggle(false);
            this.button.focus();
        }.bind(this));
    }.bind(this));

    window.addEventListener('keydown', function (event) {
        if (event.keyCode === 27 || event.key === 'Escape') {
            this.toggle(false);
        } else if (event.key === "Tab" && this.state.isOpened) {
            focusTrap(event, this.element, this.state.isOpened);
            event.preventDefault();
        }
    }.bind(this));

    window.addEventListener('click', function (event) {
        if (event.target === this.element) {
            this.toggle(false);
        }
    }.bind(this));
};

window.osuny.Modal.prototype.toggle = function (open) {
    this.state.opened = typeof open !== 'undefined' ? open : !this.state.opened;
    var classAction = this.state.opened ? 'add' : 'remove';

    document.documentElement.classList[classAction](CLASSES.modalOpened);
    
    this.element.setAttribute('aria-hidden', !this.state.opened);
    this.element.classList[classAction](CLASSES.modalIsOpened);
};

window.osuny.page.addComponent("[data-open-modal]", window.osuny.Modal);
