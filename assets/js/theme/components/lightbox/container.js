/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.LightboxContainer = function (element) {
    this.element = element;
    this.bodyElement = document.querySelector('body');
    this.mainElement = document.querySelector('main');
    this.headerElement = document.querySelector('header');
    this.footerElement = document.querySelector('footer');
    this.opened = false;
    this.controlRack = null;
    this.popupDetails = null;
    this.listeners = {};
    this.content = this.element.getElementsByClassName(window.osuny.lightbox.classes.content).item(0);
    this._initialize();
    this._initializeListeners();
};

window.osuny.lightbox.LightboxContainer.prototype = {
    _initialize () {
        var controlRackElement = document.getElementsByClassName(window.osuny.lightbox.classes.controls).item(0),
            popupDetailsElement = this.element.getElementsByClassName(window.osuny.lightbox.classes.detailWindow).item(0);
        this.controlRack = new window.osuny.lightbox.ControlRack(controlRackElement);
        this.popupDetails = new window.osuny.lightbox.Popup(popupDetailsElement);
    },
    open () {
        this._disablePageElement();
        this.bodyElement.style.overflow = 'hidden';
        this.element.style.display = 'block';
        document.addEventListener('keydown', this.listeners.keyDown);
        this.opened = true;
    },
    close () {
        this._removeImageContent();
        this._enablePageElement();
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
        // maybe add description ou alt
        this.content.focus();
        this.controlRack.load(lightbox);
        this.popupDetails.load(lightbox);
    },
    _dispachEvent(eventname) {
        var event = new Event(eventname);
        this.element.dispatchEvent(event);
    },
    _initializeListeners () {
        this.listeners.close = this._dispachEvent.bind(this, window.osuny.lightbox.events.close);
        this.listeners.next = this._dispachEvent.bind(this, window.osuny.lightbox.events.next);
        this.listeners.previous = this._dispachEvent.bind(this, window.osuny.lightbox.events.previous);
        //this.listeners.keyDown = this._onKeydown.bind(this);
        this.listeners.showDescription = this._showDescription.bind(this);
        this.listeners.showCredit = this._showCredit.bind(this);
        this.listeners.closePopup = this._closePopup.bind(this);

        this.controlRack.element.addEventListener('close', this.listeners.close);
        this.controlRack.element.addEventListener('next', this.listeners.next);
        this.controlRack.element.addEventListener('previous', this.listeners.previous);
        this.controlRack.element.addEventListener('showDescription', this.listeners.showDescription);
        this.controlRack.element.addEventListener('showCredit', this.listeners.showCredit);
        this.popupDetails.element.addEventListener('closePopup', this.listeners.closePopup);
    },
    // _onKeydown (event) {
    //     if (event.key === 'Escape') {
    //         this.listeners.close();
    //     } else if (event.key === 'ArrowLeft') {
    //         this.listeners.previous();
    //     } else if (event.key === 'ArrowRight') {
    //         this.listeners.next();
    //     }
    // },
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
    _disablePageElement () {
        this.mainElement.inert = true;
        this.mainElement.setAttribute('aria-hidden', 'true');
        this.headerElement.inert = true;
        this.headerElement.setAttribute('aria-hidden', 'true');
        this.footerElement.inert = true;
        this.footerElement.setAttribute('aria-hidden', 'true');
    },
    _enablePageElement () {
        this.mainElement.inert = false;
        this.mainElement.setAttribute('aria-hidden', 'false');
        this.headerElement.inert = false;
        this.headerElement.setAttribute('aria-hidden', 'false');
        this.footerElement.inert = false;
        this.footerElement.setAttribute('aria-hidden', 'false');
    },
    _showDescription () {
        if (this.controlRack.infoOpened()) {
            this._closePopup();
        } else {
            this.popupDetails.showDescription();
            this.controlRack.showDescription();
        }
    },
    _showCredit () {
        if (this.controlRack.creditOpened()) {
            this._closePopup();
        } else {
            this.popupDetails.showCredit();
            this.controlRack.showCredit();
        }
    },
    _closePopup (event = null) {
        if (event) {
            event.preventDefault();
        }
        this.popupDetails.close();
        this.controlRack.closePopup();
    }
};
