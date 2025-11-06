window.osuny = window.osuny || {};

window.osuny.Page = function () {
    this.components = {};
};

window.osuny.Page.prototype.registerComponent = function (component) {
    this.components[component.name] = component;
};

window.osuny.Page.prototype.init = function () {
    var name;

    for (name in this.components) {
        this.initComponents(name);
    }

    document.body.classList.add('is-loaded');
};

window.osuny.Page.prototype.initComponents = function (name) {
    var component = this.components[name];
    component.instances = window.osuny.utils.instanciateAll(component.selector, component.klass);
};

window.osuny.Page.prototype.getComponents = function (name) {
    return this.components[name].instances;
};

window.osuny.Page.prototype.getComponentInstanceById = function (id) {
    var componentInstance = null;
    this.components.forEach(function (component) {
        component.instances.forEach(function (instance) {
            if (instance.id === id) {
                componentInstance = instance;
            }
        });
    });
    return componentInstance;
};

window.osuny.page = new window.osuny.Page();

window.addEventListener('DOMContentLoaded', function () {
    window.osuny.page.init();
});
