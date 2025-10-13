import { isMobile } from '../../utils/breakpoints';

var osuny = window.osuny || {};
osuny.SlidersFactory = osuny.SlidersFactory || {};
osuny.lightbox = osuny.lightbox || {};

osuny.SlidersFactory = function () {
    this.sliders = [];
    this.activeSlider = null;

    document.querySelectorAll('[data-slider]').forEach(this.create.bind(this));

    this.activate();
    this.listen();
};

osuny.SlidersFactory.prototype.create = function (element, index) {
    var titleId;

    // Check if carousel as more than one slide
    if (element.children.length > 1) {
        titleId = this.getTitleId(element, index);
        this.sliders.push(new osuny.Slider(element, titleId));
    }
};

osuny.SlidersFactory.prototype.activate = function () {
    this.sliders.forEach(function (slider, index) {
        if (!slider.options.disable) {
            slider.init();
        } else {
            this.checkDisableCondition(slider, index);
        }
    }.bind(this));
};

osuny.SlidersFactory.prototype.checkDisableCondition = function (slider, index) {
    if (slider.options.disable.mobile && !isMobile()) {
        slider.init();
    } else {
        this.sliders.splice(index, 1);
    }
};

osuny.SlidersFactory.prototype.getTitleId = function (element, index) {
    var titleElement,
        block = element.closest('.block-titled'),
        blockTitle;

    if (block) {
        blockTitle = block.querySelector('.block-title');
    }

    if (blockTitle) {
        titleElement = blockTitle;
    } else {
        titleElement = this.createDefaultTitle(element, index);
        element.parentElement.prepend(titleElement);
    }

    titleElement.id = 'slider-title-' + index;

    return titleElement.id;
};

osuny.SlidersFactory.prototype.createDefaultTitle = function (element, index) {
    var titleElement = document.createElement('p');
    titleElement.innerText = osuny.i18n.slider.default_title + ' ' + index;
    titleElement.classList.add('sr-only');

    return titleElement;
};

osuny.SlidersFactory.prototype.listen = function () {
    window.addEventListener('scroll', this.onScroll.bind(this));
    window.addEventListener('keydown', this.onKeydown.bind(this));
};

osuny.SlidersFactory.prototype.onKeydown = function (event) {
    if (osuny.lightbox.isOpen()) {
        return;
    }
    if (this.activeSlider && event.key === 'ArrowLeft') {
        this.activeSlider.previous();
    } else if (this.activeSlider && event.key === 'ArrowRight') {
        this.activeSlider.next();
    }
};

osuny.SlidersFactory.prototype.onScroll = function () {
    var slider,
        bounding;
    this.activeSlider = null;
    for (slider of this.sliders) {
        bounding = slider.container.getBoundingClientRect();
        if (bounding.top <= innerHeight * 0.75 && bounding.top > 0) {
            this.activeSlider = slider;
        }
    }
};

osuny.slidersFactory = new osuny.SlidersFactory();
