window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Pagination = function (element) {
    this.element = element;
    this._initialize();
}

window.osuny.carousel.Pagination.prototype = {
    classes: {
        button: "carousel__pagination__page"
    },
    _initialize: function () {
        this.buttonElements = [];
        this.buttons = [];
        this.buttonElements = this.element.getElementsByClassName(this.classes.button);
        for (var index = 0; index < this.buttonElements.length; index += 1) {
            var buttonElement = this.buttonElements[index],
                button = new window.osuny.carousel.PaginationButton(buttonElement, index, this.element);
            this.buttons.push(button);
        }
        this.currentButton = this.buttons[0];
    },
    selectButton: function (index) {
        this.currentButton = this.buttons[index];
        this.currentButton.select();
    },
    setProgression: function (progression) {
        if (this.currentButton) {
            this.currentButton.setProgression(progression);
        }
    },
    unselectAllButtons: function () {
        this.buttons.forEach(function (button) {
            button.unselect();
        });
    },
    // onSlideChanged: function () {
    //     // this.resetSlidesState();
    //     // this.setSlideProgression(1);
    //     // this.tabButtons[this.instance.slides.current].container.focus();
    //     // this.tabButtons[this.instance.slides.current].setSelected(true);
    // }
}
