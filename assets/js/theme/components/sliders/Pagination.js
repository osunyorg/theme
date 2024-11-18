window.osuny = window.osuny || {};

window.osuny.SliderPagination = function (slider) {
    this.slider = slider;
    this.items = [];
    this.buttons = [];
    this.container = document.createElement('ul');
    this.container.classList.add('slider-pagination');
    this.slider.controls.appendChild(this.container);
    this.create();
};

window.osuny.SliderPagination.prototype.create = function () {
    var i;
    for (i = 0; i < this.slider.slides.length; i += 1) {
        this.createButton(i);
    }
};

window.osuny.SliderPagination.prototype.createButton = function (index) {
    var item = document.createElement('li'),
        button = document.createElement('button');

    item.appendChild(button);

    this.container.appendChild(item);
    this.buttons.push(button);
    this.items.push(item);

    button.addEventListener('click', this.onClick.bind(this, index));
};

window.osuny.SliderPagination.prototype.onClick = function (index) {
    this.slider.goTo(index);
};

window.osuny.SliderPagination.prototype.update = function () {
    var action;
    this.items.forEach(function (item, index) {
        action = index === this.slider.state.index ? 'add' : 'remove';
        item.classList[action]('is-current');
    }.bind(this));
};
