var osuny = window.osuny || {};
osuny.ExtendableList = osuny.ExtendableList || {};

osuny.ExtendableList = function (element) {
    osuny.Extendable.call(this, element);
    this.hideClass = "truncated-list";
    this.element.classList.add(this.hideClass);
    this.hiddenChildren = this.getHiddenChildren();
    if (this.hiddenChildren.length === 0) {
        this.deactivate();
    }
};

osuny.ExtendableList.prototype = Object.create(osuny.Extendable.prototype);

osuny.ExtendableList.prototype.getHiddenChildren = function () {
    var children = Array.prototype.slice.call(this.element.children),
        hiddenChildren = [];

    children.forEach(function (child) {
        var style = window.getComputedStyle(child);
        if (style.getPropertyValue('display') === 'none') {
            hiddenChildren.push(child);
        }
    });

    return hiddenChildren;
};

osuny.ExtendableList.prototype.deactivate = function () {
    this.buttons.forEach(function (button) {
        button.style.display = 'none';
    });
}

osuny.ExtendableList.prototype.toggle = function (opened, fromOutside) {
    osuny.Extendable.prototype.toggle.call(this, opened, fromOutside);
    if (this.state.opened) {
        this.element.classList.remove(this.hideClass);
        this.focusFirstItem();
    }
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
