import { setAriaVisibility } from '../../utils/a11y';
import { isMobile } from '../../utils/breakpoints';
var osuny = window.osuny || {};

osuny.sliderComponents = {
    arrows: osuny.SliderArrows,
    autoplay: osuny.SliderAutoplayer,
    pagination: osuny.SliderPagination
};

osuny.Slider = function (list, titleId) {
    this.list = list;
    this.titleId = titleId;
    this.setState();
    this.setOptions();
};

Object.defineProperty(osuny.Slider.prototype, 'currentSlide', {
    get: function () {
        return this.slides[this.state.index];
    }
});

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
        slideBy: 1,
        updatedByUser: false
    };
};

osuny.Slider.prototype.setOptions = function () {
    var data = this.list.getAttribute('data-slider'),
        options = JSON.parse(data);

    this.options = {
        // Translate transition duration
        transition: osuny.utils.isDefine(options.transition) ? options.transition : 250,
        // Add previous and next arrows
        arrows: options.arrows || false,
        // Enable autoplay
        autoplay: options.autoplay || false,
        // Autoplay delay
        interval: options.interval || 5000,
        // Add navigation dots
        pagination: options.pagination || false,
        // Add current progression and slides length
        progression: options.progression || false,
        // Disabled options
        disable: options.disable || false,
        // Per Page
        perPage: options.perPage || 1
    };
};

osuny.Slider.prototype.init = function () {
    this.setup();
    this.listen();
    this.touchControl = new osuny.TouchControl(this, this.container);

    // update after everything is setup
    this.container.classList.add(osuny.Slider.classes.isReady);
    setTimeout(this.update.bind(this), 1);
    this.resize();
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
    window.addEventListener('resize', this.resize.bind(this));
};

osuny.Slider.prototype.resize = function () {
    this.state.slideBy = isMobile() ? 1 : this.options.perPage;
    this.translate();
};

osuny.Slider.prototype.loop = function () {
    if (this.state.isLast) {
        this.goTo(0);
    } else {
        this.next();
    }
};

osuny.Slider.prototype.next = function (event) {
    this.offset(this.state.slideBy, event);
};

osuny.Slider.prototype.previous = function (event) {
    this.offset(-this.state.slideBy, event);
};

osuny.Slider.prototype.offset = function (numberOfSlides, event) {
    this.goTo(this.state.index + numberOfSlides, event);
};

osuny.Slider.prototype.goTo = function (index, event) {
    this.state.updatedByUser = osuny.utils.isDefine(event);
    if (index < 0 || index > this.slides.length - 1) {
        return;
    }

    this.state.index = index;
    this.state.isFirst = this.state.index === 0;
    this.state.isLast = this.state.index === this.slides.length - this.state.slideBy;

    this.translate();
    this.update();
};

osuny.Slider.prototype.update = function () {
    var componentKey;
    this.slides.forEach(this.updateSlide.bind(this));

    for (componentKey in this.components) {
        this.components[componentKey].update();
    }

    if (this.state.updatedByUser) {
        this.focus();
    }
};

osuny.Slider.prototype.updateSlide = function (slide, index) {
    var classes = osuny.Slider.classes,
        isCurrent = index === this.state.index,
        isVisible = index >= this.state.index && index < this.state.index + this.state.slideBy;

    slide.classList.remove(classes.isCurrent, classes.isNext, classes.isPrevious);
    slide.removeAttribute('tabindex');

    setAriaVisibility(slide, isVisible);

    if (isCurrent) {
        slide.classList.add(classes.isCurrent);
    } else if (index < this.state.index) {
        slide.classList.add(classes.isPrevious);
    } else {
        slide.classList.add(classes.isNext);
    }
};

osuny.Slider.prototype.focus = function () {
    var canFocus = this.components.autoplay ? !this.components.autoplay.state.isActive : true;
    clearTimeout(this.focusTimeout);

    this.currentSlide.setAttribute('tabindex', '-1');

    if (canFocus) {
        this.focusTimeout = setTimeout(function () {
            this.currentSlide.focus();
        }.bind(this), this.options.transition);
    }
};

osuny.Slider.prototype.translate = function () {
    if (!this.touchControl.isGrabbing) {
        this.list.style.transform = 'translateX(' + -this.currentSlide.offsetLeft + 'px)';
    }
};

osuny.Slider.prototype.drag = function (direction, distance) {
    var x = -this.currentSlide.offsetLeft - distance.x;

    if (direction === 'x') {
        this.list.style.transform = 'translateX(' + x + 'px)';
    }
};

osuny.Slider.prototype.release = function () {
    this.translate();
};
