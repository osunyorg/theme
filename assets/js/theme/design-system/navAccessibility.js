var osuny = window.osuny || {};

osuny.navAccessibility = {
    init: function (element) {
        this.element = element;

        if (!this.element) {
            return;
        }

        this.mainButton = this.element.querySelector('a[href="#main"]');

        if (this.mainButton) {
            this.mainButton.addEventListener('click', this.focusMain);
        }
    },
    focusMain: function () {
        var main = document.getElementById('main');
        main.setAttribute('tabindex', '-1');
    }
};

(function () {
    var navAccessibilityElement = document.getElementById('nav-accessibility')
    if (navAccessibilityElement) {
        osuny.navAccessibility.init(navAccessibilityElement);
    }
}());
