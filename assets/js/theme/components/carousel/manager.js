window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.manager = {
    initialized: false,
    // @alex @olivia js-carousel ou osuny-carousel ?
    class: "js-carousel",
    domObjects: [],
    instances: [],
    focusedInstance: null,
    initialize: function () {
        if (!this.initialized) {
            this.createInstances();
            this.initializeListeners();
            this.computeInstancesDisplay();
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
        document.addEventListener("keydown", function (e) {
            if (this.focusedInstance) {
                if (e.key == 'ArrowLeft') { this.focusedInstance.slider.previousSlide() }
                else if (e.key == 'ArrowRight') { this.focusedInstance.slider.nextSlide() }
            }
        }.bind(this));
    },
    resizeInstances: function () {
        this.instances.forEach(function (instance) {
            instance.adaptToWindowResize();
        });
    },
    computeInstancesDisplay: function () {
        var focusedInstanceCandidates = [];
        this.instances.forEach(function (instance) {
            instance.setVisibility();
            if (instance.state.visible) {
                focusedInstanceCandidates.push(instance);
            }
        });
        this.setFocus(focusedInstanceCandidates);
    },
    setFocus: function (focusCandidates) {
        this.cleanFocusInstance()
        var windowCenterPositionY = (window.innerHeight || document.documentElement.clientHeight) / 2;
        var smallerDistance = window.innerHeight;
        var bestCandidate = null;
        focusCandidates.forEach(function (instance) {
            var distanceToCenter = Math.abs(instance.getCenterPositionY() - windowCenterPositionY);
            if (distanceToCenter < smallerDistance) {
                smallerDistance = distanceToCenter;
                bestCandidate = instance;
            }
        });
        if (bestCandidate) {
            this.addFocusInstance(bestCandidate);
        }
    },
    cleanFocusInstance: function () {
        if (this.focusedInstance) {
            this.focusedInstance.unfocus();
            this.focusedInstance = null;
        }
    },
    addFocusInstance: function (focusCandidate) {
        this.focusedInstance = focusCandidate;
        this.focusedInstance.focus();
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