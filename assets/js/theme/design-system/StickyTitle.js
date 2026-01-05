window.osuny = window.osuny || {};

window.osuny.StickyTitle = function (container, titleSelector) {
    this.container = container;
    this.title = container.querySelector(titleSelector);

    if (this.container && this.title) {
        this.listen();
    }
}

window.osuny.StickyTitle.prototype.listen = function () {
    var distance = 0,
        threshold = 5,
        titleOriginalHeight = this.title.offsetHeight,
        titleDownHeight = this.title.querySelector('span').offsetHeight,
        hours = this.container.querySelector('.events-scheduled > li:last-child .event .event-hours');
    console.log(hours)
    window.addEventListener('scroll', function() {
        distance = Math.abs(this.title.offsetTop - this.container.offsetTop);

        if (distance > threshold) {
            this.title.classList.add('is-down');
            titleDownHeight = this.title.querySelector('span').offsetHeight;
        } else {
            this.title.classList.remove('is-down');
        }

        this.title.style.maxHeight = titleOriginalHeight + 'px';
        this.container.style.setProperty('--title-height', titleDownHeight + 'px');

        if (hours) {
            console.log(hours.offsetHeight)
            this.container.style.setProperty('--title-margin-bottom', (hours.offsetHeight)  + 'px');
        }
    }.bind(this));
};

window.osuny.StickyTitle.prototype.setTitleHeight = function () {
    
};

// Setup agenda page titles
(function () {
    var events = document.querySelectorAll('.events-date.events-date--sticky');
    events.forEach(function (event) {
        new window.osuny.StickyTitle(event, '.events-date-title');
    });
}());
