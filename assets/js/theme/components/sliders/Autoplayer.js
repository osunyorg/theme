window.osuny = window.osuny || {};

window.osuny.SliderAutoplayer = function (slider) {
    this.slider = slider;

    this.state = {
        isActive: true
    };

    this.interval = this.slider.options.interval;
    this.timeoutId = null;
    this.setup();
};

window.osuny.SliderAutoplayer.prototype.setup = function () {
    this.slider.container.style.setProperty('--slider-pagination-interval', this.interval + 'ms');
    this.start();
};

window.osuny.SliderAutoplayer.prototype.start = function () {
    // Avoid multiple timeout
    clearTimeout(this.timeoutId);

    this.slider.container.classList.remove('is-paused');

    this.timeoutId = setTimeout(function () {
        this.state.isActive = true;
        if (this.slider.state.isLast) {
            this.slider.goTo(0);
        } else {
            this.slider.next();
        }
        this.state.isActive = false;
    }.bind(this), this.interval);
};

window.osuny.SliderAutoplayer.prototype.stop = function () {
    clearTimeout(this.timeoutId);
    this.slider.container.classList.add('is-paused');
};

window.osuny.SliderAutoplayer.prototype.update = function () {
    if (this.state.isActive) {
        this.start();
    } else {
        this.stop();
    }
};

