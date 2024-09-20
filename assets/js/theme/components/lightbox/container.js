/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.LightboxContainer = function (element) {
    this.element = element;
    this.bodyElement = document.querySelector('body');
    this.opened = false;
    this.content = this.element.getElementsByClassName(window.osuny.lightbox.classes.content).item(0);
};

window.osuny.lightbox.LightboxContainer.prototype = {
    open () {
        this.bodyElement.style.overflow = 'hidden';
        this.element.style.display = 'block';
        this.opened = true;
    },
    close () {
        this._removeImageContent();
        this.bodyElement.style.overflow = 'visible';
        this.element.style.display = 'none';
        this.opened = false;
    },
    show (lightbox) {
        this._removeImageContent();
        this._setImageContent(lightbox.url);
    },
    _setImageContent (url) {
        var image = document.createElement('img');
        image.setAttribute('src', url);
        this.content.append(image);
    },
    _removeImageContent () {
        this.content.innerHTML = '';
    }
};
