window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Pagination = function (instance) {
    this.instance = instance;
    this.container = null;
    this.tabButtons = [];

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
    },
    initializeTabPagination() {
        this.tabButtons = [];
        for (var i = 0; i < this.instance.slides.total; i += 1) {
            this.tabButtons.push(new window.osuny.carousel.PaginationButton(i, this))
        }
        this.container.classList.add('is-visible');
    },

    setSlideProgression: function (progression) {
        this.tabButtons[this.instance.slides.current].setProgress(progression);
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
        this.tabButtons[this.instance.slides.current].container.focus();
        this.tabButtons[this.instance.slides.current].setSelected(true);
    }
}
