window.osuny = window.osuny || {};
window.osuny.Offcanvas = window.osuny.Offcanvas || {};

window.osuny.Offcanvas = function (element) {
    window.osuny.Extendable.call(this, element);
    this.classes = {
        bodyclass: 'has-offcanvas-opened',
        opened: 'is-opened'
    }

    this.handleAutoClose();
};

window.osuny.Offcanvas.prototype = Object.create(window.osuny.Extendable.prototype);

window.osuny.Offcanvas.prototype.toggle = function (opened, fromOutside) {
    var classAction;
    window.osuny.Extendable.prototype.toggle.call(this, opened, fromOutside);

    classAction = this.state.opened ? 'add' : 'remove';

    this.element.classList[classAction](this.classes.opened);
    document.documentElement.classList[classAction](this.classes.bodyclass);
};

window.window.osuny.page.addComponent('.offcanvas', window.osuny.Offcanvas);
