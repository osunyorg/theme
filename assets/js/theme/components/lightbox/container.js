/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.LightboxContainer = function (element) {
    this.element = element;
    this.pageFocusableElements = ['main', 'nav', 'header', 'footer'];
    this.bodyElement = document.querySelector('body');
    this.opened = false;
    this.controlRack = null;
    this.popupDetails = null;
    this.eventsCallback = {};
    this.environment = window.osuny.lightbox;
    this._findElement = window.osuny.components.utils.findElement.bind(this);
    this._dispatchEvent = window.osuny.components.utils.dispatchEvent.bind(this);
    this.content = this._findElement('content');
    this._initialize();
};

window.osuny.lightbox.LightboxContainer.prototype = {
    open () {
        this._setPageElementsEnabled(false);
        this.bodyElement.style.overflow = 'hidden';
        this.element.style.display = 'block';
        document.addEventListener('keydown', this.eventsCallback.keyDown);
        this.opened = true;
    },
    close () {
        this._removeImageContent();
        this._setPageElementsEnabled(true);
        this.bodyElement.style.overflow = 'visible';
        this.element.style.display = 'none';
        this._closePopup();
        document.removeEventListener('keydown', this.eventsCallback.keyDown);
        this.opened = false;
    },
    show (lightbox) {
        this.popupDetails.close();
        this._removeImageContent();
        this._setImageContent(lightbox);
        // this.content.focus();
        this.controlRack.load(lightbox);
        this.popupDetails.load(lightbox);
    },
    _initialize () {
        var controlRackElement = this._findElement('controls'),
            popupDetailsElement = this._findElement('detailWindow');
        this.controlRack = new window.osuny.lightbox.ControlRack(controlRackElement);
        this.popupDetails = new window.osuny.lightbox.Popup(popupDetailsElement);
        this._initializeListeners();
    },
    _initializeListeners () {
        var buttonEvents = Object.keys(this.controlRack.buttons);
        // Dispaching to manager
        this.eventsCallback.close = this._dispatchEvent.bind(this, 'close');
        this.eventsCallback.next = this._dispatchEvent.bind(this, 'next');
        this.eventsCallback.previous = this._dispatchEvent.bind(this, 'previous');

        // handling local event
        this.eventsCallback.keyDown = this._onKeydown.bind(this);
        this.eventsCallback.description = this._showPopup.bind(this, 'description');
        this.eventsCallback.credit = this._showPopup.bind(this, 'credit');
        this.eventsCallback.closePopup = this._closePopup.bind(this);

        buttonEvents.forEach(function (eventname) {
            this.controlRack.element.addEventListener(eventname, this.eventsCallback[eventname]);
        }.bind(this));
        this.popupDetails.element.addEventListener('closePopup', this.eventsCallback.closePopup);
    },
    _onKeydown (event) {
        if (event.key === 'Escape') {
            this.eventsCallback.close();
        }
    },
    _setImageContent (lightbox) {
        var image = document.createElement('img'),
            imageDescription = lightbox.descriptionPlain || lightbox.creditPlain || '';
        image.setAttribute('src', lightbox.url);
        image.setAttribute('alt', imageDescription);
        this.content.setAttribute('aria-label', imageDescription);
        this.content.append(image);
        this.content.focus();
    },
    _removeImageContent () {
        this.content.innerHTML = '';
    },
    _setPageElementsEnabled (enabled) {
        this.pageFocusableElements.forEach(function (elem) {
            this._setPageElementEnabled(elem, enabled);
        }.bind(this));
    },
    _setPageElementEnabled (elem, enabled) {
        var element = document.querySelector(elem);
        element.setAttribute('aria-hidden', String(!enabled));
        element.inert = !enabled;
    },
    _showPopup (popupContent) {
        if (this.popupDetails.opened && this.popupDetails.current === popupContent) {
            this._closePopup();
        } else {
            this.popupDetails.show(popupContent);
            this.controlRack.show(popupContent);
        }
    },
    _closePopup () {
        this.popupDetails.close();
        this.controlRack.reset();
    }
};
