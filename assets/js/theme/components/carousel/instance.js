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
        this.ui.initializeListeners();
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
        if(this.options.pagination){
            this.pagination = new window.osuny.carousel.Pagination(this);
        }
        if(this.options.arrows){
            this.arrows = new window.osuny.carousel.ArrowsController(this);
        }
        if(this.options.autoplay){
            this.autoplayer = new window.osuny.carousel.Autoplayer(this);
        }
    },

    // Autoplayer events
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
    toggleAutoplay: function(){
        if(this.autoplayer){
            this.autoplayer.toggleState();
        }
    },
    pauseAutoplay: function () {
        if (this.autoplayer) {
            this.autoplayer.pause();
        }
    },
    unpauseAutoplay: function () {
        if (this.autoplayer) {
            this.autoplayer.unpause();
        }
    },
    onAutoplayStarted: function () {
        if (this.pagination) {
            this.pagination.onAutoplayStarted();
        }
    },
    onAutoplayStopped: function () {
        if (this.pagination) {
            this.pagination.onAutoplayStopped();
        }
    },
    onAutoplayProgressionChanged: function () {
        if (this.pagination) {
            this.pagination.setSlideProgression(this.autoplayer.progression());
        }
    },

    // Slider control

    resetSlider: function () {
        this.slider.initialize();
    },
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
    },

    // Drag control
    endDrag: function () {
        if (this.slider.drag) {
            this.slider.drag.end();
        }
    },
    startDrag: function (position) {
        if (this.slider.drag) {
            this.slider.drag.start(position);
        }
    },
    drag: function (position) {
        if (this.slider.drag.active) {
            this.slider.drag.drag(position);
        }
    }
}

window.osuny.carousel.UIController = function (instance) {
    this.instance = instance;
    this.root = this.instance.root;
    this.sliderContainer = this.instance.container;
    this.windowResizeTimeout;
}
window.osuny.carousel.UIController.prototype = {
    //Visibility computation
    setVisibility: function () {
        var isVisible = this.isInViewport();
        if (this.instance.state.visible != isVisible) {
            this.instance.state.visible = isVisible;
            if (this.instance.state.visible) {
                this.instance.startAutoplay();
            } else {
                this.instance.stopAutoplay();
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
            this.instance.resetSlider();
        }.bind(this), 200);
    },

    // Events Listeners and Callback
    initializeListeners: function () {
        this.sliderContainer.addEventListener("mouseenter", this.onMouseEnter.bind(this));
        this.sliderContainer.addEventListener("mouseleave", this.onMouseLeave.bind(this));
        if (this.instance.options.drag) {
            this.sliderContainer.addEventListener("mousedown", this.onMouseDown.bind(this));
            this.sliderContainer.addEventListener("touchstart", this.onMouseDown.bind(this));
            this.sliderContainer.addEventListener("mouseup", this.onMouseUp.bind(this));      // HELP
            this.sliderContainer.addEventListener("touchend", this.onMouseUp.bind(this));
            this.sliderContainer.addEventListener("mousemove", this.onMouseMove.bind(this));
            this.sliderContainer.addEventListener("touchmove", this.onMouseMove.bind(this));
        }
    },
    onMouseEnter: function (e) {
        this.cancelLightBoxEvent(e);
        this.instance.pauseAutoplay();

    },
    onMouseLeave: function (e) {
        this.cancelLightBoxEvent(e);
        this.instance.unpauseAutoplay();
        this.instance.endDrag();
    },
    onMouseDown: function (e) {
        this.cancelLightBoxEvent(e);
        this.instance.startDrag(e.offsetX);
    },
    onMouseUp: function (e) {
        this.cancelLightBoxEvent(e);
        this.instance.endDrag();
    },
    onMouseMove: function (e) {
        this.cancelLightBoxEvent(e);
        this.instance.drag(e.offsetX);
    },
    cancelLightBoxEvent: function (e) { // MMARCHE PASSS
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
}

