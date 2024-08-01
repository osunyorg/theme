window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Carousel = function (element) {
    this.element = element;
    this.sliderContainer = null;

    // Les instances des composants
    this.ui = null;
    this.slider = null;
    this.pagination = null;
    this.autoplayer = null;
    this.toggleButton = null;
    
    this.config;

    this.slides = {
        current: 0,
        total: 0
    }

    this.state = {
        initialized: false,
        visible: false
    };

    this._initialize();
}
window.osuny.carousel.Carousel.prototype = {
    classes: {
        carousel: "carousel__container",
        toggle: "toggle",
        pagination: "carousel__pagination__tabcontainer"
    },
    next: function () {
        this.slides.current += 1;
        if (this.slides.current >= this.slides.total) {
            this.slides.current = 0;
        }
        this.showSlide(this.slides.current);
    },
    previous: function () {
        this.slides.current -= 1;
        if (this.slides.current < 0) {
            // -1 parce que 0-indexed 
            this.slides.current = this.slides.total - 1;
        }
        this.showSlide(this.slides.current);
    },
    showSlide: function (index) {
        this.pagination.resetSlidesState();
        this.pagination.highlightButton(index);
        this.slider.showSlide(index);
    },
    pause: function () {
        this.autoplayer.pause();
    },
    unpause: function () {
        this.autoplayer.unpause();
    },
    resize: function () {
        // TODO
    },
    setCarouselState: function(state){
        this.sliderContainer.setAttribute("aria-live", state);
    },
    _initialize: function () {
        this._initializeConfig();
        this._initializeComponents();
        this._initializeSlider();
        this._initializeAutoplayer();
        // this.ui.initializeListeners();
        this.state.initialized = true;
    },
    _initializeConfig: function () {
        this.config = new window.osuny.carousel.Config(this);
        // Les options sont chargées depuis le data-attribute "data-carousel"
        this.config.loadOptions(this.element.dataset.carousel);
    },
    _initializeComponents: function () {
        // this.ui = new window.osuny.carousel.UIController(this);
        var toggleButtonElement = this.element.getElementsByClassName(this.classes.toggle).item(0);
        this.toggleButton = new window.osuny.carousel.ToggleButton(toggleButtonElement);

        var paginationElement = this.element.getElementsByClassName(this.classes.pagination).item(0);
        this.pagination = new window.osuny.carousel.Pagination(paginationElement);
        this.pagination.highlightButton(this.slides.current);
        paginationElement.addEventListener("paginationButtonClicked", this._onPaginationButtonClicked.bind(this));
        // TODO catch "paginationButtonClicked"

        // this.arrows = window.osuny.utils.instanciateIf(this, window.osuny.carousel.ArrowsController, this.options.arrows);
    },
    _initializeSlider: function () {
        var sliderContainer = this.element.getElementsByClassName(this.classes.carousel).item(0);
        this.slider = new window.osuny.carousel.Slider(sliderContainer);
        this.slider.transitionDuration = this.config.transitionDuration
        this.slides.total = this.slider.length();
    },
    _initializeAutoplayer(){
        this.autoplayer = new window.osuny.carousel.Autoplayer(this.element);
        this.autoplayer.setInterval(this.config.autoplayInterval);
        // L'autoplayer n'a pas d'élément du DOM, on écoute donc l'élément du carousel
        // Quand le toggleButton sera fusionné dedans, on utilisera le button comme emitter d'events.
        this.element.addEventListener("trigger", this._onAutoplayerTrigger.bind(this));
        this.element.addEventListener("progression", this._onAutoplayerProgression.bind(this));
        if (this.config.autoplay) {
            this.autoplayer.enable();
            this.toggleButton.play();
        }
    },
    _onAutoplayerTrigger: function () {
        this.next();
    },
    _onAutoplayerProgression: function (event) {
        this.pagination.setProgression(event.progression);
    },
    _onPaginationButtonClicked: function (event) {
        console.log(event);
    },
    // // Autoplayer events
    // stopAutoplay: function () {
    //     if (this.autoplayer) {
    //         this.autoplayer.stop();
    //         this.autoplayerControl.toggleStart();
    //         this.setCarouselState("polite");
    //     }
    // },
    // startAutoplay: function () {
    //     this.autoplayer.start();
    //     this.toggleButton.play();
    //     // this.autoplayerControl.toggleStop();
    //     this.setCarouselState("off");
    // },
    // pauseAutoplay: function () {
    //     if (this.autoplayer) {
    //         this.autoplayer.pause();
    //     }
    // },
    // unpauseAutoplay: function () {
    //     if (this.autoplayer) {
    //         this.autoplayer.unpause();
    //     }
    // },
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
    onSlideChanged: function () {
        if (this.slider) {
            this.slides.current = this.slider.index;
        }
        if (this.autoplayer) {
            this.autoplayer.disable();
            this.toggleButton.pause();
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