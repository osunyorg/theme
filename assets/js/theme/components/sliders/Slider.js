/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};

window.osuny.Slider = function (element) {
    this.element = element;
    this.setOptions();
    this.setup();
    window.slider = this;
};

window.osuny.Slider.prototype.state = {
    active: false,
    index: 0,
    isFirst: true,
    isLast: false
};

window.osuny.Slider.prototype.options = {
    // Add previous and next arrows
    arrows: true,
    // Enable autoplay
    autoplay: false,
    // Autoplay delay
    interval: 2000,
    // Add navigation dots
    pagination: false,
    // Add current progression and slides length
    progression: false
};

window.osuny.Slider.prototype.setOptions = function () {
    var data = this.element.getAttribute('data-slider'),
        key;
    data = JSON.parse(data);

    for (key in this.options) {
        this.options[key] = data[key] || this.options[key];
    }
};

window.osuny.Slider.prototype.setup = function () {
    this.element.classList.add('slider');

    // Create track
    this.track = document.createElement('div');
    this.track.classList.add('slider-track');

    // Create list
    this.list = document.createElement('div');
    this.list.classList.add('slider-list');

    // Append slides to list
    Array.prototype.slice.call(this.element.children).forEach(function (slide) {
        slide.classList.add('slider-slide');
        this.list.append(slide);
    }.bind(this));

    this.slides = this.list.querySelectorAll('.slider-slide');
    this.track.append(this.list);
    this.element.append(this.track);

    if (this.options.arrows) {
        this.arrows = new window.osuny.SliderArrows(this);
    }
};

window.osuny.Slider.prototype.next = function () {
    if (!this.state.isLast) {
        this.goTo(this.state.index + 1);
    }
};

window.osuny.Slider.prototype.previous = function () {
    if (!this.state.isFirst) {
        this.goTo(this.state.index - 1);
    }
};

window.osuny.Slider.prototype.goTo = function (index) {
    this.state.index = index;
    this.state.isFirst = this.state.index === 0;
    this.state.isLast = this.state.index === this.slides.length - 1;

    this.translate();
    this.update();
};

window.osuny.Slider.prototype.update = function () {
    this.slides.forEach(function (slide, index) {
        slide.classList.remove('is-current', 'is-visible', 'is-next', 'is-previous');
        if (index < this.state.index) {
            slide.classList.add('is-previous');
        } else if (index === this.state.index) {
            slide.classList.add('is-current');
        } else {
            slide.classList.add('is-next');
        }
    }.bind(this));

    if (this.arrows) {
        this.arrows.update();
    }
};

window.osuny.Slider.prototype.translate = function () {
    this.list.style.transform = 'translateX(' + -this.slides[this.state.index].offsetLeft + 'px)';
};

// window.osuny.Slider.prototype._listen = function () {
//     this.elements.previousButton.addEventListener('click', this.goTo.bind(this, 'previous'));
//     this.elements.nextButton.addEventListener('click', this.goTo.bind(this, 'next'));

//     window.addEventListener('keydown', function (event) {
//         if (this.state.active && event.key === 'ArrowLeft') {
//             this.goTo('previous');
//         } else if (this.state.active && event.key === 'ArrowRight') {
//             this.goTo('next');
//         }
//     }.bind(this));
// };