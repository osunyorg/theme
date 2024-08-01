window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Instance = function (root) {
    this.root = root;
    this.container = null;

    // Les instances des composants
    this.ui = null;
    this.slider = null;
    this.pagination = null;
    this.autoplayer = null;
    this.toggleButton = null;
    
    // Les options sont chargées depuis le data-attribute "data-carousel"
    this.options = {};
    this.slides = {
        current: 0,
        total: 0
    }
    this.state = {
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
    setCarouselState: function(state){
        this.container.setAttribute("aria-live", state);
    },
    loadOptions: function () {
        this.options = JSON.parse(this.root.dataset.carousel);
    },
    initializeComponents: function () {
        this.ui = new window.osuny.carousel.UIController(this);
        this.slider = new window.osuny.carousel.Slider(this);
        this.slides.current = this.slider.index;
        this.slides.total = this.slider.length();
        this.pagination = window.osuny.utils.instanciateIf(this, window.osuny.carousel.Pagination, this.options.pagination);
        this.toggleButton = window.osuny.utils.instanciateIf(this, window.osuny.carousel.ToggleButton, this.options.autoplay);
        this.arrows = window.osuny.utils.instanciateIf(this, window.osuny.carousel.ArrowsController, this.options.arrows);
        this.autoplayer = window.osuny.utils.instanciateIf(this, window.osuny.carousel.Autoplayer, this.options.autoplay);
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
    toggleAutoplay: function () {
        if (this.autoplayer) {
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
            this.toggleButton.toggleStart();
        }
        this.setCarouselState("off");
    },
    onAutoplayStopped: function () {
        if (this.pagination) {
            this.toggleButton.toggleStop();
        }
        this.setCarouselState("polite");
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
            this.slides.current = this.slider.index;
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