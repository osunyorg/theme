/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Slider = function Slider (element) {
    var slidesContainers = null,
        slideContainer = null,
        i;
    this.element = element;
    this.environment = window.osuny.carousel;
    this.containerWidth = this.element.getBoundingClientRect().width;
    this._findElement = window.osuny.components.utils.findElement.bind(this);
    this.container = this._findElement('container');
    this.index = 0;
    this.direction = 0;
    this.slides = [];
    slidesContainers = this.container.children;
    for (i = 0; i < slidesContainers.length; i += 1) {
        slideContainer = slidesContainers.item(i);
        this.slides.push(new window.osuny.carousel.Slide(this, slideContainer, i));
    }
    this.showSlide(this.index);
    this.element.addEventListener('scroll', function () {
        this._updateSlidesVisibilities();
    }.bind(this));
};
window.osuny.carousel.Slider.prototype = {
    showSlide: function (index) {
        var behavior = 'smooth';
        this.computeDirection(index);
        this.index = index;
        setTimeout(function () {
            this.element.scrollTo({
                top: 0,
                left: this._slidePosition(this.index),
                behavior: behavior
            });
        }.bind(this), 2);
        this._updateSlidesClasses();
        this._updateSlidesVisibilities();
    },
    recompute: function () {
        this.containerWidth = this.element.getBoundingClientRect().width;
        this.slides.forEach(function (slide) {
            slide.computeWidth();
        });
        this.showSlide(this.index);
    },
    computeDirection (index) {
        this.direction = 0;
        if (this.index > index) {
            this.direction = 1;
        } else if (this.index < index) {
            this.direction = -1;
        }
    },
    length: function () {
        return this.slides.length;
    },
    focusOnNewVisibleSlide: function () {
        var visibleSlides = [],
            focusIndex = 0;

        this.slides.forEach(function (slide) {
            if (slide.visible) {
                visibleSlides.push(slide);
            }
        });

        if (visibleSlides.length > 0) {
            focusIndex = this.direction === 1 ? 0 : visibleSlides.length - 1;
            visibleSlides[focusIndex].container.setAttribute('tabindex', '0');
            visibleSlides[focusIndex].container.focus();
        }
    },
    currentSlideIndex: function () {
        // Le seuil permet d'éviter des erreurs d'arrondis qui causent un retour en slide 1, par étapes
        var currentWidth = 0,
            threshold = 20,
            index,
            slide;
        for (index = 0; index < this.slides.length; index += 1) {
            slide = this.slides[index];
            currentWidth += slide.width;
            if (currentWidth > this.element.scrollLeft + threshold) {
                return index;
            }
        }
        return 0;
    },
    _slidePosition: function (index) {
        var position = 0,
            i;
        for (i = 0; i < index; i += 1) {
            position += this.slides[i].width;
        }
        return position;
    },
    _updateSlidesClasses: function () {
        this.slides.forEach(function (slide) {
            slide.setClasses();
        });
    },
    _updateSlidesVisibilities: function () {
        var slideVisible = false;
        this.slides.forEach(function (slide, i) {
            slideVisible = this._slideIsVisible(i);
            slide.setInteractivityState(slideVisible);
        }.bind(this));
    },
    _slideIsVisible: function (index) {
        var slidePos = {
            min: null,
            max: null
        };
        slidePos.min = this._slidePosition(index) - this.element.scrollLeft;
        slidePos.max = slidePos.min + this.slides[index].width;
        return slidePos.min >= -2 && slidePos.max <= Math.min(window.screen.width - this.element.getBoundingClientRect().left, this.containerWidth) + 2;
    }
};
