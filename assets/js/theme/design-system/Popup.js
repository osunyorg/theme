import { ariaHideBodyChildren } from '../utils/a11y';
import { focusTrap } from '../utils/focus-trap';

var CLASSES = {
    popupOpened: 'has-modal-opened',
    popupIsOpened: 'is-opened'
};

/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.Popup = window.osuny.Popup || {};

window.osuny.Popup = function (element) {
    this.element = element;
    this.closeElements = this.element.querySelectorAll('.popup-close');
    this.extendables = this.element.querySelectorAll('.extendable');
    this.state = {
        opened: false,
        lastTriggerElement: null
    };
};

window.osuny.Popup.prototype = {
    _listen: function () {
        this.closeElements.forEach(function (button) {
            button.addEventListener('click', this.toggle.bind(this, false));
        }.bind(this));

        window.addEventListener('keydown', function (event) {
            if (event.keyCode === 27 || event.key === 'Escape') {
                this.toggle(false);
            } else if (event.key === 'Tab' && this.state.opened) {
                focusTrap(event, this.element, this.state.opened);
            }
        }.bind(this));

        window.addEventListener('click', function (event) {
            if (event.target === this.element) {
                this.toggle(false);
            }
        }.bind(this));
    },

    toggle: function (open, triggerElement) {
        var classAction;
        this.state.opened = typeof open !== 'undefined' ? open : !this.state.opened;
        classAction = this.state.opened ? 'add' : 'remove';

        document.documentElement.classList[classAction](CLASSES.popupOpened);

        this.element.setAttribute('aria-hidden', !this.state.opened);
        this.element.classList[classAction](CLASSES.popupIsOpened);

        if (!this.state.opened) {
            this.closeExtendables();
        }

        this.updateDocumentAccessibility();

        // If open action, save the element that's trigger it
        if (this.state.opened && triggerElement) {
            this.lastTriggerElement = triggerElement;
        }

        // If close action, focus the last element which open the popup
        if (!this.state.opened && this.lastTriggerElement) {
            this.lastTriggerElement.focus();
        }
    },

    closeExtendables: function () {
        // Close extendables boxes
        var closeEvent = new Event('extendable-close');
        this.extendables.forEach(function (extendable) {
            extendable.dispatchEvent(closeEvent);
        });
    },

    updateDocumentAccessibility: function () {
        ariaHideBodyChildren(this.element, this.state.opened);
    },

    isOpen: function () {
        return this.state.opened;
    }
};
