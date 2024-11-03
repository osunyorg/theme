/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.Lightbox = window.osuny.Lightbox || {};

window.osuny.Lightbox = function () {
    var element = document.getElementById('lightbox');
    window.osuny.Popup.call(this, element);
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
        creditButton: this.element.querySelector('.lightbox-button-credit')
    };
};

window.osuny.Lightbox.prototype._listen = function () {
    window.osuny.Popup.prototype._listen.call(this);

    this.buttons.forEach(function (button) {
        button.addEventListener('click', this.open.bind(this, button));
    }.bind(this));
};

window.osuny.Lightbox.prototype.open = function (button) {
    var data = JSON.parse(button.getAttribute('data-lightbox'));
    this._update(data);
    this.toggle(true, button);
};

window.osuny.Lightbox.prototype._clear = function () {
    this.contentElements.media.innerHTML = '';
    this.contentElements.information.innerHTML = '';
    this.contentElements.credit.innerHTML = '';
};

window.osuny.Lightbox.prototype._update = function (data) {
    this._clear();

    if (data.imageSrc) {
        this._createImage(data);
    }

    this.contentElements.information.innerHTML = data.information || '';
    this.contentElements.informationButton.disabled = !data.information;
    this.contentElements.credit.innerHTML = data.credit || '';
    this.contentElements.creditButton.disabled = !data.credit;
};

window.osuny.Lightbox.prototype._createImage = function (data) {
    var image = document.createElement('img');
    image.src = data.imageSrc;
    image.alt = data.alt;
    this.contentElements.media.append(image);
};

window.osuny.lightbox = new window.osuny.Lightbox();
