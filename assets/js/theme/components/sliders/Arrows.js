import { setButtonEnability } from '../../utils/a11y';

window.osuny = window.osuny || {};

window.osuny.SliderArrows = function (slider) {
    this.slider = slider;
    this.container = document.createElement('div');
    this.container.classList.add('slider-arrows');
    this.previous = this.create('previous');
    this.next = this.create('next');
    this.slider.container.appendChild(this.container);

    if (this.slider.options.progression) {
        this.addProgression();
    }

    this.listen();
};

window.osuny.SliderArrows.prototype.create = function (direction) {
    var button = document.createElement('button');
    button.classList.add('slider-arrow', 'slider-arrow-' + direction);
    window.osuny.utils.insertSROnly(button, window.osuny.i18n.slider[direction]);
    this.container.appendChild(button);
    return button;
};

window.osuny.SliderArrows.prototype.listen = function () {
    this.previous.addEventListener('click', this.slider.previous.bind(this.slider));
    this.next.addEventListener('click', this.slider.next.bind(this.slider));
};

window.osuny.SliderArrows.prototype.update = function () {
    setButtonEnability(this.previous, !this.slider.state.isFirst);
    setButtonEnability(this.next, !this.slider.state.isLast);
    if (this.progression) {
        this.progression.innerText = this.slider.state.index + 1 + '/' + this.slider.slides.length;
    }
};

window.osuny.SliderArrows.prototype.addProgression = function () {
    this.progression = document.createElement('div');
    this.progression.classList.add('slider-progression');
    this.next.before(this.progression);
};
