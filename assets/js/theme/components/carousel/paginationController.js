window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Pagination = function (instance) {
    this.instance = instance;
    this.slider = this.instance.slider;
    this.container = null;
    this.tabButtons = [];
    this.toggleButton = null;
    this.tabButtonModel = null;
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
            this.toggleButton = window.osuny.utils.instanciateIf(this, window.osuny.carousel.ToggleButton, this.instance.options.autoplay);
        }
    },

    initializeTabPagination() {
        var pagination = this.container.getElementsByClassName(this.classes.pagination).item(0);
        if (this.instance.options.autoplay) {
            pagination.classList.add('has_toggle');
        }

        this.tabButtons = [];
        for (var i = 0; i < this.carouselLength; i += 1) {
            this.tabButtons.push(new window.osuny.carousel.PaginationButton(i, this))
        }
        this.container.classList.add('is-visible');
    },

    setSlideProgression: function (progression) {
        this.tabButtons[this.slider.index].setProgress(progression);
    },
    resetSlidesState: function () {
        this.tabButtons.forEach(function (tabButton) {
            tabButton.setProgress(0);
            tabButton.setSelected(false);
        });
    },
    onSlideChanged: function () {
        this.resetSlidesState();
        this.setSlideProgression(1);
        this.tabButtons[this.slider.index].container.focus();
        this.tabButtons[this.slider.index].setSelected(true);
    },
    onAutoplayStarted: function () {
        this.toggleButton.toggleStart();
    },
    onAutoplayStopped: function () {
        this.toggleButton.toggleStop();
    }
}

window.osuny.carousel.PaginationButton = function PaginationButton(index, pagination) {
    this.index = index;
    this.container = null;
    this.progressBar = null;
    this.pagination = pagination;
    this.button = null;
    this.instance = this.pagination.instance;
    this.initialize();
}

window.osuny.carousel.PaginationButton.prototype = {
    initialize: function () {
        this.container = this.pagination.container.querySelectorAll("li").item(this.index);
        this.button = this.container.querySelector('button');

        var ariaLabel = this.button.getAttribute("aria-label");
        this.button.setAttribute("aria-label", ariaLabel.replace("%s", this.index));
        
        this.progressBar = this.button.querySelector("i");

        this.setProgress(0);
        this.container.addEventListener("click", this.onClick.bind(this));
    },
    onClick: function (e) {
        this.instance.showSlide(this.index);
        this.instance.stopAutoplay();
        this.setProgress(1);
    },
    setProgress: function (progress) {
        this.progressBar.style.setProperty("width", String(progress * 100) + "%");
    },
    setSelected: function(state){
        this.button.setAttribute("aria-selected", String(state));
    }
}

window.osuny.carousel.ToggleButton = function (pagination) {
    this.class = [];
    this.isPlay = false;
    this.pagination = pagination;
    this.instance = this.pagination.instance;
    this.container = null;
    this.initialize();
}
window.osuny.carousel.ToggleButton.prototype = {
    classes: {
        button: "toggle",
        pause: "toggle__pause",
        play: "toggle__play"
    },
    initialize: function () {
        this.state_classes = [this.classes.play, this.classes.pause];
        this.container = this.pagination.container.getElementsByClassName(this.classes.button).item(0);
        this.container.classList.add('is-visible');
        this.container.classList.add(this.state_classes[+ this.isPlay]);
        this.container.addEventListener("click", this.onClick.bind(this));
    },
    toggleState: function () {
        this.container.classList.replace(this.state_classes[+this.isPlay], this.state_classes[+ !this.isPlay]);
        this.isPlay = !this.isPlay;
    },
    toggleStart: function () {
        if (!this.isPlay) {
            this.toggleState();
        }
    },
    toggleStop: function () {
        if (this.isPlay) {
            this.toggleState();
        }
    },
    onClick: function () {
        this.instance.toggleAutoplay();
    }
}