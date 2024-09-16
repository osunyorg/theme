window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.PaginationButton = function PaginationButton(element, index, pagination) {
    this.element = element;
    this.index = index;
    this.pagination = pagination;
    this.progressBar = this.element.querySelector('i');
    this.setProgression(0);
    this.element.addEventListener('click', this._onClick.bind(this));
};

window.osuny.carousel.PaginationButton.prototype = {
    setProgression: function (progression) {
        var percent;
        this.progression = progression;
        percent = String(this.progression * 100) + '%';
        this.progressBar.style.setProperty('width', percent);
    },
    select: function () {
        this.setProgression(1);
        this.element.setAttribute('aria-selected', 'true');
    },
    unselect: function () {
        this.setProgression(0);
        this.element.setAttribute('aria-selected', 'false');
    },
    _onClick: function () {
        var event = new Event(window.osuny.carousel.events.paginationButtonClicked);
        event.index = this.index;
        this.pagination.dispatchEvent(event);
    },
    setAriaCurrent (current) {
        this.element.setAttribute('aria-current', String(current));
    }
};
