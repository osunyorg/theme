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
            this._initializeContainer();
            for (i = 0; i < this.lightboxes.length; i += 1) {
                this.lightboxes[i].launcher.addEventListener('click', function (event) {
                    event.preventDefault();
                    this._onLauncherClick(event);
                }.bind(this));
            }
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
        this.container.element.addEventListener(window.osuny.lightbox.events.close, this.onClose.bind(this));
        this.container.element.addEventListener(window.osuny.lightbox.events.next, this.onNext.bind(this));
        this.container.element.addEventListener(window.osuny.lightbox.events.previous, this.onPrevious.bind(this));
    },
    _onLauncherClick (event) {
        var index = event.target.getAttribute('value');
        this._setLightboxContent(index);
        this.open();
    },
    _setLightboxContent (index) {
        this.currentLightbox = this.lightboxes[index];
        this.container.show(this.currentLightbox);
    },
    open () {
        if (!this.container.opened) {
            this.container.open();
        }
    },
    onClose () {
        console.log('çlose')
        this.container.close();
        this.currentLightbox.launcher.focus();
    },
    onNext () {
        if (this.currentLightbox.next) {
            this._setLightboxContent(this.currentLightbox.next);
        }
    },
    onPrevious () {
        if (this.currentLightbox.previous) {
            this._setLightboxContent(this.currentLightbox.previous);
        }
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
