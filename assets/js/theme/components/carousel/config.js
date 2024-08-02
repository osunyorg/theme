window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Config = function (instance) {
    this.instance = instance;

    // Valeurs par défaut et documentation des propriétés
    this.options = {};

    // L'autoplay est-il activé ou pas ?
    this.autoplay = false;

    // FIXME @Clara ça fait quoi ?
    this.pagination = true;

    // FIXME @Clara utile ?
    this.drag = false;

    // FIXME @Clara ça fait quoi ?
    this.arrows = false;

    // Temps par slide
    this.autoplayInterval = 3000;

    // FIXME obsolète si scroll smooth, peut-être juste smooth:boolean?
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