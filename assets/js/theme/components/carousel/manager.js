if (!window.osuny) {
    window.osuny = {};
}

if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}

window.osuny.carousel.manager = {
    classes: {},
    instances: [],
    createInstance: function (id, domElement) {
        domElement.setAttribute("id", "carrouselX".replace("X", id));
        var sliderElement = domElement.getElementsByClassName(this.classes.carrousel.slider).item(0);
        var slidesContainerElement = sliderElement.getElementsByClassName(this.classes.carrousel.container).item(0);
        var domElements = {
            root: domElement,
            slider: sliderElement,
            container: slidesContainerElement
        }

        var options = JSON.parse(domElement.getAttribute(this.classes.carrousel.data_tag));
        var carrouselOptions = {};
        carrouselOptions.transition_duration = options.transition_duration;
        // Check pagination options 
        if (options.pagination == true) {
            carrouselOptions.pagination = {
                classes: this.classes.pagination
            };
        }
        carrouselOptions.i18n = this.i18n;
        return new Carrousel(domElements, carrouselOptions);
    },
    createInstances: function (classes, i18n) {
        //check classes
        var test_DOM_classes = this.assertClasses(classes);
        this.i18n = i18n;
        if (test_DOM_classes.success) {
            this.classes = classes;
            var carrousels = document.getElementsByClassName(this.classes.carrousel.root);
            for (var i = 0; i < carrousels.length; i += 1) {
                var instance = this.createInstance(i, carrousels[i])

                // Setting listeners
                instance.container.addEventListener("mouseenter", function (e) { instance.onMouseEnter(); });
                instance.container.addEventListener("mouseleave", function (e) { instance.onMouseLeave(); });

                if (instance.pagination) {
                    for (var n = 0; n < instance.pagination.tabButtons.length; n += 1) {
                        console.log(instance.pagination.tabButtons[n])
                        instance.pagination.tabButtons[n].domElement.addEventListener("click", function (e) {
                            this.goTo(e.target.getAttribute("tabindex"));
                        }.bind(instance));
                    }
                }

                this.instances.push(instance);
            }
        } else {
            console.error(test_DOM_classes.error);
        }
    },
    initListeners: function () {
        window.addEventListener('resize', function () {
            for (var i = 0; i < this.instances.length; i += 1) {
                this.instances[i].onResize();
            }

        }.bind(this));

        ///// TEST TO REMOVE /////
        document.addEventListener("keydown", function (e) {
            if (e.key == 'ArrowLeft') {
                for (var i = 0; i < this.instances.length; i += 1) {
                    this.instances[i].move(-1);
                }
            }
            else if (e.key == 'ArrowRight') {
                for (var i = 0; i < this.instances.length; i += 1) {
                    this.instances[i].move(1);
                }
            }
        }.bind(this))
        ///// 
    },
    assertClasses: function (classes) {
        var success = false;
        var error = "";
        if (classes.carrousel) {
            if (classes.carrousel.root && classes.carrousel.slider && classes.carrousel.container && classes.carrousel.data_tag) {
                if (classes.pagination) {
                    if (classes.pagination.controller && classes.pagination.pagination && classes.pagination.paginationButton && classes.pagination.toggleButton && classes.pagination.toggleButtonPause && classes.pagination.toggleButtonPlay) {
                        success = true;
                    }
                    else {
                        error = "Couldn't create carrousel because DOM classes are missing (pagination)";
                    }
                }
            }
            else {
                error = "Couldn't create carrousel because DOM classes are missing";
            }
        }
        else {
            error = "Couldn't create carrousel because DOM classes are missing";
        }
        return { success, error };
    },
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
        carrousel: {
            root: "carrousel",
            data_tag: "data-carrousel",
            slider: "carrousel__slider", // slider (servant de fenetre d'affichage)
            container: "carrousel__container", // container englobant directement les elements du slider
        },
        pagination: {
            controller: "carrousel__controller",
            pagination: "carrousel__pagination",
            paginationButton: "carrousel__pagination__page",
            toggleButton: "carrousel__toggle",
            toggleButtonPause: "carrousel__toggle__pause",
            toggleButtonPlay: "carrousel__toggle__play"
        }
    }

    window.osuny.carousel.manager.createInstances(carrouselClasses, i18n);

    // Listeners
    window.osuny.carousel.manager.initListeners();

});

