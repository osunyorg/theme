window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

//console.log(window.osuny.carousel.has_lightbox)

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
        if (this.options.arrows) {
            this.arrows = new window.osuny.carousel.ArrowsController(this);
        }
    },
    initializeListeners: function () {
        this.container.addEventListener("mouseenter", this.onMouseEnter.bind(this));
        this.container.addEventListener("mouseleave", this.onMouseLeave.bind(this));
        if (this.options.drag) { 
            this.container.addEventListener("mousedown", this.onMouseDown.bind(this));
            this.container.addEventListener("touchstart", this.onMouseDown.bind(this));
            this.container.addEventListener("mouseup", this.onMouseUp.bind(this));      // HELP
            this.container.addEventListener("touchend", this.onMouseUp.bind(this));
            this.container.addEventListener("mousemove", this.onMouseMove.bind(this));
            this.container.addEventListener("touchmove", this.onMouseMove.bind(this));
            this.container.addEventListener("click", this.onClick.bind(this));
        }
    },
    onMouseEnter: function (e) {
        this.cancelLightBoxEvent(e);
        if (this.options.autoplay) {
            this.autoplayer.pause();
        }
    },
    onMouseLeave: function (e) {
        this.cancelLightBoxEvent(e);
        if (this.options.autoplay) {
            this.autoplayer.unpause();
        }
        if (this.slider.drag) {
            this.slider.drag.end();
        }
    },
    onMouseDown: function (e) {
        this.cancelLightBoxEvent(e);
        this.slider.drag.start(e.offsetX);
    },
    onMouseUp: function (e) {
        this.cancelLightBoxEvent(e);
        this.slider.drag.end(e.offsetX);
    },
    onMouseMove: function (e) {
        this.cancelLightBoxEvent(e);
        if (this.slider.drag.active) {
            this.slider.drag.drag(e.offsetX);
        }
    },
    onClick: function (e) {
        this.cancelLightBoxEvent(e);
    },
    cancelLightBoxEvent: function (e) { // MMARCHE PASSS
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
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
        if (this.autoplayer) {
            this.autoplayer.start();
        }
    },
    visibilityStop: function () {
        if (this.autoplayer) {
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
        if (this.arrows) {
            this.arrows.onSlideChanged();
        }
    }
}