/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.Lightbox = function (element, index) {
    this.element = element;
    this.index = index;
    this.url = null;
    this.credit = null;
    this.description = null;
    this.launcher = null;
    this.previous = null;
    this.next = null;
    this.isGallery = false;
    this._initialize();
};

window.osuny.lightbox.Lightbox.prototype = {
    _initialize () {
        var options;
        this.launcher = this.element.getElementsByClassName(window.osuny.lightbox.classes.launcher).item(0);
        if (this.launcher) {
            this.launcher.setAttribute('value', this.index);
            this.url = this.launcher.href;
            options = JSON.parse(this.launcher.getAttribute(window.osuny.lightbox.dataAttribute));
            this.description = options.description;
            this.credit = options.credit;
            if (options.gallery_values) {
                this.isGallery = true;
                this._initializeGroupOptions(options.gallery_values);
            }
        }
    },
    _initializeGroupOptions (options) {
        if (options.index > 0) {
            this.previous = this.index - 1;
        }
        if (options.index < options.total - 1) {
            this.next = this.index + 1;
        }
    }
};
