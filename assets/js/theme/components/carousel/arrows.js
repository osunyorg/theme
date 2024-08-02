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
        this.counter = window.osuny.utils.findElementByClassName(
            this.element,
            window.osuny.carousel.classes.arrowsCounter
        );
        this.next = window.osuny.utils.findElementByClassName(
            this.element,
            window.osuny.carousel.classes.arrowsNext
        );
        this.previous = window.osuny.utils.findElementByClassName(
            this.element,
            window.osuny.carousel.classes.arrowsPrevious
        );
        this.next.addEventListener(
            "click",
            this._onNext.bind(this)
        );
        this.previous.addEventListener(
            "click",
            this._onPrevious.bind(this)
        );
    },
    _onNext: function () {
        this.element.dispatchEvent(
            new Event(window.osuny.carousel.events.arrowsNext)
        );
    },
    _onPrevious: function () {
        this.element.dispatchEvent(
            new Event(window.osuny.carousel.events.arrowsPrevious)
        );
    }
}