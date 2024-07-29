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
    this.initialize();
}
window.osuny.carousel.Slider.prototype = {
    initialize: function () {
        this.index = 0;
        this.slides = [];
        this.deltaPosition = 0;
        this.position = 0;
        this.loadSlidesFromDom();
        this.showSlide(this.index);
    },
    nextSlide: function () {
        this.showSlide(this.indexOfSlideAt(1));
    },
    previousSlide: function () {
        this.showSlide(this.indexOfSlideAt(-1));
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
        this.deltaPosition -= (this.deltaPosition - delta);
        this.translate(true);

        // On met à jour le slide current 
        this.index = this.indexOfSlideAt(offset);

        //On met à jour l'état de l'instance
        this.instance.onSlideChanged();
    },
    loadSlidesFromDom: function () {
        var slidesContainers = this.container.children;
        var sliderContainer;
        for (var i = 0; i < slidesContainers.length; i += 1) {
            sliderContainer = slidesContainers.item(i);
            sliderContainer.setAttribute("id", "slide__" + i);
            this.slides.push(new window.osuny.carousel.Slide(slidesContainers.item(i)));
        }
        this.translate(true);
    },
    translate: function (transition = false) {
        this.position += this.deltaPosition;
        var timeTransition = 0;
        this.deltaPosition = 0;
        if (transition === true) {
            timeTransition = this.transition_duration;
        }
        this.instance.container.style.setProperty('transition', 'left ' + String(timeTransition) + 'ms');
        this.instance.container.style.setProperty('left', this.position + "px");
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
    }
}

window.osuny.carousel.Slide = function (container) {
    this.size;
    this.container = container;
    this.initialize();
}

window.osuny.carousel.Slide.prototype = {
    initialize: function () {
        this.computeSize();
    },
    computeSize: function () {
        var style = getComputedStyle(this.container);
        this.size = this.container.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }
}