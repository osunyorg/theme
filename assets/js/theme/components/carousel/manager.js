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
        window.addEventListener('scroll', function () {
            this.computeInstancesDisplay();
        }.bind(this));
        // TODO Define instance with focus
    },
    resizeInstances: function () {
        this.instances.forEach(function (instance) {
            instance.adaptToWindowResize();
        });
    },
    computeInstancesDisplay: function () {
        // this.removeAllFocus();
        this.instances.forEach(function (instance, i) {
            instance.setVisibility();
        });
    },
    removeAllFocus: function () {
        this.instances.forEach(function (instance) {
            instance.blur();
        });
    },
    setFocus: function (instance) {
        instance.focus();
    },
    invoke: function () {
        "use strict";
        return {
            initialize: this.initialize.bind(this),
            instances: this.instances,
        };
    }
}.invoke();

window.addEventListener("load", function () {
    window.osuny.carousel.manager.initialize();
});
