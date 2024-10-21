window.osuny = window.osuny || {};
window.osuny.components = window.osuny.components || {};

window.osuny.components.utils = {
    // Méhodes ajoutées comme des traits (décorateur) aux objets qui en ont besoin
    findElement: function (classKey) {
        var className = this.environment.classes[classKey];
        return this.element.getElementsByClassName(className).item(0);
    },
    dispatchEvent: function (eventKey, value = null) {
        var eventName = this.environment.events[eventKey],
            event = new Event(eventName);
        event.value = value;
        this.element.dispatchEvent(event);
    },
    dispatchAwakeEvent: function (component) {
        // prevenir le manager de composants qu'il y a au moins une instance de lightbox.
        var awakeEvent = new Event(window.osuny[component].events.instanciated);
        awakeEvent.value = this;
        document.dispatchEvent(awakeEvent);
    }
};
