window.osuny = window.osuny || {};

window.osuny.sliderComponents = {
    arrows: window.osuny.SliderArrows,
    autoplay: window.osuny.SliderAutoplayer,
    pagination: window.osuny.SliderPagination
};

window.osuny.Slider = function (list) {
    this.list = list;
    this.setState();
    this.setOptions();
    this.setup();
    this.touchControl = new window.osuny.TouchControl(this);

    // update after everything is setup
    this.container.classList.add('is-ready');
    setTimeout(this.update.bind(this), 1);
};

window.osuny.Slider.prototype.setState = function () {
    this.state = {
        active: false,
        index: 0,
        isFirst: true,
        isLast: false
    };
};

window.osuny.Slider.prototype.setOptions = function () {
    var data = this.list.getAttribute('data-slider'),
        options = JSON.parse(data);

    this.options = {
        // Add previous and next arrows
        arrows: options.arrows || false,
        // Enable autoplay
        autoplay: options.autoplay || false,
        // Autoplay delay
        interval: options.interval || 2000,
        // Add navigation dots
        pagination: options.pagination || false,
        // Add current progression and slides length
        progression: options.progression || false
    };
};

window.osuny.Slider.prototype.setup = function () {
    this.list.classList.add('slider-list');

    this.container = document.createElement('div');
    this.container.classList.add('slider');

    // Create track
    this.track = document.createElement('div');
    this.track.classList.add('slider-track');

    this.list.parentNode.append(this.container);
    this.track.append(this.list);
    this.container.append(this.track);

    // Append slides to list
    Array.prototype.slice.call(this.list.children).forEach(function (slide) {
        slide.classList.add('slider-slide');
    }.bind(this));

    this.slides = this.list.querySelectorAll('.slider-slide');

    this.addComponents();
};

window.osuny.Slider.prototype.addComponents = function () {
    this.components = {};

    ['arrows', 'pagination', 'autoplay'].forEach(function (name) {
        if (this.options[name]) {
            this.components[name] = new window.osuny.sliderComponents[name](this);
        }
    }.bind(this));
};

window.osuny.Slider.prototype.next = function () {
    this.move(1);
};

window.osuny.Slider.prototype.previous = function () {
    this.move(-1);
};

window.osuny.Slider.prototype.move = function (numberOfSlides) {
    this.goTo(this.state.index + numberOfSlides);
};

window.osuny.Slider.prototype.goTo = function (index) {
    if (index <= 0 || index > this.slides.length - 1) {
        return;
    }

    this.state.index = index;
    this.state.isFirst = this.state.index === 0;
    this.state.isLast = this.state.index === this.slides.length - 1;

    this.translate();
    this.update();
};

window.osuny.Slider.prototype.update = function () {
    var componentKey;
    this.slides.forEach(function (slide, index) {
        slide.classList.remove('is-current', 'is-visible', 'is-next', 'is-previous');
        if (index < this.state.index) {
            slide.classList.add('is-previous');
        } else if (index === this.state.index) {
            slide.classList.add('is-current');
        } else {
            slide.classList.add('is-next');
        }
    }.bind(this));

    for (componentKey in this.components) {
        this.components[componentKey].update();
    }
};

window.osuny.Slider.prototype.translate = function () {
    this.list.style.transform = 'translateX(' + -this.slides[this.state.index].offsetLeft + 'px)';
};
