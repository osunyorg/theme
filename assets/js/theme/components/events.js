/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.components = window.osuny.components || {};

window.osuny.components.events = {
    components: {
        lightbox: null,
        carousel: null
    },
    handleKeyDownEvent: function (e) {
        var target = this._getEventTarget();
        if (target) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') {
                target.previous();
            } else if (e.key === 'ArrowRight') {
                target.next();
            }
        }
    },
    //  who receives the event depending on lightbox state and carousels
    _getEventTarget () {
        if (this._isLightBoxOpened()) {
            return this.components.lightbox;
        }
        if (this._hasFocusedCarousel()) {
            return this.components.carousel.focusedCarousel;
        }
    },
    _isLightBoxOpened () {
        if (this.components.lightbox) {
            return this.components.lightbox.container.opened;
        }
    },
    _hasFocusedCarousel () {
        if (this.components.carousel) {
            return this.components.carousel.focusedCarousel;
        }
    },
    initialize: function () {
        this._dispatchEvent = window.osuny.components.utils.dispatchEvent.bind(window);
        Object.keys(this.components).forEach(function (component) {
            document.addEventListener(window.osuny[component].events.instanciated, function (e) {
                this.components[component] = e.value;
            }.bind(this), true);
        }.bind(this));
        window.addEventListener('keydown', this.handleKeyDownEvent.bind(this));
    }
};

window.addEventListener('load', function () {
    window.osuny.components.events.initialize();
});
