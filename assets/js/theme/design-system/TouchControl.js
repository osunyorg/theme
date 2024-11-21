var osuny = window.osuny || {};
/*
* Parameter parent can be a Slider or a Lightbox
*/
osuny.TouchControl = function (parent) {
    this.parent = parent;
    this.container = parent.container;

    this.options = {
        threshold: {
            action: Math.max(30, window.innerWidth * 0.15),
            direction: 10,
            // The minimum duration interaction to be considered as grab in ms
            duration: 50
        }
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
        startedAt: 0,
        isGrabbing: false,
        shouldPreventClicks: false
    };

    this.listen();
};

osuny.TouchControl.classes = {
    isGrabbing: 'is-grabbing'
};

Object.defineProperty(osuny.TouchControl.prototype, 'isGrabbing', {
    get: function () {
        return this.state.isGrabbing;
    },
    set: function (_isGrabbing) {
        var classAction = _isGrabbing ? 'add' : 'remove';
        this.state.isGrabbing = _isGrabbing;
        this.container.classList[classAction](osuny.TouchControl.classes.isGrabbing);

        if (_isGrabbing) {
            this.state.shouldPreventClicks = true;
        }
    }
});

osuny.TouchControl.prototype.listen = function () {
    this.container.style.touchAction = 'pan-y';
    osuny.utils.bindEvents(this.container, 'touchstart mousedown', this.onStart.bind(this), { passive: true });
    osuny.utils.bindEvents(this.container, 'touchmove mousemove', this.onMove.bind(this), { passive: true });
    osuny.utils.bindEvents(this.container, 'touchend mouseup touchcancel click', this.onEnd.bind(this), true);
    osuny.utils.bindEvents(window, 'touchend mouseup touchcancel click', this.onEnd.bind(this), true);
    window.addEventListener('blur', this.onEnd.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
};

osuny.TouchControl.prototype.onStart = function (event) {
    this.state.isPointerDown = true;
    this.isGrabbing = false;
    this.state.start = osuny.utils.getEventClientCoord(event);
    this.state.startedAt = osuny.utils.getTime();
};

osuny.TouchControl.prototype.onMove = function (event) {
    var time = osuny.utils.getTime(),
        isGrabbing = time > this.state.startedAt + this.options.threshold.duration;

    if (!this.state.isPointerDown) {
        this.isGrabbing = false;
        return;
    }

    if (this.isGrabbing !== isGrabbing && isGrabbing) {
        this.state.start = osuny.utils.getEventClientCoord(event);
        this.isGrabbing = isGrabbing;
    }

    if (this.isGrabbing) {
        this.state.end = osuny.utils.getEventClientCoord(event);
        this.drag();
    }
};

osuny.TouchControl.prototype.drag = function () {
    var distance = {
        x: this.state.start.x - this.state.end.x,
        y: this.state.start.y - this.state.end.y
    };

    if (Math.abs(distance.y) > this.options.threshold.direction && !this.state.direction) {
        this.state.direction = 'y';
    } else if (Math.abs(distance.x) > this.options.threshold.direction && !this.state.direction) {
        this.state.direction = 'x';
    }

    if (this.parent['drag']) {
        this.parent.drag(this.state.direction, distance);
    }
};

osuny.TouchControl.prototype.onEnd = function (event) {
    var threshold = this.options.threshold.action;

    console.log('end')
    // this.preventClicks(event);

    if (!this.state.isPointerDown) {
        return this.clear();
    }

    this.state.isPointerDown = false;
    this.state.end = osuny.utils.getEventClientCoord(event);

    if (this.state.direction === 'y' || !this.isGrabbing) {
        return this.clear();
    }

    this.clear();

    if (this.state.start.x > this.state.end.x + threshold) {
        this.parent.next();
    } else if (this.state.start.x < this.state.end.x - threshold) {
        this.parent.previous();
    }

    if (this.parent['release']) {
        this.parent.release();
    }
};

osuny.TouchControl.prototype.preventClicks = function (event) {
    if (this.state.shouldPreventClicks && event.type === 'click') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    clearTimeout(this.throttleId);
    this.throttleId = setTimeout(function () {
        this.state.shouldPreventClicks = false;
    }.bind(this), 10);
};

osuny.TouchControl.prototype.clear = function () {
    this.state.direction = null;
    this.state.isPointerDown = false;
    this.isGrabbing = false;
};

osuny.TouchControl.prototype.onResize = function () {
    this.options.threshold.action = Math.max(30, window.innerWidth * 0.15);
};
