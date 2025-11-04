window.osuny = window.osuny || {};

window.osuny.Accordion = function (element) {
    this.element = element;
    this.button = this.element.querySelector('summary');

    this.state = {
        opened: false
    };

    this.listen();
};

window.osuny.Accordion.prototype.listen = function () {
    var self = this;

    this.button.addEventListener('click', function () {
        self.toggleAccordion();
    });
};

window.osuny.Accordion.prototype.toggleAccordion = function (open) {
    if (typeof open === 'undefined') {
        open = !this.state.opened;
    }
    this.state.opened = open;
    this.button.setAttribute('aria-expanded', this.state.opened);
};

window.osuny.page.addComponent('details', window.osuny.Accordion);
