/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.manager = {
    initialized: false,
    lightboxes: [],
    container: null,
    currentLightbox: null,
    initialize () {
        var i = 0;
        if (!this.initialized) {
            this._createLightboxes();
            this.bodyElement = document.querySelector('body');
            this.initialized = true;
        }
        // Il y a au moins une lightbox dans la page alors on crée le conteneur
        if (this.lightboxes.length > 0) {
            this.awake = window.osuny.components.utils.dispatchAwakeEvent.bind(this);
            this._initializeContainer();
            for (i = 0; i < this.lightboxes.length; i += 1) {
                this.lightboxes[i].launcher.addEventListener('click', function (event) {
                    event.preventDefault();
                    this._onLauncherClick(event);
                }.bind(this));
            }
            this.awake('lightbox');
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
        this._addContainerListener('close', this.close.bind(this));
        this._addContainerListener('next', this.next.bind(this));
        this._addContainerListener('previous', this.previous.bind(this));
    },
    _onLauncherClick (event) {
        var index = event.currentTarget.getAttribute('value');
        this._setLightboxContent(index);
        this._open();
    },
    _setLightboxContent (index) {
        this.currentLightbox = this.lightboxes[index];
        this.container.show(this.currentLightbox);
    },
    _open () {
        if (!this.container.opened) {
            this.container.open();
        }
    },
    close () {
        this.container.close();
        this.currentLightbox.launcher.focus();
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
    },
    _addContainerListener (event, callback) {
        this.container.element.addEventListener(window.osuny.lightbox.events[event], callback);
    },
    invoke: function () {
        return {
            initialize: this.initialize.bind(this)
        };
    }
}.invoke();

window.addEventListener('load', function () {
    window.osuny.lightbox.manager.initialize();
});
