window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.utils = {
    // Méhodes ajoutées comme des traits (décorateur) aux objets qui en ont besoin
    findElement: function (classKey) {
        var className = window.osuny.carousel.classes[classKey];
        return window.osuny.components.utils.findElement(this.element, className);
    },
    dispatchEvent: function (eventKey, value = null) {
        window.osuny.components.utils.dispatchEvent(eventKey, value);
    }
};
