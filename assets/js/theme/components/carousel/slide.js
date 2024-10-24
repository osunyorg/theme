/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Slide = function (slider, container, index) {
    this.slider = slider;
    this.container = container;
    this.index = index;
    this.classList = this.container.classList;
    this.computedStyle = null;
    this.width = 0;
    this.visible = false;
    this.computeWidth();
};

window.osuny.carousel.Slide.prototype = {
    computeWidth: function () {
        this.computedStyle = getComputedStyle(this.container);
        this.width = this.container.offsetWidth +
                        parseFloat(this.computedStyle.marginLeft) +
                        parseFloat(this.computedStyle.marginRight);
    },
    setClasses () {
        this._setState(this._isBefore(), window.osuny.carousel.classes.slideIsBefore);
        this._setState(this._isPrevious(), window.osuny.carousel.classes.slideIsPrevious);
        this._setState(this._isCurrent(), window.osuny.carousel.classes.slideIsCurrent);
        this._setState(this._isNext(), window.osuny.carousel.classes.slideIsNext);
        this._setState(this._isAfter(), window.osuny.carousel.classes.slideIsAfter);
    },
    setInteractivityState (slideVisible) {
        var focusableSubElements = ['a', 'button', 'iframe'];
        this.visible = slideVisible;
        this.setFocusable(this.container);
        focusableSubElements.forEach(function (element) {
            this.container.querySelectorAll(element).forEach(function (e) {
                this.setFocusable(e);
            }.bind(this));
        }.bind(this));
    },
    setFocusable (element) {
        element.setAttribute('aria-hidden', String(!this.visible));
        if (this.visible) {
            element.setAttribute('tabindex', String(0));
        } else {
            element.setAttribute('tabindex', String(-1));
        }
    },
    _isBefore: function () {
        return this.index < this.slider.index;
    },
    _isPrevious: function () {
        return this.index === this.slider.index - 1;
    },
    _isCurrent: function () {
        return this.index === this.slider.index;
    },
    _isNext: function () {
        return this.index === this.slider.index + 1;
    },
    _isAfter: function () {
        return this.index > this.slider.index;
    },
    _setState: function (active, className) {
        if (active) {
            this.classList.add(className);
        } else {
            this.classList.remove(className);
        }
    }
};
