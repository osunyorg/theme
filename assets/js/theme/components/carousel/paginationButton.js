window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

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