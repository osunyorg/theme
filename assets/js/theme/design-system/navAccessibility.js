window.osuny = window.osuny || {};

window.osuny.navAccessibility = {
    init: function () {
        this.element = document.getElementById('nav-accessibility');

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

window.osuny.navAccessibility.init();