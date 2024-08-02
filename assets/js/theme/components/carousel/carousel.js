window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Carousel = function (element) {
    this.element = element;
    this.slides = {
        current: 0,
        total: 0
    }
    this.state = {
        initialized: false,
        visible: false
    };
    this.windowResizeTimeout;

    this._initializeConfig();
    this._initializeSlider();
    this._initializePagination();
    this._initializeArrows();
    this._initializeAutoplayer();
    this._initializeMouseEvents();
    this.showSlide(0);
    this.state.initialized = true;
}
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
    setCarouselState: function(state){
        this.sliderContainer.setAttribute("aria-live", state);
    },
    isInViewPort: function(){
        var boundingRect = this.element.getBoundingClientRect(),
            screenHeight = window.innerHeight || document.documentElement.clientHeight,
            aboveTheBottom = boundingRect.bottom >= 0,
            belowTheTop = boundingRect.top <= screenHeight;
        return aboveTheBottom && belowTheTop;
    },
    getCenterPositionY: function () {
        var boundingRect = this.element.getBoundingClientRect();
        return boundingRect.top + boundingRect.height / 2;
    },
    _initializeConfig: function () {
        this.config = new window.osuny.carousel.Config(this);
        // Les options sont chargées depuis le data-attribute "data-carousel"
        this.config.loadOptions(this.element.dataset.carousel);
    },
    _initializePagination: function () {
        var paginationElement = this.element.getElementsByClassName(window.osuny.carousel.classes.pagination).item(0);
        this.pagination = new window.osuny.carousel.Pagination(paginationElement);
        if (paginationElement) {
            paginationElement.addEventListener(window.osuny.carousel.events.paginationButtonClicked, this._onPaginationButtonClicked.bind(this));
        }
    },
    _initializeArrows: function  () {
        var arrowsElement = this.element.getElementsByClassName(window.osuny.carousel.classes.arrows).item(0);
        this.arrows = new window.osuny.carousel.Arrows(arrowsElement);
        if (arrowsElement) {
            arrowsElement.addEventListener(window.osuny.carousel.events.arrowsNext, this.next.bind(this));
            arrowsElement.addEventListener(window.osuny.carousel.events.arrowsPrevious, this.previous.bind(this));
        }
    },
    _initializeSlider: function () {
        var sliderContainer = this.element.getElementsByClassName(window.osuny.carousel.classes.container).item(0);
        this.slider = new window.osuny.carousel.Slider(sliderContainer);
        this.slider.transitionDuration = this.config.transitionDuration
        this.slides.total = this.slider.length();
    },
    _initializeAutoplayer(){
        this.autoplayerElement = this.element.getElementsByClassName(window.osuny.carousel.classes.toggle).item(0);
        this.autoplayer = new window.osuny.carousel.Autoplayer(this.autoplayerElement);
        this.autoplayer.setInterval(this.config.autoplayInterval);
        if (this.autoplayerElement) {
            this.autoplayerElement.addEventListener(window.osuny.carousel.events.autoplayerTrigger, this.next.bind(this));
            this.autoplayerElement.addEventListener(window.osuny.carousel.events.autoplayerProgression, this._onAutoplayerProgression.bind(this));
            if (this.config.autoplay) {
                this.autoplayer.enable();
            }
        }
    },
    _initializeMouseEvents: function(){
        this.element.addEventListener("mouseenter", this.pause.bind(this));
        this.element.addEventListener("mouseleave", this.unpause.bind(this));
    },
    _onAutoplayerProgression: function (event) {
        this.pagination.setProgression(event.progression);
    },
    _onPaginationButtonClicked: function (event) {
        this.autoplayer.disable();
        this.showSlide(event.index);
    },
    inViewPort: function(){
        var boundingRect = this.element.getBoundingClientRect();
        return (
            boundingRect.bottom >= 0 &&
            boundingRect.top <= (window.innerHeight || document.documentElement.clientHeight)
        );
    },
    getCenterPositionY: function () {
        var boundingRect = this.element.getBoundingClientRect();
        return boundingRect.top + boundingRect.height / 2;
    }

    
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
    //     if (this.pagination) {s
    //         this.pagination.setSlideProgression(e.progression);
    //     }
    // },
    // Slider control
    // resetSlider: function () {
    //     this.slider.initialize();
    // },
    // onSlideChanged: function () {
    //     if (this.slider) {
    //         this.slides.current = this.slider.index;
    //     }
    //     if (this.autoplayer) {
    //         this.autoplayer.disable();
    //         this.toggleButton.pause();
    //     }
    //     if (this.pagination) {
    //         this.pagination.onSlideChanged();
    //     }
    //     if (this.arrows) {
    //         this.arrows.onSlideChanged();
    //     }
    // },

    // // Drag control
    // endDrag: function () {
    //     if (this.slider.drag) {
    //         this.slider.drag.end();
    //     }
    // },
    // startDrag: function (position) {
    //     if (this.slider.drag) {
    //         this.slider.drag.start(position);
    //     }
    // },
    // drag: function (position) {
    //     if (this.slider.drag.active) {
    //         this.slider.drag.drag(position);
    //     }
    // }
}