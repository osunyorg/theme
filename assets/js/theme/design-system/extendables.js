import { a11yClick, getFocusableElements } from '../utils/a11y';

var osuny = window.osuny || {};

osuny.Extendable = function (element) {
    this.element = element;
    this.buttons = document.querySelectorAll('[aria-controls=' + this.element.id + ']');
    this.state = {
        opened: false,
        // Button which opened the extendable
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

osuny.Extendable.prototype.listen = function () {
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
            this.close();
        }
    }.bind(this));

    this.element.addEventListener(window.osuny.EVENTS.EXTENDABLE_CLOSE, this.closeQuietly.bind(this));
};

osuny.Extendable.prototype.handleAutoClose = function () {
    var isInTarget = false;
    window.addEventListener('click', function (event) {
        isInTarget = this.state.openedByButton ? this.state.openedByButton.contains(event.target) : false;
        if (!isInTarget) {
            isInTarget = this.element.contains(event.target);
        }
        if (this.state.opened && event.target !== this.state.openedByButton && !isInTarget) {
            this.close();
        }
    }.bind(this));
};

osuny.Extendable.prototype.a11yFocus = function (button) {
    if (this.state.opened) {
        this.state.openedByButton = button;
    }
};

osuny.Extendable.prototype.toggle = function () {
    if (this.state.opened) {
        this.close();
    } else {
        this.open();
    }
};

osuny.Extendable.prototype.open = function () {
    this.state.opened = true;
    if (this.options.closeSiblings) {
        this.closeSiblings();
    }
    this.setButtonAriaExpanded();
    if (this.options.focusFirst) {
        this.focusFirstElement();
    }
    window.dispatchEvent(new Event(window.osuny.EVENTS.EXTENDABLE_DID_OPEN));
    window.dispatchEvent(new Event('resize'));
};

osuny.Extendable.prototype.close = function () {
    this.state.opened = false;
    this.setButtonAriaExpanded();
    this.giveFocusBack();
    window.dispatchEvent(new Event(window.osuny.EVENTS.EXTENDABLE_DID_CLOSE));
};

// This will close without giving back any focus, as it's triggered from a sibling
osuny.Extendable.prototype.closeQuietly = function () {
    this.state.openedByButton = null;
    this.close();
};

osuny.Extendable.prototype.giveFocusBack = function () {
    if (this.state.openedByButton) {
        this.state.openedByButton.focus();
        this.state.openedByButton = null;
    }
};

osuny.Extendable.prototype.setButtonAriaExpanded = function () {
    this.buttons.forEach(function (button) {
        if (button.getAttribute('aria-expanded')) {
            button.setAttribute('aria-expanded', this.state.opened);
        }
    }.bind(this));
};

osuny.Extendable.prototype.focusFirstElement = function () {
    var focusableElements = getFocusableElements(this.element);
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
};

osuny.Extendable.prototype.closeSiblings = function () {
    var parent = this.element.parentNode,
        extendables;

    if (parent.classList.contains('dropdown')) {
        parent = parent.parentNode;
    }

    extendables = parent.querySelectorAll('.extendable');
    extendables.forEach(function (extendable) {
        if (this.element !== extendable) {
            extendable.dispatchEvent(new Event(window.osuny.EVENTS.EXTENDABLE_CLOSE));
        }
    }.bind(this));
};

(function () {
    osuny.utils.instanciateAll('.extendable, .collapse', osuny.Extendable);
}());
