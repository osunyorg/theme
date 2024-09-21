/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.ControlRack = function (element) {
    this.element = element;
    this.buttons = {
        close: this.element.getElementsByClassName(window.osuny.lightbox.classes.closeButton).item(0),
        prev: this.element.getElementsByClassName(window.osuny.lightbox.classes.prevButton).item(0),
        next: this.element.getElementsByClassName(window.osuny.lightbox.classes.nextButton).item(0),
        info: this.element.getElementsByClassName(window.osuny.lightbox.classes.infoButton).item(0),
        credit: this.element.getElementsByClassName(window.osuny.lightbox.classes.creditButton).item(0)
    };
    this._initializeEvents();
};

window.osuny.lightbox.ControlRack.prototype = {
    _initializeEvents () {
        var i = 0;
        for(i=0; i< Object.keys(this.buttons).length; i++) {
            var key = Object.keys(this.buttons)[i];
            var action = this._dispachEvent.bind(this, key);
            this.buttons[key].addEventListener('click', action);
        }
    },
    // _onKeydown (event) {
    //     if (event.key === 'Escape') {
    //         this.listeners.close();
    //     } else if (event.key === 'ArrowLeft') {
    //         this.listeners.previous();
    //     } else if (event.key === 'ArrowRight') {
    //         this.listeners.next();
    //     }
    // },
    _showArrows () {
        this._showButton(this.buttons.prev);
        this._showButton(this.buttons.next);
    },
    _hideArrows () {
        this._hideButton(this.buttons.prev);
        this._hideButton(this.buttons.next);
    },
    _dispachEvent(eventname) {
        var event = new Event(eventname);
        this.element.dispatchEvent(event);
    },
    _showButton (button) {
        button.style.display = 'block';
    },
    _hideButton (button) {
        button.style.display = 'none';
    },
    load (lightbox) {
        if (lightbox.isGallery) {
            this._showArrows();
        } else {
            this._hideArrows();
        }
        this.buttons.next.disabled = lightbox.next === null;
        this.buttons.prev.disabled = lightbox.previous === null;

        if (lightbox.credit) {
            this._showButton(this.buttons.credit);
        } else {
            this._hideButton(this.buttons.credit);
        }

        if (lightbox.description) {
            this._showButton(this.buttons.info);
        } else {
            this._hideButton(this.buttons.info);
        }
    },
    showDescription () {
        this.buttons.info.classList.add('active');
        this.buttons.credit.classList.remove('active');
    },
    showCredit () {
        this.buttons.credit.classList.add('active');
        this.buttons.info.classList.remove('active');
    },
    closePopup () {
        this.buttons.info.classList.remove('active');
        this.buttons.credit.classList.remove('active');
    },
    infoOpened () {
        return this.buttons.info.classList.contains('active');
    },
    creditOpened () {
        return this.buttons.credit.classList.contains('active');
    }
};
