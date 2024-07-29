window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Instance = function (root) {
    this.root = root;
    this.container = null;
    this.windowResizeTimeout;
    // Les instances des composants
    this.pagination = null;
    this.slider = null;
    this.autoplayer = null;
    // Les options sont chargées depuis le data-attribute "data-carousel"
    this.options = {};
    this.state = {
        index: 0,
        initialized: false,
        visible: false
    };
    this.initialize();
}
window.osuny.carousel.Instance.prototype = {
    classes: {
        carousel: "carousel__container",
    },
    initialize: function () {
        this.findContainer();
        this.loadOptions();
        this.initializeComponents();
        this.initializeListeners();
        if (this.options.autoplay) {
            this.initializeAutoplayer();
        }
        this.state.initialized = true;
    },
    findContainer: function () {
        this.container = this.root.getElementsByClassName(this.classes.carousel).item(0);
    },
    loadOptions: function () {
        this.options = JSON.parse(this.root.dataset.carousel);
    },
    initializeComponents: function () {
        this.slider = new window.osuny.carousel.Slider(this);
        if (this.options.pagination) {
            this.pagination = new window.osuny.carousel.Pagination(this);
        }
    },
    initializeListeners: function () {
        this.container.addEventListener("mouseenter", this.onMouseEnter.bind(this));
        this.container.addEventListener("mouseleave", this.onMouseLeave.bind(this));
    },
    onMouseEnter: function () {
        if (this.options.autoplay) {
            this.autoplayer.pause();
        }
    },
    onMouseLeave: function () {
        if (this.options.autoplay) {
            this.autoplayer.unpause();
        }
    },
    initializeAutoplayer: function () {
        this.autoplayer = new window.osuny.carousel.Autoplayer(this);
    },
    adaptToWindowResize: function () {
        clearTimeout(this.windowResizeTimeout);
        this.windowResizeTimeout = setTimeout(function () {
            this.slider.initialize();
        }.bind(this), 200);
    },
    next: function () {
        this.slider.nextSlide();
    },
    setVisibility: function () {
        var isVisible = this.isInViewport();
        if (this.state.visible != isVisible) {
            this.state.visible = isVisible;
            if (this.state.visible) {
                this.visibilityStart();
            } else {
                this.visibilityStop();
            }
        }
    },
    isInViewport: function () {
        var boundingRect = this.root.getBoundingClientRect();
        return (
            boundingRect.bottom >= 0 &&
            boundingRect.top <= (window.innerHeight || document.documentElement.clientHeight)
        );
    },
    getCenterPositionY: function () {
        var boundingRect = this.root.getBoundingClientRect();
        return boundingRect.top + boundingRect.height / 2;
    },
    visibilityStart: function () {
        if(this.autoplayer){
            this.autoplayer.start();
        }
    },
    visibilityStop: function () {
        if(this.autoplayer){
            this.autoplayer.stop();
        }
    },
    onSlideChanged: function () {
        if (this.slider) {
            this.state.index = this.slider.index;
        }
        if (this.autoplayer) {
            this.autoplayer.onSlideChanged();
        }
        if (this.pagination) {
            this.pagination.onSlideChanged();
        }
    }
}