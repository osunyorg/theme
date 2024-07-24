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
        console.log('adaptToWindowResize not implemented');
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

//     // if (options.autoplay) {
//     //     this.initAutoPlay(options);
//     // }

// }

// window.osuny.carousel.Instance.prototype.initListeners = function () {
//     var onTransitioned = this.onTransitioned.bind(this);
//     this.slider.domElement.addEventListener('transitionend', function (e) {
//         if (e.propertyName == "left") {
//             onTransitioned();
//         }
//     });

//     ///// TEST TO REMOVE /////
//     document.addEventListener("keydown", function (e) {
//         if (e.key == 'ArrowLeft') {
//             for (var i = 0; i < this.instances.length; i += 1) {
//                 this.instances[i].move(-1);
//             }
//         }
//         else if (e.key == 'ArrowRight') {
//             for (var i = 0; i < this.instances.length; i += 1) {
//                 this.instances[i].move(1);
//             }
//         }
//     }.bind(this));
//     /////////////////////////

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

// window.osuny.carousel.Instance.prototype.onTransitioned = function () {
//     this.state.isReady = false;
//     this.slider.updateDom();
//     if (this.state.offset > 0) { // on avance vers la droite
//         for (var i = 0; i < this.state.offset; i++) {
//             // on enlève l'element tout à gauche pour le rajouter à droite
//             this.slider.putFirstAtEnd();
//         }
//     } else if (this.state.offset < 0) { // onn va 
//         for (var i = 0; i < Math.abs(this.state.offset); i++) {
//             this.slider.putLastAtbegining();
//         }
//     }
//     this.state.offset = 0;
//     this.state.isReady = true;
// }

// window.osuny.carousel.Instance.prototype.move = function (offset) {  // décaler la track de offset = +n ou -n slides
//     if (true) {
//         // if (this.options.pagination) {
//         //     this.domElements.root.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.slider.currentSlide()).querySelector("i").setAttribute("style", "width: 0%");
//         // }
//         // if (this.options.autoplay.started) {
//         //     this.options.autoplay.started = Date.now();
//         // }

//         var delta = 0; // distance à parcourir
//         var sign = Math.sign(offset); // direction positive ou negative 

//         //calcul du delta à translater à partir de la somme des tailles 
//         // on parcours le nombre de slide à déplacer
//         for (var i = 0; i < Math.abs(offset); i += 1) {
//             // on ajoute ( ou soustrait en fonction du signe), la taille de chacun des slide
//             delta -= sign * this.slider.elementAt(offset - (sign > 0) - sign * i).size;
//         }

//         // On active l'animation
//         this.slider.translate(delta, this.options.transition_duration);

//         // pour l'instant on a pas bougé, on ajoute le decalage au décalage eventuel ( ou 0)
//         this.state.offset += offset;

//         // On met à jour le slide current 
//         this.slider.updateCurrent(offset);
//     }
// }

// window.osuny.carousel.Instance.prototype.goTo = function (n) {
//     this.move(n - this.slider.currentSlide());
// };

// window.osuny.carousel.Instance.prototype.initAutoPlay = function (params) { // TODO changer pour requestaimation frame et gerer animmation
//     this.options.autoplay = {
//         interval: 2000,
//         pauseOnHover: false,
//         paused: false
//     };

//     if (params.interval) {
//         params.interval = parseInt(params.interval);
//         // on vérifie que l'interval est superieur à la durée de la transition
//         if (parseInt(params.interval) > this.options.transition_duration) {
//             this.options.autoplay.interval = parseInt(params.interval);
//         }
//     }

//     if (params.pauseOnHover) {
//         this.options.autoplay.pauseOnHover = params.pauseOnHover;
//     }

//     this.options.autoplay.started = Date.now();
//     window.requestAnimationFrame(this.runAutoPlay.bind(this));
// }

// window.osuny.carousel.Instance.prototype.runAutoPlay = function () {
//     var now = Date.now();
//     var elapsed = now - this.options.autoplay.started;

//     if (elapsed > this.options.autoplay.interval) {
//         if (!this.options.drag.active && !(this.state.isHovered && this.options.autoplay.pauseOnHover) && !this.options.autoplay.paused) {
//             this.options.autoplay.started = now;
//             if (this.options.pagination) {
//                 this.domElements.root.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.slider.currentSlide()).querySelector("i").setAttribute("style", "width: 0%");
//             }
//             this.move(1);
//         }
//     } else {
//         if (!this.options.drag.active && !(this.state.isHovered && this.options.autoplay.pauseOnHover) && !this.options.autoplay.paused) {
//             var p = elapsed / this.options.autoplay.interval * 100.0
//             if (this.options.pagination) {
//                 this.domElements.root.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.slider.currentSlide()).querySelector("i").setAttribute("style", "width: " + p + "%");
//             }
//         }
//     }
//     requestAnimationFrame(this.runAutoPlay.bind(this))
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

// // Actions Callbacks
// window.osuny.carousel.Instance.prototype.onResize = function () {
//     // Recalcule la dimension totale du contenu du slider et met à jour sa position x
//     clearTimeout(this.resizeTimeout);
//     this.resizeTimeout = setTimeout(function () {
//         this.slider.init();
//     }.bind(this), 300);
// }

// window.osuny.carousel.Instance.prototype.onMouseEnter = function () {
//     this.state.isHovered = true;
// }

// window.osuny.carousel.Instance.prototype.onMouseLeave = function () {
//     this.state.isHovered = false;
// }

// window.osuny.carousel.Instance.prototype.onTogglePlay = function (target) {
//     this.pagination.toggleButton.toggle(target);
// }