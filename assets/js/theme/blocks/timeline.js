function Timeline(timeline) {
    this.timeline = timeline;
    this.eventClass = 'timeline-event'
    this.init();
}

Timeline.prototype.init = function() {
    this.updateTitleHeight();

    // Resize
    window.addEventListener('resize', this.handleResize.bind(this));
};

Timeline.prototype.updateTitleHeight = function () {
    var maxTitleHeight = this.getMaxTitleHeight();

    // On met à jour la variable css qui ajoute une min-height au .title
    // L'objectif est d'aligner les lignes de la timeline entre elles
    this.updateCssVariable('--min-title-height', maxTitleHeight + 'px');
};

Timeline.prototype.getMaxTitleHeight = function () {
    var maxTitleHeight = 0;
    var events = this.timeline.getElementsByClassName(this.eventClass);

    // On vient regarder dans tous les .timeline-event pour vérifier quel est le titre le plus long
    Array.prototype.forEach.call(events, function(event) {
        var titleHeight = this.getTitleHeight(event);
        if (titleHeight > maxTitleHeight) {
            maxTitleHeight = titleHeight;
        }
    }, this);

    return maxTitleHeight;
}

Timeline.prototype.getTitleHeight = function (event) {
    var eventTitle = event.querySelector('.title');
    return eventTitle ? eventTitle.offsetHeight : 0;
};

Timeline.prototype.updateCssVariable = function (variable, value) {
    this.timeline.style.setProperty(variable, value);
};

Timeline.prototype.handleResize = function() {
    this.updateTitleHeight();
};

document.addEventListener('DOMContentLoaded', function() {
    var timelines = document.getElementsByClassName('block-timeline--horizontal');
    for (var i = 0; i < timelines.length; i++) {
        new Timeline(timelines[i]);
    }
});