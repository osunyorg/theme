/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Arrows = function (element) {
    this.element = element;
    if (!this.element) {
        return;
    }
    this.environment = window.osuny.carousel;
    this._findElement = window.osuny.components.utils.findElement.bind(this);
    this._dispatchEvent = window.osuny.components.utils.dispatchEvent.bind(this);
    this.counter = this._findElement('arrowsCounter');
    this.next = this._findElement('arrowsNext');
    this.previous = this._findElement('arrowsPrevious');
    this.next.addEventListener('click', this._onNext.bind(this));
    this.previous.addEventListener('click', this._onPrevious.bind(this));
};

window.osuny.carousel.Arrows.prototype = {
    update: function (index, total) {
        if (this.element) {
            this.counter.innerHTML = index + 1 + '/' + total;
            this.next.disabled = index + 1 === total;
            this.previous.disabled = index === 0;
        }
    },
    _onNext: function () {
        this._dispatchEvent('arrowsNext');
    },
    _onPrevious: function () {
        this._dispatchEvent('arrowsPrevious');
    }
};
