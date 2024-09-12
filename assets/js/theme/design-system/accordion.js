function Accordion(element) {
    this.element = element;
    this.button = this.element.querySelector('summary');

    this.state = {
        isOpened: false
    };

    this.listen();
}

Accordion.prototype.listen = function() {
    var self = this;

    this.button.addEventListener('click', function() {
        self.toggleAccordion();
    });
};

Accordion.prototype.toggleAccordion = function(open) {
    if (typeof open === 'undefined') {
        open = !this.state.isOpened;
    }
    this.state.isOpened = open;
    this.button.setAttribute('aria-expanded', this.state.isOpened);
    };

(function () {
    var accordions = document.querySelectorAll('details');
    console.log(accordions)
    Array.prototype.forEach.call(accordions, function(accordion) {
        console.log(accordion)
        new Accordion(accordion);
    });
}());
