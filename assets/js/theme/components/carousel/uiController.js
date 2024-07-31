window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.UIController = function (instance) {
    this.instance = instance;
    this.root = this.instance.root;
    this.sliderContainer = this.instance.container;
    this.windowResizeTimeout;
}
window.osuny.carousel.UIController.prototype = {
    //Visibility computation
    setVisibility: function () {
        var isVisible = this.isInViewport();
        if (this.instance.state.visible != isVisible) {
            this.instance.state.visible = isVisible;
            if (this.instance.state.visible) {
                this.instance.startAutoplay();
            } else {
                this.instance.stopAutoplay();
            }
        }
    },
    isInViewport: function () {
        var boundingRect = this.root.getBoundingClientRect();
        return (
            boundingRect.bottom >= 0 &&
            boundingRect.top <= (window.innerHeight || document.documentElement.clientHeight)
        );
    },
    getCenterPositionY: function () {
        var boundingRect = this.root.getBoundingClientRect();
        return boundingRect.top + boundingRect.height / 2;
    },
    adaptToWindowResize: function () {
        clearTimeout(this.windowResizeTimeout);
        this.windowResizeTimeout = setTimeout(function () {
            this.instance.resetSlider();
        }.bind(this), 200);
    },

    // Events Listeners and Callback
    initializeListeners: function () {
        this.sliderContainer.addEventListener("mouseenter", this.onMouseEnter.bind(this));
        this.sliderContainer.addEventListener("mouseleave", this.onMouseLeave.bind(this));
        if (this.instance.options.drag) {
            this.sliderContainer.addEventListener("mousedown", this.onMouseDown.bind(this));
            this.sliderContainer.addEventListener("touchstart", this.onMouseDown.bind(this));
            this.sliderContainer.addEventListener("mouseup", this.onMouseUp.bind(this));      // HELP
            this.sliderContainer.addEventListener("touchend", this.onMouseUp.bind(this));
            this.sliderContainer.addEventListener("mousemove", this.onMouseMove.bind(this));
            this.sliderContainer.addEventListener("touchmove", this.onMouseMove.bind(this));
        }
    },
    onMouseEnter: function (e) {
        this.cancelLightBoxEvent(e);
        this.instance.pauseAutoplay();

    },
    onMouseLeave: function (e) {
        this.cancelLightBoxEvent(e);
        this.instance.unpauseAutoplay();
        this.instance.endDrag();
    },
    onMouseDown: function (e) {
        this.cancelLightBoxEvent(e);
        this.instance.startDrag(e.offsetX);
    },
    onMouseUp: function (e) {
        this.cancelLightBoxEvent(e);
        this.instance.endDrag();
    },
    onMouseMove: function (e) {
        this.cancelLightBoxEvent(e);
        this.instance.drag(e.offsetX);
    },
    cancelLightBoxEvent: function (e) { // MMARCHE PASSS
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
}

