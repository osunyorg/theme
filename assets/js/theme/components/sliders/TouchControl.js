var osuny = window.osuny || {};

osuny.TouchControl = function (slider) {
    this.slider = slider;
    this.container = slider.container;

    this.options = {
        threshold: Math.max(30, window.innerWidth * 0.15),
        grabbedClass: 'is-grabbed'
    };

    this.state = {
        isPointerDown: false,
        start: {
            x: 0,
            y: 0
        },
        end: {
            x: 0,
            y: 0
        },
        isScrollingY: false
    };

    this.listen();
};

osuny.TouchControl.prototype.listen = function () {
    this.container.style.touchAction = 'pan-y';
    osuny.utils.bindEvents(this.container, 'touchstart mousedown', this.onPointerDown.bind(this));
    osuny.utils.bindEvents(this.container, 'touchmove mousemove', this.onPointerMove.bind(this));
    osuny.utils.bindEvents(this.container, 'touchend mouseup click touchcancel', this.onPointerUp.bind(this));
};

osuny.TouchControl.prototype.onPointerDown = function (event) {
    this.state.isPointerDown = true;
    this.state.start = osuny.utils.getEventClientCoord(event);
    this.state.end = osuny.utils.getEventClientCoord(event);
    this.container.classList.add(this.options.grabbedClass);
};

osuny.TouchControl.prototype.onPointerMove = function (event) {
    if (this.state.isPointerDown) {
        this.state.end = osuny.utils.getEventClientCoord(event);
        this.moveSlider(event);
    }
};

osuny.TouchControl.prototype.moveSlider = function (event) {
    var distance = {
        x: this.state.start.x - this.state.end.x,
        y: this.state.start.y - this.state.end.y
    };

    if (Math.abs(distance.y) > this.options.threshold && !this.state.direction) {
        this.state.direction = 'y';
    } else if (Math.abs(distance.x) > this.options.threshold && !this.state.direction) {
        this.state.direction = 'x';
    }

    if (this.state.direction === 'x') {
        this.slider.move(distance.x);
        event.preventDefault();
    }
};

osuny.TouchControl.prototype.onPointerUp = function (event) {
    this.state.direction = null;

    if (!this.state.isPointerDown) {
        return;
    }

    this.state.isPointerDown = false;
    this.state.end = osuny.utils.getEventClientCoord(event);
    this.container.classList.remove(this.options.grabbedClass);

    if (this.state.direction === 'y') {
        return;
    }

    if (this.state.start.x > this.state.end.x + this.options.threshold) {
        this.slider.next();
    } else if (this.state.start.x < this.state.end.x - this.options.threshold) {
        this.slider.previous();
    }

    this.slider.release();
};
