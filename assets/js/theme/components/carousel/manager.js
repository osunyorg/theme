if (!window.osuny) {
    window.osuny = {};
}

if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}

window.osuny.carousel.manager = {
    domClasses: {
        carousel: {
            root: "carousel",
            data_tag: "data-carousel",
            slider: "carousel__slider", 
            container: "carousel__container", 
        },
        pagination: {
            controller: "carousel__controller",
            pagination: "carousel__pagination",
            paginationButton: "carousel__pagination__page",
            toggleButton: "carousel__toggle",
            toggleButtonPause: "carousel__toggle__pause",
            toggleButtonPlay: "carousel__toggle__play"
        }
    },
    instances: [],
    createInstances: function () {
        var carousels = document.getElementsByClassName(this.domClasses.carousel.root);
        for (var i = 0; i < carousels.length; i += 1) {
            carousels[i].setAttribute("id", "carouselX".replace("X", i));
            var instance = new window.osuny.carousel.Instance(carousels[i], this.domClasses);       
            this.instances.push(instance);
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
        }.bind(this));
        /////////////////////////

        for (var i = 0; i < this.instances.length; i += 1) {
            var instance = this.instances[i];
            instance.domElements.container.addEventListener("mouseenter", function (e) { instance.onMouseEnter(); });
            instance.domElements.container.addEventListener("mouseleave", function (e) { instance.onMouseLeave(); });

            if (instance.pagination) {
                for (var n = 0; n < instance.pagination.tabButtons.length; n += 1) {
                    instance.pagination.tabButtons[n].domElement.addEventListener("click", function (e) {
                        this.goTo(e.target.getAttribute("tabindex"));
                    }.bind(instance));
                }
                if (instance.pagination.toggleButton) {
                    instance.pagination.toggleButton.domElement.addEventListener("click", function (e) {
                        instance.onTogglePlay(e.target);
                    }.bind(instance));
                }
            }
        }
    }
}

window.addEventListener("load", function () {
    window.osuny.carousel.manager.createInstances();

    // Listeners
    window.osuny.carousel.manager.initListeners();

});

