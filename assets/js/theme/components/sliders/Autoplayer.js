window.osuny = window.osuny || {};

window.osuny.SliderAutoplayer = function (slider) {
    this.slider = slider;

    this.state = {
        isActive: true,
        isPaused: false
    };

    this.interval = this.slider.options.interval;
    this.timeoutId = null;
    this.setup();
};

window.osuny.SliderAutoplayer.prototype.setup = function () {
    this.slider.container.style.setProperty('--slider-pagination-interval', this.interval + 'ms');
    this.addToggler();
    this.play();
};

window.osuny.SliderAutoplayer.prototype.addToggler = function () {
    this.container = document.createElement('div');
    this.container.classList.add('slider-autoplayer');
    this.button = document.createElement('button');
    this.button.innerHTML = '<span class="sr-only">jouer/arrêter</span>';
    this.container.append(this.button);
    this.slider.controls.append(this.container);

    this.button.addEventListener('click', this.toggle.bind(this));
};

window.osuny.SliderAutoplayer.prototype.toggle = function () {
    if (this.state.isPaused) {
        this.resume();
    } else {
        this.pause();
    }
};

window.osuny.SliderAutoplayer.prototype.play = function () {
    // Avoid multiple timeout
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(this.callNextSlide.bind(this), this.interval);
};

window.osuny.SliderAutoplayer.prototype.callNextSlide = function () {
    this.state.isActive = true;
    this.slider.loop();
    this.state.isActive = false;
};

window.osuny.SliderAutoplayer.prototype.resume = function () {
    this.state.isPaused = false;
    this.slider.container.classList.remove('is-paused');
    this.callNextSlide();
};

window.osuny.SliderAutoplayer.prototype.pause = function () {
    this.state.isPaused = true;
    this.slider.container.classList.add('is-paused');
    clearTimeout(this.timeoutId);
};

window.osuny.SliderAutoplayer.prototype.update = function () {
    if (this.state.isPaused) {
        return;
    }

    if (this.state.isActive) {
        this.play();
    } else {
        this.pause();
    }
};

