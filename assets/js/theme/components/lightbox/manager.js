/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};
window.osuny.lightbox.manager = {
    initialized: false,
    lightboxes: [],
    container: null,
    currentLightbox: null,
    controlRack: null,
    listeners: {},
    initialize () {
        if (!this.initialized) {
            this._createLightboxes();
            this.bodyElement = document.querySelector('body');
            this.initialized = true;
        }
        // Il y a au moins une lightbox das la page alors on crée le conteneur
        if (this.lightboxes.length > 0) {
            this._initializeContainer();
            this._initializeControlRack();
            this._initializeListeners();
        }
    },
    _createLightboxes () {
        var lightboxElements = document.getElementsByClassName(window.osuny.lightbox.classes.figure),
            lightbox = null,
            i = 0;
        for (i = 0; i < lightboxElements.length; i += 1) {
            lightbox = new window.osuny.lightbox.Lightbox(lightboxElements[i], i);
            this.lightboxes.push(lightbox);
        }
    },
    // one container handles all lightboxes contents
    _initializeContainer () {
        var containerElement = document.getElementsByClassName(window.osuny.lightbox.classes.container).item(0);
        this.container = new window.osuny.lightbox.LightboxContainer(containerElement);
    },
    _initializeControlRack () {
        var controlRackElement = document.getElementsByClassName(window.osuny.lightbox.classes.controls).item(0);
        this.controlRack = new window.osuny.lightbox.ControlRack(controlRackElement);
    },
    _initializeListeners () {
        var i = 0;
        for (i = 0; i < this.lightboxes.length; i += 1) {
            this.lightboxes[i].launcher.addEventListener('click', function (event) {
                event.preventDefault();
                this._onLauncherClick(event);
            }.bind(this));
        }
        this.listeners.keyDown = this._onKeydown.bind(this);
        this.listeners.close = this.close.bind(this);
        this.listeners.next = this.next.bind(this);
        this.listeners.previous = this.previous.bind(this);
    },
    _onLauncherClick (event) {
        var index = event.target.getAttribute('value');
        this._setLightboxContent(index);
        this.open();
    },
    _onKeydown (event) {
        if (event.key === 'Escape') {
            this.close();
        } else if (event.key === 'ArrowLeft') {
            this.previous();
        } else if (event.key === 'ArrowRight') {
            this.next();
        }
    },
    _setLightboxContent (index) {
        this.currentLightbox = this.lightboxes[index];
        this.container.show(this.currentLightbox);
        // update controlrack infos
    },
    invoke: function () {
        return {
            initialize: this.initialize.bind(this),
            lightboxes: this.lightboxes
        };
    },
    _bindLightboxEvents () { 
        this.controlRack.closeButton.addEventListener('click', this.listeners.close);
        this.controlRack.nextButton.addEventListener('click', this.listeners.next);
        this.controlRack.prevButton.addEventListener('click', this.listeners.previous);
        document.addEventListener('keydown', this.listeners.keyDown);
        // todo infos
        // todo credit
    },
    _unbindLightboxEvents () {
        this.controlRack.closeButton.removeEventListener('click', this.listeners.close);
        this.controlRack.nextButton.removeEventListener('click', this.listeners.next);
        this.controlRack.prevButton.removeEventListener('click', this.listeners.previous);
        document.removeEventListener('keydown', this.listeners.keyDown);
        // todo infos
        // todo credit
    },
    open () {
        if (!this.container.opened) {
            this.container.open();
            // handle events only when lightbox is opened
            this._bindLightboxEvents();
        }
    },
    close () {
        this.container.close();
        // handle events only when lightbox is opened
        this._unbindLightboxEvents();
    },
    next () {
        if (this.currentLightbox.next) {
            this._setLightboxContent(this.currentLightbox.next);
        }
    },
    previous () {
        if (this.currentLightbox.previous) {
            this._setLightboxContent(this.currentLightbox.previous);
        }
    }
}.invoke();

window.addEventListener('load', function () {
    window.osuny.lightbox.manager.initialize();
});
