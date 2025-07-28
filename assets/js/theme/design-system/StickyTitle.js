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
        threshold = 5,
        titleOriginalHeight = this.title.offsetHeight,
        titleDownHeight = this.title.querySelector('span').offsetHeight,
        hours = this.container.querySelector('.event:last-child .event-hours span');

    window.addEventListener('scroll', function() {
        distance = Math.abs(this.title.offsetTop - this.container.offsetTop);

        if (distance > threshold) {
            this.title.classList.add('is-down');
            titleDownHeight = this.title.querySelector('span').offsetHeight;
        } else {
            this.title.classList.remove('is-down');
        }

        this.title.style.maxHeight = titleOriginalHeight + "px";
        this.container.style.setProperty('--title-height', titleDownHeight + 'px');

        if (hours) {
            this.container.style.setProperty('--title-margin-bottom', (titleDownHeight/2)  + 'px');
        }
    }.bind(this));
};

osuny.StickyTitle.prototype.setTitleHeight = function () {
    
};

// Setup agenda page titles
(function () {
    var events = document.querySelectorAll('.events-date');
    events.forEach(function (event) {
        new osuny.StickyTitle(event, '.events-date-title');
    });
}());
