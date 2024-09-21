window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.utils = {
    // Méhodes ajoutées comme des traits (décorateur) aux objets qui en ont besoin
    findElement: function(classKey) {
        var className = window.osuny.lightbox.classes[classKey];
        return this.element.getElementsByClassName(className).item(0);
    }
}