// import './carousel/instance';
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
    this.slider = element.slider;

    this.track = {
        domElement: element.slidesContainer,
        n: 0,
        delta: 0,
        position: 0,
        elements: [],
        updateElements: function() {
            this.elements = [];
            var elems = this.domElement.querySelectorAll(".carrousel__slide:not(.clone)");
            for(var i = 0; i<elems.length; i += 1){
                this.elements.push({
                    dom: elems[i],
                    size: this.computeElementWidth(elems[i])
                });
            }
        },
        element: function(index){ 
            var elements = this.elements;
            return elements[index];
        },
        length: function() { // nombre de slides du caroussel ( sans compter les clones)
            return this.elements.length;
        },
        size: function() {
            var size = 0;
            for (var i = 0; i < this.elements.length; i++) {
                size += this.elements[i].size;
            }
            return size;
        },
        translate: function (delta, transition = 0) {
            // on enregistre également la distance à parcourir
            // si le delta n'était pas à 0 on le soustrait à la distance à parcourir
            this.delta = delta - this.delta; 
            this.position += this.delta;
            this.delta = 0;
            this.domElement.style.setProperty('transition', 'left ' + String(transition) + 'ms');
            this.domElement.style.setProperty('left', this.position + "px");
        },
        putFirstAtEnd: function() {
            var traveller = this.domElement.children.item(0);
            var travellerId = parseInt(traveller.getAttribute("id").slice(-1));
            console.log(traveller)
            var width = this.element(travellerId).size;
            console.log("traveller width "+width)
            this.translate(width);
            this.domElement.append(this.domElement.removeChild(traveller));
        },
        putLastAtbegining : function() {
            var traveller = this.domElement.children.item(this.domElement.children.length - 1)
            var travellerId = parseInt(traveller.getAttribute("id").slice(-1));
            var width = -this.element(travellerId).size;
            console.log("traveller width "+ width)
            this.translate(width);
            this.domElement.prepend(this.domElement.removeChild(traveller));
        },
        getPosition: function () {
            return this.position;
        },
        computeElementWidth: function (dom) {
            var style = getComputedStyle(dom);
            var width = dom.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
            return width
        },
        setCurrent: function(current){
            this.n = current;
        }
    }

    this.state = {
        isHovered: false,
        isReady: false
    };

    this.offset = 0;

    // On récupere la durée de transition
    // this.initTransitionDuration();
    console.log("transition initialized with value: " + this.options.transitionDuration);
    // On initialise le contenu et la position du track
    this.initTrackContent();
    console.log("track content initialized");

    this.initListeners();
    console.log("listeners initialized");

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

    // if (options.pagination) {
    //     this.initPagination();
    // }
    // this.initDrag();

    this.state.isReady = true;
}

Carrousel.prototype.initListeners = function initListeners() {
    var onTransitioned = this.onTransitioned.bind(this);
    this.track.domElement.addEventListener('transitionend', function(e) {
        if(e.propertyName == "left"){
            onTransitioned();
        }
        }
    );

    this.slider.addEventListener("mouseenter", function (e) { this.state.isHovered = true; }.bind(this));
    this.slider.addEventListener("mouseleave", function (e) { this.state.isHovered = false; }.bind(this));

    // add detection focus ( touch )
    var resizeAction = this.onResize.bind(this);
    window.addEventListener('resize', resizeAction);
    // this.addActiveSlideClass(0);
}

Carrousel.prototype.initTrackContent = function initTrackContent() {
    // Ajoute une copei des elements à la fin, conserve les references des elements dans 
    var childrenAsArray = Array.from(this.track.domElement.children);
    var domElement;
    for (var i = 0; i < childrenAsArray.length; i++) {
        domElement = childrenAsArray[i];
        domElement.setAttribute("id", "slide__"+i);
        if (this.options.loop) {
            var clone = domElement.cloneNode(true);
            clone.classList.add("clone");
            clone.setAttribute("id", "slide__clone__"+i);
            this.track.domElement.appendChild(clone); // ajout d'une copie a la fin
        }
    }
    this.track.updateElements();
    if (this.options.loop) {
        this.track.translate(-this.track.size());
    }
}

Carrousel.prototype.onTransitioned = function onTransitioned() {
    this.state.isReady = false;
    var nCurrent = this.track.domElement.children.length - this.track.length();
    // this.cleanUpSlideClass(nCurrent);
    // dans le cas ou il y a loop
    if (this.offset > 0) { // on avance vers la droite
        for (var i = 0; i < this.offset; i++) {
            // on enlève l'element tout à gauche pour le rajouter à droite
            this.track.putFirstAtEnd();
        }
    } else if (this.offset < 0) { // onn va 
        for (var i = 0; i < Math.abs(this.offset); i++) {
            this.track.putLastAtbegining();
        }
    }
    nCurrent = this.track.domElement.children.length - this.track.length();
    // this.addActiveSlideClass(nCurrent);
    this.offset = 0;
    this.state.isReady = true;
}

Carrousel.prototype.initPagination = function initPagination() {
    var controller = document.createElement("div");
    controller.classList.add(carrouselClasses.classController);
    var pagination = document.createElement("ul");
    pagination.classList.add(carrouselClasses.classPagination);
    var button;
    var elemI;

    for (var i = 0; i < this.track.length(); i++) {
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
                this.carrousel.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.track.n).querySelector("i").setAttribute("style", "width: 0%");
            }
            this.move(1);
        }
    } else {
        if (!this.options.drag.active && !(this.state.isHovered && this.options.autoplay.pauseOnHover) && !this.options.autoplay.paused) {
            var p = elapsed / this.options.autoplay.interval * 100.0
            if (this.options.pagination) {
                this.carrousel.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.track.n).querySelector("i").setAttribute("style", "width: " + p + "%");
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
    this.track.domElement.addEventListener('mousedown', function (e) {
        // e.preventDefault();
        this.options.drag.posx = e.offsetX;
        this.options.drag.startpos = this.track.pos;
        this.track.domElement.addEventListener('mousemove', dragAction);
    }.bind(this));

    window.addEventListener('mouseup', function (e) {
        this.track.domElement.removeEventListener('mousemove', dragAction);
        this.move(this.options.drag.target);
        this.options.drag.posx = null;
        this.options.drag.startpos = null;
        this.options.drag.delta = 0;
        this.options.drag.active = false;
    }.bind(this));

    window.addEventListener('mouseleave', function (e) {
        this.track.domElement.removeEventListener('mousemove', dragAction);
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
    if (this.track.getPosition() < 0) {
        // this.track.pos += e.offsetX - this.options.drag.posx;
        this.track.translate(e.offsetX - this.options.drag.posx);

        this.track.delta = this.track.getPosition() - this.options.drag.startpos;
        this.options.drag.target = 0;
        if (Math.sign(this.options.drag.delta) > 0) {
            if (Math.abs(this.options.drag.delta) - this.track.element(this.numElementAt(-1)).size / 4 > 0) {
                this.options.drag.target -= 1;
            }
        } else {
            if (Math.abs(this.options.drag.delta) - this.track.element(this.numElementAt(-1)).size / 4 > 0) {
                this.options.drag.target += 1;
            }
        }
    }
}

Carrousel.prototype.move = function (offset) {  // décaler la track de offset = +n ou -n slides
    if (this.state.isReady) {
        // if (this.options.pagination) {
        //     this.carrousel.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.track.n).querySelector("i").setAttribute("style", "width: 0%");
        // }
        // if (this.options.autoplay.started) {
        //     this.options.autoplay.started = Date.now();
        // }
        var delta = 0; // distance à parcourir
        var sign = Math.sign(offset); // direction positive ou negative 
        
        //calcul du delta à translater à partir de la somme des tailles 
        var slideNumber;
        // on parcours le nombre de slide à déplacer
        for (var i = 0; i < Math.abs(offset); i += 1) { 
            // on recupere l'instance de chaque slide
            slideNumber = this.numElementAt(offset - (sign > 0) - sign * i);
            // on ajoute ( ou soustrait en fonction du signe), la taille de chacun des slide
            delta -= sign * this.track.element(slideNumber).size; 
        }

        // On active l'animation
        this.track.translate(delta, this.options.transitionDuration);

        // pour l'instant on a pas bougé, on ajoute le decalage au décalage eventuel ( ou 0)
        this.offset += offset;

        // On met à jour le slide current 
        this.track.setCurrent(this.numElementAt(offset));
    
    }
}

Carrousel.prototype.goTo = function goTo(n) {
    this.move(n - this.track.n);
};

Carrousel.prototype.numElementAt = function numElementAt(offset) {
    var trackLen = this.track.length();
    return ((this.track.n + offset) % trackLen + trackLen) % trackLen;
}

Carrousel.prototype.cleanUpSlideClass = function cleanUpSlideClass(currentSlide) {
    this.track.domElement.children.item(currentSlide).classList.remove("is-active");
    this.track.domElement.children.item(currentSlide + 1).classList.remove("is-next");
}

Carrousel.prototype.addActiveSlideClass = function addActiveSlideClass(currentSlide) {
    this.track.domElement.children.item(currentSlide).classList.add("is-active");
    this.track.domElement.children.item(currentSlide + 1).classList.add("is-next");
}

Carrousel.prototype.onResize = function onResize() {
    // Recalcule la dimension totale du contenu du slider et met à jour sa position x
    this.state.isReady = false;
    this.track.updateElements();
    this.goTo(0);
    this.state.isReady = true;
}