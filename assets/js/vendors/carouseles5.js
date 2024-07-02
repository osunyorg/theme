// TODO: 
// X - pause button
// X - pagination - goto 
// X - resize pété
// X - ajout elements fin en fonction du nombre 
// 0 - touch
// X - pagination progress
// 0 - bloquer en loop quand pas fini de charger en queue
// 0 - gerer la version pour gallery
// 0 - petit bug au drag sur les autres carrousels

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
    classController: "carrousel__controller",// si pagination ajout de la class auto
    classPagination: "carrousel__pagination", 
    classPaginationButton:  "carrousel__pagination__page",
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
    this.paused = false;
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
        if (options.pagination) {
            this.initPagination()
            // document.addEventListener("keydown", function (e) {
            //     //this.move(parseInt(e.key)-this.track.n);
            //     if (e.key == 'ArrowLeft') {
            //         this.move(-1);
            //     }
            //     else if (e.key == 'ArrowRight') {
            //         this.move(1);
            //     }
            // }.bind(this))
        }
        this.initDrag();
    }
    else {
        console.error("Aucun element de la classe %s trouvé dans le DOM", (options.classContainer));
        return;
    }
}

Carrousel.prototype.onResize = function onResize() {
    this.ready = false;
    this.computeDim();
    this.track.pos = -this.track.len
    this.updatePos();
    this.ready = true;
}

Carrousel.prototype.initTrack = function initTrack(trackElem) {
    this.track = {
        elem: trackElem,
        pos: 0,
        n: 0,
        delta: 0,
        len: 0
    };

    // Je récupere la durée de transition specifiée dans le css
    var d = getComputedStyle(this.track.elem).transitionDuration;
    if (d.split("ms").length > 1) {
        this.transitionDuration = parseInt(d.split("ms")[0]);
    } else if (d.split("s").length > 1) {
        this.transitionDuration = parseInt(parseFloat(d.split("s")[0]) * 1000);
    }

    var childrenAsArray = Array.from(this.track.elem.children);
    for (var i = 0; i < childrenAsArray.length; i++) {
        var e = childrenAsArray[i];
        if (this.loop) {
            this.track.elem.appendChild(e.cloneNode(true)); // ajout d'une copie a la fin
        }
        var el = {};
        el.element = e;
        el.id = i;
        this.elements.push(el);
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
        //todo compute width according to window 
        this.track.pos -= this.track.len; // initialisation de la position du track
        this.updatePos();
    }

    this.track.elem.addEventListener('transitionend', function () {
        this.ready = false;
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
        this.offset = 0;
        this.ready = true;
    }.bind(this));

    this.slider.addEventListener("mouseenter", function (e) {
        this.hovered = true;
    }.bind(this));

    this.slider.addEventListener("mouseleave", function (e) {
        this.hovered = false;
    }.bind(this));

    // add detection focus ( touch )
    var resizeAction = this.onResize.bind(this);
    window.addEventListener('resize', resizeAction);
    this.ready = true;
    return this;
}

Carrousel.prototype.computeDim = function computeDim() {
    // compute width
    this.track.len = 0;
    for (var i = 0; i < this.elements.length; i++) {
        var e = this.elements[i].element;
        var style = getComputedStyle(e);
        this.elements[i].width = e.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        this.track.len += this.elements[i].width;
    }
}

Carrousel.prototype.initPagination = function initPagination() {
    var controller = document.createElement("div");
    controller.classList.add(carrouselClasses.classController);
        var pagination = document.createElement("ul");
        pagination.classList.add(carrouselClasses.classPagination);
        for(var i = 0; i<this.elements.length; i++){
            var li = document.createElement("li");
            li.setAttribute("role", "presentation");
            var button = document.createElement("button");
            button.classList.add(carrouselClasses.classPaginationButton);
            button.setAttribute("role", "tab");
            button.setAttribute("type", "button");
            button.setAttribute("aria-label", i18n.slideX.replace("%s", i));
            button.setAttribute("aria-controls", this.carrousel.getAttribute("id")+"-"+"slideX".replace("X",i));
            button.setAttribute("tabindex", i);
            var elemI = document.createElement("i");
            elemI.setAttribute("width", "0%");
            button.append(elemI);
            button.addEventListener("click", function(e){ 
                this.goTo(e.target.getAttribute("tabindex"));
            }.bind(this));
            li.append(button);
            pagination.append(li);        
        }
        controller.append(pagination);
        if(Object.keys(this.autoplay).length != 0){
            var toggleButton = document.createElement("button");
            toggleButton.classList.add(carrouselClasses.classToggleButton);
            var span = document.createElement("span");
            span.classList.add(carrouselClasses.classToggleButtonPause);
            toggleButton.append(span);
            toggleButton.addEventListener("click", function(e){
                this.paused = !this.paused;
                if(this.paused){
                    e.target.classList.replace(carrouselClasses.classToggleButtonPause, carrouselClasses.classToggleButtonPlay);
                }else{
                    e.target.classList.replace(carrouselClasses.classToggleButtonPlay, carrouselClasses.classToggleButtonPause);
                }
            }.bind(this));
            controller.append(toggleButton);
        }       
        this.carrousel.append(controller);
}

Carrousel.prototype.runAutoPlay = function runAutoPlay(){
    var now = Date.now();
    var elapsed = now - this.autoplay.started;

    if(elapsed > this.autoplay.interval){
        if (!this.drag.active && !(this.hovered && this.autoplay.pauseOnHover) && !this.paused) {
            this.autoplay.started = now;
            this.carrousel.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.track.n).querySelector("i").setAttribute("style", "width: 0%");
            this.move(1);
        }
    }else{
        if (!this.drag.active && !(this.hovered && this.autoplay.pauseOnHover) && !this.paused) {
            var p = elapsed/this.autoplay.interval*100.0
            this.carrousel.getElementsByClassName(carrouselClasses.classPaginationButton).item(this.track.n).querySelector("i").setAttribute("style", "width: "+p+"%");
        }
    }
    requestAnimationFrame(this.runAutoPlay.bind(this))
}

Carrousel.prototype.initAutoPlay = function initAutoPlay(params) { // TODO changer pour requestaimation frame et gerer animmation
    this.autoplay = {
        interval: 2000,
        pauseOnHover: false
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

Carrousel.prototype.initDrag = function initDrag() {
    this.drag = {
        posx: null,
        startpos: null,
        target: 0,
        delta: 0,
        active: false
    };
    var dd = this.onDrag.bind(this);
    this.track.elem.addEventListener('mousedown', function (e) {
        e.preventDefault();
        this.drag.posx = e.offsetX;
        this.drag.startpos = this.track.pos;
        this.track.elem.addEventListener('mousemove', dd);
    }.bind(this));

    window.addEventListener('mouseup', function (e) {
        this.track.elem.removeEventListener('mousemove', dd);
        this.move(this.drag.target);
        this.drag.posx = null;
        this.drag.startpos = null;
        this.drag.delta = 0;
        this.drag.active = false;
    }.bind(this));

    window.addEventListener('mouseleave', function (e) {
        this.track.elem.removeEventListener('mousemove', dd);
        this.move(this.drag.target);
        this.drag.posx = null;
        this.drag.startpos = null;
        this.drag.delta = 0;
        this.drag.active = false;
    }.bind(this));
}

Carrousel.prototype.onDrag = function onDrag(e) {
    this.drag.active = true;
    if (this.track.pos < 0) {
        this.track.pos += e.offsetX - this.drag.posx;
        this.updatePos();

        this.drag.delta = this.track.pos - this.drag.startpos;
        this.drag.target = 0;
        if (Math.sign(this.drag.delta) > 0) {
            if (Math.abs(this.drag.delta) - this.elements[this.elementAt(-1)].width / 2 > 0) {
                this.drag.target -= 1;
            }
        } else {
            if (Math.abs(this.drag.delta) - this.elements[this.elementAt(0)].width / 2 > 0) {
                this.drag.target += 1;
            }
        }
    }
}

Carrousel.prototype.slide = function slide() {
    this.track.pos += this.track.delta;
    this.track.delta = 0;
    this.track.elem.style.setProperty('transition', 'left ' + String(this.transitionDuration) + 'ms ');
    this.track.elem.style.setProperty('left', this.track.pos + "px");
}

Carrousel.prototype.elementAt = function elementAt(i) {
    // var trackLen = this.track.elem.children.length;
    var trackLen = this.elements.length;
    return ((this.track.n + i) % trackLen + trackLen) % trackLen;
}

Carrousel.prototype.updatePos = function updatePos() {
    this.track.elem.style.setProperty('transition', 'left 0ms');
    this.track.elem.style.setProperty('left', this.track.pos + "px");
}

Carrousel.prototype.move = function (offset) {  // move de n elements
    if (this.ready) {
        var elemswidth = 0;
        //calcul du delta à translater à partir de la somme des tailles 
        for (var i = 0; i < Math.abs(offset); i += 1) {
            var s = Math.sign(offset);
            elemswidth -= Math.sign(offset) * this.elements[this.elementAt(offset - (s > 0) - s * i)].width;
        }
        this.offset += offset;
        this.track.delta += elemswidth - (this.drag.delta);
        this.track.n = this.elementAt(offset);
        this.slide();
    }
}

Carrousel.prototype.goTo = function goTo(n){
    this.move(n - this.track.n);
};

window.addEventListener("load", function () {
    var classCarrousel = "carrousel";
    var carrousels = document.getElementsByClassName(classCarrousel);
    for (var i = 0; i < carrousels.length; i += 1) {
        carrousels[i].setAttribute("id", "carrouselX".replace("X",i));
        new Carrousel(carrousels[i], JSON.parse(carrousels[i].getAttribute("data-carrousel")));
    }
})