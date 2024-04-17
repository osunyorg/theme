import { focusTrap } from '../utils/focus-trap';

const CLASSES = {
    modalOpened: 'has-modal-opened'
};

class Modal {
    constructor(button) {
        this.button = button;
        this.id = this.button.getAttribute('data-open-modal');
        this.element = document.getElementById(this.id);
        this.closeButtons = this.element.querySelectorAll('.close');

        if (!this.element) {
            return;
        }

        this.state = {
            isOpened: false
        };

        this.listen();
    }

    listen() {
        this.button.addEventListener('click', () => {
            this.toggle(true);
        });

        this.closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.toggle(false);
                this.button.focus()
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

    toggle(open = !this.state.isOpened) {
        this.state.isOpened = open;
        const classAction = this.state.isOpened ? 'add' : 'remove';

        this.element.setAttribute('aria-hidden', !this.state.isOpened);
        document.documentElement.classList[classAction](CLASSES.modalOpened);
    }

}

// Selectors
(function () {
    const modalButtons = document.querySelectorAll("[data-open-modal]");
    modalButtons.forEach(button => {
        new Modal(button);
    })
})();
