window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Pagination = function (element) {
    this.element = element;
    this.buttonElements = [];
    this.buttons = [];
    this.currentButton;
    this.initialize();
}

window.osuny.carousel.Pagination.prototype = {
    classes: {
        button: "carousel__pagination__page"
    },
    initialize: function () {
        this.buttonElements = this.element.getElementsByClassName(this.classes.button);
        for (var index = 0; index < this.buttonElements.length; index += 1) {
            var buttonElement = this.buttonElements[index],
                button = new window.osuny.carousel.PaginationButton(buttonElement, index);
            this.buttons.push(button);
        }
    },
    highlightButton: function (index) {
        this.currentButton = this.buttons[index];
    },
    setProgression: function (progression) {
        if (this.currentButton) {
            this.currentButton.setProgression(progression);
        }
    },
    resetSlidesState: function () {
        this.buttons.forEach(function (button) {
            button.setProgression(0);
            button.setSelected(false);
        });
    },
    // onSlideChanged: function () {
    //     // this.resetSlidesState();
    //     // this.setSlideProgression(1);
    //     // this.tabButtons[this.instance.slides.current].container.focus();
    //     // this.tabButtons[this.instance.slides.current].setSelected(true);
    // }
}
