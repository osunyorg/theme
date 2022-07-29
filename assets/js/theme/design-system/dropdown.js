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
        console.log('lalala')
        let classAction;
        this.state.isOpened = open;
        classAction = this.state.isOpened ? 'add' : 'remove';
        this.dropdownButton.setAttribute('aria-expanded', this.state.isOpened);
    }
}

export default new Dropdown('.diplomas-select');
