var osuny = window.osuny || {};
osuny.ExtendableList = osuny.ExtendableList || {};

osuny.ExtendableList = function (element) {
    this.hiddenChildren = [];
    this.hideClass = "truncated-list";
    osuny.Extendable.call(this, element);

    this.element.classList.add(this.hideClass);
    this.getHiddenChildren();
};

osuny.ExtendableList.prototype = Object.create(osuny.Extendable.prototype);

osuny.ExtendableList.prototype.getHiddenChildren = function (children) {
    var children = this.element.querySelectorAll("li");

    children.forEach(function (child) {
        var style = window.getComputedStyle(child);
        if (style.getPropertyValue('display') === 'none') {
            this.hiddenChildren.push(child);
        }
    }.bind(this));

    if (this.hiddenChildren.length === 0) {
        this.buttons.forEach(function (button) {
            button.style.display = 'none';
        });
    }
};

osuny.ExtendableList.prototype.toggle = function (opened) {
    osuny.Extendable.prototype.toggle.call(this, opened, true);
    this.element.classList.toggle(this.hideClass);
    this.focusFirstItem();
};

osuny.ExtendableList.prototype.focusFirstItem = function (opened) {
    var firstElement = this.hiddenChildren[0];
    firstElement.setAttribute('tabindex', '0');
    firstElement.focus();
    firstElement.removeAttribute('tabindex');
};

(function () {
    osuny.utils.instanciateAll('.extendable-list', osuny.ExtendableList);
}());
