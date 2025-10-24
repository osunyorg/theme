window.osuny = window.osuny || {};

window.osuny.ExtendableList = function (element) {
    window.osuny.Extendable.call(this, element);
    this.hideClass = "truncated-list";
    this.element.classList.add(this.hideClass);
    this.hiddenChildren = this.getHiddenChildren();
    if (this.hiddenChildren.length === 0) {
        this.deactivate();
    }
};

window.osuny.ExtendableList.prototype = Object.create(window.osuny.Extendable.prototype);

window.osuny.ExtendableList.prototype.getHiddenChildren = function () {
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

window.osuny.ExtendableList.prototype.deactivate = function () {
    this.buttons.forEach(function (button) {
        button.style.display = 'none';
    });
}

window.osuny.ExtendableList.prototype.toggle = function (opened, fromOutside) {
    window.osuny.Extendable.prototype.toggle.call(this, opened, fromOutside);
    if (this.state.opened) {
        this.element.classList.remove(this.hideClass);
        this.focusFirstItem();
    }
};

window.osuny.ExtendableList.prototype.focusFirstItem = function (opened) {
    var firstElement = this.hiddenChildren[0];
    firstElement.setAttribute('tabindex', '0');
    firstElement.focus();
    firstElement.removeAttribute('tabindex');
};

window.osuny.page.addComponent('.extendable-list', window.osuny.ExtendableList);
