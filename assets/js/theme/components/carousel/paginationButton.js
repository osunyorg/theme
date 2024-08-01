window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.PaginationButton = function PaginationButton(element, index) {
    this.element = element;
    this.index = index;
    this.progressBar;
    this._initialize();
}

window.osuny.carousel.PaginationButton.prototype = {
    _initialize: function () {
        var ariaLabel = this.element.getAttribute("aria-label"),
            ariaNewLabel = ariaLabel.replace("%s", this.index);
        this.element.setAttribute("aria-label", ariaNewLabel);
        this.progressBar = this.element.querySelector("i");
        this.setProgression(0);
        this.element.addEventListener("click", this.onClick.bind(this));
    },
    onClick: function () {
        var event = new Event("paginationButtonClicked");
        event.index = this.index;
        this.element.dispatchEvent(event);
    },
    setProgression: function (progression) {
        this.progressBar.style.setProperty("width", String(progression * 100) + "%");
    },
    setSelected: function(state){
        this.element.setAttribute("aria-selected", String(state));
    }
}