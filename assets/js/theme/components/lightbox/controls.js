/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.ControlRack = function (element) {
    this.element = element;
    this.closeButton = this.element.getElementsByClassName(window.osuny.lightbox.classes.closeButton).item(0);
    this.prevButton = this.element.getElementsByClassName(window.osuny.lightbox.classes.prevButton).item(0);
    this.nextButton = this.element.getElementsByClassName(window.osuny.lightbox.classes.nextButton).item(0);
    this.infoButton = this.element.getElementsByClassName(window.osuny.lightbox.classes.infoButton).item(0);
    this.creditButton = this.element.getElementsByClassName(window.osuny.lightbox.classes.creditButton).item(0);
};

window.osuny.lightbox.ControlRack.prototype = {

};
