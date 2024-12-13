var osuny = window.osuny || {};

osuny.SliderAutoplayer = function (slider) {
    this.slider = slider;

    this.state = {
        isActive: true,
        isPaused: false
    };

    this.interval = this.slider.options.interval;
    this.timeoutId = null;
    this.setup();
};

osuny.SliderAutoplayer.prototype.setup = function () {
    this.slider.container.style.setProperty('--slider-pagination-interval', this.interval + 'ms');
    this.addToggler();
    this.play();
};

osuny.SliderAutoplayer.prototype.addToggler = function () {
    this.container = document.createElement('div');
    this.container.classList.add('slider-autoplayer');
    this.button = document.createElement('button');
    this.container.append(this.button);
    this.slider.controls.append(this.container);

    this.button.setAttribute('aria-describedby', this.slider.titleId);
    this.a11ySpan = osuny.utils.insertSROnly(this.button, osuny.i18n.slider.pause);

    this.button.addEventListener('click', this.toggle.bind(this));
};

osuny.SliderAutoplayer.prototype.toggle = function () {
    if (this.state.isPaused) {
        this.resume();
    } else {
        this.pause();
    }
};

osuny.SliderAutoplayer.prototype.play = function () {
    // Avoid multiple timeout
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(this.callNextSlide.bind(this), this.interval);
};

osuny.SliderAutoplayer.prototype.callNextSlide = function () {
    this.state.isActive = true;
    this.slider.loop();
    this.state.isActive = false;
};

osuny.SliderAutoplayer.prototype.resume = function () {
    this.state.isPaused = false;
    this.slider.container.classList.remove('is-paused');
    this.callNextSlide();
    this.a11ySpan.innerText = osuny.i18n.slider.pause;
};

osuny.SliderAutoplayer.prototype.pause = function () {
    this.state.isPaused = true;
    this.slider.container.classList.add('is-paused');
    this.a11ySpan.innerText = osuny.i18n.slider.play;
    clearTimeout(this.timeoutId);
};

osuny.SliderAutoplayer.prototype.update = function () {
    if (this.state.isPaused) {
        return;
    }

    if (this.state.isActive) {
        this.play();
    } else {
        this.pause();
    }
};
