/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Autoplayer = function (element) {
    this.element = element;
    if (!this.element) {
        return;
    }
    this.icons = {
        play: this.element.getElementsByClassName(window.osuny.carousel.classes.autoplayerToggleIconPlay).item(0),
        pause: this.element.getElementsByClassName(window.osuny.carousel.classes.autoplayerToggleIconPause).item(0)
    };
    this.ariaLiveElement = null;
    // Etat de l'autoplay
    this.enabled = false;
    // Etat de pause (quand on rollover par exemple)
    this.paused = false;
    // Pause au rollover
    this.softPaused = false;
    // Intervalle en millisecondes entre 2 déclenhements
    this.interval = 3000;
    this._resetLoopValues();
    // Bouton toggle
    this.classList = this.element.classList;
    this.classList.add(window.osuny.carousel.classes.autoplayerPaused);
    this.element.addEventListener('click', this._onClick.bind(this));
    this.environment = window.osuny.carousel;
    this._dispatchEvent = window.osuny.components.utils.dispatchEvent.bind(this);
};
window.osuny.carousel.Autoplayer.prototype = {
    setInterval: function (interval) {
        this.interval = interval;
    },
    // enable() et disable() activent la boucle
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
    // pause() et unpause() interrompent temporairement la boucle, en gardant la position
    pause: function () {
        this.paused = true;
        this._updateToggle();
    },
    unpause: function () {
        this.paused = false;
        this.softPaused = false;
        this._updateToggle();
    },
    // Les méthodes soft se produisent quand on passe sur le carousel avec la souris.
    // L'idée est de permettre aux personnes de lire une citation.
    // Elles ne changent pas réellement l'état de l'autoplayer,
    // mais elles l'arrêtent temporairement.
    softPause: function () {
        this.softPaused = true;
    },
    softUnpause: function () {
        this.softPaused = false;
    },
    _loop: function () {
        var now = Date.now();
        if (!this.enabled) {
            return;
        }
        if (!this.paused && !this.softPaused) {
            this.elapsedSinceLastTrigger += now - this.lastLoopAt;
            this.progression = this.elapsedSinceLastTrigger / this.interval;
            this._dispatchProgression();
        }
        if (this.elapsedSinceLastTrigger > this.interval) {
            this._dispatchTrigger();
            this._resetLoopValues();
            this._dispatchProgression();
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
        this._dispatchEvent('autoplayerTrigger');
    },
    _dispatchProgression () {
        this._dispatchEvent('autoplayerProgression', this.progression);
    },
    _updateToggle: function () {
        if (!this.element) {
            return;
        }
        this.classList.remove(window.osuny.carousel.classes.autoplayerPlaying);
        this.classList.remove(window.osuny.carousel.classes.autoplayerPaused);
        if (this.paused) {
            this.classList.add(window.osuny.carousel.classes.autoplayerPaused);
        } else {
            this.classList.add(window.osuny.carousel.classes.autoplayerPlaying);
        }
        this.icons.play.setAttribute('aria-hidden', !this.paused);
        this.icons.pause.setAttribute('aria-hidden', this.paused);
    },
    _onClick: function () {
        if (this.paused) {
            this.unpause();
            this.enable();
        } else {
            this.pause();
        }
    }
};
