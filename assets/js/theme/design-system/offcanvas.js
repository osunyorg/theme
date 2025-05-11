var osuny = window.osuny || {};
osuny.Offcanvas = osuny.Offcanvas || {};

osuny.Offcanvas = function (element) {
    osuny.Extendable.call(this, element);
};

osuny.Offcanvas.prototype = Object.create(osuny.Extendable.prototype);

osuny.Offcanvas.prototype.toggle = function (opened, fromOutside) {
    osuny.Extendable.prototype.toggle.call(this, opened, fromOutside);
    this.element.classList[this.state.opened ? 'add' : 'remove']('is-opened');
};


(function () {
    osuny.utils.instanciateAll('.offcanvas', osuny.Offcanvas);
}());
