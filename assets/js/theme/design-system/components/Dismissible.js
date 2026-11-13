/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};

window.osuny.Dismissible = function (element) {
    window.osuny.Popup.call(this, element);
    var id = element.getAttribute('data-dismissible-id');
    this.storageKey = 'osuny-popup-dismissed:' + id;
    this.closeButton = this.element.querySelector('.close');
    this._init();
};

window.osuny.Dismissible.prototype._init = function () {
    this._listen();
    if (this.isDismissed()) {
        this.close();
    } else {
        this.open();
    }
};

window.osuny.Dismissible.prototype._listen = function () {
    this.closeButton.addEventListener('click', this.close.bind(this));
};

window.osuny.Dismissible.prototype.close = function () {
    this.element.setAttribute('aria-hidden', 'true');

    try {
        window.localStorage.setItem(this.storageKey, '1');
    } catch (e) {
        // everything's fine
    }
};

window.osuny.Dismissible.prototype.open = function () {
    this.element.removeAttribute('aria-hidden');
    this.close.setAttribute('aria-expanded', 'true');
};

window.osuny.Dismissible.prototype.isDismissed = function () {
    try {
        return window.localStorage.getItem(this.storageKey) === '1';
    } catch (e) {
        return false;
    }
};

window.osuny.page.registerComponent({
    name: 'dismissible',
    selector: '.dismissible',
    klass: window.osuny.Dismissible
});

console.log('yo')