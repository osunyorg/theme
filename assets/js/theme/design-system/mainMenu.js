import { breakpoints } from '../utils/breakpoints';

const CLASSES = {
    mainMenuOpened: 'is-opened',
    isAnimating: 'is-animating',
    scrollingDown: 'is-scrolling-down',
    menusOpened: 'has-menu-opened',
    sticky: 'is-sticky'
};
class MainMenu {
    constructor (selector) {
        this.element = document.querySelector(selector);
        this.menu = this.element.querySelector('.menu');
        this.mainButton = this.element.querySelector('button');
        this.dropdownsButtons = this.element.querySelectorAll('.has-children [role="button"]');

        this.state = {
            isOpened: false,
            isMobile: false,
            hasDropdownOpened: false,
            previousScrollY: window.scrollY
        };

        this.listen();
        this.resize();
    }

    listen () {
        window.addEventListener('resize', this.resize.bind(this));

        this.mainButton.addEventListener('click', () => {
            this.toggleMainMenu();
        });

        this.dropdownsButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.toggleDropdown(button);
            });
        });

        ['scroll', 'touchmove'].forEach(event => {
            window.addEventListener(event, this.onScroll.bind(this));
        });

        window.addEventListener('click', (event) => {
            if (event.target === document.body) {
                this.closeEverything();
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.keyCode === 27 || event.key === 'Escape') {
                this.closeEverything();
            }
        });
    }

    resize () {
        const isMobile = window.innerWidth <= breakpoints.md;
        document.documentElement.style.setProperty('--header-height', this.element.offsetHeight + 'px');
        
        // is state changed ?
        if (this.state.isMobile === isMobile) {
            return null;
        }

        this.state.isMobile = isMobile;

        this.closeEverything();
        
    }

    toggleMainMenu (open = !this.state.isOpened) {
        let classAction;
        this.state.isOpened = open;
        classAction = this.state.isOpened ? 'add' : 'remove';
        this.mainButton.setAttribute('aria-expanded', this.state.isOpened);
        this.menu.classList[classAction](CLASSES.mainMenuOpened);

        // Close dropdown to avoid keeping overlay when mobile and menu closed 
        if (this.state.isMobile && !this.state.isOpened) {
            this.state.hasDropdownOpened = false;
        }

        // Update global overlay
        this.updateOverlay();
    }

    toggleDropdown (clickedButton) {
        let isExpanded = true;

        if (clickedButton) {
            isExpanded = clickedButton.getAttribute('aria-expanded') === 'true';
        }

        // Close all dropdowns except selected
        this.dropdownsButtons.forEach(button => {
            if (clickedButton === button) {
                clickedButton.setAttribute('aria-expanded', !isExpanded);
            } else {
                button.setAttribute('aria-expanded', 'false');
            }
        });

        // Now menu is expanded or closed
        isExpanded = !isExpanded;
        this.state.hasDropdownOpened = isExpanded;

        // Update global overlay
        this.updateOverlay();
    }

    updateOverlay () {
        const classAction = this.state.hasDropdownOpened || this.state.isOpened ? 'add' : 'remove';
        document.documentElement.classList[classAction](CLASSES.menusOpened);

        // Add class for animation transition
        let transitionDuration = window.getComputedStyle(this.element).transitionDuration;
        // TODO : regex for getting 'ms' or other units value
        transitionDuration = parseFloat(transitionDuration.replace('s', ''));
        document.documentElement.classList.add(CLASSES.isAnimating);
        setTimeout(() => {
            document.documentElement.classList.remove(CLASSES.isAnimating);
        }, transitionDuration * 1000);
    }

    closeEverything () {
        this.state.isOpened = false;
        this.toggleDropdown(false);
        this.toggleMainMenu(false);
    }

    onScroll () {
        const offset = this.element.offsetHeight,
            y = window.scrollY,
            isNearTop = y < offset;

        if (isNearTop) {
            this.element.classList.remove(CLASSES.sticky);
        } else {
            this.element.classList.add(CLASSES.sticky);
        }

        if (y > this.state.previousScrollY && !isNearTop) {
            document.documentElement.classList.add(CLASSES.scrollingDown);
        } else {
            document.documentElement.classList.remove(CLASSES.scrollingDown);
        }

        this.state.previousScrollY = y;
    }
}

export default new MainMenu('header[role="banner"]');
