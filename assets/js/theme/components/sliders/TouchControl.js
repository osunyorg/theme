window.osuny = window.osuny || {};

// TODO : test clicks and arrows on drag

window.osuny.TouchControl = function (slider) {
    this.slider = slider;
    this.container = slider.container;

    this.options = {
        threshold: 30,
        grabbedClass: 'is-grabbed'
    };

    this.state = {
        isPointerDown: false,
        start: 0,
        end: 0
    };

    this.listen();
};

window.osuny.TouchControl.prototype.listen = function () {
    this.container.style.touchAction = 'pan-x';

    this.container.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.container.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.container.addEventListener('pointermove', this.onPointerMove.bind(this));
};

window.osuny.TouchControl.prototype.onPointerDown = function (event) {
    this.state.isPointerDown = true;
    this.state.start = event.clientX;
    this.container.classList.add(this.options.grabbedClass);
};

window.osuny.TouchControl.prototype.onPointerMove = function (event) {
    var gap = this.state.start - this.state.end;
    this.state.end = event.clientX;

    if (this.state.isPointerDown) {
        this.slider.move(gap);
    }
};

window.osuny.TouchControl.prototype.onPointerUp = function (event) {
    if (!this.state.isPointerDown) {
        return;
    }

    this.state.isPointerDown = false;

    event.preventDefault();
    this.state.end = event.clientX;

    if (this.state.start > this.state.end + this.options.threshold) {
        this.slider.next();
    } else if (this.state.start < this.state.end - this.options.threshold) {
        this.slider.previous();
    }

    this.slider.release();
    this.container.classList.remove(this.options.grabbedClass);
};
