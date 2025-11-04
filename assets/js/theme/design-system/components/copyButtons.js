window.osuny = window.osuny || {};

window.osuny.CopyButton = function (button) {
    this.button = button;
    this.text = this.button.getAttribute('data-click-to-copy');
    this.timeout = null;
    this.listen();
};

window.osuny.CopyButton.prototype.listen = function () {
    this.button.addEventListener('click', this.copy.bind(this));
    this.button.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            this.copy();
        }
    }.bind(this));
};

window.osuny.CopyButton.prototype.copy = function () {
    navigator.clipboard.writeText(this.text).then(function () {
        this.button.classList.add('is-copied');
        clearTimeout(this.timeout);
        setTimeout(function () {
            this.button.classList.remove('is-copied');
        }.bind(this), 3000);
    }.bind(this));
};

window.osuny.page.addComponent('[data-click-to-copy]', window.osuny.CopyButton);
