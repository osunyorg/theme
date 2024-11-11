window.osuny = window.osuny || {};
window.osuny.SlidersFactory = window.osuny.SlidersFactory || {};

window.osuny.SlidersFactory = function () {
    this.sliders = [];
    this.activeSlider = null;

    document.querySelectorAll('[data-slider]').forEach(function (element, index) {
        this.sliders.push(new window.osuny.Slider(element, index));
    }.bind(this));

    this.listen();
};

window.osuny.SlidersFactory.prototype.listen = function () {
    window.addEventListener('scroll', this.onScroll.bind(this));

    window.addEventListener('keydown', function (event) {
        if (this.activeSlider && event.key === 'ArrowLeft') {
            this.activeSlider.previous();
        } else if (this.activeSlider && event.key === 'ArrowRight') {
            this.activeSlider.next();
        }
    }.bind(this));
};

window.osuny.SlidersFactory.prototype.onScroll = function () {
    var slider,
        bounding;
    this.activeSlider = null;
    for (slider of this.sliders) {
        bounding = slider.container.getBoundingClientRect();
        if (bounding.top <= window.innerHeight * 0.75 && bounding.top > 0) {
            this.activeSlider = slider;
        }
    }
};

window.osuny.slidersFactory = new window.osuny.SlidersFactory();
