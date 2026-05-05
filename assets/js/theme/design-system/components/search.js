import { isMobile } from '../../utils/breakpoints';
import { focusTrap } from '../../utils/focus-trap';

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
        this.elements.buttonOpen.addEventListener('click', this.open.bind(this));
    }
    if (this.elements.buttonClose) {
        this.elements.buttonClose.addEventListener('click', this.close.bind(this));
    }
};

window.osuny.Search.prototype.resize = function () {
    if (isMobile()) {
        this.close();
    } else {
        this.open();
    }
};

window.osuny.Search.prototype.getDetails = function () {
    setTimeout(function() {
        this.details = this.elements.detailsContainer.querySelectorAll('.pf-filter-group'); 
        this.details.forEach( function (detail) {
            detail.open = true;
        }.bind(this));
    }.bind(this), 200);
}

window.osuny.Search.prototype.open = function () {
    if (this.state.isMobile) {
        return;
    }

    this.state.isOpened = true;

    setTimeout(function() {
        this.setDetailsAttribute(true);
    }.bind(this), 300);
};

window.osuny.Search.prototype.close = function () {
    this.state.isOpened = false;
    this.setDetailsAttribute(false);
}

window.osuny.Search.prototype.setDetailsAttribute = function (open) {
    this.details = this.elements.detailsContainer.querySelectorAll('.pf-filter-group'); 
    this.attribute = open ? 'open' : '';
    
    this.details.forEach( function (detail) {
        detail.open = open;
    }.bind(this));
}

window.osuny.page.registerComponent({
    name: 'search',
    selector: '.pf-modal',
    klass: window.osuny.Search
});