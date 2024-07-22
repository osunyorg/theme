if (!window.osuny) {
    window.osuny = {};
}

if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}

window.osuny.carousel.manager = {
    instances: [],
    createInstances: function (classes) {
        var carrouselDataTag = "data-carrousel";
        var carrousels = document.getElementsByClassName(classes.carrousel);
        for (var i = 0; i < carrousels.length; i += 1) {
            carrousels[i].setAttribute("id", "carrouselX".replace("X", i));
            var sliderElement = carrousels[i].getElementsByClassName(classes.slider).item(0);
            var slidesContainerElement = sliderElement.getElementsByClassName(classes.container).item(0);
            var elements = {
                root: carrousels[i],
                slider: sliderElement,
                container: slidesContainerElement
            }
            var options = JSON.parse(carrousels[i].getAttribute(carrouselDataTag));
            var instance = new Carrousel(elements, options);
            sliderElement.addEventListener("mouseenter", function (e) { instance.onMouseEnter(); });
            sliderElement.addEventListener("mouseleave", function (e) { instance.onMouseLeave(); });

            this.instances.push(instance);
        }
    },
    initListeners: function() {
        window.addEventListener('resize', function(){
            for(var i = 0; i<this.instances.length; i+=1){
                this.instances[i].onResize();
            }
        }.bind(this));
    }
}

window.addEventListener("load", function () {
    var siteLang = document.querySelector('html').getAttribute('lang');
    var i18n;
    if (siteLang == "fr") {
        i18n = {
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
        carrousel: "carrousel",
        slider: "carrousel__slider", // slider (servant de fenetre d'affichage)
        container: "carrousel__container", // container englobant directement les elements du slider
        controller: "carrousel__controller",
        pagination: "carrousel__pagination",
        paginationButton: "carrousel__pagination__page",
        toggleButton: "carrousel__toggle",
        toggleButtonPause: "carrousel__toggle__pause",
        toggleButtonPlay: "carrousel__toggle__play"
    }

    window.osuny.carousel.manager.createInstances(carrouselClasses);

    // Listeners
    window.osuny.carousel.manager.initListeners();

});

