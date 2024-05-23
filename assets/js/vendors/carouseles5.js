// TODO: 
// O - resize
// O - pause button
// O - touch
// O - pagination - goto + progress
// O - ajout elements fin en fonction du nombre 

Carrousel = function Carrousel(element, options) {
    this.elem = element; // check type dom element
    this.width =  element.offsetWidth;
    this.height = element.offsetHeight;
    this.offset = 0;
    this.transitionDuration = 0;
    this.loop = true;
    this.hovered = false;
    this.autoplay = {};
    this.drag = {};
    this.elements = [];
    this.ready = false;
    this.track = {};

    var trackElem = this.elem.getElementsByClassName(options.classContainer).item(0);
    if(trackElem){
        this.initTrack(trackElem);
        if(options.pagination){
            document.addEventListener("keydown", function(e){
                this.move(parseInt(e.key)-this.track.n)
            }.bind(this))
        }
        if(options.autoplay){
            this.initAutoPlay(options);
        }
        this.initDrag();

    }
    else{
        console.error("Aucun element de la classe %s trouvé dans le DOM", (options.classContainer))
        return
    }
}

Carrousel.prototype.initTrack = function initTrack(trackElem){
    this.track = {
        elem: trackElem,
        pos : 0,
        n : 0,
        delta: 0
    };

    // Je récupere la durée de transition specifiée dans le css
    var d = getComputedStyle(this.track.elem).transitionDuration;
    if(d.split("ms").length > 1){
        this.transitionDuration = parseInt(d.split("ms")[0]);
    }else if(d.split("s").length > 1){
        this.transitionDuration = parseInt(parseFloat(d.split("s")[0]) * 1000);
    }

    var childrenAsArray = Array.from(this.track.elem.children);
    for(var i = 0; i < childrenAsArray.length; i++){
        var e = childrenAsArray[i]
        var style = getComputedStyle(e);
        var el = {};
        el.width = e.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        el.element = e;
        el.id = i;
        this.elements.push(el);
        // this.track.elem.appendChild(e.cloneNode(true)); // ajout d'une copie a la fin
    }
    
    // this.track.pos -= this.track.elem.offsetWidth; // initialisation de la position du track
    // this.updatePos();
    
    this.track.elem.addEventListener('transitionend', function(){
        this.ready = false;
        if(this.offset > 0){
            for(var i=0; i<this.offset; i++){
                this.track.pos += this.elements[this.elementAt(-i-1)].width;
                this.updatePos();
                this.track.elem.append(this.track.elem.removeChild(this.track.elem.children.item(0)));
            }
        }else if (this.offset<0){
            for(var i=0; i<Math.abs(this.offset); i++){
                this.track.pos -= this.elements[this.elementAt(i)].width;
                this.updatePos();
                this.track.elem.prepend(this.track.elem.removeChild(this.track.elem.children.item(this.track.elem.children.length-1)));
            }
        }
        this.offset = 0;
        this.ready = true;
    }.bind(this));

    this.elem.addEventListener("mouseenter",function(e){
        this.hovered = true;
    }.bind(this))
    this.elem.addEventListener("mouseleave",function(e){
        this.hovered = false;
    }.bind(this))
    this.ready = true;
    return this;
}

Carrousel.prototype.initAutoPlay = function initAutoPlay(params){

    this.autoplay = {
        interval: 10000,
        pauseOnHover: true,
        pauseOnFocus: false
    }

    if(params.interval){
        params.interval = parseInt(params.interval);
        // on vérifie que l'interval est superieur à la durée de la transition
        if(params.interval > this.transitionDuration){ 
            this.autoplay.interval = parseInt(params.interval)
        }
    }

    this.autoplay.counter = setInterval(function(){ // auto move
        if(!this.drag.active && !(this.hovered && this.autoplay.pauseOnHover)){
            this.move(1);
        }
    }.bind(this), this.autoplay.interval);
}

Carrousel.prototype.initDrag = function initDrag(){
    this.drag = {
        posx: null,
        startpos: null,
        target: 0,
        delta: 0,
        active: false
    }
    var dd = this.onDrag.bind(this);
    this.track.elem.addEventListener('mousedown', function(e){
        e.preventDefault()
        this.drag.posx = e.offsetX;
        this.drag.startpos = this.track.pos;
        this.track.elem.addEventListener('mousemove', dd);
    }.bind(this));
    
    window.addEventListener('mouseup', function(e){
        this.track.elem.removeEventListener('mousemove', dd);
        this.move(this.drag.target);
        this.drag.posx = null;
        this.drag.startpos = null;
        this.drag.delta = 0;
        this.drag.active = false;
    }.bind(this));

    window.addEventListener('mouseleave', function(e){
        this.track.elem.removeEventListener('mousemove', dd);
        this.move(this.drag.target);
        this.drag.posx = null;
        this.drag.startpos = null;
        this.drag.delta = 0;
        this.drag.active = false;
    }.bind(this));
}

Carrousel.prototype.onDrag = function onDrag(e){
    this.drag.active = true;
    this.track.pos += e.offsetX - this.drag.posx;
    this.updatePos()

    this.drag.delta = this.track.pos-this.drag.startpos;
    this.drag.target = 0;
    if(Math.sign(this.drag.delta) > 0){            
        if(Math.abs(this.drag.delta) - this.elements[this.elementAt(-1)].width/2 > 0){
            this.drag.target -= 1;                
        }
    }else{
        if(Math.abs(this.drag.delta) - this.elements[this.elementAt(0)].width/2 > 0){
            this.drag.target += 1 ;                
        }
    }
}

Carrousel.prototype.slide = function slide(){
    this.track.pos += this.track.delta;
    this.track.delta = 0;
    this.track.elem.style.setProperty('transition', 'left ' + String(this.transitionDuration) + 'ms ');
    this.track.elem.style.setProperty('left', this.track.pos + "px");
}

Carrousel.prototype.elementAt = function elementAt(i){
    var trackLen = this.track.elem.children.length;
    return ((this.track.n + i) % trackLen + trackLen) % trackLen;
}

Carrousel.prototype.updatePos = function updatePos(){
    this.track.elem.style.setProperty('transition', 'left 0ms');
    this.track.elem.style.setProperty('left', this.track.pos + "px");
}

Carrousel.prototype.move = function(target){ 
    if(this.ready){
        var elemswidth = 0;
        //calcul du delta à translater à partir de la sommme des tailles 
        if(target>0){ 
            for(var i=0; i< Math.abs(target); i+=1){
                elemswidth -= this.elements[this.elementAt(target-1-i)].width;
            }
        }else if(target<0){
            for(var i=0; i< Math.abs(target); i+=1){
                elemswidth += this.elements[this.elementAt(target+i)].width;
            }
        }
        this.offset += target;
        this.track.delta += elemswidth - (this.drag.delta);
        this.track.n = this.elementAt(target);
        this.slide();
    }
}

window.addEventListener("load", function(){
    var classCarrousel = "carrousel__slider";

    var params = {
        arrows: false,
        pagination: true,
        loop: true,
        rewind: false,
        autoplay: true,
        pauseOnHover: false,
        pauseOnFocus: true,
        interval: 2000,
        classContainer: "carrousel__container"
    };
    var params = {
        classContainer: "carrousel__container",
        pagination: true
    }
    var carrousels = document.getElementsByClassName(classCarrousel);
    for (var i = 0; i < carrousels.length; i+=1) {
        new Carrousel(carrousels[i], params);
    }
})