window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

// TODO fusionner dans Autoplayer
window.osuny.carousel.ToggleButton = function (element) {
    this.element = element;
    this.classList = this.element.classList;
    this.isPlaying = false;
    this.events = {};
    this._initialize();
    return {
        play: this.play.bind(this),
        pause: this.pause.bind(this)
    }
}
window.osuny.carousel.ToggleButton.prototype = {
    classes: {
        paused: "toggle__paused",
        playing: "toggle__playing"
    },
    events: {
        play: "play",
        pause: "pause"
    },
    play: function () {
        this.isPlaying = true;
        this.classList.remove(this.classes.paused);
        this.classList.add(this.classes.playing);
    },
    pause: function () {
        this.isPlaying = false;
        this.classList.remove(this.classes.playing);
        this.classList.add(this.classes.paused);
    },
    _initialize: function () {
        this.classList.add(this.classes.paused);
        this.element.addEventListener("click", this._onClick.bind(this));
    },
    _onClick: function () {
        var eventKind = this.isStarted ? this.events.pause : this.events.play,
            event = new Event(eventKind);
        this.element.dispatchEvent(event);
    }
}