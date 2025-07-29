var osuny = window.osuny || {};
osuny.Offcanvas = osuny.Offcanvas || {};

osuny.Offcanvas = function (element) {
    osuny.Extendable.call(this, element);
    this.classes = {
        bodyclass: 'has-offcanvas-opened',
        opened: 'is-opened'
    }

    this.handleAutoClose();
};

osuny.Offcanvas.prototype = Object.create(osuny.Extendable.prototype);

osuny.Offcanvas.prototype.toggle = function (opened, fromOutside) {
    var classAction;
    osuny.Extendable.prototype.toggle.call(this, opened, fromOutside);

    classAction = this.state.opened ? 'add' : 'remove';

    this.element.classList[classAction](this.classes.opened);
    document.documentElement.classList[classAction](this.classes.bodyclass);
};

(function () {
    osuny.utils.instanciateAll('.offcanvas', osuny.Offcanvas);
}());
