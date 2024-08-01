window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Slider = function Slider(element) {
    this.element = element;
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
        this._loadSlidesFromDom();
        // this.drag = window.osuny.utils.instanciateIf(this, window.osuny.carousel.Drag, this.carousel.options.drag);
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
        //On previent l'carousel
        // this.carousel.onSlideChanged();
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
    _loadSlidesFromDom: function () {
        var slidesContainers = this.element.children;
        for (var i = 0; i < slidesContainers.length; i += 1) {
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
            position.left -= this.slides[i].width;
        }
        position.right = position.left - this.slides[index].width;
        position.center = (position.right + position.left) / 2;
        return position
    },
    translate: function (transition = false) {
        this.position += this.deltaPosition;
        var transitionDuration = transition === true ? this.transitionDuration : 0;
        this.deltaPosition = 0;
        // Pourquoi ne pas mettre la transition purement en CSS, et le retirer complètement du JS ?
        this.element.style.setProperty('transition', 'left ' + String(transitionDuration) + 'ms');
        this.element.style.setProperty('left', this.position + "px");

    },
    width: function () {
        var width = 0;
        this.slides.forEach(slide => {
            width += slide.width;
        });
        return width;
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
            slidesPosition.sup = slidesPosition.inf - this.slides[i].width;
            if (this.position < slidesPosition.inf && this.position > slidesPosition.sup) {
                slideIndex = i;
                this.deltaPosition = slidesPosition.inf - this.position;
                break;
            }
        }
        return slideIndex;
    }
}