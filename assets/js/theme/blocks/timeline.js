var osuny = window.osuny || {};

osuny.Timeline = function (timeline) {
    this.timeline = timeline;
    this.updateTitleHeight();
    window.addEventListener('resize', this.updateTitleHeight.bind(this));
};

osuny.Timeline.prototype.updateTitleHeight = function () {
    var maxTitleHeight = this.getMaxTitleHeight();
    // On met à jour la variable css qui ajoute une min-height au .title
    // L'objectif est d'aligner les lignes de la timeline entre elles
    this.timeline.style.setProperty('--min-title-height', maxTitleHeight + 'px');
};

osuny.Timeline.prototype.getMaxTitleHeight = function () {
    var maxTitleHeight = 0,
        events = this.timeline.querySelectorAll('.timeline-event');

    // On vient regarder dans tous les .timeline-event pour vérifier quel est le titre le plus long
    events.forEach(function (event) {
        var titleHeight = this.getTitleHeight(event);
        if (titleHeight > maxTitleHeight) {
            maxTitleHeight = titleHeight;
        }
    }, this);

    return maxTitleHeight;
};

osuny.Timeline.prototype.getTitleHeight = function (event) {
    var eventTitle = event.querySelector('.title');
    return eventTitle ? eventTitle.offsetHeight : 0;
};

document.addEventListener('DOMContentLoaded', function () {
    osuny.utils.instanciateAll('.block-timeline--horizontal', osuny.Timeline);
});
