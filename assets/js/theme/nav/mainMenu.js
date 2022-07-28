import breakpoints from '../utils/breakpoints';

class MainMenu {
    constructor () {
        this.element = document.querySelector('nav[role="navigation"]');
        this.menu = this.element.querySelector('.menu');
        this.mainButton = this.element.querySelector('button');
        this.dropdownsButtons = this.element.querySelectorAll('.has-children a[role="button"]');
        this.isOpened = false;
        this.isActive = false;

        this.listen();
    }

    listen () {
        window.addEventListener('resize', this.resize.bind(this));
        this.mainButton.addEventListener('click', this.toggleMain.bind(this));
        this.dropdownsButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.toggleDropdown(button);
            });
        });
    }

    resize () {
        this.isActive = window.innerWidth <= breakpoints.md;
    }

    toggleMain () {
        this.isOpened = !this.isOpened;
        this.mainButton.setAttribute('aria-expanded', this.isOpened ? 'true' : 'false');
        this.menu.classList.toggle('show');
        document.body.classList.toggle('has-overlay');
    }

    toggleDropdown (button) {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    }
}

export default new MainMenu();
