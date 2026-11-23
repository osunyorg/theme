/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};

window.osuny.Dismissible = function (element) {
    window.osuny.Popup.call(this, element);
    var id = element.getAttribute('data-dismissible-id'),
        expirationInHours = element.getAttribute('data-dismissible-expiration') || 24;

    this.expirationDuration = 1000 * 60 * 60 * expirationInHours;
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
    var currentTime = new Date().getTime();
    this.element.setAttribute('aria-hidden', 'true');

    try {
        window.localStorage.setItem(this.storageKey, currentTime);
    } catch (e) {
        // everything's fine
    }
};

window.osuny.Dismissible.prototype.open = function () {
    this.element.removeAttribute('aria-hidden');
    this.closeButton.setAttribute('aria-expanded', 'true');
};

window.osuny.Dismissible.prototype.isDismissed = function () {
    try {
        return this.isExpired()
    } catch (e) {
        return false;
    }
};

window.osuny.Dismissible.prototype.isExpired = function () {
    var closedTime = window.localStorage.getItem(this.storageKey),
        currentTime = new Date().getTime(),
        isExpired = false;

    if (!closedTime) {
        return false;
    } else {
        isExpired = currentTime - closedTime > this.expirationDuration;
    }

    return !isExpired;
};

window.osuny.page.registerComponent({
    name: 'dismissible',
    selector: '.dismissible',
    klass: window.osuny.Dismissible
});
