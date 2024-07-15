import './carousel/instance';
import './carousel/manager';



// TODO: 
// 0 - touch
// 0 - petit bug au drag sur les autres carrousels
// 0 - probleme click glightbox // gallery bug drag

var siteLang = document.querySelector('html').getAttribute('lang');
if (siteLang == "fr") {
    var i18n = {
        first: 'Aller au premier slide',
        last: 'Aller au dernier slide',
        next: 'Slide suivant',
        pageX: 'Aller à la page %s',
        pause: 'Mettre en pause le carousel',
        play: 'Démarrer le carousel',
        prev: 'Slide précedent',
        slideX: 'Aller au slide %s'
    }
}

var carrouselClasses = {
    classSlider: "carrousel__slider", // slider (servant de fenetre d'affichage)
    classContainer: "carrousel__container", // container englobant directement les elements du slider
    classController: "carrousel__controller",
    classPagination: "carrousel__pagination",
    classPaginationButton: "carrousel__pagination__page",
    classToggleButton: "carrousel__toggle",
    classToggleButtonPause: "carrousel__toggle__pause",
    classToggleButtonPlay: "carrousel__toggle__play"
}
Carrousel = function Carrousel(element, options) {
    this.carrousel = element;
    this.slider = this.carrousel.getElementsByClassName(carrouselClasses.classSlider).item(0);
    this.offset = 0;
    this.transitionDuration = 0;
    this.loop = true;
    this.hovered = false;
    this.arrows = false;
    this.autoplay = {};
    this.drag = {};
    this.elements = [];
    this.ready = false;
    this.track = {};
    this.pagination = false;
    var trackElem = this.slider.getElementsByClassName(carrouselClasses.classContainer).item(0);

    if (trackElem) {
        this.initTrack(trackElem);
        if (options.autoplay) {
            this.initAutoPlay(options);
        }
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

        if (options.pagination) {
            this.initPagination();
        }
        this.initDrag();
    }
    else {
        console.error("Aucun element de la classe %s trouvé dans le DOM", (options.classContainer));
        return;
    }
}

Carrousel.prototype.initTransitionDuration = function initTransitionDuration() {
    // Je récupere la durée de transition specifiée dans le css
    var d = getComputedStyle(this.track.elem).transitionDuration;
    if (d.split("ms").length > 1) {
        this.transitionDuration = parseInt(d.split("ms")[0]);
    } else if (d.split("s").length > 1) {
        this.transitionDuration = parseInt(parseFloat(d.split("s")[0]) * 1000);
    }
}

Carrousel.prototype.initTrack = function initTrack(trackElem) {
    // Initialisation du slider
    this.track = {
        elem: trackElem,
        pos: 0,
        n: 0,
        delta: 0,
        len: 0
    };

    // On récupere la durée de transition
    this.initTransitionDuration();

    // On initialise le contenu et la position du track
    this.initTrackContent();

    var onTransitioned = this.onTransitioned.bind(this);
    this.track.elem.addEventListener('transitionend', onTransitioned);

    this.slider.addEventListener("mouseenter", function (e) { this.hovered = true; }.bind(this));
    this.slider.addEventListener("mouseleave", function (e) { this.hovered = false; }.bind(this));

    // add detection focus ( touch )
    var resizeAction = this.onResize.bind(this);
    window.addEventListener('resize', resizeAction);

    this.addActiveSlideClass(0);
    this.ready = true;
    return this;
}

Carrousel.prototype.initTrackContent = function initTrackContent() {
    // Ajoute une copei des elements à la fin, conserve les references des elements dans 
    var childrenAsArray = Array.from(this.track.elem.children);
    var domElement, slideObject;
    for (var i = 0; i < childrenAsArray.length; i++) {
        domElement = childrenAsArray[i];
        if (this.loop) {
            this.track.elem.appendChild(domElement.cloneNode(true)); // ajout d'une copie a la fin
        }
        slideObject = {};
        slideObject.element = domElement;
        slideObject.id = i;
        this.elements.push(slideObject);
    }

    this.computeDim();

    if (this.track.len < this.slider.offsetWidth) {  // dans le cas ou le contenu est plus petit que la fenetre ...
        for (var i = 0; i < childrenAsArray.length; i++) {
            var e = childrenAsArray[i];
            this.track.elem.appendChild(e.cloneNode(true)); // ajout d'une copie a la fin
        }
        this.computeDim();
    }

    if (this.loop) {
        this.track.pos -= this.track.len; // initialisation de la position du track
        this.updatePos();
    }
}

Carrousel.prototype.onTransitioned = function onTransitioned() {
    this.ready = false;
    var nCurrent = this.track.elem.children.length - this.elements.length;
    this.cleanUpSlideClass(nCurrent);

    if (this.offset > 0) {
        for (var i = 0; i < this.offset; i++) {
            this.track.pos += this.elements[this.elementAt(-i - 1)].width;
            this.updatePos();
            this.track.elem.append(this.track.elem.removeChild(this.track.elem.children.item(0)));
        }
    } else if (this.offset < 0) {
        for (var i = 0; i < Math.abs(this.offset); i++) {
            this.track.pos -= this.elements[this.elementAt(i)].width;
            this.updatePos();
            this.track.elem.prepend(this.track.elem.removeChild(this.track.elem.children.item(this.track.elem.children.length - 1)));
        }
    }
    nCurrent = this.track.elem.children.length - this.elements.length;
    this.addActiveSlideClass(nCurrent);
    this.offset = 0;
    this.ready = true;
}

Carrousel.prototype.initPagination = function initPagination() {
    var controller = document.createElement("div");
    controller.classList.add(carrouselClasses.classController);
    var pagination = document.createElement("ul");
    pagination.classList.add(carrouselClasses.classPagination);
    var button;
    var elemI;

    for (var i = 0; i < this.elements.length; i++) {
        pagination.append(this.makePaginationButton(i));
    }
    controller.append(pagination);

    if (Object.keys(this.autoplay).length != 0) {
        controller.append(this.makeToggleButton());
    }
    this.carrousel.append(controller);
    this.pagination = true;
}

Carrousel.prototype.makeToggleButton = function makeToggleButton() {
    var toggleButton = document.createElement("button");
    toggleButton.classList.add(carrouselClasses.classToggleButton);
    var span = document.createElement("span");
    span.classList.add(carrouselClasses.classToggleButtonPause);
    toggleButton.append(span);
    toggleButton.addEventListener("click", function (e) {
        this.autoplay.paused = !this.autoplay.paused;
        if (this.autoplay.paused) {
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
    this.autoplay = {
        interval: 2000,
        pauseOnHover: false,
        paused: false
    };

    if (params.interval) {
        params.interval = parseInt(params.interval);
        // on vérifie que l'interval est superieur à la durée de la transition
        if (parseInt(params.interval) > this.transitionDuration) {
            this.autoplay.interval = parseInt(params.interval);
        }
    }

    if (params.pauseOnHover) {
        this.autoplay.pauseOnHover = params.pauseOnHover;
    }

    this.autoplay.started = Date.now();
    window.requestAnimationFrame(this.runAutoPlay.bind(this));
}


Carrousel.prototype.runAutoPlay = function runAutoPlay() {
    var now = Date.now();
    var elapsed = now - this.autoplay.started;

    if (elapsed > this.autoplay.interval) {
        if (!this.drag.active && !(this.hovered && this.autoplay.pauseOnHover) && !this.autoplay.paused) {
            this.autoplay.started = now;
            if (this.pagination) {
                this.carrousel.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.track.n).querySelector("i").setAttribute("style", "width: 0%");
            }
            this.move(1);
        }
    } else {
        if (!this.drag.active && !(this.hovered && this.autoplay.pauseOnHover) && !this.autoplay.paused) {
            var p = elapsed / this.autoplay.interval * 100.0
            if (this.pagination) {
                this.carrousel.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.track.n).querySelector("i").setAttribute("style", "width: " + p + "%");
            }
        }
    }
    requestAnimationFrame(this.runAutoPlay.bind(this))
}

Carrousel.prototype.initDrag = function initDrag() { // TODO gerer ce probleme de lightbox qui s'ouvre pendant le drag 
    this.drag = {
        posx: null,
        startpos: null,
        target: 0,
        delta: 0,
        active: false
    };
    var dragAction = this.onDrag.bind(this);
    this.track.elem.addEventListener('mousedown', function (e) {
        // e.preventDefault();
        this.drag.posx = e.offsetX;
        this.drag.startpos = this.track.pos;
        console.log("md")
        this.track.elem.addEventListener('mousemove', dragAction);
    }.bind(this));

    window.addEventListener('mouseup', function (e) {
        this.track.elem.removeEventListener('mousemove', dragAction);
        this.move(this.drag.target);
        this.drag.posx = null;
        this.drag.startpos = null;
        this.drag.delta = 0;
        this.drag.active = false;
        console.log("mu")
    }.bind(this));

    window.addEventListener('mouseleave', function (e) {
        this.track.elem.removeEventListener('mousemove', dragAction);
        this.move(this.drag.target);
        this.drag.posx = null;
        this.drag.startpos = null;
        this.drag.delta = 0;
        this.drag.active = false;
        console.log("ml")
    }.bind(this));
}

Carrousel.prototype.onDrag = function onDrag(e) {
    // this.preventDefault;
    this.drag.active = true;
    if (this.track.pos < 0) {
        this.track.pos += e.offsetX - this.drag.posx;
        this.updatePos();

        this.drag.delta = this.track.pos - this.drag.startpos;
        this.drag.target = 0;
        if (Math.sign(this.drag.delta) > 0) {
            if (Math.abs(this.drag.delta) - this.elements[this.elementAt(-1)].width / 4 > 0) {
                this.drag.target -= 1;
            }
        } else {
            if (Math.abs(this.drag.delta) - this.elements[this.elementAt(0)].width / 4 > 0) {
                this.drag.target += 1;
            }
        }
    }
}

Carrousel.prototype.move = function (offset) {  // move de offset elements
    if (this.ready) {
        if (this.pagination) {
            this.carrousel.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.track.n).querySelector("i").setAttribute("style", "width: 0%");
        }
        if (this.autoplay.started) {
            this.autoplay.started = Date.now();
        }
        var elemswidth = 0;
        //calcul du delta à translater à partir de la somme des tailles 
        var sign = Math.sign(offset);
        var travellingElem;
        for (var i = 0; i < Math.abs(offset); i += 1) {
            travellingElem = this.elementAt(offset - (sign > 0) - sign * i);
            elemswidth -= sign * this.elements[travellingElem].width;
        }

        this.offset += offset;
        this.track.delta += elemswidth - (this.drag.delta);
        this.track.n = this.elementAt(offset);
        this.slide();
    }
}

Carrousel.prototype.goTo = function goTo(n) {
    this.move(n - this.track.n);
};

Carrousel.prototype.slide = function slide() {
    this.track.pos += this.track.delta;
    this.track.delta = 0;
    this.track.elem.style.setProperty('transition', 'left ' + String(this.transitionDuration) + 'ms ');
    this.track.elem.style.setProperty('left', this.track.pos + "px");
}

Carrousel.prototype.computeDim = function computeDim() {
    // compute width
    this.track.len = 0;
    var e, style;
    for (var i = 0; i < this.elements.length; i++) {
        e = this.elements[i].element;
        style = getComputedStyle(e);
        this.elements[i].width = e.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        this.track.len += this.elements[i].width;
    }
}

Carrousel.prototype.elementAt = function elementAt(i) {
    var trackLen = this.elements.length;
    return ((this.track.n + i) % trackLen + trackLen) % trackLen;
}

Carrousel.prototype.updatePos = function updatePos() {
    this.track.elem.style.setProperty('transition', 'left 0ms');
    this.track.elem.style.setProperty('left', this.track.pos + "px");
}

Carrousel.prototype.cleanUpSlideClass = function cleanUpSlideClass(currentSlide) {
    this.track.elem.children.item(currentSlide).classList.remove("is-active");
    this.track.elem.children.item(currentSlide + 1).classList.remove("is-next");
}

Carrousel.prototype.addActiveSlideClass = function addActiveSlideClass(currentSlide) {

    this.track.elem.children.item(currentSlide).classList.add("is-active");
    this.track.elem.children.item(currentSlide + 1).classList.add("is-next");
}

Carrousel.prototype.onResize = function onResize() {
    // Recalcule la dimension totale du contenu du slider et met à jour sa position x
    this.ready = false;
    this.computeDim();
    this.track.pos = -this.track.len
    this.updatePos();
    this.ready = true;
}

window.addEventListener("load", function () {
    var classCarrousel = "carrousel";
    var carrousels = document.getElementsByClassName(classCarrousel);
    for (var i = 0; i < carrousels.length; i += 1) {
        carrousels[i].setAttribute("id", "carrouselX".replace("X", i));
        new Carrousel(carrousels[i], JSON.parse(carrousels[i].getAttribute("data-carrousel")));
    }
});