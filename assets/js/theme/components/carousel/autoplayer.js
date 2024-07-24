if (!window.osuny) {
    window.osuny = {};
}
if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}
window.osuny.carousel.Autoplayer = function Autoplayer(instance) {
    // TODO pour faire vraiment robuste, il faudrait exposer uniquement
    // start()
    // stop()
    // pause()
    // unpause()
    // progression
    this.instance = instance;
    this.running = false;
    this.paused = false;
    this.interval = 2000;
    this.progression = 0;
    this.lastLoopAt = null;
    this.elapsed = 0;
    this.initialize();
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
            this.progress = this.elapsed / this.interval;
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
        console.log("paused")
    },
    unpause: function () {
        this.paused = false;
        console.log("unpaused")
    },
    resetLoopValues: function () {
        this.progress = 0;
        this.elapsed = 0;
        this.lastLoopAt = Date.now();
    },
    trigger: function () {
        this.resetLoopValues();
        this.instance.next();
    }
}
