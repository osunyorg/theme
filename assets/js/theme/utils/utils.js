window.osuny = window.osuny || {};
window.osuny.utils = window.osuny.utils || {};

window.osuny.utils.instanciateAll = function (selector, Klass) {
    var instances = document.querySelectorAll(selector);
    instances.forEach(function (instance) {
        new Klass(instance);
    });
};

window.osuny.utils.insertSROnly = function (element, text) {
    var span = document.createElement('span');
    span.innerText = text;
    span.classList.add('sr-only');
    element.append(span);
    return span;
};
