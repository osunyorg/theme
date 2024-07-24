if (!window.osuny) {
    window.osuny = {};
}

if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}
window.osuny.carousel.Slider = function Slider(instance) {
    this.instance = instance;
    this.index = 0;
    this.offset = 0;
    this.slides = [];
    this.deltaPosition = 0;
    this.position = 0;
    this.initialize();
}

window.osuny.carousel.Slider.prototype = {
    initialize: function () {

        //cleaning clones ( if any)
        var clones = this.instance.container.querySelectorAll(":scope > .clone");
        for (var i = 0; i < clones.length; i += 1) {
            this.instance.container.removeChild(clones[i]);
        }

        // Adding new clones
        var domElement;
        var childrenAsArray = Array.from(this.instance.container.children);
        for (var i = 0; i < childrenAsArray.length; i++) {
            domElement = childrenAsArray[i];
            domElement.setAttribute("id", "slide__" + i);

            var clone = domElement.cloneNode(true);
            clone.classList.add("clone");
            clone.setAttribute("id", "slide__clone__" + i);
            this.instance.container.appendChild(clone); // ajout d'une copie a la fin
        }

        this.updateElements();
        this.translate(-this.size(), 500);

        var slideTranslationFinished = this.slideTranslationFinished.bind(this);

        this.instance.container.addEventListener('transitionend', function (e) {
            if (e.propertyName == "left") {
                slideTranslationFinished();
            }
        });
    },
    nextSlide: function () {
        this.showSlide(this.index + 1);
    },
    previousSlide: function () {
        this.showSlide(this.index - 1)
    },
    showSlide: function (index) {
        var offset = index - this.index;
        var delta = 0; // distance à parcourir
        var sign = Math.sign(offset); // direction positive ou negative 
        // on parcours le nombre de slide à déplacer
        for (var i = 0; i < Math.abs(offset); i += 1) {
            // on ajoute ( ou soustrait en fonction du signe), la taille de chacun des slide
            delta -= sign * this.slideAt(offset - (sign > 0) - sign * i).size;
        }

        // On active l'animation
        this.translate(delta, this.instance.options.transition_duration);

        // pour l'instant on a pas bougé, on ajoute le decalage au décalage eventuel ( ou 0)
        this.offset += offset;

        // On met à jour le slide current 
        this.index = this.indexOfSlideAt(offset);
    },
    translate: function (delta, transition = 0) {
        this.deltaPosition = delta - this.deltaPosition;
        this.position += this.deltaPosition;
        this.deltaPosition = 0;
        this.instance.container.style.setProperty('transition', 'left ' + String(transition) + 'ms');
        this.instance.container.style.setProperty('left', this.position + "px");
    },
    slideTranslationFinished: function () {
        if (this.offset > 0) {
            for (var i = 0; i < this.offset; i++) {
                this.putFirstASlideAtEnd();
            }
        } else if (this.offset < 0) {
            for (var i = 0; i < Math.abs(this.offset); i++) {
                this.putLastSlideAtbegining();
            }
        }
        this.offset = 0;
    },
    putFirstASlideAtEnd: function () {
        var container = this.instance.container;
        var travellingSlide = container.children.item(0);
        var travellingSlideId = parseInt(travellingSlide.getAttribute("id").slice(-1));
        var travellingSlideWidth = this.slides[travellingSlideId].size;
        this.translate(travellingSlideWidth);
        container.append(container.removeChild(travellingSlide));
    },
    putLastSlideAtbegining: function () {
        var container = this.instance.container;
        var travellingSlide = container.children.item(container.children.length - 1)
        var travellingSlideId = parseInt(travellingSlide.getAttribute("id").slice(-1));
        var travellingSlideWidth = -this.slides[travellingSlideId].size;
        this.translate(travellingSlideWidth);
        container.prepend(container.removeChild(travellingSlide));
    },
    slideAt: function (offset) {
        var index = this.indexOfSlideAt(offset);
        return this.slides[index];
    },

    indexOfSlideAt: function (offset) {
        // returns the index of the slide located at the distance "offset" from current slide
        var trackLen = this.slides.length;
        return ((this.index + offset) % trackLen + trackLen) % trackLen;
    },
    updateElements: function () {
        this.slides = [];
        var elems = this.instance.container.querySelectorAll(":scope > :not(.clone)");
        for (var i = 0; i < elems.length; i += 1) {
            this.slides.push({
                dom: elems[i],
                size: this.computeElementWidth(elems[i])
            });
        }
    },
    size: function () {
        var size = 0;
        for (var i = 0; i < this.slides.length; i++) {
            size += this.slides[i].size;
        }
        return size;
    },
    computeElementWidth: function (domElement) {
        var style = getComputedStyle(domElement);
        var width = domElement.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        return width
    },
    computeElementsWidth: function (domElements) {
        var width = 0;
        for (var i = 0; i < domElements.length; i += 1) {
            width += this.computeElementWidth(domElements[i])
        }
        return width;
    }
}