window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Slider = function Slider(element) {
    this.element = element;
    this.transitionDuration = 0;
    this.index = 0;
    this.slides = [];
    this.deltaPosition = 0;
    this.position = 0;
    this.drag = null;
    var slidesContainers = this.element.children;
    for (var i = 0; i < slidesContainers.length; i += 1) {
        this.slides.push(new window.osuny.carousel.Slide(this, slidesContainers.item(i), i));
    }
    this.showSlide(this.index);
}
window.osuny.carousel.Slider.prototype = {
    showSlide: function (index) {
        this.index = index;
        this.deltaPosition -= this.position - this._positionOfSlide(this.index).left;
        this._translate();
        this._updateSlidesClasses();
    },
    recompute: function(){
        this.slides.forEach(function(slide) {
            slide.computeWidth();
        });
        this.showSlide(this.index);
    },
    length: function () {
        return this.slides.length;
    },
    _positionOfSlide: function (index) {
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
    _translate: function () {
        this.position += this.deltaPosition;
        this.deltaPosition = 0;
        this.element.style.setProperty('transition', 'left ' + String(this.transitionDuration) + 'ms');
        this.element.style.setProperty('left', this.position + "px");

    },
    _updateSlidesClasses: function () {
        this.slides.forEach(function(slide) {
            slide.setClasses();
        });
    }
}