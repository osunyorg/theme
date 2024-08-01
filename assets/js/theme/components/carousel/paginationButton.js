window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.PaginationButton = function PaginationButton(element, index, pagination) {
    this.element = element;
    this.index = index;
    this.pagination = pagination;
    this.progression = 0;
    var ariaLabel = this.element.getAttribute("aria-label"),
        ariaNewLabel = ariaLabel.replace("%s", this.index);
    this.element.setAttribute("aria-label", ariaNewLabel);
    this.progressBar = this.element.querySelector("i");
    this.setProgression(0);
    this.element.addEventListener("click", this._onClick.bind(this));
}

window.osuny.carousel.PaginationButton.prototype = {
    setProgression: function (progression) {
        this.progression = progression;
        var percent = String(this.progression * 100) + "%";
        this.progressBar.style.setProperty("width", percent);
    },
    select: function () {
        this.setProgression(1);
        this.element.setAttribute("aria-selected", "true");
    },
    unselect: function () {
        this.setProgression(0);
        this.element.setAttribute("aria-selected", "false");
    },
    _onClick: function () {
        var event = new Event("paginationButtonClicked");
        event.index = this.index;
        this.pagination.dispatchEvent(event);
    }
}