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
    var maxTitleHeight = 0;

    // On vient regarder dans tous les .timeline-event pour vérifier quel est le titre le plus long
    var events = this.timeline.getElementsByClassName((this.eventClass));
    for (var i = 0; i < events.length; i++) {
        var eventTitle = events[i].querySelector('.title');
        if (eventTitle) {
            var titleHeight = eventTitle.offsetHeight;
            if (titleHeight > maxTitleHeight) {
                maxTitleHeight = titleHeight;
            }
        }
    }
    // On met à jour la variable css qui ajoute une min-height au .title
    // L'objectif est d'aligner les lignes de la timeline entre elles
    this.timeline.style.cssText += '; --min-title-height: ' + maxTitleHeight + 'px;';
}

Timeline.prototype.handleResize = function() {
    this.updateTitleHeight();
};

document.addEventListener('DOMContentLoaded', function() {
    var timelines = document.getElementsByClassName('block-timeline--horizontal');
    for (var i = 0; i < timelines.length; i++) {
        new Timeline(timelines[i]);
    }
});