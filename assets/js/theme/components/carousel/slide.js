window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Slide = function (slider, container, index) {
    this.slider = slider;
    this.container = container;
    this.index = index;
    this.classList = this.container.classList;
    this.computedStyle = null;
    this.width = 0;
    this.computeWidth();
}

window.osuny.carousel.Slide.prototype = {
    htmlClasses: {
        _isBefore: 'is-before',
        _isPrevious: 'is-previous',
        _isCurrent: 'is-current',
        _isNext: 'is-next',
        _isAfter: 'is-after'
    },
    computeWidth: function () {
        this.computedStyle = getComputedStyle(this.container);
        this.width =  Math.round(parseFloat(this.computedStyle.width) + parseFloat(this.computedStyle.marginLeft) + parseFloat(this.computedStyle.marginRight));
    },
    setClasses() {
        this._setState('_isBefore');
        this._setState('_isPrevious');
        this._setState('_isCurrent');
        this._setState('_isNext');
        this._setState('_isAfter');
    },
    _isBefore: function () {
        return this.index < this.slider.index;
    },
    _isPrevious: function () {
        return this.index == this.slider.index - 1;
    },
    _isCurrent: function () {
        return this.index == this.slider.index;
    },
    _isNext: function () {
        return this.index == this.slider.index + 1;
    },
    _isAfter: function  () {
        return this.index > this.slider.index;
    },
    _setState: function (state) {
        var className = this.htmlClasses[state],
            // Appel de la fonction this.isBefore()
            active = this[state]();
        if (active) {
            this.classList.add(className);
        } else {
            this.classList.remove(className);
        }
    }
}
