window.osuny = window.osuny || {};
window.osuny.utils = window.osuny.utils || {};
window.osuny.utils.instanciateIf = function (scope, model, condition) {
    if (condition) {
        return new model(scope);
    } else {
        return null;
    }
}
window.osuny.utils.instanciateAll = function(selector, klass) {
    var instances = document.querySelectorAll(selector);
    instances.forEach(function (instance) {
        new klass(instance);
    });
}