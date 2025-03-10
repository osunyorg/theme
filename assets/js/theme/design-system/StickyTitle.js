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
        threshold = 10,
        hours = this.container.querySelector('.event:last-child .event-hours span');
    window.addEventListener('scroll', function() {
        distance = Math.abs(this.title.offsetTop - this.container.offsetTop)
        if (distance > threshold) {
            this.title.classList.add('is-down');
            this.container.style.maxHeight = this.container.offsetHeight + "px";
        } else {
            this.title.classList.remove('is-down');
            this.container.style.maxHeight = "none";
        }
        this.container.style.setProperty('--title-height', this.title.offsetHeight + 'px');

        if (hours) {
            this.container.style.setProperty('--title-margin-bottom', hours.offsetHeight + 'px');
        }
    }.bind(this));
};

// Setup agenda page titles
(function () {
    var events = document.querySelectorAll('.events-date');
    events.forEach(function (event) {
        new osuny.StickyTitle(event, '.events-date-title');
    });
}());
