import './TouchControl';
import { setButtonEnability, setDefaultAltToImages } from '../utils/a11y';

/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.Lightbox = window.osuny.Lightbox || {};

window.osuny.Lightbox = function () {
    var element = document.getElementById('lightbox');
    window.osuny.Popup.call(this, element);

    this.state.currentData = {};
    this.state.previousData = {};
    this.state.nextData = {};

    this._setup();
    this._listen();
};

window.osuny.Lightbox.prototype = Object.create(window.osuny.Popup.prototype);

window.osuny.Lightbox.prototype._setup = function () {
    this.buttons = document.querySelectorAll('[data-lightbox]');
    this.contentElements = {
        media: this.element.querySelector('#lightbox-media'),
        image: null,
        information: this.element.querySelector('#lightbox-information'),
        informationButton: this.element.querySelector('.lightbox-button-information'),
        credit: this.element.querySelector('#lightbox-credit'),
        creditButton: this.element.querySelector('.lightbox-button-credit'),
        previousButton: this.element.querySelector('.lightbox-button-previous'),
        nextButton: this.element.querySelector('.lightbox-button-next')
    };
    this.touchControl = new window.osuny.TouchControl(this, this.contentElements.media);
    setDefaultAltToImages(this.buttons);
};

window.osuny.Lightbox.prototype._listen = function () {
    window.osuny.Popup.prototype._listen.call(this);

    this.buttons.forEach(function (button, index) {
        button.addEventListener('click', this.open.bind(this, button));
        this._setAriaDescribed(button, index);
    }.bind(this));

    this.contentElements.previousButton.addEventListener('click', this.navigateTo.bind(this, 'previousData'));
    this.contentElements.nextButton.addEventListener('click', this.navigateTo.bind(this, 'nextData'));

    window.addEventListener('keydown', function (event) {
        if (this.state.opened && event.key === 'ArrowLeft') {
            this.previous();
        } else if (this.state.opened && event.key === 'ArrowRight') {
            this.next();
        }
    }.bind(this));
};

window.osuny.Lightbox.prototype.open = function (button) {
    var data = this._getData(button);
    this._update(data);
    this.toggle(true, button);
    this.element.focus();
};

window.osuny.Lightbox.prototype._getData = function (button) {
    var data = JSON.parse(button.getAttribute('data-lightbox'));
    data.buttonElement = button;
    return data;
};

window.osuny.Lightbox.prototype._setAriaDescribed = function (button, index) {
    var parent = button.parentElement,
        figcaption = parent.querySelector('figcaption');

    if (figcaption) {
        figcaption.id = 'image-figcaption-' + index;
        button.setAttribute('aria-describedby', figcaption.id);
    }
};

window.osuny.Lightbox.prototype._setSiblings = function () {
    var figure = this.state.currentData.buttonElement.parentElement,
        galleryElement = figure.closest('.gallery'),
        figureIndex = 0;

    if (!galleryElement || galleryElement.children.length === 1) {
        this.contentElements.previousButton.style.display = 'none';
        this.contentElements.nextButton.style.display = 'none';
        return;
    }

    figureIndex = Array.prototype.indexOf.call(galleryElement.children, figure);

    setButtonEnability(this.contentElements.previousButton, figureIndex > 0);
    setButtonEnability(this.contentElements.nextButton, figureIndex < galleryElement.children.length - 1);

    this.state.previousData = this._getSiblingsData(figure.previousElementSibling);
    this.state.nextData = this._getSiblingsData(figure.nextElementSibling);
};

window.osuny.Lightbox.prototype._getSiblingsData = function (element) {
    var button;
    if (!element) {
        return null;
    }
    button = element.querySelector('.lightbox-button');
    if (button) {
        return this._getData(button);
    }
};

window.osuny.Lightbox.prototype._clear = function () {
    this.contentElements.previousButton.style.display = 'block';
    this.contentElements.nextButton.style.display = 'block';
    this.contentElements.media.innerHTML = '';
    this.contentElements.information.innerHTML = '';
    this.contentElements.credit.innerHTML = '';

    setButtonEnability(this.contentElements.previousButton, false);
    setButtonEnability(this.contentElements.nextButton, false);
    this.closeExtendables();
};

window.osuny.Lightbox.prototype._update = function (data, focus) {
    this._clear();
    this.state.currentData = data;

    this._setSiblings();

    if (data.imageSrc) {
        this._createImage(data);
    } else {
        this.contentElements.image = null;
    }

    this.contentElements.information.innerHTML = data.information || '';
    setButtonEnability(this.contentElements.informationButton, Boolean(data.information));
    this.contentElements.credit.innerHTML = data.credit || '';
    setButtonEnability(this.contentElements.creditButton, Boolean(data.credit));

    if (focus && data.imageSrc) {
        this._focusImage();
    }
};

window.osuny.Lightbox.prototype._createImage = function (data) {
    this.contentElements.image = document.createElement('img');
    this.contentElements.image.draggable = false;
    this.contentElements.image.src = data.imageSrc;
    this.contentElements.image.alt = data.alt || data.buttonElement.querySelector('img').alt;
    this.contentElements.media.append(this.contentElements.image);
    this._setAriaOnImage(data);
};

window.osuny.Lightbox.prototype._setAriaOnImage = function (data) {
    var describedBy = [];
    if (data.information) {
        describedBy.push(this.contentElements.information.id);
    }
    if (data.credit) {
        describedBy.push(this.contentElements.credit.id);
    }
    if (describedBy.length) {
        this.contentElements.image.setAttribute('aria-describedby', describedBy.join(' '));
    }
};

window.osuny.Lightbox.prototype._focusImage = function () {
    this.contentElements.image.setAttribute('tabindex', '-1');
    this.contentElements.image.focus();
};

window.osuny.Lightbox.prototype.previous = function () {
    this.navigateTo('previousData');
};

window.osuny.Lightbox.prototype.next = function () {
    this.navigateTo('nextData');
};

window.osuny.Lightbox.prototype.navigateTo = function (key) {
    if (this.state[key]) {
        this._update(this.state[key], true);
    }
};

window.osuny.lightbox = new window.osuny.Lightbox();
