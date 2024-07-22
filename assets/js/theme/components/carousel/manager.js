if (!window.osuny) {
    window.osuny = {};
}

if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}

window.osuny.carousel.manager = {
    instances: [],
    createInstances: function () {
        var classCarrousel = "carrousel";
        var carrousels = document.getElementsByClassName(classCarrousel);
        for (var i = 0; i < carrousels.length; i += 1) {
            carrousels[i].setAttribute("id", "carrouselX".replace("X", i));
            var sliderElement = carrousels[i].getElementsByClassName(carrouselClasses.classSlider).item(0);
            var slidesContainerElement = sliderElement.getElementsByClassName(carrouselClasses.classContainer).item(0);
            var elements = {
                root: carrousels[i],
                slider: sliderElement,
                slidesContainer: slidesContainerElement
            }
            console.log(slidesContainerElement)
            var options = JSON.parse(carrousels[i].getAttribute("data-carrousel"));
            this.instances.push(new Carrousel(elements, options));
        }
    }
}

window.addEventListener("load", function () {
    console.log("loaded")
    window.osuny.carousel.manager.createInstances();
});

var siteLang = document.querySelector('html').getAttribute('lang');
if (siteLang == "fr") {
    var i18n = {
        first: 'Aller au premier slide',
        last: 'Aller au dernier slide',
        next: 'Slide suivant',
        pageX: 'Aller à la page %s',
        pause: 'Mettre en pause le carousel',
        play: 'Démarrer le carousel',
        prev: 'Slide précedent',
        slideX: 'Aller au slide %s'
    }
}

var carrouselClasses = {
    classSlider: "carrousel__slider", // slider (servant de fenetre d'affichage)
    classContainer: "carrousel__container", // container englobant directement les elements du slider
    classController: "carrousel__controller",
    classPagination: "carrousel__pagination",
    classPaginationButton: "carrousel__pagination__page",
    classToggleButton: "carrousel__toggle",
    classToggleButtonPause: "carrousel__toggle__pause",
    classToggleButtonPlay: "carrousel__toggle__play"
}
