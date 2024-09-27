window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.utils = {
    // Méhodes ajoutées comme des traits (décorateur) aux objets qui en ont besoin
    findElement: function (classKey) {
        var className = window.osuny.carousel.classes[classKey];
        return this.element.getElementsByClassName(className).item(0);
    },
    dispatchEvent: function (eventKey, value = null) {
        var eventName = window.osuny.carousel.events[eventKey],
            event = new Event(eventName);
        event.value = value;
        this.element.dispatchEvent(event);
    }
};
