import { isMobile } from '../../utils/breakpoints';

window.osuny = window.osuny || {};

window.osuny.Search = function (element) {
    this.elements = {
        root: element,
        sections: [],
        detailsContainer: element.querySelector('.pf-filter-pane'),
        buttonOpen: document.querySelector('.pf-trigger-btn'),
        buttonClose: document.querySelector('.pf-modal-close')
    }

    this.state = {
        isOpened: false,
        isMobile: isMobile()
    };

    this.listen();
};
  
  window.osuny.Search.prototype.listen = function () {
    window.addEventListener('resize', this.resize.bind(this));

    if (this.elements.buttonOpen) {
        this.elements.buttonOpen.addEventListener('click', this.toggleDetails.bind(this));
    }
    if (this.elements.buttonClose) {
        this.elements.buttonClose.addEventListener('click', this.toggleDetails.bind(this));
    }
    if (this.state.isOpened) {
        this.details = this.elements.detailsContainer.querySelectorAll('.pf-filter-group');
    }
};
    
window.osuny.Search.prototype.toggleDetails = function () {
    if (this.state.isMobile) {
        return;
    }

    this.state.isOpened = !this.state.isOpened;

    setTimeout(function() {
        if (this.state.isOpened) {
            this.openDetails(this.state.isOpened);
        }
    }.bind(this), 200);
};

window.osuny.Search.prototype.resize = function () {
    if (isMobile()) {
        this.openDetails(false);
    } else {
        this.openDetails(true);
    }
};

window.osuny.Search.prototype.openDetails = function (shouldOpen) {
    this.details = this.elements.detailsContainer.querySelectorAll('.pf-filter-group'); 

    this.details.forEach( function (detail) {
        if (shouldOpen) {
            detail.setAttribute('open', 'open');
        } else {
            detail.removeAttribute('open');
        }
    }.bind(this));
};

window.osuny.page.registerComponent({
    name: 'search',
    selector: '.pf-modal',
    klass: window.osuny.Search
});