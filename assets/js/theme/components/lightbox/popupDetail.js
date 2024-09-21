/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.Popup = function (element) {
    this.element = element;
    this.content = this.element.getElementsByClassName(window.osuny.lightbox.classes.detailWindowContent).item(0);
    this.title = null;
    this.informationTitle = this.element.getElementsByClassName(window.osuny.lightbox.classes.detailWindowTitleInformation).item(0);
    this.creditTitle = this.element.getElementsByClassName(window.osuny.lightbox.classes.detailWindowTitleCredit).item(0);
    this.currentDescription = '';
    this.currentCredit = '';
    this.closeButton = this.element.getElementsByClassName(window.osuny.lightbox.classes.detailWindowClose).item(0);
    this.opened = false;
    this.close();
};

window.osuny.lightbox.Popup.prototype = {
    _show (content) {
        this._resetTitle();
        if (content === 'description') {
            this.title = this.informationTitle;
            this.content.innerHTML = this.currentDescription;
        } else if (content === 'credit') {
            this.title = this.creditTitle;
            this.content.innerHTML = this.currentCredit;
        }
        this.title.style.display = 'block';
        if (!this.opened) {
            this.open();
        }
    },
    showDescription() {
        this._show('description');
    },
    showCredit () {
        this._show('credit');
    },
    close () {
        this._resetTitle();
        this.content.innerHTML = '';
        this.element.style.display = 'none';
        this.opened = false;
    },
    _resetTitle () {
        if (this.title) {
            this.title.style.display = 'none';
            this.title = null;
        }
    },
    open () {
        this.element.style.display = 'block';
        this.opened = true;
    },
    load (lightbox) {
        this.currentDescription = lightbox.description;
        this.currentCredit = lightbox.credit;
    }
};
