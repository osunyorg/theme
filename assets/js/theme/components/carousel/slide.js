window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

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
