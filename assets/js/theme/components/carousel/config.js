window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Config = function (instance) {
    this.instance = instance;

    // Valeurs par défaut et documentation des propriétés
    this.options = {};

    // L'autoplay est-il activé ou pas ?
    this.autoplay = false;
    this.pagination = true;
    this.drag = false;
    this.arrows = false;

    // Temps par slide
    this.autoplayInterval = 3000;
    this.transitionDuration = 500;
}

window.osuny.carousel.Config.prototype = {
    valuesInOptions: [
        "autoplay",
        "arrows",
        "pagination",
        "transitionDuration",
        "drag"
    ],
    loadOptions: function (data) {
        this.options = JSON.parse(data);
        this.autoplay = false;
        for (var i = 0; i <= this.valuesInOptions.length; i += 1) {
            var value = this.valuesInOptions[i];
            if (this.options[value] !== undefined) {
                this[value] = this.options[value];
            }
        };
    }
}