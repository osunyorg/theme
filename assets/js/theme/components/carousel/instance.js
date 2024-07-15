if (!window.osuny) {
    window.osuny = {};
}
if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}
window.osuny.carousel.instance = {
    htmlClasses: {
        slider: "carrousel__slider", // slider (servant de fenetre d'affichage)
        container: "carrousel__container", // container englobant directement les elements du slider
        controller: "carrousel__controller",
        pagination: "carrousel__pagination",
        paginationButton: "carrousel__pagination__page",
        toggleButton: "carrousel__toggle",
        toggleButtonPause: "carrousel__toggle__pause",
        toggleButtonPlay: "carrousel__toggle__play"
    },
    i18n: {
        first: 'Aller au premier slide',
        last: 'Aller au dernier slide',
        next: 'Slide suivant',
        pageX: 'Aller à la page %s',
        pause: 'Mettre en pause le carousel',
        play: 'Démarrer le carousel',
        prev: 'Slide précedent',
        slideX: 'Aller au slide %s'
    },
    // HTML element
    rootElement: null,
    init: function (element) {

    }
};