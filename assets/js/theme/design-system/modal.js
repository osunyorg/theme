
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
            });
        });

        window.addEventListener('keydown', (event) => {
            if (event.keyCode === 27 || event.key === 'Escape') {
                this.toggle(false);
            } else if (event.key === "Tab") {
                // TODO fix a11y inner focus
                // this.innerFocus(event);
            }
        });

        window.addEventListener('click', (event) => {
            if (event.target === this.element) {
                this.toggle(false);
            }
        });
    }

    innerFocus(event) {
        const focusables = 'a, button, input, textarea, select, details, [tabindex], [contenteditable="true"]';
        const elements = this.element.querySelectorAll(focusables);

        const focusableInDialog = Array.from(elements).filter(element => element.tabIndex >= 0);
        const firstFocusable = focusableInDialog[0];
        const lastFocusable = focusableInDialog.at(-1);

        if (!this.state.isOpened) {
            return;
        }

        if (!this.element.contains(event.target) && event.shiftKey) {
            lastFocusable.focus();
        }
        else if (!this.element.contains(event.target)) {
            firstFocusable.focus();
        }

        this.closeButtons[0].focus();
    }

    toggle(open = !this.state.isOpened) {
        this.state.isOpened = open;
        const classAction = this.state.isOpened ? 'add' : 'remove';

        this.element.setAttribute('aria-hidden', !this.state.isOpened);
        document.documentElement.classList[classAction](CLASSES.modalOpened);

        if (!this.state.isOpened) {
            this.button.focus();
        }
    }

}

// Selectors
(function () {
    const modalButtons = document.querySelectorAll("[data-open-modal]");
    modalButtons.forEach(button => {
        new Modal(button);
    })
})();
