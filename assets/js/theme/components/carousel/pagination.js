window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Pagination = function (element) {
    var index = 0,
        button,
        buttonElement;
    this.element = element;
    this.buttons = [];
    if (!this.element) {
        return;
    }
    this.buttonElements = this.element.getElementsByClassName(window.osuny.carousel.classes.paginationPage);
    for (index = 0; index < this.buttonElements.length; index += 1) {
        buttonElement = this.buttonElements[index];
        button = new window.osuny.carousel.PaginationButton(buttonElement, index, this.element);
        this.buttons.push(button);
    }
    this.currentButton = this.buttons[0];
};
window.osuny.carousel.Pagination.prototype = {
    selectButton: function (index) {
        if (this.element) {
            this.currentButton = this.buttons[index];
            this.currentButton.select();
            this.currentButton.setAriaCurrent(true);
        }
    },
    setProgression: function (progression) {
        if (this.currentButton) {
            this.currentButton.setProgression(progression);
        }
    },
    unselectAllButtons: function () {
        this.buttons.forEach(function (button) {
            button.setAriaCurrent(false);
            button.unselect();
        });
    }
};
