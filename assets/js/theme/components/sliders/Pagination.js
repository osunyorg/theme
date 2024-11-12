window.osuny = window.osuny || {};

window.osuny.SliderPagination = function (slider) {
    this.slider = slider;
    this.buttons = [];
    this.container = document.createElement('div');
    this.container.classList.add('slider-pagination');
    this.slider.container.appendChild(this.container);
    this.create();
};

window.osuny.SliderPagination.prototype.create = function () {
    var i;
    for (i = 0; i < this.slider.slides.length; i += 1) {
        this.createButton(i);
    }
};

window.osuny.SliderPagination.prototype.createButton = function (index) {
    var button = document.createElement('button');
    button.classList.add('slider-pagination-item');
    this.buttons.push(button);
    this.container.appendChild(button);
    button.addEventListener('click', this.onClick.bind(this, index));
};

window.osuny.SliderPagination.prototype.onClick = function (index) {
    this.slider.goTo(index);
};

window.osuny.SliderPagination.prototype.update = function () {
    this.buttons[this.slider.state.index].classList.add('is-current');
};
