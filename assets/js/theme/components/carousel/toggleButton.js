window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.ToggleButton = function (instance) {
    this.class = [];
    this.isPlay = false;
    this.instance = instance;
    this.container = null;
    this.initialize();
}
window.osuny.carousel.ToggleButton.prototype = {
    classes: {
        button: "toggle",
        pause: "toggle__pause",
        play: "toggle__play",
        container: "carousel__pagination"
    },
    initialize: function () {
        var paginationContainer = this.instance.root.getElementsByClassName(this.classes.container).item(0);
        this.state_classes = [this.classes.play, this.classes.pause];
        this.container = paginationContainer.getElementsByClassName(this.classes.button).item(0);
        this.container.classList.add(this.state_classes[+ this.isPlay]);
        this.container.addEventListener("click", this.onClick.bind(this));
    },
    toggleState: function () {
        this.container.classList.replace(this.state_classes[+this.isPlay], this.state_classes[+ !this.isPlay]);
        this.isPlay = !this.isPlay;
    },
    toggleStart: function () {
        if (!this.isPlay) {
            this.toggleState();
        }
    },
    toggleStop: function () {
        if (this.isPlay) {
            this.toggleState();
        }
    },
    onClick: function () {
        this.instance.toggleAutoplay();
    }
}