import { a11yClick } from '../utils/a11y';

window.osuny = window.osuny || {};

window.osuny.Collapse = function (element) {
    this.element = element;
    this.button = document.querySelector('[aria-controls=' + this.element.id + ']');
    this.state = {
        isOpened: false
    };

    a11yClick(this.button, function (event) {
        event.preventDefault();
        this.toggle();
    }.bind(this));
};

window.osuny.Collapse.prototype.toggle = function () {
    this.state.isOpened = !this.state.isOpened;
    this.button.setAttribute('aria-expanded', this.state.isOpened);
};

(function () {
    var collapses = document.querySelectorAll('.collapse');
    Array.prototype.forEach.call(collapses, function (element) {
        new window.osuny.Collapse(element);
    });
}());
