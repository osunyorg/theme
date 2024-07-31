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
        this.drag = window.osuny.utils.instanciateIf(this, window.osuny.carousel.Drag, this.instance.options.drag);
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
        this.index = this.indexOfSlideAt(index - this.index);
        this.deltaPosition -= this.position - this.positionOfSlide(this.index).left;
        this.translate(true);
        this.updateSlidesClasses();
        //On previent l'instance
        this.instance.onSlideChanged();
    },
    recomputePosition: function () {
        var threshold = 100;
        var currentslidePosition = this.positionOfSlide(this.index).left;
        var index = this.index;
        if (this.position < (currentslidePosition - threshold)) {
            index = this.indexOfSlideAt(1);
        } else if (this.position > (currentslidePosition + threshold)) {
            index = this.indexOfSlideAt(-1);
        }
        this.showSlide(index);
    },
    loadSlidesFromDom: function () {
        var slidesContainers = this.container.children;
        var sliderContainer;
        for (var i = 0; i < slidesContainers.length; i += 1) {
            sliderContainer = slidesContainers.item(i);
            this.slides.push(new window.osuny.carousel.Slide(this, slidesContainers.item(i), i));
        }
        this.translate(true);
    },
    positionOfSlide: function (index) {
        var position = {
            left: 0,
            right: 0,
            center: 0
        };
        for (var i = 0; i < index; i += 1) {
            position.left -= this.slides[i].size;
        }
        position.right = position.left - this.slides[index].size;
        position.center = (position.right + position.left) / 2;
        return position
    },
    translate: function (transition = false) {
        this.position += this.deltaPosition;
        var transition_duration = transition === true ? this.transition_duration : 0;
        this.deltaPosition = 0;
        this.instance.container.style.setProperty('transition', 'left ' + String(transition_duration) + 'ms');
        this.instance.container.style.setProperty('left', this.position + "px");

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
                break;
            }
        }
        return slideIndex;
    }
}