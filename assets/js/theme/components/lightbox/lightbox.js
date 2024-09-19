window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.Lightbox = function (element) {
    this.element = element;
    this.imgData = {
        url: ''
    }
    this.launcher = null;
    this._initialize();

    // note event lister fleche return next item geré niveau manager
};

window.osuny.lightbox.Lightbox.prototype = {
    _initialize () {
        this.launcher = this.element.getElementsByClassName(window.osuny.lightbox.classes.launcher).item(0);
        if (this.element.classList.contains(window.osuny.lightbox.classes.groupedlightbox)) {
            this._initializeGroupedLightbox();
        } else {
            this._initializeSingleLightbox();
        }
    },
    _initializeGroupedLightbox () {

    },
    _initializeSingleLightbox () {

    },
    open(){

    },
    close () {

    },
    next () {

    },
    previous () {

    }
};