window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.ToggleButton = function (instance) {
    this.class = [];
    this.container = null;
    this.isStart = false;
    this.instance = instance;
    this.events = {};
    this._initialize();
    return {
        toggleStart: this.toggleStart.bind(this),
        toggleStop: this.toggleStop.bind(this),
        getElement: this.getElement.bind(this)
    }
}
window.osuny.carousel.ToggleButton.prototype = {
    classes: {
        button: "toggle",
        pause: "toggle__pause",
        play: "toggle__play",
        container: "carousel__pagination"
    },
    toggleStart: function () {
        if (!this.isStart) {
            this._toggleState();
        }
    },
    toggleStop: function () {
        if (this.isStart) {
            this._toggleState();
        }
    },
    getElement: function(){
        return this.container;
    },
    _initialize: function () {
        var paginationContainer = this.instance.root.getElementsByClassName(this.classes.container).item(0);
        this.state_classes = [this.classes.pause, this.classes.play];
        this.container = paginationContainer.getElementsByClassName(this.classes.button).item(0);
        this.container.classList.add(this.state_classes[+ this.isStart]);

        this.container.addEventListener("click", this._onClick.bind(this));
        this.events.start = new Event("start");
        this.events.stop = new Event("stop");
    },
    _toggleState: function () {
        this.container.classList.replace(this.state_classes[+this.isStart], this.state_classes[+ !this.isStart]);
        this.isStart = !this.isStart;
    },
    _onClick: function () {
        if(this.isStart){
            this.container.dispatchEvent(this.events.start);
        }
        else{
            this.container.dispatchEvent(this.events.stop);
        }
    }
}