/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.Popup = function (element) {
    this.element = element;
    this.titles = {};
    this.title = null;
    this.currentContent = {};
    this.currentContent.description = '';
    this.currentContent.credit = '';
    this.current = null;
    this.opened = false;

    this.content = this.element.getElementsByClassName(window.osuny.lightbox.classes.detailWindowContent).item(0);
    this.titles.description = this.element.getElementsByClassName(window.osuny.lightbox.classes.detailWindowTitleInformation).item(0);
    this.titles.credit = this.element.getElementsByClassName(window.osuny.lightbox.classes.detailWindowTitleCredit).item(0);
    this.closeButton = this.element.getElementsByClassName(window.osuny.lightbox.classes.detailWindowClose).item(0);
    this.closeButton.addEventListener('click', function (e) {
        var event = new Event('closePopup');
        this.element.dispatchEvent(event);
        e.preventDefault();
    }.bind(this));
    this.close();
};

window.osuny.lightbox.Popup.prototype = {
    close () {
        this._resetTitle();
        this.current = null;
        this.content.innerHTML = '';
        this.element.style.display = 'none';
        this.opened = false;
    },
    open () {
        this.element.style.display = 'block';
        this.opened = true;
    },
    load (lightbox) {
        this.currentContent.description = lightbox.description;
        this.currentContent.credit = lightbox.credit;
    },
    show (content) {
        if (Object.keys(this.currentContent).includes(content)) {
            this._resetTitle();
            this.current = content;
            this.title = this.titles[content];
            this.content.innerHTML = this.currentContent[content];
        }
        this.title.style.display = 'block';
        if (!this.opened) {
            this.open();
        }
    },
    _resetTitle () {
        if (this.title) {
            this.title.style.display = 'none';
            this.title = null;
        }
    }
};
