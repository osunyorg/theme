window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Autoplayer = function (element) {
    // Element du DOM du carousel qui utilise l'autoplayer
    this.element = element;
    // Etat de l'autoplay
    this.enabled = false;
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
    
    return {
        setInterval: this.setInterval.bind(this),
        enable: this.enable.bind(this),
        disable: this.disable.bind(this),
        pause: this.pause.bind(this),
        unpause: this.unpause.bind(this)
    }
}
window.osuny.carousel.Autoplayer.prototype = {
    events: {
        trigger: 'trigger',
        progression: 'progression'
    },
    setInterval: function (interval) {
        this.interval = interval;
    },
    enable: function () {
        this.enabled = true;
        this._resetLoopValues();
        this._loop();
    },
    disable: function () {
        this.enabled = false;
    },
    pause: function () {
        this.paused = true;
    },
    unpause: function () {
        this.paused = false;
    },
    _loop: function () {
        if (!this.enabled) {
            return;
        }
        var now = Date.now();
        if (!this.paused) {
            this.elapsedSinceLastTrigger += now - this.lastLoopAt;
            this.progression = this.elapsedSinceLastTrigger / this.interval;
            this._dispatchProgression();
        }
        if (this.elapsedSinceLastTrigger > this.interval) {
            this._dispatchTrigger();
            this._resetLoopValues();
        }
        // Mémoire du last loop pour la sortie de pause
        this.lastLoopAt = now;
        window.requestAnimationFrame(this._loop.bind(this));
    },
    _resetLoopValues: function () {
        this.progression = 0;
        this.elapsedSinceLastTrigger = 0;
        this.lastLoopAt = Date.now();
    },
    _dispatchTrigger: function () {
        var event = new Event(this.events.trigger);
        this.element.dispatchEvent(event);
    },
    _dispatchProgression(){
        var event = new Event(this.events.progression);
        event.progression = this.progression;
        this.element.dispatchEvent(event);
    }
}