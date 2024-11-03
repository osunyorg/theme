import { a11yClick } from '../utils/a11y';

window.osuny = window.osuny || {};

window.osuny.Collapse = function (element) {
    this.element = element;
    this.buttons = document.querySelectorAll('[aria-controls=' + this.element.id + ']');
    this.state = {
        opened: false
    };
    this.options = {
        // This attribute determine if collapse should close others when opened
        closeSiblings: this.element.getAttribute('data-collapse-close-siblings')
    };
    this.listen();
};

window.osuny.Collapse.prototype.listen = function () {
    this.buttons.forEach(function (button) {
        a11yClick(button, function (event) {
            event.preventDefault();
            this.toggle();
        }.bind(this));
    }.bind(this));

    this.element.addEventListener('collapse-close', this.toggle.bind(this, true));
};

window.osuny.Collapse.prototype.toggle = function (forceClose) {
    this.state.opened = forceClose ? false : !this.state.opened;

    if (this.state.opened && this.options.closeSiblings) {
        this.closeSiblings();
    }

    this.buttons.forEach(function (button) {
        button.setAttribute('aria-expanded', this.state.opened);
    }.bind(this));
};

window.osuny.Collapse.prototype.closeSiblings = function () {
    var siblings = this.element.parentNode.querySelectorAll('button[aria-expanded="true"]');

    siblings.forEach(function (button) {
        button.click();
    }.bind(this));
};

(function () {
    var collapses = document.querySelectorAll('.collapse');
    Array.prototype.forEach.call(collapses, function (element) {
        new window.osuny.Collapse(element);
    });
}());
