import { ariaHideBodyChildren } from '../../utils/a11y';
import { isMobile } from '../../utils/breakpoints';

window.osuny = window.osuny || {};

window.osuny.Search = function (element) {
    this.elements = {
        root: element,
        detailsContainer: element.querySelector('.pf-filter-pane'),
        triggerButtons: document.querySelectorAll('.pf-trigger-btn'),
        buttonSearchInType: document.querySelector('[data-search-in-type]'),
        pagefindFilters: document.querySelector('pagefind-filter-pane'),
        triggerButton: null
    };

    this.pagefindInstance = window.PagefindComponents.getInstanceManager().getInstance('default');

    this.state = {
        isOpened: false,
        isMobile: isMobile()
    };

    this.listen();
    this.resize();
};

window.osuny.Search.prototype.listen = function () {
    window.addEventListener('resize', this.resize.bind(this));

    if (this.elements.buttonSearchInType) {
        this.elements.buttonSearchInType.addEventListener('click', this.searchInType.bind(this));
    }

    this.elements.triggerButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            this.elements.triggerButton = button;
        }.bind(this));
    }.bind(this));

    this.elements.root.addEventListener('toggle', this.onToggle.bind(this));

    this.updateSearchFiltersToAny();
};

window.osuny.Search.prototype.updateSearchFiltersToAny = function () {
    this.pagefindInstance.on('search', function (term, filters) {
        // Update the searchFilters instance to allow 'OR' : one or more of the conditions match.
        // https://pagefind.app/docs/js-api-filtering/#using-compound-filters
        this.pagefindInstance.searchFilters = {
            type: {
                any: filters.type
            }
        };
    }.bind(this));
};

window.osuny.Search.prototype.resize = function () {
    this.state.isMobile = isMobile();
    this.elements.pagefindFilters.expanded = !this.state.isMobile;
    if (this.state.isMobile) {
        this.closeFilters();
    } else {
        this.openFilters();
    }

};

window.osuny.Search.prototype.onToggle = function (event) {
    this.state.isOpened = event.newState === 'open';
    if (!this.state.isOpened) {
        this.onClose();
    }
    this.resize();
    this.updateDocumentAccessibility();
};


window.osuny.Search.prototype.onClose = function () {
    if (this.elements.triggerButton) {
        this.elements.triggerButton.focus();
        this.elements.triggerButton = null;
    }
};

window.osuny.Search.prototype.updateDocumentAccessibility = function () {
    document.body.style.overflow = this.state.isOpened ? 'hidden' : 'auto';
    ariaHideBodyChildren(this.elements.root, this.state.isOpened);
};


window.osuny.Search.prototype.openFilters = function () {
    this.toggleFilters(true);
};

window.osuny.Search.prototype.closeFilters = function () {
    this.toggleFilters(false);
};

window.osuny.Search.prototype.toggleFilters = function (opened = true) {
    this.details = this.elements.detailsContainer.querySelectorAll('.pf-filter-group');

    this.details.forEach( function (detail) {
        detail.open = opened;
    }.bind(this));
};

window.osuny.Search.prototype.searchInType = function () {
    var type = this.elements.buttonSearchInType.getAttribute('data-search-in-type');
    this.pagefindInstance.triggerFilter('type', [type]);
};

window.osuny.page.registerComponent({
    name: 'search',
    selector: '.pf-modal',
    klass: window.osuny.Search
});