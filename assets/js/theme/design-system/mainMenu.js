import { focusTrap } from '../utils/focus-trap';
import { isMobile } from '../utils/breakpoints';
import { a11yClick, ariaHideBodyChildren } from '../utils/a11y';

var CLASSES = {
    mainMenuOpened: 'is-opened',
    isAnimating: 'is-animating',
    scrollingDown: 'is-scrolling-down',
    menusOpened: 'has-menu-opened',
    sticky: 'is-sticky'
};

window.osuny = window.osuny || {};

window.osuny.MainMenu = function (selector) {
    this.element = document.querySelector(selector);
    this.menu = this.element.querySelector('.menu');
    this.mainButton = this.element.querySelector('button.header-button');
    this.upperMenu = this.element.querySelector('.upper-menu');

    this.dropdownsButtons = this.element.querySelectorAll('.has-children [role="button"]');

    this.state = {
        opened: false,
        isMobile: false,
        hasDropdownOpened: false,
        previousScrollY: window.scrollY
    };

    this.listen();
    this.resize();
};

window.osuny.MainMenu.prototype.listen = function () {
    window.addEventListener('resize', this.resize.bind(this));

    window.addEventListener('click', function (event) {
        var insideHeader = event.target.closest('#document-header');
        if (event.target === document.body || !insideHeader) {
            this.closeEverything();
        }
    }.bind(this));

    if (this.mainButton) {
        this.mainButton.addEventListener('click', this.toggle.bind(this));
    }

    this.dropdownsButtons.forEach( function (button) {
        a11yClick(button, function (event) {
            event.preventDefault();
            this.toggleDropdown(button);
        }.bind(this));
    }.bind(this));

    ['scroll', 'touchmove'].forEach(function (event) {
        window.addEventListener(event, this.onScroll.bind(this));
    }.bind(this));

    window.addEventListener('keydown', function (event) {
        if (event.keyCode === 27 || event.key === 'Escape') {
            this.closeEverything();
        }
        focusTrap(event, this.element, this.state.opened);
    }.bind(this));
};

window.osuny.MainMenu.prototype.resize = function () {
    this.setHeaderHeightVariables();

    // is state changed ?
    if (this.state.isMobile === isMobile()) {
        return null;
    }

    this.state.isMobile = isMobile();

    this.closeEverything();

    if (this.upperMenu) {
        this.updateUpperMenuPosition();
    }
};

window.osuny.MainMenu.prototype.setHeaderHeightVariables = function () {
    if (!this.state.opened) {
        document.documentElement.style.setProperty('--header-height', Math.floor(this.element.offsetHeight) + 'px');
        document.documentElement.style.setProperty('--header-menu-max-height', Math.floor(window.innerHeight - this.element.offsetHeight) + 'px');
    }
};

window.osuny.MainMenu.prototype.updateUpperMenuPosition = function () {
    if (this.state.isMobile) {
        this.element.append(this.upperMenu);
    } else {
        this.element.prepend(this.upperMenu);
    }
};

window.osuny.MainMenu.prototype.open = function () {
    this.state.opened = true;
    this.menu.classList.add(CLASSES.mainMenuOpened);
    this.onChange();
};

window.osuny.MainMenu.prototype.close = function () {
    this.state.opened = false;
    this.menu.classList.remove(CLASSES.mainMenuOpened);

    // Close dropdown to avoid keeping overlay when mobile and menu closed
    if (this.state.isMobile) {
        this.state.hasDropdownOpened = false;
    }
    this.toggleDropdown(false);
    this.onChange();
};

window.osuny.MainMenu.prototype.onChange = function () {
    this.mainButton.setAttribute('aria-expanded', this.state.opened);
    if (this.state.isMobile) {
        ariaHideBodyChildren(this.element, this.state.opened);
    }
    this.updateOverlay();
};

window.osuny.MainMenu.prototype.toggle = function () {
    if (this.state.opened) {
        this.close();
    } else {
        this.open();
    }
};

window.osuny.MainMenu.prototype.closeEverything = function () {
    if (!this.state.opened && !this.state.hasDropdownOpened) {
        return;
    }

    this.close();
};

window.osuny.MainMenu.prototype.toggleDropdown = function (clickedButton) {
    var isExpanded = true;

    if (clickedButton) {
        isExpanded = clickedButton.getAttribute('aria-expanded') === 'true';
    }

    // Close all dropdowns except selected
    this.dropdownsButtons.forEach(function (button) {
        if (clickedButton === button) {
            clickedButton.setAttribute('aria-expanded', !isExpanded);
        } else {
            button.setAttribute('aria-expanded', 'false');
        }
    });

    // Now menu is expanded or closed
    isExpanded = !isExpanded;
    this.state.hasDropdownOpened = isExpanded;

    this.updateOverlay();
};

window.osuny.MainMenu.prototype.updateOverlay = function () {
    var classAction = this.state.hasDropdownOpened || this.state.opened ? 'add' : 'remove';
    document.documentElement.classList[classAction](CLASSES.menusOpened);

    // Add class for animation transition
    var transitionDuration = window.getComputedStyle(this.element).transitionDuration;
    // TODO : regex for getting 'ms' or other units value
    transitionDuration = parseFloat(transitionDuration.replace('s', ''));
    document.documentElement.classList.add(CLASSES.isAnimating);
    setTimeout(function () {
        document.documentElement.classList.remove(CLASSES.isAnimating);
    }, transitionDuration * 1000);
};


window.osuny.MainMenu.prototype.onScroll = function () {
    var offset = this.element.offsetHeight,
        y = window.scrollY,
        isNearTop = y < offset,
        threshold = 50,
        hasChanged = false;

    if (isNearTop) {
        this.element.classList.remove(CLASSES.sticky);
    } else {
        this.element.classList.add(CLASSES.sticky);
    }

    if (y > this.state.previousScrollY + threshold && !isNearTop) {
        document.documentElement.classList.add(CLASSES.scrollingDown);
        hasChanged = true;
    } else if (y < this.state.previousScrollY - threshold) {
        document.documentElement.classList.remove(CLASSES.scrollingDown);
        hasChanged = true;
    }

    if (hasChanged) {
        this.state.previousScrollY = y;
    }

    this.setHeaderHeightVariables();
};

window.osuny = window.osuny || {};
window.osuny.menu = new window.osuny.MainMenu('header#document-header');
