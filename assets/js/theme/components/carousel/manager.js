window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.manager = {
    initialized: false,
    elements: [],
    carousels: [],
    focusedCarousel: null,
    carouselsInViewport: [],
    windowCenterY: null,
    initialize: function () {
        if (!this.initialized) {
            this._createCarousels();
            this._computeWindowCenterY();
            this._initializeListeners();
            this._findCarouselsInViewport();
            this.initialized = true;
        }
    },
    _createCarousels: function () {
        this.elements = document.getElementsByClassName(window.osuny.carousel.classes.carousel);
        for (var i = 0; i < this.elements.length; i += 1) {
            var element = this.elements[i],
                carousel = new window.osuny.carousel.Carousel(element);
            this.carousels.push(carousel);
        }
    },
    _initializeListeners: function () {
        window.addEventListener("resize", this._resize.bind(this));
        window.addEventListener("scroll", this._findCarouselsInViewport.bind(this));
        window.addEventListener("keydown", this._onKeyPress.bind(this));
    },
    _resize: function () {
        this._computeWindowCenterY();
        this.carousels.forEach(function (carousel) {
            carousel.resize();
        });
    },
    _computeWindowCenterY: function(){
        this.windowCenterY = (window.innerHeight || document.documentElement.clientHeight) / 2;
    },
    _findCarouselsInViewport: function () {
        this.carouselsInViewport = [];
        for (var i = 0; i < this.carousels.length; i += 1) {
            var carousel = this.carousels[i];
            if (carousel.isInViewPort()) {
                carousel.unpause();
                this.carouselsInViewport.push(carousel);
            } else {
                carousel.pause();
            }
        };
        this.focusedCarousel = this._findBestCarouselFocusCandidate();
        console.log(this.focusedCarousel)
    },
    _findBestCarouselFocusCandidate: function () {
        // On démarre avec la plus grande distance possible
        var distance = window.innerHeight,
            bestCandidate = null;

        for (var i = 0; i < this.carousels.length; i += 1) {
            var carousel = this.carousels[i];
            var currentDistanceToCenter = Math.abs(carousel.getCenterPositionY() - this.windowCenterY);
            if (currentDistanceToCenter < distance) {
                distance = currentDistanceToCenter;
                bestCandidate = carousel;
            }
        };
        return bestCandidate;
    },
    _onKeyPress: function (e) {
        if (this.focusedCarousel) {
            if (e.key == 'ArrowLeft') { this.focusedCarousel.previous() }
            else if (e.key == 'ArrowRight') { this.focusedCarousel.next() }
        }
    },
    invoke: function () {
        "use strict";
        return {
            initialize: this.initialize.bind(this),
            carousels: this.carousels,
        };
    }
}.invoke();

window.addEventListener("load", function () {
    window.osuny.carousel.manager.initialize();
});