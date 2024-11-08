/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.SlidersFactory = window.osuny.SlidersFactory || {};

window.osuny.SlidersFactory = function () {
    this.sliders = [];
    document.querySelectorAll('[data-slider]').forEach(function (element) {
        this.sliders.push(new window.osuny.Slider(element));
    }.bind(this));
};

window.osuny.slidersFactory = new window.osuny.SlidersFactory();
