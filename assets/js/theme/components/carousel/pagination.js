
Pagination = function Pagination(classes, carrousel_size, i18n, toggleButton = false) {
    var containerDom, paginationDom;
    // Creating pagination div container
    containerDom = document.createElement("div");
    containerDom.classList.add(classes.controller);

    console.log(classes.pagination)
    // Creating container ul for pagination control buttons
    var paginationDom = document.createElement("ul");
    paginationDom.classList.add(classes.pagination);

    this.tabButtons = [];
    for (var i = 0; i < carrousel_size; i += 1) {
        this.tabButtons.push(new PaginationButton(i, classes.paginationButton, i18n))
        paginationDom.append(this.tabButtons[i].domElement);
    }

    containerDom.append(paginationDom);

    if (toggleButton) {
        this.toggleButton = new ToggleButton(classes);
        containerDom.append(this.toggleButton.domElement);
        console.log(this.toggleButton.domElement)
    }
    this.domElement = containerDom;
}

ToggleButton = function ToggleButton(classes, initialState = 1) {
    this.class = [classes.toggleButtonPlay, classes.toggleButtonPause];
    this.state = initialState;
    this.domElement = document.createElement("button");
    this.domElement.classList.add(classes.toggleButton);
    var span = document.createElement("span");
    this.domElement.append(span);
    this.toggleElem = span;
    this.toggleElem.classList.add(this.class[this.state]);
}

ToggleButton.prototype.toggle = function(){
    var newState = Math.abs(this.state - 1);
    this.toggleElem.classList.replace(this.class[this.state], this.class[newState]);
    this.state = newState;
}

PaginationButton = function PaginationButton(nSlide, classe, i18n) {
    this.domElement;
    this.index = nSlide;
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