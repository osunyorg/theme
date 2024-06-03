import 'intersection-observer';
import { isReducedMotionPrefered } from '../utils/isReducedMotionPrefered';
import '../utils/number';

// Compatibilities
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

const OPTIONS = {
    // in ms
    DURATION: 2000
};

class KeyFigures {
    constructor (dom) {
        this.dom = dom;
        this.time = 0;
        this.init();
    }

    init () {
        let target = 0;
        this.figures = this.dom.querySelectorAll('strong');
        this.targets = [];
        this.values = [];
        this.figures.forEach((figure) => {
            target = parseFloat(figure.innerHTML, 10);
            this.values.push(0);
            this.targets.push(target);
            figure.innerText = this.formatValue(target);
        });

        // Show format value if reduced motion
        if (!isReducedMotionPrefered()) {
            this.intersectionObserver = new IntersectionObserver(this.observe.bind(this));
            this.intersectionObserver.POLL_INTERVAL = 100;
            this.intersectionObserver.observe(this.dom);
        }

        this.resize();
        this.listen();
    }

    listen () {
        window.addEventListener('resize', this.resize.bind(this));
    }

    observe (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.play();
            }
        });
    }

    play () {
        this.intersectionObserver.unobserve(this.dom);
        this.start = new Date().getTime();
        this.loop();
    }

    loop () {
        this.time = Math.min(new Date().getTime() - this.start, OPTIONS.DURATION);

        this.figures.forEach((figure, index) => {
            this.values[index] = this.getValues(this.time, 0, this.targets[index], OPTIONS.DURATION);
            figure.innerHTML = this.formatValue(parseFloat(this.values[index], 10));
        });

        if (this.time < OPTIONS.DURATION) {
            window.requestAnimationFrame(this.loop.bind(this));
        } else {
            this.onEnded();
        }
    }

    getValues (time, from, to, duration) {
        const decimalsLength = to.decimals();

        let value = KeyFigures.easeOutQuad(time, from, to, duration);
        if (decimalsLength) {
            value = Math.round(value * decimalsLength * 10) / (decimalsLength * 10);
        } else {
            value = Math.round(value);
        }
        return value.toFixed(decimalsLength);
    }

    formatValue (value, separator = ' ') {
        return value.toLocaleString('en').replace(',', separator);
    }

    onEnded() {
        this.figures.forEach((figure, index) => {
            figure.innerHTML = this.formatValue(this.targets[index]);
        });
    }

    resize () {
        this.figures.forEach((figure) => {
            figure.style.minWidth = 0;
            figure.style.minWidth = figure.offsetWidth + 'px';
        });
    }

    static easeInOutQuart (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        } else {
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    }

    static easeOutQuad (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    }
}

window.addEventListener('load', () => {
    const keyFigures = document.querySelectorAll('.block-key_figures.with-animation');
    keyFigures.forEach((dom) => {
        new KeyFigures(dom);
    });
});


