window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Autoplayer = function (instance, interval = 3000) {
    // Instance du carousel qui utilise l'autoplayer
    this.instance = instance;
    // Etat de l'autoplay
    this.running = false;
    // Etat de pause (quand on rollover par exemple)
    this.paused = false;
    // Intervalle en millisecondes entre 2 déclenhements
    this.interval = interval;
    // Progression de 0 à 1, vers le prochain déclenchement
    this.progression = 0;
    // Date de la dernière boucle
    this.lastLoopAt = null;
    // Temps écoulé depuis le dernier déclenchement
    this.elapsedSinceLastTrigger = 0;
    
    this.events = {};
    this._initializeEmitter();

    return {
        start: this.start.bind(this),
        stop: this.stop.bind(this),
        pause: this.pause.bind(this),
        unpause: this.unpause.bind(this),
        reset: this.reset.bind(this)
    }
}
window.osuny.carousel.Autoplayer.prototype = {
    start: function () {
        this.running = true;
        this._resetLoopValues();
        this._loop();

    },
    stop: function () {
        this.running = false;
    },
    pause: function () {
        this.paused = true;
    },
    unpause: function () {
        this.paused = false;
    },
    reset: function () {
        this._resetLoopValues();
    },
    _initializeEmitter:function(){
        this.events.progression = new Event("progression");
        this._setProgression(0);
    },
    _loop: function () {
        var now = Date.now();
        if (!this.paused) {
            this.elapsedSinceLastTrigger += now - this.lastLoopAt;
            this._setProgression(this.elapsedSinceLastTrigger / this.interval)
        }
        if (this.elapsedSinceLastTrigger > this.interval) {
            this._trigger();
        }
        // Mémoire du last loop pour la sortie de pause
        this.lastLoopAt = now;
        if (this.running) {
            window.requestAnimationFrame(this._loop.bind(this));
            // this.instance.onAutoplayProgressionChanged();
        }
    },
    _resetLoopValues: function () {
        this._setProgression(0);
        this.elapsedSinceLastTrigger = 0;
        this.lastLoopAt = Date.now();
    },
    _trigger: function () {
        this._resetLoopValues();
        this.instance.next();
    },
    _setProgression(progression){
        this.progression = progression;
        this.events.progression.progression = this.progression;
        // this.instance.root.dispatchEvent(this.events.progression); // no hcoice, autoplayer n'a pas de dom
    }
}