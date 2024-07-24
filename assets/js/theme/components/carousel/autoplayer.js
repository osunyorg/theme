if (!window.osuny) {
    window.osuny = {};
}
if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}
window.osuny.carousel.Autoplayer = function (instance) {
    this.instance = instance;
    this.running = false;
    this.paused = false;
    this.interval = 2000;
    this.progression = 0;
    this.lastLoopAt = null;
    this.elapsed = 0;
    this.initialize();
    return {
        start: this.start.bind(this),
        stop: this.stop.bind(this),
        pause: this.pause.bind(this),
        unpause: this.unpause.bind(this),
        getProgression: this.getProgression.bind(this),
    }
}
window.osuny.carousel.Autoplayer.prototype = {
    initialize: function () {
        if (this.instance.options.interval) {
            this.interval = this.instance.options.interval;
        }
        if (this.instance.options.autoplay) {
            this.start();
        }
    },
    start: function () {
        this.running = true;
        this.resetLoopValues();
        this.loop();
    },
    stop: function () {
        this.running = false;
    },
    loop: function () {
        var now = Date.now();
        if (!this.paused) {
            this.elapsed += now - this.lastLoopAt;
            this.progression = this.elapsed / this.interval;
        }
        if (this.elapsed > this.interval) {
            this.trigger();
        }
        // Mémoire du last loop pour la sortie de pause
        this.lastLoopAt = now;
        if (this.running) {
            window.requestAnimationFrame(this.loop.bind(this));
        }
    },
    pause: function () {
        this.paused = true;
    },
    unpause: function () {
        this.paused = false;
    },
    resetLoopValues: function () {
        this.progress = 0;
        this.elapsed = 0;
        this.lastLoopAt = Date.now();
    },
    trigger: function () {
        this.resetLoopValues();
        this.instance.next();
    },
    getProgression: function () {
        return this.progression;
    }
}
