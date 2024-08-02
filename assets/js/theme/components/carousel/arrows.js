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
        this.counter = this._findElement('arrowsCounter');
        this.next = this._findElement('arrowsNext');
        this.previous = this._findElement('arrowsPrevious');
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
        this._dispatchEvent('arrowsNext');
    },
    _onPrevious: function () {
        this._dispatchEvent('arrowsPrevious');
    },
    _findElement: function(classKey) {
        var className = window.osuny.carousel.classes[classKey];
        return this.element.getElementsByClassName(className).item(0);
    },
    _dispatchEvent: function (eventKey) {
        var eventName = window.osuny.carousel.events[eventKey];
        var event = new Event(eventName);
        this.element.dispatchEvent(event);
    }
}