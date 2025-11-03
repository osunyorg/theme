window.osuny = window.osuny || {};

window.osuny.NavAccessibility = function (element) {
    this.element = element;
    this.mainButton = this.element.querySelector('a[href="#main"]');

    if (this.mainButton) {
        this.mainButton.addEventListener('click', this.focusMain.bind(this));
    }
};

window.osuny.NavAccessibility.prototype.focusMain = function () {
    var main = document.getElementById('main');
    main.setAttribute('tabindex', '-1');
}

window.osuny.page.addComponent('#nav-accessibility', window.osuny.NavAccessibility);
