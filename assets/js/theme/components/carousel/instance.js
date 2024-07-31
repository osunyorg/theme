window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

//console.log(window.osuny.carousel.has_lightbox)

window.osuny.carousel.Instance = function (root) {
    this.root = root;
    this.container = null;

    // Les instances des composants
    this.ui = null;
    this.slider = null;
    this.pagination = null;
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
        this.state.initialized = true;
    },
    findContainer: function () {
        this.container = this.root.getElementsByClassName(this.classes.carousel).item(0);
    },
    loadOptions: function () {
        this.options = JSON.parse(this.root.dataset.carousel);
    },
    initializeComponents: function () {
        this.ui = new window.osuny.carousel.UIController(this);
        this.slider = new window.osuny.carousel.Slider(this);
        if (this.options.pagination) {
            this.pagination = new window.osuny.carousel.Pagination(this);
        }
        if (this.options.arrows) {
            this.arrows = new window.osuny.carousel.ArrowsController(this);
        }
        if (this.options.autoplay) {
            this.autoplayer = new window.osuny.carousel.Autoplayer(this);
        }
    },
    stopAutoplay: function () {
        if (this.autoplayer) {
            this.autoplayer.stop();
        }
    },
    startAutoplay: function () {
        if (this.autoplayer) {
            this.autoplayer.start();
        }
    },

    // Events Listeners and Callback
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
        this.slider.drag.end();
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
    entersViewport: function () {
        if (this.autoplayer) {
            this.autoplayer.start();
        }
    },
    leavesViewport: function () {
        if (this.autoplayer) {
            this.autoplayer.stop();
        }
    },
    onResize: function () {
        this.slider.initialize();
    },
    // Slider control
    next: function () {
        this.slider.nextSlide();
    },
    previous: function () {
        this.slider.previousSlide();
    },
    showSlide: function (index) {
        this.slider.showSlide(index);
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

window.osuny.carousel.UIController = function (instance) {
    this.instance = instance;
    this.root = this.instance.root;
    this.windowResizeTimeout;
}
window.osuny.carousel.UIController.prototype = {
    //Visibility computation
    setVisibility: function () {
        var isVisible = this.isInViewport();
        if (this.instance.state.visible != isVisible) {
            this.instance.state.visible = isVisible;
            if (this.instance.state.visible) {
                this.instance.entersViewport();
            } else {
                this.instance.leavesViewport();
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
    adaptToWindowResize: function () {
        clearTimeout(this.windowResizeTimeout);
        this.windowResizeTimeout = setTimeout(function () {
            this.instance.onResize();
        }.bind(this), 200);
    },
}

