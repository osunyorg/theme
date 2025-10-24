window.osuny = window.osuny || {};

window.osuny.Page = function () {
    this.components = [];
};

window.osuny.Page.prototype.addComponent = function (selector, kind) {
    console.log(selector, kind)

    this.components.push({
        kind: kind,
        selector: selector,
        instances: []
    });
};

window.osuny.Page.prototype.init = function () {
    this.components.forEach(function (component) {
        component.instances = window.osuny.utils.instanciateAll(component.selector, component.kind);
    });
    document.body.classList.add('is-loaded');
};

window.osuny.Page.prototype.getComponents = function (kind) {
    var components = [];
    this.components.forEach(function (component) {
        if (component.kind === kind) {
            components = component.instances;
        }
    });
    return components;
};

window.osuny.page = new window.osuny.Page();

window.addEventListener('DOMContentLoaded', function () {
    window.osuny.page.init();
});
