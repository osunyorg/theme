import * as params from '@params';
import { setAriaVisibility } from '../../utils/a11y';

var osuny = window.osuny || {};
osuny.i18n = params.i18n;

osuny.sliderComponents = {
    arrows: osuny.SliderArrows,
    autoplay: osuny.SliderAutoplayer,
    pagination: osuny.SliderPagination
};

osuny.Slider = function (list) {
    this.list = list;
    this.setState();
    this.setOptions();
    this.setup();
    this.listen();
    this.touchControl = new osuny.TouchControl(this);

    // update after everything is setup
    this.container.classList.add(osuny.Slider.classes.isReady);
    setTimeout(this.update.bind(this), 1);
};

osuny.Slider.classes = {
    isReady: 'is-ready',
    isCurrent: 'is-current',
    isPrevious: 'is-previous',
    isNext: 'is-next',
    list: 'slider-list',
    container: 'slider',
    track: 'slider-track',
    controls: 'slider-controls',
    slide: 'slider-slide'
};

osuny.Slider.prototype.setState = function () {
    this.state = {
        index: 0,
        isFirst: true,
        isLast: false,
        isGrabbed: false
    };
};

osuny.Slider.prototype.setOptions = function () {
    var data = this.list.getAttribute('data-slider'),
        options = JSON.parse(data);

    this.options = {
        // Autoplay delay
        transition: options.transition || 250,
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

osuny.Slider.prototype.setup = function () {
    var classes = osuny.Slider.classes;
    this.list.classList.add(classes.list);

    this.container = document.createElement('div');
    this.container.classList.add(classes.container);

    // Create track
    this.track = document.createElement('div');
    this.track.classList.add(classes.track);

    this.list.parentNode.append(this.container);
    this.track.append(this.list);
    this.container.append(this.track);

    this.controls = document.createElement('div');
    this.controls.classList.add(classes.controls);
    this.container.append(this.controls);

    // Append slides to list
    Array.prototype.slice.call(this.list.children).forEach(function (slide) {
        slide.classList.add(classes.slide);
    }.bind(this));

    this.slides = this.list.querySelectorAll('.' + classes.slide);

    this.container.style.setProperty('--slider-transition-duration', this.options.transition + 'ms');

    this.addComponents();
};

osuny.Slider.prototype.addComponents = function () {
    this.components = {};

    ['arrows', 'pagination', 'autoplay'].forEach(function (name) {
        if (this.options[name]) {
            this.components[name] = new osuny.sliderComponents[name](this);
        }
    }.bind(this));
};

osuny.Slider.prototype.listen = function () {
    window.addEventListener('resize', this.update.bind(this));
};

osuny.Slider.prototype.loop = function () {
    if (this.state.isLast) {
        this.goTo(0);
    } else {
        this.next();
    }
};

osuny.Slider.prototype.next = function () {
    this.offset(1);
};

osuny.Slider.prototype.previous = function () {
    this.offset(-1);
};

osuny.Slider.prototype.offset = function (numberOfSlides) {
    this.goTo(this.state.index + numberOfSlides);
};

osuny.Slider.prototype.goTo = function (index) {
    if (index < 0 || index > this.slides.length - 1) {
        return;
    }

    this.state.index = index;
    this.state.isFirst = this.state.index === 0;
    this.state.isLast = this.state.index === this.slides.length - 1;

    this.translate();
    this.update();
};

osuny.Slider.prototype.update = function () {
    var componentKey;
    this.slides.forEach(function (slide, index) {
        this.updateSlide(slide, index);
    }.bind(this));

    for (componentKey in this.components) {
        this.components[componentKey].update();
    }
};

osuny.Slider.prototype.updateSlide = function (slide, index) {
    var classes = osuny.Slider.classes,
        current = index === this.state.index;

    slide.classList.remove(classes.isCurrent, classes.isNext, classes.isPrevious);

    setAriaVisibility(slide, current);

    if (current) {
        slide.classList.add(classes.isCurrent);
        this.focus(slide);
    } else if (index < this.state.index) {
        slide.classList.add(classes.isPrevious);
    } else {
        slide.classList.add(classes.isNext);
    }
};

osuny.Slider.prototype.focus = function (slide) {
    var canFocus = this.components.autoplay ? !this.components.autoplay.state.isActive : true;
    clearTimeout(this.focusTimeout);

    if (canFocus) {
        this.focusTimeout = setTimeout(function () {
            slide.focus();
        }, this.options.transition);
    }
};

osuny.Slider.prototype.translate = function () {
    if (!this.state.isGrabbed) {
        this.list.style.transform = 'translateX(' + -this.slides[this.state.index].offsetLeft + 'px)';
    }
};

osuny.Slider.prototype.move = function (gap) {
    var x = -this.slides[this.state.index].offsetLeft - gap;
    this.state.isGrabbed = true;
    this.list.style.transform = 'translateX(' + x + 'px)';
};

osuny.Slider.prototype.release = function () {
    this.state.isGrabbed = false;
    this.translate();
};
