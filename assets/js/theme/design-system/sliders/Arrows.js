import { setButtonEnability } from '../../utils/a11y';

var osuny = window.osuny || {};

osuny.SliderArrows = function (slider) {
    this.slider = slider;
    this.container = document.createElement('div');
    this.container.classList.add('slider-arrows');
    this.previous = this.create('previous');
    this.next = this.create('next');
    this.slider.container.appendChild(this.container);

    if (this.slider.options.progression) {
        this.addProgression();
        // mettre un p au lieu d'un div
        //<p>2<span class="sr-only"> sur </span><span aria-hidden="true">/</span>4</p>
    }

    this.listen();
};

osuny.SliderArrows.prototype.create = function (direction) {
    var button = document.createElement('button');
    button.classList.add('slider-arrow', 'slider-arrow-' + direction);
    button.setAttribute('aria-describedby', this.slider.titleId);
    osuny.utils.insertSROnly(button, osuny.i18n.slider[direction]);
    this.container.appendChild(button);
    return button;
};

osuny.SliderArrows.prototype.listen = function () {
    this.previous.addEventListener('click', this.slider.previous.bind(this.slider));
    this.next.addEventListener('click', this.slider.next.bind(this.slider));
};

osuny.SliderArrows.prototype.update = function () {
    setButtonEnability(this.previous, !this.slider.state.isFirst);
    setButtonEnability(this.next, !this.slider.state.isLast);
    if (this.progression) {
        this.updateProgression();
    }
};

osuny.SliderArrows.prototype.updateProgression = function () {
    this.progression.innerText = this.slider.state.index + 1 + '<span class="sr-only"> sur </span><span aria-hidden="true">/</span>' + this.slider.slides.length;
};

osuny.SliderArrows.prototype.addProgression = function () {
    this.progression = document.createElement('p');
    this.progression.classList.add('slider-progression');
    this.next.before(this.progression);
};
