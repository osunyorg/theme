class Dropdown {
    constructor (selector) {
        this.element = document.querySelector(selector);
        this.dropdownButton = this.element.querySelector('button');

        this.state = {
            isOpened: false
        };

        this.listen();
    }

    listen () {
        this.dropdownButton.addEventListener('click', () => {
            this.toggleDropdown();
        });
    }

    toggleDropdown (open = !this.state.isOpened) {
        this.state.isOpened = open;
        this.dropdownButton.setAttribute('aria-expanded', this.state.isOpened);
    }
}

// Selectors
['.diplomas-select', '.dropdown-share'].map(selector => {
    if (document.querySelector(selector)) {
        new Dropdown(selector);
    }
});

// TODO : A11Y fermer dropdown avec la touche escap + s'assurer de conserver l'emplacement du focus
