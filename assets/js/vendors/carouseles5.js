window.addEventListener("load", function(){
    var classCaroussel = "caroussel";
    var classContainer = "caroussel-container";
    //todo params 
    var params = {
        arrows: true,
        pagination: true,
        autoWidth: true,
        autoHeight: true,
        loop: true,
        rewind: false,
        autoplay: false,
        pauseOnHover: false,
        pauseOnFocus: true,
        interval: 8000
    }

    Carrousel = function Carrousel(element) {
        this.elem = element; // check type dom element
        this.width =  element.offsetWidth;
        this.height = element.offsetHeight;
        this.delta = 0;
        this.offset = 0;
        this.track = {
            elem: this.elem.getElementsByClassName(classContainer).item(0),
            pos : 0,
            n : 0
        };
        this.track.len = this.track.elem.children.length;
        this.track.width = this.track.elem.offsetWidth;
        this.elements = [];
        this.transitionDuration = 0;
        this.loop = true;
        this.ready = false;
        this.drag = {
            posx: null,
            startpos: null,
            target: 0,
            delta: 0
        }
        this.init();
    }

    Carrousel.prototype.init = function init(){
        // Je récupere la durée de transition specifiée dans le css
        var d = getComputedStyle(this.track.elem).transitionDuration;
        if(d.split("ms").length > 1){
            this.transitionDuration = parseInt(d.split("ms")[0]);
        }else if(d.split("s").length > 1){
            this.transitionDuration = parseInt(parseFloat(d.split("s")[0]) * 1000);
        }
        
        var childrenAsArray = Array.from(this.track.elem.children);
        for(var i = 0; i < childrenAsArray.length; i++){
            var e = this.track.elem.children.item(i)
            var style = getComputedStyle(e);
            var el = {};
            el.width = e.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
            el.element = e;
            el.id = i;
            this.elements.push(el);
            this.track.elem.appendChild(e.cloneNode(true));
        }
        
        this.track.pos -= this.track.width; // initialisation de la position du track
        this.updatePos();
        
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
        
        // dragdrop si option
        this.initDrag();
        this.ready = true;
        return this;
    }
    
    Carrousel.prototype.initDrag = function initDrag(){
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
        }.bind(this));

        window.addEventListener('mouseleave', function(e){
            this.track.elem.removeEventListener('mousemove', dd);
            this.move(this.drag.target);
            this.drag.posx = null;
            this.drag.startpos = null;
            this.drag.delta = 0;
        }.bind(this));
    }

    Carrousel.prototype.onDrag = function onDrag(e){
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
        this.track.pos += this.delta;
        this.delta = 0;
        this.track.elem.style.setProperty('transition', 'left ' + String(this.transitionDuration) + 'ms ');
        this.track.elem.style.setProperty('left', this.track.pos + "px");
    }

    Carrousel.prototype.elementAt = function elementAt(i){
        return ((this.track.n + i) % this.track.len + this.track.len) % this.track.len;
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
            this.delta += elemswidth - (this.drag.delta);
            this.track.n = this.elementAt(target);
            this.slide();
        }
    }

    var caroussels = document.getElementsByClassName(classCaroussel);
    var ncaroussels = caroussels.length;
    var caroussel = new Carrousel(caroussels.item(0), params);

    document.addEventListener("keydown", function(event) {
        if(event.code === "ArrowLeft"){
            caroussel.move(-1);
        }
        else if(event.code === "ArrowRight"){
            caroussel.move(1);
        }
    }.bind(caroussel));


})