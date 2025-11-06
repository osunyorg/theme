import { ariaHideBodyChildren } from '../utils/a11y';
import { focusTrap } from '../utils/focus-trap';

var CLASSES = {
    hasPopupOpened: 'has-modal-opened',
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
window.osuny.Popup.prototype._listen = function () {
    this.closeElements.forEach(function (button) {
        button.addEventListener('click', this.toggle.bind(this, false));
    }.bind(this));

    window.addEventListener('keydown', function (event) {
        if (event.keyCode === 27 || event.key === 'Escape') {
            this.toggle(false);
        }
        focusTrap(event, this.element, this.state.opened);
    }.bind(this));

    window.addEventListener('click', function (event) {
        if (event.target === this.element) {
            this.toggle(false);
        }
    }.bind(this));
};

window.osuny.Popup.prototype.toggle = function (open, triggerElement) {
    var classAction;
    this.state.opened = typeof open !== 'undefined' ? open : !this.state.opened;
    classAction = this.state.opened ? 'add' : 'remove';

    document.documentElement.classList[classAction](CLASSES.hasPopupOpened);

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
};

window.osuny.Popup.prototype.open = function () {
    this.toggle(true);
};

window.osuny.Popup.prototype.close = function () {
    this.toggle(false);
};

window.osuny.Popup.prototype.closeExtendables = function () {
    // Close extendables boxes
    var closeEvent = new Event(window.osuny.EVENTS.EXTENDABLE_CLOSE);
    this.extendables.forEach(function (extendable) {
        extendable.dispatchEvent(closeEvent);
    });
};

window.osuny.Popup.prototype.updateDocumentAccessibility = function () {
    ariaHideBodyChildren(this.element, this.state.opened);
};

window.osuny.Popup.prototype.isOpen = function () {
    return this.state.opened;
};
