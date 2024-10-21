/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Carousel = function (element, index) {
    this.element = element;
    this.slides = {
        current: 0,
        total: 0
    };
    this.state = {
        initialized: false,
        visible: false,
        hasMouseOver: false,
        hasFocus: false
    };
    this.index = index;
    this.windowResizeTimeout = null;
    this.lastScrollXTimeout = null;
    this.environment = window.osuny.carousel;
    this._findElement = window.osuny.components.utils.findElement.bind(this);
    this.id = window.osuny.carousel.classes.carousel + '-' + this.index;
    this._initialize();
    this.showSlide(0);
    this.state.initialized = true;
};
window.osuny.carousel.Carousel.prototype = {
    next: function () {
        var index = this.slides.current + 1;
        if (index >= this.slides.total) {
            index = 0;
        }
        this.showSlide(index);
    },
    previous: function () {
        var index = this.slides.current - 1;
        if (index < 0) {
            // -1 parce que 0-indexed
            index = this.slides.total - 1;
        }
        this.showSlide(index);
    },
    showSlide: function (index) {
        this.slides.current = index;
        this.pagination.unselectAllButtons();
        this.pagination.selectButton(index);
        this.slider.showSlide(index);
        this.arrows.update(this.slides.current, this.slides.total);
    },
    pause: function () {
        this.autoplayer.pause();
    },
    unpause: function () {
        this.autoplayer.unpause();
    },
    resize: function () {
        clearTimeout(this.windowResizeTimeout);
        this.windowResizeTimeout = setTimeout(function () {
            this.slider.recompute();
        }.bind(this), 200);
    },
    isInViewPort: function () {
        var boundingRect = this.element.getBoundingClientRect(),
            screenHeight = window.innerHeight || document.documentElement.clientHeight,
            elementBottomInViewport = boundingRect.bottom >= 0,
            elementTopInViewport = boundingRect.top <= screenHeight;
        return elementBottomInViewport || elementTopInViewport;
    },
    getCenterPositionY: function () {
        var boundingRect = this.element.getBoundingClientRect();
        return boundingRect.top + boundingRect.height / 2;
    },
    _initialize: function () {
        this.config = new window.osuny.carousel.Config(this);
        // Les options sont chargées depuis le data-attribute "data-carousel"
        this.config.loadOptions(this.element.dataset.carousel);
        this.element.setAttribute('id', this.id);
        this._findElement('container').setAttribute('id', this.id + '-items');
        this._initializeSlider();
        this._initializePagination();
        this._initializeArrows();
        this._initializeAutoplayer();
        this._initializeMouseEvents();
    },
    _initializePagination: function () {
        var paginationElement = this._findElement('pagination');
        this.pagination = new window.osuny.carousel.Pagination(paginationElement);
        if (paginationElement) {
            paginationElement.addEventListener(window.osuny.carousel.events.paginationButtonClicked, this._onPaginationButtonClicked.bind(this));
            paginationElement.addEventListener(window.osuny.carousel.events.controlFocused, function () {
                this.autoplayer.pause();
            }.bind(this));
            Array.from(this._findElement('container').children).forEach(function (e, i) {
                e.setAttribute('id', this.id + '-item-' + i);
                this.pagination.buttons[i].element.setAttribute('aria-controls', this.id + '-item-' + i);
            }.bind(this));
        }
    },
    _initializeArrows: function () {
        var arrowsElement = this._findElement('arrows');
        this.arrows = new window.osuny.carousel.Arrows(arrowsElement);
        if (arrowsElement) {
            arrowsElement.addEventListener(window.osuny.carousel.events.arrowsNext, this.next.bind(this));
            arrowsElement.addEventListener(window.osuny.carousel.events.arrowsPrevious, this.previous.bind(this));
        }
    },
    _initializeSlider: function () {
        var sliderElement = this._findElement('slider');
        this.slider = new window.osuny.carousel.Slider(sliderElement);
        this.slides.total = this.slider.length();
        sliderElement.addEventListener('scroll', this._onSliderScroll.bind(this));
    },
    _initializeAutoplayer () {
        this.autoplayerElement = this._findElement('autoplayerToggle');
        this.autoplayer = new window.osuny.carousel.Autoplayer(this.autoplayerElement);
        this.autoplayer.setInterval(this.config.autoplayinterval);
        this.autoplayer.ariaLiveElement = this._findElement('container');
        if (this.autoplayerElement) {
            this.autoplayerElement.addEventListener(window.osuny.carousel.events.autoplayerTrigger, this.next.bind(this));
            this.autoplayerElement.addEventListener(window.osuny.carousel.events.autoplayerProgression, this._onAutoplayerProgression.bind(this));
            if (this.config.autoplay) {
                this.autoplayer.enable();
            }
        }
    },
    _pointerStart: function () {
        this.autoplayer.softPause();
        this.state.hasMouseOver = true;
    },
    _pointerEnd: function () {
        this.autoplayer.softUnpause();
        this.state.hasMouseOver = false;
    },
    _initializeMouseEvents: function () {
        this.element.addEventListener('mouseenter', this._pointerStart.bind(this));
        this.element.addEventListener('touchstart', this._pointerStart.bind(this));
        this.element.addEventListener('mouseleave', this._pointerEnd.bind(this));
        this.element.addEventListener('touchend', this._pointerEnd.bind(this));
    },
    _onAutoplayerProgression: function (event) {
        this.pagination.setProgression(event.value);
    },
    _onPaginationButtonClicked: function (event) {
        this.autoplayer.disable();
        this.showSlide(event.index);
    },
    _onSliderScroll: function () {
        this.autoplayer.softPause();
        clearTimeout(this.lastScrollXTimeout);
        this.lastScrollXTimeout = setTimeout(function () {
            if (!this.state.hasMouseOver) {
                this.autoplayer.softUnpause();
            }
            this._onSliderScrollend();
        }.bind(this), 100);
    },
    _onSliderScrollend: function () {
        var index = this.slider.currentSlideIndex();
        if (this.slides.current !== index) {
            this.showSlide(index);
        }
        if (this.state.hasFocus) {
            this.slider.focusOnNewVisibleSlide();
        }
    }
};
