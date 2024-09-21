/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.LightboxContainer = function (element) {
    this.element = element;
    this.pageFocusableElements = ['main', 'header', 'footer'];
    this.bodyElement = document.querySelector('body');
    this.opened = false;
    this.controlRack = null;
    this.popupDetails = null;
    this.listeners = {};
    this._findElement = window.osuny.lightbox.utils.findElement.bind(this);
    this.content = this._findElement('content');
    this._initialize();
};

window.osuny.lightbox.LightboxContainer.prototype = {
    open () {
        this._setPageElementsEnabled(false);
        this.bodyElement.style.overflow = 'hidden';
        this.element.style.display = 'block';
        document.addEventListener('keydown', this.listeners.keyDown);
        this.opened = true;
    },
    close () {
        this._removeImageContent();
        this._setPageElementsEnabled(true);
        this.bodyElement.style.overflow = 'visible';
        this.element.style.display = 'none';
        this._closePopup();
        document.removeEventListener('keydown', this.listeners.keyDown);
        this.opened = false;
    },
    show (lightbox) {
        this.popupDetails.close();
        this._removeImageContent();
        this._setImageContent(lightbox);
        this.content.focus();
        this.controlRack.load(lightbox);
        this.popupDetails.load(lightbox);
    },
    _initialize () {
        var controlRackElement = document.getElementsByClassName(window.osuny.lightbox.classes.controls).item(0),
            popupDetailsElement = this._findElement('detailWindow');
        this.controlRack = new window.osuny.lightbox.ControlRack(controlRackElement);
        this.popupDetails = new window.osuny.lightbox.Popup(popupDetailsElement);
        this._initializeListeners();
    },
    _initializeListeners () {
        var buttonEvents = Object.keys(this.controlRack.buttons);
        // Dispaching to manager
        this.listeners.close = this._dispachEvent.bind(this, window.osuny.lightbox.events.close);
        this.listeners.next = this._dispachEvent.bind(this, window.osuny.lightbox.events.next);
        this.listeners.previous = this._dispachEvent.bind(this, window.osuny.lightbox.events.previous);

        // handling local event
        this.listeners.keyDown = this._onKeydown.bind(this);
        this.listeners.description = this._showPopup.bind(this, 'description');
        this.listeners.credit = this._showPopup.bind(this, 'credit');
        this.listeners.closePopup = this._closePopup.bind(this);

        buttonEvents.forEach(function (eventname) {
            this.controlRack.element.addEventListener(eventname, this.listeners[eventname]);
        }.bind(this));
        this.popupDetails.element.addEventListener('closePopup', this.listeners.closePopup);
    },
    _dispachEvent (eventname) {
        var event = new Event(eventname);
        this.element.dispatchEvent(event);
    },
    _onKeydown (event) {
        if (event.key === 'Escape') {
            this.listeners.close();
        } else if (event.key === 'ArrowLeft') {
            this.listeners.previous();
        } else if (event.key === 'ArrowRight') {
            this.listeners.next();
        }
    },
    _setImageContent (lightbox) {
        var image = document.createElement('img');
        image.setAttribute('src', lightbox.url);
        if (lightbox.description) {
            image.setAttribute('alt', lightbox.description);
        }
        this.content.append(image);
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
