if (!window.osuny) {
    window.osuny = {};
}
if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}

window.osuny.carousel.Pagination = function (instance) {
    this.instance = instance;
    this.slider = this.instance.slider;
    this.container = null;
    this.tabButtons = [];
    this.toggleButton = null;
    this.carouselLength = this.slider.length();
    this.initialize();
}

window.osuny.carousel.Pagination.prototype = {
    classes: {
        container: "carousel__pagination",
        pagination: "carousel__pagination__tabcontainer"
    },

    initialize: function () {
        this.container = this.instance.root.getElementsByClassName(this.classes.container).item(0);
        if (this.instance.options.pagination) {
            this.initializeTabPagination();
        }

        if (this.instance.options.autoplay) {
            this.toggleButton = new window.osuny.carousel.ToggleButton(this);
        }
    },

    initializeTabPagination() {
        var pagination = this.container.getElementsByClassName(this.classes.pagination).item(0);
        this.tabButtons = [];
        for (var i = 0; i < this.carouselLength; i += 1) {
            this.tabButtons.push(new window.osuny.carousel.PaginationButton(i, this))
            pagination.append(this.tabButtons[i].container);
        }
    },

    setSlideProgression: function(progression){
        this.tabButtons[this.slider.index].setProgress(progression);
    }
}

window.osuny.carousel.PaginationButton = function PaginationButton(index, paginationInstance) {
    this.index = index;
    this.progress = 0;
    this.container = null;
    this.progressBar = null;
    this.pagination = paginationInstance;
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
        button.setAttribute("aria-controls", "slideX".replace("X", this.index));
        button.setAttribute("tabindex", this.index);

        this.progressBar = document.createElement("i");
        button.append(this.progressBar);

        this.container.append(button);

        this.setProgress(1);
    },
    setProgress: function (progress) {
        this.progress = progress;
        this.progressBar.style.setProperty("width", String(this.progress * 100) + "%");
    }
}

window.osuny.carousel.ToggleButton = function (pagination) {
    this.class = [];
    this.state = 1;
    this.pagination = pagination;
    this.instance = this.pagination.instance;
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
        this.container = this.pagination.container.getElementsByClassName(this.classes.button).item(0);
        this.container.classList.add(this.state_classes[this.state]);
        this.initializeListener();
    },
    toggleUI: function () {
        this.container.classList.replace(this.state_classes[this.state], this.state_classes[Math.abs(this.state - 1)]);
    },
    initializeListener: function () {
        var callBack = this.toggle.bind(this);
        this.container.addEventListener("click", function (e) {
            callBack(e);
        });
    },
    toggle: function (e) {
        this.toggleUI();
        if (this.state == 1) {
            this.instance.autoplayer.stop();
        } else {
            this.instance.autoplayer.start();
        }
        this.state = Math.abs(this.state-1);
    }
}