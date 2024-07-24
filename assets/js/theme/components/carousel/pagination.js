if (!window.osuny) {
    window.osuny = {};
}

if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}

window.osuny.carousel.Pagination = function (instance) {
    this.instance = instance;
    this.container = null;
    this.tabButtons = [];
    this.toggleButton = null;
    this.carouselLength = this.instance.slider.length();
    this.initialize();

}

window.osuny.carousel.Pagination.prototype = {
    classes: {
        controller: "carousel__controller",
        pagination: "carousel__pagination"
    },
    // 3 possibilités pour récupérer les textes localisés
    // 1. en data-attributes du carousel, mais ça fait de la redondance si plusieurs carousels dans la même page
    // 2. en script inline, mais pb de sécurité et pas très élégant
    // 3. en js externe, mais une requête de plus pour pas grand chose
    // 4 intégrer les éléments directement dans le DOM
    // Solution adoptée : 4
    i18n: { // TODO trouver comment récuperer depuis yml
        first: 'Aller au premier slide',
        last: 'Aller au dernier slide',
        next: 'Slide suivant',
        pageX: 'Aller à la page %s',
        pause: 'Mettre en pause le carousel',
        play: 'Démarrer le carousel',
        prev: 'Slide précedent',
        slideX: 'Aller au slide %s',
    },
    initialize: function () {
        if (this.instance.options.pagination || this.instance.options.arrows) {
            this.container = document.createElement("div");
            this.container.classList.add(this.classes.controller);
            if (this.instance.options.pagination) {
                this.initializeTabPagination();
            }

            if (this.instance.options.arrows) {
                console.log("TODO implemente arrows")
            }

            if (this.instance.options.autoplay) {
                this.toggleButton = new window.osuny.carousel.ToggleButton(this.instance);
                this.container.append(this.toggleButton.container);
            }

            this.instance.root.append(this.container);
        }
    },

    initializeTabPagination() {
        var pagination;
        pagination = document.createElement("ul");
        pagination.classList.add(this.classes.pagination);

        this.tabButtons = [];

        for (var i = 0; i < this.carouselLength; i += 1) {
            this.tabButtons.push(new window.osuny.carousel.PaginationButton(i, this))
            pagination.append(this.tabButtons[i].container);
            console.log(pagination)
        }
        this.container.append(pagination);
    }
}

window.osuny.carousel.PaginationButton = function PaginationButton(index, paginationInstance) {
    this.index = index;
    this.progress = 0;
    this.container = null;
    this.progressBar = null;
    this.instance = paginationInstance;
    this.initialize();
}

window.osuny.carousel.PaginationButton.prototype = {
    classes: {
        paginationButton: "carousel__pagination__page"
    },
    initialize: function () {
        this.container = document.createElement("li");
        this.container.setAttribute("role", "presentation");

        var button = document.createElement("button");
        button.classList.add(this.classes.paginationButton);
        button.setAttribute("role", "tab");
        button.setAttribute("type", "button");
        button.setAttribute("aria-label", this.instance.i18n.slideX.replace("%s", this.index));
        button.setAttribute("aria-controls", "slideX".replace("X", this.index));
        button.setAttribute("tabindex", this.index);

        this.progressBar = document.createElement("i");
        button.append(this.progressBar);

        this.container.append(button);

        this.setProgress(0);

        // this container click event

    },
    setProgress: function (progress) {
        this.progress = progress;
        this.progressBar.setAttribute("width", String(this.progress * 100) + "%");
    }
}

window.osuny.carousel.ToggleButton = function (instance) {
    this.class = [];
    this.state = 1;
    this.instance = instance;
    this.container = null;
    this.initialize();
}

window.osuny.carousel.ToggleButton.prototype = {
    classes: {
        button: "carousel__toggle",
        pause: "carousel__toggle__pause",
        play: "carousel__toggle__play"
    },
    initialize: function () {
        this.state_classes = [this.classes.play, this.classes.pause];
        this.container = document.createElement("button");
        this.container.classList.add(this.classes.button);
        var span = document.createElement("span");
        span.classList.add(this.state_classes[this.state]);
        this.container.append(span);
    },
    toggle: function (target) {
        var newState = Math.abs(this.state - 1);
        target.classList.replace(this.class[this.state], this.class[newState]);
        this.state = newState;
    }
}