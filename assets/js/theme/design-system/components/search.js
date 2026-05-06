import { ariaHideBodyChildren } from '../../utils/a11y';
import { focusTrap } from '../../utils/focus-trap';
import { isMobile } from '../../utils/breakpoints';

window.osuny = window.osuny || {};

window.osuny.Search = function (element) {
    this.elements = {
        root: element,
        sections: [],
        detailsContainer: element.querySelector('.pf-filter-pane'),
        buttonsOpen: document.querySelectorAll('.pf-trigger-btn'),
        buttonClose: document.querySelector('.pf-modal-close'),
        triggerButton: null
    }

    this.state = {
        isOpened: false,
        isMobile: isMobile()
    };

    this.listen();
};

window.osuny.Search.prototype.listen = function () {
    window.addEventListener('resize', this.resize.bind(this));

    this.elements.buttonsOpen.forEach(button => {
        button.addEventListener('click', (event) => {
            this.elements.triggerButton = event.currentTarget;
            this.open();
        });
    });

    if (this.elements.buttonClose) {
        this.elements.buttonClose.addEventListener('click', this.close.bind(this));
    }

    window.addEventListener('keydown', function (event) {
        if (this.state.isOpened) {
            if (event.keyCode === 27 || event.key === 'Escape') {
                this.close();
            }
        }
        focusTrap(event, this.elements.root, this.state.isOpened);
    }.bind(this), true);
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
    this.updateDocumentAccessibility(true);

    setTimeout(function() {
        this.setDetailsAttribute(true);
    }.bind(this), 300);
};

window.osuny.Search.prototype.close = function () {
    this.state.isOpened = false;
    this.setDetailsAttribute(false);
    this.updateDocumentAccessibility(false);

    // focus clicked search button
    setTimeout(function() {
        this.elements.triggerButton.focus();
    }.bind(this), 300);
}

window.osuny.Search.prototype.setDetailsAttribute = function (open) {
    this.details = this.elements.detailsContainer.querySelectorAll('.pf-filter-group'); 
    this.attribute = open ? 'open' : '';
    
    this.details.forEach( function (detail) {
        detail.open = open;
    }.bind(this));
}

window.osuny.Search.prototype.updateDocumentAccessibility = function (isOpen) {
    console.log(isOpen)
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    ariaHideBodyChildren(this.elements.root, isOpen);
};

window.osuny.page.registerComponent({
    name: 'search',
    selector: '.pf-modal',
    klass: window.osuny.Search
});