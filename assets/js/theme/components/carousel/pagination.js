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
