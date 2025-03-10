var osuny = window.osuny || {};

osuny.StickyTitle = function (container, titleSelector) {
    this.container = container;
    this.title = container.querySelector(titleSelector);

    if (this.container && this.title) {
        this.listen();
    }
}

osuny.StickyTitle.prototype.listen = function () {
    var distance = 0,
        threshold = 10;
    window.addEventListener('scroll', function() {
        distance = Math.abs(this.title.offsetTop - this.container.offsetTop)
        if (distance > threshold) {
            this.title.classList.add('is-down');
        } else {
            this.title.classList.remove('is-down');
        }
        this.container.style.setProperty('--title-height', this.title.offsetHeight + 'px');
    }.bind(this));
};

// Setup agenda page titles
(function () {
    var events = document.querySelectorAll('.events-date');
    events.forEach(function (event) {
        new osuny.StickyTitle(event, '.events-date-title');
    });
}());
