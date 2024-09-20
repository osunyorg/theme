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
    _showArrows () {
        this._showButton(this.prevButton);
        this._showButton(this.nextButton);
    },
    _hideArrows () {
        this._hideButton(this.prevButton);
        this._hideButton(this.nextButton);
    },
    _showButton (button) {
        button.style.display = 'block';
    },
    _hideButton (button) {
        button.style.display = 'none';
    },
    load (lightbox) {
        if (lightbox.isGallery) {
            this._showArrows();
        } else {
            this._hideArrows();
        }
        this.nextButton.disabled = lightbox.next === null;
        this.prevButton.disabled = lightbox.previous === null;

        if (lightbox.credit) {
            this._showButton(this.creditButton);
        } else {
            this._hideButton(this.creditButton);
        }

        if (lightbox.description) {
            this._showButton(this.infoButton);
        } else {
            this._hideButton(this.infoButton);
        }
    },
    showDescription () {
        this.infoButton.classList.add('active');
        this.creditButton.classList.remove('active');
    },
    showCredit () {
        this.creditButton.classList.add('active');
        this.infoButton.classList.remove('active');
    },
    closePopup () {
        this.infoButton.classList.remove('active');
        this.creditButton.classList.remove('active');
    },
    infoOpened () {
        return this.infoButton.classList.contains('active')
    },
    creditOpened () {
        return this.creditButton.classList.contains('active')
    }
};
