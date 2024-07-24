if (!window.osuny) {
    window.osuny = {};
}

if (!window.osuny.carousel) {
    window.osuny.carousel = {};
}

window.osuny.carousel.Pagination = function Pagination(classes, carousel_size, i18n, toggleButton = false) {
    var containerDom, paginationDom;
    this.domClasses = classes.pagination;

    containerDom = document.createElement("div");
    containerDom.classList.add(this.domClasses.controller);

    paginationDom = document.createElement("ul");
    paginationDom.classList.add(this.domClasses.pagination);

    this.tabButtons = [];
    for (var i = 0; i < carousel_size; i += 1) {
        this.tabButtons.push(new window.osuny.carousel.PaginationButton(i, this.domClasses.paginationButton, i18n))
        paginationDom.append(this.tabButtons[i].domElement);
    }

    containerDom.append(paginationDom);

    if (toggleButton) {
        this.toggleButton = new window.osuny.carousel.ToggleButton(this.domClasses);
        containerDom.append(this.toggleButton.domElement);
    }
    this.domElement = containerDom;
}

window.osuny.carousel.ToggleButton = function ToggleButton(classes, initialState = 1) {
    this.class = [classes.toggleButtonPlay, classes.toggleButtonPause];
    this.state = initialState;
    this.domElement = document.createElement("button");
    this.domElement.classList.add(classes.toggleButton);
    var span = document.createElement("span");
    span.classList.add(this.class[this.state]);
    this.domElement.append(span);
}

window.osuny.carousel.ToggleButton.prototype.toggle = function(target){
    var newState = Math.abs(this.state - 1);
    target.classList.replace(this.class[this.state], this.class[newState]);
    this.state = newState;
}

window.osuny.carousel.PaginationButton = function PaginationButton(index, classe, i18n) {
    this.index = index;
    this.progress = 0;
    this.domElement = document.createElement("li");
    this.domElement.setAttribute("role", "presentation");

    var button = document.createElement("button");
    button.classList.add(classe);
    button.setAttribute("role", "tab");
    button.setAttribute("type", "button");
    button.setAttribute("aria-label", i18n.slideX.replace("%s", this.index));
    button.setAttribute("aria-controls", "slideX".replace("X", this.index));
    button.setAttribute("tabindex", this.index);

    var elemI = document.createElement("i");
    elemI.setAttribute("width", String(this.progress * 100) + "%");
    button.append(elemI);

    this.domElement.append(button);
}