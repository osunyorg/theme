window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Arrows = function (element) {
    this.element = element;
    if (this.element) {
        this._initialize();
    }
}

window.osuny.carousel.Arrows.prototype = {
    update: function (index, total) {
        if (this.element) {
            this.counter.innerHTML = (index + 1) + '/' + total;
            this.next.disabled = index + 1 == total;
            this.previous.disabled = index == 0;
        }
    },
    _initialize: function  () {
        this.counter = this.element.getElementsByClassName(window.osuny.carousel.classes.arrowsCounter).item(0);
        this.next = this.element.getElementsByClassName(window.osuny.carousel.classes.arrowsNext).item(0);
        this.previous = this.element.getElementsByClassName(window.osuny.carousel.classes.arrowsPrevious).item(0);
        this.next.addEventListener('click', this._onNext.bind(this));
        this.previous.addEventListener('click', this._onPrevious.bind(this));
    },
    _onNext: function () {
        var event = new Event(window.osuny.carousel.events.arrowsNext);
        this.element.dispatchEvent(event);
    },
    _onPrevious: function () {
        var event = new Event(window.osuny.carousel.events.arrowsPrevious);
        this.element.dispatchEvent(event);
    }
}