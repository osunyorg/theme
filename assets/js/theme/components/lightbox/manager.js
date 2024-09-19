/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.manager = {
    initialized: false,
    elements: [],
    lightboxes: [],
    initialize () {
        if (!this.initialized) {
            this._createLightboxes();
            this.initialized = true;
        }
    },
    _createLightboxes () {
        var lightboxElements = document.getElementsByClassName(window.osuny.lightbox.classes.lightbox),
            lightbox = null,
            i = 0;
        for (i = 0; i < lightboxElements.length; i += 1) {
            lightbox = new window.osuny.lightbox.Lightbox(lightboxElements[i]);
            this.lightboxes.push(lightbox);
        }
        console.log(this.lightboxes)
    },
    invoke: function () {
        return {
            initialize: this.initialize.bind(this),
            lightboxes: this.lightboxes
        };
    }
}.invoke();

window.addEventListener('load', function () {
    window.osuny.lightbox.manager.initialize();
});

