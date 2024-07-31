window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Drag = function (slider) {
    this.active = false;
    this.initialPosition = 0;
    this.slider = slider;
}
window.osuny.carousel.Drag.prototype = {
    start: function (position) {
        this.active = true;
        this.initialPosition = position;
    },
    drag: function (position) {
        var distance = this.initialPosition - position;
        this.slider.deltaPosition -= distance;
        this.slider.translate();
    },
    end: function () {
        this.active = false;
        this.initialPosition = 0;
        this.slider.recomputePosition();
    }
}