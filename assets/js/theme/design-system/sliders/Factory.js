var osuny = window.osuny || {};
osuny.SlidersFactory = osuny.SlidersFactory || {};
osuny.lightbox = osuny.lightbox || {};

osuny.SlidersFactory = function () {
    this.sliders = [];
    this.activeSlider = null;

    document.querySelectorAll('[data-slider]').forEach(function (element, index) {
        // Check if carousel as more than one slide
        if (element.children.length > 1) {
            this.sliders.push(new osuny.Slider(element, index));
        }
    }.bind(this));

    this.listen();
};

osuny.SlidersFactory.prototype.listen = function () {
    window.addEventListener('scroll', this.onScroll.bind(this));
    window.addEventListener('keydown', this.onKeydown.bind(this));
};

osuny.SlidersFactory.prototype.onKeydown = function (event) {
    if (osuny.lightbox.isOpen()) {
        return;
    }
    if (this.activeSlider && event.key === 'ArrowLeft') {
        this.activeSlider.previous();
    } else if (this.activeSlider && event.key === 'ArrowRight') {
        this.activeSlider.next();
    }
};

osuny.SlidersFactory.prototype.onScroll = function () {
    var slider,
        bounding;
    this.activeSlider = null;
    for (slider of this.sliders) {
        bounding = slider.container.getBoundingClientRect();
        if (bounding.top <= innerHeight * 0.75 && bounding.top > 0) {
            this.activeSlider = slider;
        }
    }
};

osuny.slidersFactory = new osuny.SlidersFactory();
