/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.ControlRack = function (element) {
    this.element = element;
    this.environment = window.osuny.lightbox;
    this._findElement = window.osuny.components.utils.findElement.bind(this);
    this.buttons = {
        close: this._findElement('closeButton'),
        previous: this._findElement('prevButton'),
        next: this._findElement('nextButton'),
        description: this._findElement('infoButton'),
        credit: this._findElement('creditButton')
    };
    this._initializeEvents();
};

window.osuny.lightbox.ControlRack.prototype = {
    _initializeEvents () {
        var i = 0,
            key = 0,
            action = null;
        for (i=0; i< Object.keys(this.buttons).length; i+=1) {
            key = Object.keys(this.buttons)[i];
            action = this._dispachEvent.bind(this, key);
            this.buttons[key].addEventListener('click', action);
        }
    },
    _displayArrows (display) {
        if (display) {
            this._showButton(this.buttons.previous);
            this._showButton(this.buttons.next);
        } else {
            this._hideButton(this.buttons.previous);
            this._hideButton(this.buttons.next);
        }
    },
    _dispachEvent (eventname) {
        var event = new Event(eventname);
        this.element.dispatchEvent(event);
    },
    _showButton (button) {
        button.style.display = 'block';
    },
    _hideButton (button) {
        button.style.display = 'none';
    },
    load (lightbox) {
        this._displayArrows(lightbox.isGallery);
        this.buttons.next.disabled = lightbox.next === null;
        this.buttons.previous.disabled = lightbox.previous === null;

        this._loadButton(lightbox, 'credit');
        this._loadButton(lightbox, 'description');
    },
    _loadButton (lightbox, content) {
        if (lightbox[content]) {
            this._showButton(this.buttons[content]);
        } else {
            this._hideButton(this.buttons[content]);
        }
    },
    show (popupContent = null) {
        this.buttons.description.setAttribute('aria-expanded', false);
        this.buttons.credit.setAttribute('aria-expanded', false);
        if (popupContent === 'description') {
            this.buttons.description.setAttribute('aria-expanded', true);
        } else if (popupContent === 'credit') {
            this.buttons.credit.setAttribute('aria-expanded', true);
        }
    },
    reset () {
        this.show(null);
    }
};
