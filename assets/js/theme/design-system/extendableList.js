window.osuny = window.osuny || {};
window.osuny.ExtendableList = window.osuny.ExtendableList || {};

window.osuny.ExtendableList = function () {
  this.hideClass = "truncated-list";
  var element = document.querySelector('.extendable-list');
  window.osuny.Extendable.call(this, element);
  this._setup();
};

window.osuny.ExtendableList.prototype = Object.create(window.osuny.Extendable.prototype);

window.osuny.ExtendableList.prototype._setup = function () {
  this.element.classList.add(this.hideClass);
  var children = this.element.querySelectorAll("li");
  this.hiddenChildren = [];
  
  this.getAllHiddenChildren(children);

  if (this.hiddenChildren.length === 0) {
    this.buttons.forEach(function (button) {
      button.style.display = 'none';
    });
  }
};

window.osuny.ExtendableList.prototype.getAllHiddenChildren = function (children) {
  children.forEach((child) => {
    var style = window.getComputedStyle(child);

    if (style.getPropertyValue('display') === 'none') {
        this.hiddenChildren.push(child);
    }
  });
};

osuny.Extendable.prototype.toggle = function (opened) {
  this.state.opened = typeof opened !== 'undefined' ? opened : !this.state.opened;
  this.element.classList.toggle(this.hideClass);
  
  this.buttons.forEach(function (button) {
    if (button.getAttribute('aria-expanded')) {
      button.setAttribute('aria-expanded', this.state.opened);
    }
  }.bind(this));

  this.focusNewListItems();
};

osuny.Extendable.prototype.focusNewListItems = function (opened) {
  var firstNewListItem = this.hiddenChildren[0];

  firstNewListItem.setAttribute('tabindex', '0');
  firstNewListItem.focus();
  firstNewListItem.removeAttribute('tabindex');
}

window.osuny.ExtendableList = new window.osuny.ExtendableList();