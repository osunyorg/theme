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
        isBefore: 'is-before',
        isPrevious: 'is-previous',
        isCurrent: 'is-current',
        isNext: 'is-next',
        isAfter: 'is-after'
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
        this.setState('isBefore');
        this.setState('isPrevious');
        this.setState('isCurrent');
        this.setState('isNext');
        this.setState('isAfter');
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
    setState: function (state) {
        var className = this.htmlClasses[state],
            // Appel de la fonction this.isBefore()
            active = this[state]();
        if (active) {
            this.classList.add(className);
        } else {
            this.classList.remove(className);
        }
    }
}
