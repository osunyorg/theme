window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Autoplayer = function (element) {
    this.element = element;
    this._initialize();
}
window.osuny.carousel.Autoplayer.prototype = {
    setInterval: function (interval) {
        this.interval = interval;
    },
    enable: function () {
        this.enabled = true;
        this._loop();
        this._updateToggle();
    },
    disable: function () {
        this.enabled = false;
        this.paused = true;
        this._updateToggle();
    },
    pause: function () {
        this.paused = true;
        this._updateToggle();
    },
    unpause: function () {
        this.paused = false;
        this._updateToggle();
    },
    _initialize: function () {
        // Etat de l'autoplay
        this.enabled = false;
        // Etat de pause (quand on rollover par exemple)
        this.paused = false;
        // Intervalle en millisecondes entre 2 déclenhements
        this.interval = 3000;
        this._resetLoopValues();
        // Bouton
        this.classList = this.element.classList;
        this.classList.add(window.osuny.carousel.classes.autoplayerPaused);
        this.element.addEventListener("click", this._onClick.bind(this));
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
        // Progression de 0 à 1, vers le prochain déclenchement
        this.progression = 0;
        // Temps écoulé depuis le dernier déclenchement
        this.elapsedSinceLastTrigger = 0;
        // Date de la dernière boucle
        this.lastLoopAt = Date.now();
    },
    _dispatchTrigger: function () {
        var event = new Event(window.osuny.carousel.events.autoplayerTrigger);
        this.element.dispatchEvent(event);
    },
    _dispatchProgression(){
        var event = new Event(window.osuny.carousel.events.autoplayerProgression);
        event.progression = this.progression;
        this.element.dispatchEvent(event);
    },
    _updateToggle: function () {
        this.classList.remove(window.osuny.carousel.classes.autoplayerPlaying);
        this.classList.remove(window.osuny.carousel.classes.autoplayerPaused);
        if (this.paused) {
            this.classList.add(window.osuny.carousel.classes.autoplayerPaused);
        } else {
            this.classList.add(window.osuny.carousel.classes.autoplayerPlaying);
        }
    },
    _onClick: function () {
        var eventKind = this.paused ? window.osuny.carousel.events.autoplayerPlay : window.osuny.carousel.events.autoplayerPause,
            event = new Event(eventKind);
        this.element.dispatchEvent(event);
    }
}