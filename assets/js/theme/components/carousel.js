// import './carousel/instance';
import './carousel/slider';
import './carousel/manager';

// TODO: 
// 0 - touch
// 0 - petit bug au drag sur les autres carrousels
// 0 - probleme click glightbox // gallery bug drag

Carrousel = function Carrousel(element, options) {
    this.options = {
        loop: true,
        arrows: false,
        autoplay: null,
        drag: null,
        transitionDuration: 0,
        pagination: false
    }

    if (options.transition_duration) {
        this.options.transitionDuration = options.transition_duration;
    }

    this.carrousel = element.root; // move elsewhere
    this.container = element.container;
    
    this.state = {
        isHovered: false,
        isReady: false
    };
    this.resizeTimeout;
    
    this.offset = 0;
    
    // On initialise le contenu et la position du track
    
    this.slider = new Slider(this.container);
    console.log("track content initialized");

    this.initListeners();
    console.log("listeners initialized");

    // if (options.pagination) {
    //     this.initPagination();
    // }
    // this.initDrag();

    // if (options.autoplay) {
    //     this.initAutoPlay(options);
    // }
    ///// TEST TO REMOVE /////
    document.addEventListener("keydown", function (e) {
        if (e.key == 'ArrowLeft') {
            this.move(-1);
        }
        else if (e.key == 'ArrowRight') {
            this.move(1);
        }
    }.bind(this))
    ///// 

    this.state.isReady = true;
}

Carrousel.prototype.initListeners = function initListeners() {
    var onTransitioned = this.onTransitioned.bind(this);
    this.slider.domElement.addEventListener('transitionend', function (e) {
        if (e.propertyName == "left") {
            onTransitioned();
        }
    }
    );

    // this.addActiveSlideClass(0);
}

Carrousel.prototype.onTransitioned = function onTransitioned() {
    this.state.isReady = false;
    this.slider.updateDom();
    if (this.offset > 0) { // on avance vers la droite
        for (var i = 0; i < this.offset; i++) {
            // on enlève l'element tout à gauche pour le rajouter à droite
            this.slider.putFirstAtEnd();
        }
    } else if (this.offset < 0) { // onn va 
        for (var i = 0; i < Math.abs(this.offset); i++) {
            this.slider.putLastAtbegining();
        }
    }
    this.offset = 0;
    this.state.isReady = true;
}




Carrousel.prototype.initPagination = function initPagination() {
    var controller = document.createElement("div");
    controller.classList.add(carrouselClasses.classController);
    var pagination = document.createElement("ul");
    pagination.classList.add(carrouselClasses.classPagination);

    for (var i = 0; i < this.slider.length(); i++) {
        pagination.append(this.makePaginationButton(i));
    }
    controller.append(pagination);

    if (this.options.autoplay) {
        controller.append(this.makeToggleButton());
    }
    this.carrousel.append(controller);
    this.options.pagination = true;
}

Carrousel.prototype.makeToggleButton = function makeToggleButton() {
    var toggleButton = document.createElement("button");
    toggleButton.classList.add(carrouselClasses.classToggleButton);
    var span = document.createElement("span");
    span.classList.add(carrouselClasses.classToggleButtonPause);
    toggleButton.append(span);
    toggleButton.addEventListener("click", function (e) {
        this.options.autoplay.paused = !this.options.autoplay.paused;
        if (this.options.autoplay.paused) {
            e.target.classList.replace(carrouselClasses.classToggleButtonPause, carrouselClasses.classToggleButtonPlay);
        } else {
            e.target.classList.replace(carrouselClasses.classToggleButtonPlay, carrouselClasses.classToggleButtonPause);
        }
    }.bind(this));
    return toggleButton;
}

Carrousel.prototype.makePaginationButton = function makePaginationButton(nSlide) {
    var li = document.createElement("li");
    li.setAttribute("role", "presentation");

    var button = document.createElement("button");
    button.classList.add(carrouselClasses.classPaginationButton);
    button.setAttribute("role", "tab");
    button.setAttribute("type", "button");
    button.setAttribute("aria-label", i18n.slideX.replace("%s", nSlide));
    button.setAttribute("aria-controls", this.carrousel.getAttribute("id") + "-" + "slideX".replace("X", nSlide));
    button.setAttribute("tabindex", nSlide);

    var elemI = document.createElement("i");
    elemI.setAttribute("width", "0%");

    button.append(elemI);
    button.addEventListener("click", function (e) {
        this.goTo(e.target.getAttribute("tabindex"));
    }.bind(this));
    li.append(button);

    return li;
}

Carrousel.prototype.initAutoPlay = function initAutoPlay(params) { // TODO changer pour requestaimation frame et gerer animmation
    this.options.autoplay = {
        interval: 2000,
        pauseOnHover: false,
        paused: false
    };

    if (params.interval) {
        params.interval = parseInt(params.interval);
        // on vérifie que l'interval est superieur à la durée de la transition
        if (parseInt(params.interval) > this.options.transitionDuration) {
            this.options.autoplay.interval = parseInt(params.interval);
        }
    }

    if (params.pauseOnHover) {
        this.options.autoplay.pauseOnHover = params.pauseOnHover;
    }

    this.options.autoplay.started = Date.now();
    window.requestAnimationFrame(this.runAutoPlay.bind(this));
}


Carrousel.prototype.runAutoPlay = function runAutoPlay() {
    var now = Date.now();
    var elapsed = now - this.options.autoplay.started;

    if (elapsed > this.options.autoplay.interval) {
        if (!this.options.drag.active && !(this.state.isHovered && this.options.autoplay.pauseOnHover) && !this.options.autoplay.paused) {
            this.options.autoplay.started = now;
            if (this.options.pagination) {
                this.carrousel.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.slider.currentSlide()).querySelector("i").setAttribute("style", "width: 0%");
            }
            this.move(1);
        }
    } else {
        if (!this.options.drag.active && !(this.state.isHovered && this.options.autoplay.pauseOnHover) && !this.options.autoplay.paused) {
            var p = elapsed / this.options.autoplay.interval * 100.0
            if (this.options.pagination) {
                this.carrousel.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.slider.currentSlide()).querySelector("i").setAttribute("style", "width: " + p + "%");
            }
        }
    }
    requestAnimationFrame(this.runAutoPlay.bind(this))
}

Carrousel.prototype.initDrag = function initDrag() { // TODO gerer ce probleme de lightbox qui s'ouvre pendant le drag 
    this.options.drag = {
        posx: null,
        startpos: null,
        target: 0,
        delta: 0,
        active: false
    };
    var dragAction = this.onDrag.bind(this);
    this.slider.domElement.addEventListener('mousedown', function (e) {
        // e.preventDefault();
        this.options.drag.posx = e.offsetX;
        this.options.drag.startpos = this.slider.pos;
        this.slider.domElement.addEventListener('mousemove', dragAction);
    }.bind(this));

    window.addEventListener('mouseup', function (e) {
        this.slider.domElement.removeEventListener('mousemove', dragAction);
        this.move(this.options.drag.target);
        this.options.drag.posx = null;
        this.options.drag.startpos = null;
        this.options.drag.delta = 0;
        this.options.drag.active = false;
    }.bind(this));

    window.addEventListener('mouseleave', function (e) {
        this.slider.domElement.removeEventListener('mousemove', dragAction);
        this.move(this.options.drag.target);
        this.options.drag.posx = null;
        this.options.drag.startpos = null;
        this.options.drag.delta = 0;
        this.options.drag.active = false;
    }.bind(this));
}

Carrousel.prototype.onDrag = function onDrag(e) {
    // this.preventDefault;
    this.options.drag.active = true;
    if (this.slider.getPosition() < 0) {
        // this.slider.pos += e.offsetX - this.options.drag.posx;
        this.slider.translate(e.offsetX - this.options.drag.posx);

        this.slider.delta = this.slider.getPosition() - this.options.drag.startpos;
        this.options.drag.target = 0;
        if (Math.sign(this.options.drag.delta) > 0) {
            if (Math.abs(this.options.drag.delta) - this.slider.elementAt(-1).size / 4 > 0) {
                this.options.drag.target -= 1;
            }
        } else {
            if (Math.abs(this.options.drag.delta) - this.slider.elementAt(-1).size / 4 > 0) {
                this.options.drag.target += 1;
            }
        }
    }
}

Carrousel.prototype.move = function (offset) {  // décaler la track de offset = +n ou -n slides
    if (true) {
        // if (this.options.pagination) {
        //     this.carrousel.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.slider.currentSlide()).querySelector("i").setAttribute("style", "width: 0%");
        // }
        // if (this.options.autoplay.started) {
        //     this.options.autoplay.started = Date.now();
        // }

        var delta = 0; // distance à parcourir
        var sign = Math.sign(offset); // direction positive ou negative 

        //calcul du delta à translater à partir de la somme des tailles 
        // on parcours le nombre de slide à déplacer
        for (var i = 0; i < Math.abs(offset); i += 1) {
            // on ajoute ( ou soustrait en fonction du signe), la taille de chacun des slide
            delta -= sign * this.slider.elementAt(offset - (sign > 0) - sign * i).size;
        }

        // On active l'animation
        this.slider.translate(delta, this.options.transitionDuration);

        // pour l'instant on a pas bougé, on ajoute le decalage au décalage eventuel ( ou 0)
        this.offset += offset;

        // On met à jour le slide current 
        this.slider.updateCurrent(offset);
    }
}

Carrousel.prototype.goTo = function goTo(n) {
    this.move(n - this.slider.currentSlide());
};

Carrousel.prototype.cleanUpSlideClass = function cleanUpSlideClass(currentSlide) {
    this.slider.domElement.children.item(currentSlide).classList.remove("is-active");
    this.slider.domElement.children.item(currentSlide + 1).classList.remove("is-next");
}

Carrousel.prototype.addActiveSlideClass = function addActiveSlideClass(currentSlide) {
    this.slider.domElement.children.item(currentSlide).classList.add("is-active");
    this.slider.domElement.children.item(currentSlide + 1).classList.add("is-next");
}

// Actions Callbacks
Carrousel.prototype.onResize = function onResize() {
    // Recalcule la dimension totale du contenu du slider et met à jour sa position x
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(function () {
        this.slider.init(this.container);
    }.bind(this), 300);
}

Carrousel.prototype.onMouseEnter = function onMouseEnter() {
    this.state.isHovered = true;
}

Carrousel.prototype.onMouseLeave = function onMouseLeave() {
    this.state.isHovered = false;
}