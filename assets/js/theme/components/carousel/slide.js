window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Slide = function (slider, container, i) {
    this.slider = slider;
    this.container = container;
    this.index = i;
    this.classList = this.container.classList;
    this.computedStyle = null;
    this.width = 0;
    this.initialize();
}

window.osuny.carousel.Slide.prototype = {
    htmlClasses: {
        before: 'is-before',
        previous: 'is-previous',
        current: 'is-current',
        next: 'is-next',
        after: 'is-after'
    },
    initialize: function () {
        // TODO gérer le resize de la page !
        this.computeSize();
    },
    computeSize: function () {
        this.computedStyle = getComputedStyle(this.container);
        this.width = this.container.offsetWidth + parseFloat(this.computedStyle.marginLeft) + parseFloat(this.computedStyle.marginRight);
    },
    setClasses() {
        this.toggleClass(this.htmlClasses.before, this.isBefore());
        this.toggleClass(this.htmlClasses.previous, this.isPrevious());
        this.toggleClass(this.htmlClasses.current, this.isCurrent());
        this.toggleClass(this.htmlClasses.next, this.isNext());
        this.toggleClass(this.htmlClasses.after, this.isAfter());
    },
    isBefore: function () {
        return this.index < this.slider.index;
    },
    isPrevious: function () {
        return this.index == this.slider.index - 1;
    },
    isCurrent: function () {
        return this.index == this.slider.index;
    },
    isNext: function () {
        return this.index == this.slider.index + 1;
    },
    isAfter: function  () {
        return this.index > this.slider.index;
    },
    toggleClass: function (className, active) {
        if (active) {
            this.classList.add(className);
        } else {
            this.classList.remove(className);
        }
    }
}
