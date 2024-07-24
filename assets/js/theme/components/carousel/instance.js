if (!window.osuny) {
    window.osuny = {};
}
if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}
// L'instance de carousel est composée de :
// - un slider qui contient les images
// - une pagination, avec des flèches
// Il est charge des événements et de l'autoplay, comme un chef d'orchestre
window.osuny.carousel.Instance = function (root) {
    this.root = root;
    this.container = null;
    this.pagination = null;
    this.slider = null;
    this.autoplayer = null;
    this.windowResizeTimeout;
    // Les options sont chargées depuis le data-attribute "data-carousel"
    this.options = {};
    this.state = {
        index: 0,
        initialized: false,
        focus: false
    };
    this.initialize();
}
window.osuny.carousel.Instance.prototype =  {
    classes: {
        carousel: "carousel__container",
    },
    initialize: function () {
        this.findContainer();
        this.loadOptions();
        this.initializeComponents();
        this.initializeListeners();
        if(this.options.autoplay){
            this.initializeAutoplayer();
        }
        this.state.initialized = true;
    },
    findContainer: function () {
        this.container = this.root.getElementsByClassName(this.classes.carousel).item(0);
    },
    loadOptions: function () {
        this.options = JSON.parse(this.root.dataset.carousel);
    },
    initializeComponents: function () {
        this.slider = new window.osuny.carousel.Slider(this);
        this.pagination = new window.osuny.carousel.Pagination(this);
    },
    initializeListeners: function () {
        this.container.addEventListener("mouseenter", this.onMouseEnter.bind(this));
        this.container.addEventListener("mouseleave", this.onMouseLeave.bind(this));
        ///// TEST TO REMOVE /////
        document.addEventListener("keydown", function (e) {
            if (e.key == 'ArrowLeft') { this.slider.previousSlide() }
            else if (e.key == 'ArrowRight') { this.slider.nextSlide() }
        }.bind(this));
        /////////////////////////
    },
    onMouseEnter: function () {
        if(this.options.autoplay){
            this.pauseAutoplay();
        }
    },
    onMouseLeave: function () {
        if(this.options.autoplay){
            this.unpauseAutoplay();
        }
    },
    initializeAutoplayer: function () {
        this.autoplayer = new window.osuny.carousel.Autoplayer(this);
    },
    adaptToWindowResize: function () {
        clearTimeout(this.windowResizeTimeout);
        this.windowResizeTimeout = setTimeout(function () {
            this.slider.reset();
        }.bind(this), 200);
    },
    next: function () {
        this.slider.nextSlide();
    },
    focus: function () {
        this.state.focus = true;
    },
    blur: function () {
        this.state.focus = false;
    },
    pauseAutoplay: function(){
        if(this.options.pagination){
            this.pagination.toggleButton.pause();
        }else{
            this.autoplayer.pause();
        }
    },
    unpauseAutoplay: function(){
        if(this.options.pagination){
            this.pagination.toggleButton.unpause();
        }else{
            this.autoplayer.unpause();
        }
    }
}