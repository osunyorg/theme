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

window.osuny.utils.bindEvents = function (element, _events, callback) {
    var events = _events.split(' ');
    events.forEach(function (event) {
        element.addEventListener(event, callback);
    });
};

window.osuny.utils.isTouchEvent = function (event) {
    return typeof TouchEvent !== 'undefined' && event instanceof TouchEvent;
};

window.osuny.utils.getEventClientCoord = function (_event) {
    var event = _event;
    if (window.osuny.utils.isTouchEvent(event)) {
        event = event.changedTouches[0];
    }
    return { x: event.clientX, y: event.clientY };
};
