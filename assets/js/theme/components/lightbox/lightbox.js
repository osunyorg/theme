/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.Lightbox = function (element, index) {
    this.element = element;
    this.index = index;
    this.imgData = {
        url: ''
    };
    this.launcher = null;
    this.launcher = this.element.getElementsByClassName(window.osuny.lightbox.classes.launcher).item(0);
    this.launcher.setAttribute('value', this.index);
    this.imgData.url = this.launcher.href;
    this.imgData.information = 'image information';
    this.imgData.copyright = 'blle';
};
