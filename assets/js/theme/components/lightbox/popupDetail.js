/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.Popup = function (element) {
    this.element = element;
    this._findElement = window.osuny.lightbox.utils.findElement.bind(this);
    this.titles = {};
    this.title = null;
    this.currentContent = {};
    this.currentContent.description = '';
    this.currentContent.credit = '';
    this.current = null;
    this.opened = false;

    this.content = this._findElement('detailWindowContent');
    this.titles.description = this._findElement('detailWindowTitleInformation');
    this.titles.credit = this._findElement('detailWindowTitleCredit');
    this.closeButton = this._findElement('detailWindowClose');
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
