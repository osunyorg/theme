/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.LightboxContainer = function (element) {
    this.element = element;
    this.bodyElement = document.querySelector('body');
    this.mainElement = document.querySelector('main');
    this.headerElement = document.querySelector('header');
    this.footerElement = document.querySelector('footer');
    this.opened = false;
    this.content = this.element.getElementsByClassName(window.osuny.lightbox.classes.content).item(0);
};

window.osuny.lightbox.LightboxContainer.prototype = {
    open () {
        this._disablePageElement();
        this.bodyElement.style.overflow = 'hidden';
        this.element.style.display = 'block';
        this.opened = true;
    },
    close () {
        this._removeImageContent();
        this._enablePageElement();
        this.bodyElement.style.overflow = 'visible';
        this.element.style.display = 'none';
        this.opened = false;
    },
    show (lightbox) {
        this._removeImageContent();
        this._setImageContent(lightbox.url);
        // maybe add description ou alt
        this.content.focus();
    },
    _setImageContent (url) {
        var image = document.createElement('img');
        image.setAttribute('src', url);
        this.content.append(image);
    },
    _removeImageContent () {
        this.content.innerHTML = '';
    },
    _disablePageElement () {
        this.mainElement.inert = true;
        this.mainElement.setAttribute('aria-hidden', 'true');
        this.headerElement.inert = true;
        this.headerElement.setAttribute('aria-hidden', 'true');
        this.footerElement.inert = true;
        this.footerElement.setAttribute('aria-hidden', 'true');
    },
    _enablePageElement() {
        this.mainElement.inert = false;
        this.mainElement.setAttribute('aria-hidden', 'false');
        this.headerElement.inert = false;
        this.headerElement.setAttribute('aria-hidden', 'false');
        this.footerElement.inert = false;
        this.footerElement.setAttribute('aria-hidden', 'false');
    }
};
