window.osuny = window.osuny || {};

window.osuny.Modal = function (button) {
    var id = button.getAttribute('data-open-modal'),
        element = document.getElementById(id);
    window.osuny.Popup.call(this, element);

    this.button = button;
    this._listen();
};

window.osuny.Modal.prototype = Object.create(window.osuny.Popup.prototype);

window.osuny.Modal.prototype._listen = function () {
    window.osuny.Popup.prototype._listen.call(this);

    this.button.addEventListener('click', this.open.bind(this, this.button));
};

window.osuny.page.registerComponent({
    name: 'modal',
    selector: '[data-open-modal]',
    klass: window.osuny.Modal
});