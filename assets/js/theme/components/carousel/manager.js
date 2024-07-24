if (!window.osuny) {
    window.osuny = {};
}
if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}
window.osuny.carousel.manager = {
    initialized: false,
    // @alex @olivia js-carousel ou osuny-carousel ?
    class: "js-carousel",
    domObjects: [],
    instances: [],
    initialize: function () {
        if (!this.initialized) {
            this.createInstances();
            this.initializeListeners();
            this.initialized = true;
        }
    },
    createInstances: function () {
        this.domObjects = document.getElementsByClassName(this.class);
        for (var i = 0; i < this.domObjects.length; i += 1) {
            var domObject = this.domObjects[i],
                instance = new window.osuny.carousel.Instance(domObject);
            this.instances.push(instance);
        }
    },
    initializeListeners: function () {
        window.addEventListener('resize', function () {
            this.resizeInstances();
        }.bind(this));

        // TODO Define instance with focus
    },
    resizeInstances: function () {
        for (var i = 0; i < this.instances.length; i += 1) {
            var instance = this.instances[i];
            instance.adaptToWindowResize();
        }
    },
    removeAllFocus: function () {
        for (var i = 0; i < this.instances.length; i += 1) {
            var instance = this.instances[i];
            instance.blur();
        }
    },
    setFocus: function (instance) {
        instance.focus();
    },
    invoke: function () {
        "use strict";
        return {
            initialize: this.initialize.bind(this)
        };
    }
}.invoke();

window.addEventListener("load", function () {
    window.osuny.carousel.manager.initialize();
});

