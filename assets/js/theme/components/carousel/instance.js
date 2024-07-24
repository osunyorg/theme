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
    // Chargée depuis le data-attribute "data-carousel"
    this.options = {};
    this.state = {
        initialized: false,
        hover: false,
        index: 0
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
            if (e.key == 'ArrowLeft') {
                this.slider.previousSlide();
            }
            else if (e.key == 'ArrowRight') {
                this.slider.nextSlide();
            }
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

    },
    blur: function () {

    }
}
// // TODO 
// window.osuny.carousel.Instance.prototype.init = function(){
//     var options = JSON.parse(this.domElements.root.getAttribute(this.domClasses.carousel.data_tag));
//     // console.log(options)
//     if(options.transition_duration){
//         this.options.transition_duration = options.transition_duration;
//     }

//     // Initialisation du slider
//     this.domElements.container = this.domElements.root.getElementsByClassName(this.domClasses.carousel.container).item(0);
//     this.slider = new window.osuny.carousel.Slider( this.domElements.container);
//     this.initListeners();
    

//     // Initialisation de la pagination
//     if (options.pagination) {
//         this.pagination = new window.osuny.carousel.Pagination(this.domClasses, this.slider.elements.length, this.i18n, true);
//         this.domElements.root.append(this.pagination.domElement)
//     }

//     // this.initDrag();



// window.osuny.carousel.Instance.prototype.initListeners = function () {
//     var onTransitioned = this.onTransitioned.bind(this);
//     this.slider.domElement.addEventListener('transitionend', function (e) {
//         if (e.propertyName == "left") {
//             onTransitioned();
//         }
//     });

//     for (var i = 0; i < this.instances.length; i += 1) {
//         var instance = this.instances[i];
//         instance.domElements.container.addEventListener("mouseenter", function (e) { instance.onMouseEnter(); });
//         instance.domElements.container.addEventListener("mouseleave", function (e) { instance.onMouseLeave(); });

//         if (instance.pagination) {
//             for (var n = 0; n < instance.pagination.tabButtons.length; n += 1) {
//                 instance.pagination.tabButtons[n].domElement.addEventListener("click", function (e) {
//                     this.goTo(e.target.getAttribute("tabindex"));
//                 }.bind(instance));
//             }
//             if (instance.pagination.toggleButton) {
//                 instance.pagination.toggleButton.domElement.addEventListener("click", function (e) {
//                     instance.onTogglePlay(e.target);
//                 }.bind(instance));
//             }
//         }
//     }
//     // this.addActiveSlideClass(0);
// }


// window.osuny.carousel.Instance.prototype.initDrag = function () { // TODO gerer ce probleme de lightbox qui s'ouvre pendant le drag 
//     this.options.drag = {
//         posx: null,
//         startpos: null,
//         target: 0,
//         delta: 0,
//         active: false
//     };
//     var dragAction = this.onDrag.bind(this);
//     this.slider.domElement.addEventListener('mousedown', function (e) {
//         // e.preventDefault();
//         this.options.drag.posx = e.offsetX;
//         this.options.drag.startpos = this.slider.pos;
//         this.slider.domElement.addEventListener('mousemove', dragAction);
//     }.bind(this));

//     window.addEventListener('mouseup', function (e) {
//         this.slider.domElement.removeEventListener('mousemove', dragAction);
//         this.move(this.options.drag.target);
//         this.options.drag.posx = null;
//         this.options.drag.startpos = null;
//         this.options.drag.delta = 0;
//         this.options.drag.active = false;
//     }.bind(this));

//     window.addEventListener('mouseleave', function (e) {
//         this.slider.domElement.removeEventListener('mousemove', dragAction);
//         this.move(this.options.drag.target);
//         this.options.drag.posx = null;
//         this.options.drag.startpos = null;
//         this.options.drag.delta = 0;
//         this.options.drag.active = false;
//     }.bind(this));
// }

// window.osuny.carousel.Instance.prototype.onDrag = function (e) {
//     // this.preventDefault;
//     this.options.drag.active = true;
//     if (this.slider.getPosition() < 0) {
//         // this.slider.pos += e.offsetX - this.options.drag.posx;
//         this.slider.translate(e.offsetX - this.options.drag.posx);

//         this.slider.delta = this.slider.getPosition() - this.options.drag.startpos;
//         this.options.drag.target = 0;
//         if (Math.sign(this.options.drag.delta) > 0) {
//             if (Math.abs(this.options.drag.delta) - this.slider.elementAt(-1).size / 4 > 0) {
//                 this.options.drag.target -= 1;
//             }
//         } else {
//             if (Math.abs(this.options.drag.delta) - this.slider.elementAt(-1).size / 4 > 0) {
//                 this.options.drag.target += 1;
//             }
//         }
//     }
// }

// window.osuny.carousel.Instance.prototype.cleanUpSlideClass = function (currentSlide) {
//     this.slider.domElement.children.item(currentSlide).classList.remove("is-active");
//     this.slider.domElement.children.item(currentSlide + 1).classList.remove("is-next");
// }

// window.osuny.carousel.Instance.prototype.addActiveSlideClass = function (currentSlide) {
//     this.slider.domElement.children.item(currentSlide).classList.add("is-active");
//     this.slider.domElement.children.item(currentSlide + 1).classList.add("is-next");
// }


// window.osuny.carousel.Instance.prototype.onTogglePlay = function (target) {
//     this.pagination.toggleButton.toggle(target);
// }