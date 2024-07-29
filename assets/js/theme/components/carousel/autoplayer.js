window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Autoplayer = function (instance) {
    // Instance du carousel qui utilise l'autoplayer
    this.instance = instance;
    this.pagination = null;
    // Etat de l'autoplay
    this.running = false;
    // Etat de pause (quand on rollover par exemple)
    this.paused = false;
    // Intervalle en millisecondes entre 2 déclenhements
    this.interval = 3000;
    // Progression de 0 à 1, vers le prochain déclenchement
    this.progression = 0;
    // Date de la dernière boucle
    this.lastLoopAt = null;
    // Temps écoulé depuis le dernier déclenchement
    this.elapsedSinceLastTrigger = 0;
    this.initialize();
    return {
        start: this.start.bind(this),
        stop: this.stop.bind(this),
        pause: this.pause.bind(this),
        unpause: this.unpause.bind(this),
        onSlideChanged: this.onSlideChanged.bind(this)
    }
}
window.osuny.carousel.Autoplayer.prototype = {
    initialize: function () {
        this.getOptions();
    },
    getOptions: function () {
        if (this.instance.options.interval) {
            this.interval = this.instance.options.interval;
        }
        if (this.instance.pagination) {
            this.pagination = this.instance.pagination;
        }
    },
    start: function () {
        this.running = true;
        this.resetLoopValues();
        this.loop();
        this.updateViewState();

    },
    stop: function () {
        this.running = false;
        if (this.pagination) {
            this.pagination.toggleButton.toggleStop();
        }
    },
    loop: function () {
        var now = Date.now();
        if (!this.paused) {
            this.elapsedSinceLastTrigger += now - this.lastLoopAt;
            this.progression = this.elapsedSinceLastTrigger / this.interval;
        }
        if (this.elapsedSinceLastTrigger > this.interval) {
            this.trigger();
        }
        // Mémoire du last loop pour la sortie de pause
        this.lastLoopAt = now;
        if (this.running) {
            window.requestAnimationFrame(this.loop.bind(this));
            this.updateViewProgression();
        }
    },
    pause: function () {
        this.paused = true;
    },
    unpause: function () {
        this.paused = false;
    },
    resetLoopValues: function () {
        this.progression = 0;
        this.elapsedSinceLastTrigger = 0;
        this.lastLoopAt = Date.now();
    },
    trigger: function () {
        this.resetLoopValues();
        this.instance.next();
    },
    updateViewProgression: function () {
        if (this.pagination) {
            this.pagination.setSlideProgression(this.progression);
        }
    },
    updateViewState: function () {
        if (this.pagination) {
            this.pagination.toggleButton.toggleState();
        }
    },
    onSlideChanged: function () {
        this.resetLoopValues();
    }
}