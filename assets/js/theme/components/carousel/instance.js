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
    this.autoplayerControl = null;
    
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
        this.arrows = window.osuny.utils.instanciateIf(this, window.osuny.carousel.ArrowsController, this.options.arrows);
        if(this.options.autoplay){
            this.initializeAutoplay();
        }
    },

    initializeAutoplay(){
        var interval = 3000;
        if(this.options.interval){
            interval = parseInt(this.options.interval);
        };
        this.autoplayer = new window.osuny.carousel.Autoplayer(this, interval);

        // this.root.addEventListener("progression", function(e){
        //     this.onAutoplayProgressionChanged(e);
        // }.bind(this));

        
        this.autoplayerControl = new window.osuny.carousel.ToggleButton(this);
        this.autoplayerControl.getElement().addEventListener("start", this.startAutoplay.bind(this));
        this.autoplayerControl.getElement().addEventListener("stop", this.stopAutoplay.bind(this));
        this.startAutoplay();
    },

    // Autoplayer events
    stopAutoplay: function () {
        if (this.autoplayer) {
            this.autoplayer.stop();
            this.autoplayerControl.toggleStart();
            this.setCarouselState("polite");
        }
    },
    startAutoplay: function () {
        this.autoplayer.start();
        this.autoplayerControl.toggleStop();
        this.setCarouselState("off");
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
    // onAutoplayProgressionChanged: function (e) { 
    //     // console.log(e)
    //     if (this.pagination) {
    //         this.pagination.setSlideProgression(e.progression);
    //     }
    // },
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
            this.autoplayer.reset();
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