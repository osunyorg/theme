window.osuny = window.osuny || {};
window.osuny.utils = window.osuny.utils || {};
window.osuny.utils.instanciateIf = function (scope, model, condition) {
    if (condition) {
        return new model(scope);
    } else {
        return null;
    }
}