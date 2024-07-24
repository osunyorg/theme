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
        focus: false,
        hover: false,
    };
    this.initialize();
}
window.osuny.carousel.Instance.prototype =  {
    // 3 possibilités pour récupérer les textes localisés
    // - en data-attributes du carousel, mais ça fait de la redondance si plusieurs carousels dans la même page
    // - en script inline, mais pb de sécurité et pas très élégant
    // - en js externe, mais une requête de plus pour pas grand chose
    // Solution adoptée : data-attributes
    i18n: { // TODO trouver comment récuperer depuis yml
        first: 'Aller au premier slide',
        last: 'Aller au dernier slide',
        next: 'Slide suivant',
        pageX: 'Aller à la page %s',
        pause: 'Mettre en pause le carousel',
        play: 'Démarrer le carousel',
        prev: 'Slide précedent',
        slideX: 'Aller au slide %s',
    },
    classes: {
        carousel: "carousel__container",
    },
    initialize: function () {
        this.findContainer();
        this.loadOptions();
        this.initializeComponents();
        this.initializeListeners();
        this.initializeAutoplayer();
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
        this.state.hover = true;
        this.autoplayer.pause();
    },
    onMouseLeave: function () {
        this.state.hover = false;
        this.autoplayer.unpause();
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
    }
}
