/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.components = window.osuny.components || {};

window.osuny.components.events = {
    components: [],
    handleKeyDownEvent: function (e) {
        console.log(e)
    },
    initialize: function () {
        document.addEventListener('lightboxInstance', function (e) { 
            console.log(e);
        }, true);
        window.addEventListener(
            "keydown",
            this.handleKeyDownEvent.bind(this)
        );
    }
};

window.addEventListener("load", function () {
    window.osuny.components.events.initialize();
});
