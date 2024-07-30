window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Slider = function Slider(instance) {
    this.instance = instance;
    this.container = this.instance.container;
    this.transition_duration = this.instance.options.transition_duration;
    this.index = 0;
    this.slides = [];
    this.deltaPosition = 0;
    this.position = 0;
    this.drag = null;
    this.initialize();
}
window.osuny.carousel.Slider.prototype = {
    initialize: function () {
        this.index = 0;
        this.slides = [];
        this.deltaPosition = 0;
        this.position = 0;
        this.loadSlidesFromDom();
        if (this.instance.options.drag) {
            this.drag = new window.osuny.carousel.Drag(this);
        }
        this.showSlide(this.index);
        this.updateSlidesClasses();
    },
    nextSlide: function () {
        this.showSlide(this.indexOfSlideAt(1));
    },
    previousSlide: function () {
        this.showSlide(this.indexOfSlideAt(-1));
    },
    showSlide: function (index) {
        var offset = index - this.index;
        var delta = 0;
        var sign = Math.sign(offset); // direction positive ou negative 
        // on parcours le nombre de slide à déplacer
        for (var i = 0; i < Math.abs(offset); i += 1) {
            // on ajoute ( ou soustrait en fonction du signe), la taille de chacun des slide
            delta -= sign * this.slideAt(offset - (sign > 0) - sign * i).size;
        }
        // On active l'animation
        this.deltaPosition -= (this.deltaPosition - delta);
        console.log(this.deltaPosition)
        this.translate(true);
        // On met à jour le slide current 
        this.index = this.indexOfSlideAt(offset);
        // this.slides[this.index].setCurrent();
        this.updateSlidesClasses();
        //On previent l'instance
        this.instance.onSlideChanged();
    },
    showTargetSlide: function(){
        var index = this.findSlideIndexByPosition();
        this.showSlide(index);
    },
    loadSlidesFromDom: function () {
        var slidesContainers = this.container.children;
        var sliderContainer;
        for (var i = 0; i < slidesContainers.length; i += 1) {
            sliderContainer = slidesContainers.item(i);
            sliderContainer.setAttribute("id", "slide__" + i);
            this.slides.push(new window.osuny.carousel.Slide(this, slidesContainers.item(i), i));
        }
        this.translate(true);
    },
    translate: function (transition = false) {
        var position = this.position + this.deltaPosition;
        if (position <= 0) {
            this.position = position;
            var transition_duration = 0;
            this.deltaPosition = 0;
            if (transition === true) {
                transition_duration = this.transition_duration;
            }
            this.instance.container.style.setProperty('transition', 'left ' + String(transition_duration) + 'ms');
            this.instance.container.style.setProperty('left', this.position + "px");
        }
    },
    size: function () {
        var size = 0;
        this.slides.forEach(slide => {
            size += slide.size;
        });
        return size;
    },
    slideAt: function (offset) {
        var index = this.indexOfSlideAt(offset);
        return this.slides[index];
    },
    length: function () {
        return this.slides.length;
    },
    indexOfSlideAt: function (offset) {
        // returns the index of the slide located at the distance "offset" from current slide
        var sliderLen = this.slides.length;
        return ((this.index + offset) % sliderLen + sliderLen) % sliderLen;
    },
    updateSlidesClasses: function () {
        this.slides.forEach(slide => {
            slide.setClasses();
        });
    },
    findSlideIndexByPosition: function () {
        var slidesPosition = {
            inf: 0,
            sup: 0
        }
        var slideIndex = 0;
        for (var i = 0; i < this.slides.length; i += 1) {
            slidesPosition.inf = slidesPosition.sup;
            slidesPosition.sup = slidesPosition.inf - this.slides[i].size;
            if (this.position < slidesPosition.inf && this.position > slidesPosition.sup) {
                slideIndex = i;
                this.deltaPosition = slidesPosition.inf - this.position;
                console.log(slideIndex)
                break;
            }
        }
        return slideIndex;
    }
}

window.osuny.carousel.Slide = function (slider, container, i) {
    this.size;
    this.container = container;
    this.slider = slider;
    this.initialize();
    this.index = i;
}

window.osuny.carousel.Slide.prototype = {
    initialize: function () {
        this.computeSize();
    },
    computeSize: function () {
        var style = getComputedStyle(this.container);
        this.size = this.container.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    },
    setClasses() {
        this.cleanStateClasses();
        if (this.slider.index == this.index) {
            this.setCurrent();
        }
        if (this.slider.index - 1 == this.index) {
            this.setPrevious();
        }
        if (this.slider.index > this.index) {
            this.setBefore();
        }
        if (this.slider.index + 1 == this.index) {
            this.setNext();
        }
    },
    setCurrent: function () {
        this.container.classList.add('is-current');
    },
    setPrevious: function () {
        this.container.classList.add('is-previous');
    },
    setBefore: function () {
        this.container.classList.add('is-before');
    },
    setNext: function () {
        this.container.classList.add('is-next');
    },
    cleanStateClasses: function () {
        this.container.classList.remove('is-current');
        this.container.classList.remove('is-next');
        this.container.classList.remove('is-previous');
        this.container.classList.remove('is-before');
    }
}

window.osuny.carousel.Drag = function (slider) {
    this.active = false;
    this.initialPosition = 0;
    this.slider = slider;
}
window.osuny.carousel.Drag.prototype = {
    start: function (position) {
        this.active = true;
        this.initialPosition = position;
        console.log("dragStart");
    },
    drag: function (position) {
        var distance = this.initialPosition - position;
        this.slider.deltaPosition -= distance;
        this.slider.translate();
    },
    end: function () {
        this.active = false;
        this.initialPosition = 0;
        this.slider.showTargetSlide();
        console.log("dragEnd");
    }
}
