window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Config = function (instance) {
    this.instance = instance;

    // Valeurs par défaut et documentation des propriétés
    // L'autoplay est-il activé ou pas ?
    this.autoplay = false;

    // Pagination sous forme de tabulation 
    this.pagination = true;

     // Controle du defilement avec les fleches
    this.arrows = false;

    // Durée d'affichage d'un slide en cas d'autoplay
    this.autoplayinterval = 3000;
}

window.osuny.carousel.Config.prototype = {
    valuesInOptions: [
        "autoplay",
        "arrows",
        "pagination",
        "autoplayinterval"
    ],
    loadOptions: function (data) {
        var options = JSON.parse(data);
        for (var i = 0; i <= this.valuesInOptions.length; i += 1) {
            var value = this.valuesInOptions[i];
            if (options[value] !== undefined) {
                this[value] = options[value];
            }
        };
    }
}