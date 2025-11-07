import 'intersection-observer';
import { isReducedMotionPrefered } from '../utils/isReducedMotionPrefered';
import '../utils/number';
window.osuny = window.osuny || {};

// Compatibilities
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var OPTIONS = {
    // in ms
    DURATION: 2000
};

window.osuny.KeyFigures = function (element) {
    this.element = element;
    this.time = 0;
    this.isAnimated = this.element.classList.contains('is-animated');
    this.init();
};

window.osuny.KeyFigures.prototype.init = function () {
    var target = 0;
    this.figures = this.element.querySelectorAll('strong');
    this.targets = [];
    this.values = [];
    this.figures.forEach( function (figure) {
        target = parseFloat(figure.innerHTML, 10);
        this.values.push(0);
        this.targets.push(target);
        figure.innerText = this.formatValue(target);
    }.bind(this));

    // Show format value if reduced motion
    if (this.isAnimated && !isReducedMotionPrefered()) {
        this.intersectionObserver = new IntersectionObserver(this.observe.bind(this));
        this.intersectionObserver.POLL_INTERVAL = 100;
        this.intersectionObserver.observe(this.element);
    }

    this.resize();
    this.listen();
};

window.osuny.KeyFigures.prototype.listen = function () {
    window.addEventListener('resize', this.resize.bind(this));
};

window.osuny.KeyFigures.prototype.observe = function (entries) {
    entries.forEach( function (entry) {
        if (entry.isIntersecting) {
            this.play();
        }
    }.bind(this));
};

window.osuny.KeyFigures.prototype.play = function () {
    this.intersectionObserver.unobserve(this.element);
    this.start = new Date().getTime();
    this.loop();
};

window.osuny.KeyFigures.prototype.loop = function () {
    this.time = Math.min(new Date().getTime() - this.start, OPTIONS.DURATION);

    this.figures.forEach( function (figure, index) {
        this.values[index] = this.getValues(this.time, 0, this.targets[index], OPTIONS.DURATION);
        figure.innerHTML = this.formatValue(parseFloat(this.values[index], 10));
    }.bind(this));

    if (this.time < OPTIONS.DURATION) {
        window.requestAnimationFrame(this.loop.bind(this));
    } else {
        this.onEnded();
    }
};

window.osuny.KeyFigures.prototype.getValues = function (time, from, to, duration) {
    var decimalsLength = to.decimals(),
        value = window.osuny.KeyFigures.easeOutQuad(time, from, to, duration);
    if (decimalsLength) {
        value = Math.round(value * decimalsLength * 10) / (decimalsLength * 10);
    } else {
        value = Math.round(value);
    }
    return value.toFixed(decimalsLength);
};

window.osuny.KeyFigures.prototype.formatValue = function (value, separator = ' ') {
    return value.toLocaleString('en').replace(/,/g, separator);
};

window.osuny.KeyFigures.prototype.onEnded = function() {
    this.figures.forEach( function (figure, index) {
        figure.innerHTML = this.formatValue(this.targets[index]);
    }.bind(this));
};

window.osuny.KeyFigures.prototype.resize = function () {
    this.figures.forEach( function (figure) {
        figure.style.minWidth = 0;
        figure.style.minWidth = figure.offsetWidth + 'px';
    });
};

window.osuny.KeyFigures.easeInOutQuart = function (t, b, c, d) {
    if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t + b;
    } else {
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    }
};

window.osuny.KeyFigures.easeOutQuad = function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
};

window.osuny.page.registerComponent({
    name: 'keyFigures',
    selector: '.block-key_figures',
    klass: window.osuny.KeyFigures
});
