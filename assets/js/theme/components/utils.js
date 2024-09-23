window.osuny = window.osuny || {};
window.osuny.components = window.osuny.components || {};

window.osuny.components.utils = {
    // Méhodes ajoutées comme des traits (décorateur) aux objets qui en ont besoin
    findElement: function (className) {
        var classNameInEnv = this.environment.classes[className];
        return this.element.getElementsByClassName(classNameInEnv).item(0);
    },
    dispatchEvent: function (eventKey, value = null) {
        var eventName = window.osuny.carousel.events[eventKey],
            event = new Event(eventName);
        event.value = value;
        this.element.dispatchEvent(event);
    }
};
