/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.components = window.osuny.components || {};

window.osuny.components.events = {
    components: {
        carousel: null
    },
    handleKeyDownEvent: function (e) {
        var target = this._targetDirector();

        if (target) {
            if (e.key === 'ArrowLeft') {
                target.previous();
            } else if (e.key === 'ArrowRight') {
                target.next();
            }
        }
    },
    //  who receives the event depending on lightbox state and carousels
    _targetDirector () {
        if (this._hasFocusedCarousel() && !window.osuny.lightbox.state.opened) {
            return this.components.carousel.focusedCarousel;
        }
    },
    _hasFocusedCarousel () {
        if (this.components.carousel) {
            return this.components.carousel.focusedCarousel;
        }
    },
    initialize: function () {
        var componentsName = Object.keys(this.components);
        this._dispatchEvent = window.osuny.components.utils.dispatchEvent.bind(window);
        componentsName.forEach(function (component) {
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
