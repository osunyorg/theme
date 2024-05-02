import { focusTrap } from '../utils/focus-trap';

const CLASSES = {
    modalOpened: 'has-modal-opened',
    isAnimating: 'is-animating',
    modalIsOpened: 'is-opened'
};

class Modal {
    constructor (button) {
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
    }

    listen () {
        this.button.addEventListener('click', () => {
            this.toggle(true);
        });

        this.closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.toggle(false);
                this.button.focus();
            });
        });

        window.addEventListener('keydown', (event) => {
            if (event.keyCode === 27 || event.key === 'Escape') {
                this.toggle(false);
            } else if (event.key === "Tab" && this.state.isOpened) {
                focusTrap(event, this.element, this.state.isOpened);
                event.preventDefault();
            }
        });

        window.addEventListener('click', (event) => {
            if (event.target === this.element) {
                this.toggle(false);
            }
        });
    }

    toggle(open) {
        this.state.opened = typeof open !== 'undefined' ? open : !this.state.opened;
        const classAction = this.state.opened ? 'add' : 'remove';

        document.documentElement.classList[classAction](CLASSES.modalOpened);
        
        setTimeout(() => {
            document.documentElement.classList.remove(CLASSES.isAnimating);
        }, 0);

        setTimeout(() => {
            this.element.setAttribute('aria-hidden', !this.state.opened);
            this.element.classList[classAction](CLASSES.modalIsOpened);
        }, 0.2);
        
    }
}

// Selectors
(function () {
    const modalButtons = document.querySelectorAll('[data-open-modal]');
    modalButtons.forEach(button => {
        new Modal(button);
    });
}());
