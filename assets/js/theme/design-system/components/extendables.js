import { a11yClick, getFocusableElements } from '../../utils/a11y';

window.osuny = window.osuny || {};

window.osuny.Extendable = function (element) {
    this.element = element;
    this.buttons = document.querySelectorAll('[aria-controls=' + this.element.id + ']');
    this.state = {
        opened: false,
        // Button who opened the extendable
        openedByButton: null
    };
    this.options = {
        // This attribute determine if extendable should close others when opened
        closeSiblings: this.element.getAttribute('data-extendable-close-siblings') === 'true',
        autoClose: this.element.getAttribute('data-extendable-auto-close') === 'true',
        focusFirst: this.element.getAttribute('data-extendable-focus-first') === 'true'
    };

    this.listen();
};

window.osuny.Extendable.prototype.listen = function () {
    if (this.options.autoClose) {
        this.handleAutoClose();
    }

    this.buttons.forEach(function (button) {
        a11yClick(button, function (event) {
            event.preventDefault();
            this.toggle();
            this.a11yFocus(button);
        }.bind(this));
    }.bind(this));

    window.addEventListener('keydown', function (event) {
        if (event.keyCode === 27 || event.key === 'Escape') {
            this.toggle(false);
        }
    }.bind(this));

    this.element.addEventListener(window.window.osuny.EVENTS.EXTENDABLE_CLOSE, this.toggle.bind(this, false, true));
};

window.osuny.Extendable.prototype.handleAutoClose = function () {
    var isInTarget = false;
    window.addEventListener('click', function (event) {
        isInTarget = this.state.openedByButton ? this.state.openedByButton.contains(event.target) : false;
        if (!isInTarget) {
            isInTarget = this.element.contains(event.target);
        }
        if (this.state.opened && event.target !== this.state.openedByButton && !isInTarget) {
            this.toggle(false);
        }
    }.bind(this));
};

window.osuny.Extendable.prototype.a11yFocus = function (button) {
    if (this.state.opened) {
        this.state.openedByButton = button;
    }
};

window.osuny.Extendable.prototype.toggle = function (opened, fromOutside) {
    this.state.opened = typeof opened !== 'undefined' ? opened : !this.state.opened;

    if (this.state.opened && this.options.closeSiblings) {
        this.closeSiblings();
    }

    this.setButtonAriaExpanded();

    if (!this.state.opened && this.state.openedByButton && !fromOutside) {
        this.state.openedByButton.focus();
        this.state.openedByButton = null;
    }

    if (this.state.opened && this.options.focusFirst) {
        this.focusFirstElement();
    }

    this.dispatchOpeningEvents();
};

window.osuny.Extendable.prototype.dispatchOpeningEvents = function () {
    if (this.state.opened) {
        window.dispatchEvent(new Event(window.window.osuny.EVENTS.EXTENDABLE_HAS_OPEN));
        window.dispatchEvent(new Event('resize'));
    }
};

window.osuny.Extendable.prototype.setButtonAriaExpanded = function () {
    this.buttons.forEach(function (button) {
        if (button.getAttribute('aria-expanded')) {
            button.setAttribute('aria-expanded', this.state.opened);
        }
    }.bind(this));
};

window.osuny.Extendable.prototype.focusFirstElement = function () {
    var focusableElements = getFocusableElements(this.element);
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
};

window.osuny.Extendable.prototype.closeSiblings = function () {
    var parent = this.element.parentNode,
        extendables;

    if (parent.classList.contains('dropdown')) {
        parent = parent.parentNode;
    }

    extendables = parent.querySelectorAll('.extendable');
    extendables.forEach(function (extendable) {
        if (this.element !== extendable) {
            extendable.dispatchEvent(new Event(window.window.osuny.EVENTS.EXTENDABLE_CLOSE));
        }
    }.bind(this));
};

window.osuny.page.registerComponent({
    name: 'extendable',
    selector: '.extendable, .collapse',
    klass: window.osuny.Extendable
});
