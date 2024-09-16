/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Slider = function Slider (element) {
    var slidesContainers = null,
        slideContainer = null,
        i;
    this.element = element;
    this._findElement = window.osuny.carousel.utils.findElement.bind(this);
    this.container = this._findElement('container');
    this.index = 0;
    this.slides = [];
    this.deltaPosition = 0;
    this.drag = null;
    slidesContainers = this.container.children;
    for (i = 0; i < slidesContainers.length; i += 1) {
        slideContainer = slidesContainers.item(i);
        this.slides.push(new window.osuny.carousel.Slide(this, slideContainer, i));
    }
    this.showSlide(this.index);
};
window.osuny.carousel.Slider.prototype = {
    showSlide: function (index) {
        var behavior = 'smooth';
        this.index = index;
        this.element.scrollTo({
            top: 0,
            left: this._slidePosition(index),
            behavior: behavior
        });
        this._updateSlidesClasses();
    },
    recompute: function () {
        this.slides.forEach(function (slide) {
            slide.computeWidth();
        });
        this.showSlide(this.index);
    },
    length: function () {
        return this.slides.length;
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
    }
};
