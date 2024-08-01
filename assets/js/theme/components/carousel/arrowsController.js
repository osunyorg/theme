window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.ArrowsController = function (instance) {
    this.instance = instance;
    this.slider = this.instance.slider;
    this.container = null;
    this.carouselLength = this.slider.length();
    this.arrows = {};
    this.counter = null;
    this.initialize();
}

window.osuny.carousel.ArrowsController.prototype = {
    classes: {
        container: "carousel__arrows",
        arrowPrev: "arrow-prev",
        arrowNext: "arrow-next",
        counter: "counter"
    },

    initialize: function () {
        this.findElements();
        this.updateCounter();
        this.updateArrowsState();
        this.initListeners();
    },
    findElements: function () {
        this.container = this.instance.root.getElementsByClassName(this.classes.container).item(0);
        this.arrows.prev = this.container.getElementsByClassName(this.classes.arrowPrev).item(0);
        this.arrows.next = this.container.getElementsByClassName(this.classes.arrowNext).item(0);
        this.counter = this.container.getElementsByClassName(this.classes.counter).item(0);
    },
    initListeners: function () {
        this.arrows.next.addEventListener("click", this.slider.nextSlide.bind(this.slider));
        this.arrows.prev.addEventListener("click", this.slider.previousSlide.bind(this.slider));
    },
    onSlideChanged: function () {
        this.updateArrowsState();
        this.updateCounter();
    },
    updateCounter: function () {
        this.counter.innerHTML = String(this.slider.index + 1) + '/' + String(this.slider.length());
    },
    updateArrowsState: function () {
        this.arrows.prev.disabled = (this.slider.index == 0);
        this.arrows.next.disabled = (this.slider.index == this.slider.length() - 1);
    }
}