import './TouchControl';
import { setButtonEnability } from '../utils/a11y';

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
        information: this.element.querySelector('#lightbox-information'),
        informationButton: this.element.querySelector('.lightbox-button-information'),
        credit: this.element.querySelector('#lightbox-credit'),
        creditButton: this.element.querySelector('.lightbox-button-credit'),
        previousButton: this.element.querySelector('.lightbox-button-previous'),
        nextButton: this.element.querySelector('.lightbox-button-next')
    };
    this.touchControl = new window.osuny.TouchControl(this, this.contentElements.media);
};

window.osuny.Lightbox.prototype._listen = function () {
    window.osuny.Popup.prototype._listen.call(this);

    this.buttons.forEach(function (button) {
        button.addEventListener('click', this.open.bind(this, button));
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

window.osuny.Lightbox.prototype._update = function (data) {
    this._clear();
    this.state.currentData = data;

    this._setSiblings();

    if (data.imageSrc) {
        this._createImage(data);
    }

    this.contentElements.information.innerHTML = data.information || '';
    setButtonEnability(this.contentElements.informationButton, Boolean(data.information));
    this.contentElements.credit.innerHTML = data.credit || '';
    setButtonEnability(this.contentElements.creditButton, Boolean(data.credit));
};

window.osuny.Lightbox.prototype._createImage = function (data) {
    var image = document.createElement('img');
    image.draggable = false;
    image.src = data.imageSrc;
    image.alt = data.alt || '';
    image.tabIndex = 0;
    this.contentElements.media.append(image);
    image.focus();
};

window.osuny.Lightbox.prototype.previous = function () {
    this.navigateTo('previousData');
};

window.osuny.Lightbox.prototype.next = function () {
    this.navigateTo('nextData');
};

window.osuny.Lightbox.prototype.navigateTo = function (key) {
    if (this.state[key]) {
        this._update(this.state[key]);
    }
};

window.osuny.lightbox = new window.osuny.Lightbox();