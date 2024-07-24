if (!window.osuny) {
    window.osuny = {};
}

if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}
window.osuny.carousel.Slider = function Slider(container) {
    this.domElement = container;
    // this.domElement.addEventListener('transitionend', function (e) {
    //     if (e.propertyName == "left") {
    //         this.onTransitioned();
    //     }
    // });
    this.init();
}

window.osuny.carousel.Slider.prototype.init = function () {
    this.current = 0;
    this.position = 0;
    this.elements = [];
    this.delta = 0;

    //cleaning clones ( if any)
    var clones = this.domElement.querySelectorAll(":scope > .clone");
    for (var i = 0; i < clones.length; i += 1) {
        this.domElement.removeChild(clones[i]);
    }

    // Adding new clones
    var domElement;
    var childrenAsArray = Array.from(this.domElement.children);
    for (var i = 0; i < childrenAsArray.length; i++) {
        domElement = childrenAsArray[i];
        domElement.setAttribute("id", "slide__" + i);

        var clone = domElement.cloneNode(true);
        clone.classList.add("clone");
        clone.setAttribute("id", "slide__clone__" + i);
        this.domElement.appendChild(clone); // ajout d'une copie a la fin
    }

    this.updateElements();
    this.translate(-this.size(), 500);

    // var onTransitioned = this.onTransitioned.bind(this);
}

window.osuny.carousel.Slider.prototype.updateElements = function () {
    this.elements = [];
    var elems = this.domElement.querySelectorAll(":scope > :not(.clone)");
    for (var i = 0; i < elems.length; i += 1) {
        this.elements.push({
            dom: elems[i],
            size: this.computeElementWidth(elems[i])
        });
    }
};

window.osuny.carousel.Slider.prototype.translate = function (delta, transition = 0) {
    // on enregistre également la distance à parcourir
    // si le delta n'était pas à 0 on le soustrait à la distance à parcourir
    this.delta = delta - this.delta;
    this.position += this.delta;
    this.delta = 0;
    this.domElement.style.setProperty('transition', 'left ' + String(transition) + 'ms');
    this.domElement.style.setProperty('left', this.position + "px");
}

window.osuny.carousel.Slider.prototype.putFirstAtEnd = function () {
    var traveller = this.domElement.children.item(0);
    var travellerId = parseInt(traveller.getAttribute("id").slice(-1));
    var width = this.element(travellerId).size;
    this.translate(width);
    this.domElement.append(this.domElement.removeChild(traveller));
};

window.osuny.carousel.Slider.prototype.putLastAtbegining = function () {
    var traveller = this.domElement.children.item(this.domElement.children.length - 1)
    var travellerId = parseInt(traveller.getAttribute("id").slice(-1));
    var width = -this.element(travellerId).size;
    this.translate(width);
    this.domElement.prepend(this.domElement.removeChild(traveller));
};

// ACCESSORS
window.osuny.carousel.Slider.prototype.currentSlide = function () {
    return this.current;
}

window.osuny.carousel.Slider.prototype.getPosition = function () {
    return this.position;
};

window.osuny.carousel.Slider.prototype.element = function (index) { //element {dom, size} (hors clone à l'index index)
    var elements = this.elements;
    return elements[index];
};

window.osuny.carousel.Slider.prototype.elementAt = function (offset) {
    var index = this.numElementAt(offset);
    return this.elements[index];
};

window.osuny.carousel.Slider.prototype.size = function () {
    var size = 0;
    for (var i = 0; i < this.elements.length; i++) {
        size += this.elements[i].size;
    }
    return size;
};

window.osuny.carousel.Slider.prototype.computeElementWidth = function (dom) {
    var style = getComputedStyle(dom);
    var width = dom.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    return width
};

window.osuny.carousel.Slider.prototype.computeElementsWidth = function (domElems) {
    var width = 0;
    for (var i = 0; i < domElems.length; i += 1) {
        width += this.computeElementWidth(domElems[i])
    }
    return width;
};

window.osuny.carousel.Slider.prototype.updateCurrent = function (offset) {
    this.current = this.numElementAt(offset);
};

window.osuny.carousel.Slider.prototype.numElementAt = function (offset) {
    // returns the index of the slide located at the distance "offset" from current slide
    var trackLen = this.elements.length;
    return ((this.current + offset) % trackLen + trackLen) % trackLen;
};

window.osuny.carousel.Slider.prototype.updateDom = function () {
    /// WIP 
    var currentPosition = 0;
    var slideNumber = parseInt(this.domElement.children.item(0).getAttribute("id").slice(-1));

    var offset = 
    for (var i = 0; i < this.domElement.children.length; i += 1) {
        var slideNumber = parseInt(this.domElement.children.item(i).getAttribute("id").slice(-1));
        if(slideNumber != this.current){
            currentPosition += 1;
        }else{
            break;
        }
    }
    var thereticalPostion = this.elements.length + 1;
    console.log(thereticalPostion, currentPosition)
    var offset = currentPosition - thereticalPostion;
};