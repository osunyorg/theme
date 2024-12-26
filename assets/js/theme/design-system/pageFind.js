/* eslint-disable no-undef, no-underscore-dangle */

window.osuny = window.osuny || {};
window.osuny.Popup = window.osuny.Popup || {};
window.osuny.Search = window.osuny.Search || {};

window.osuny.Search = function (element) {
    window.osuny.Popup.call(this, element);

    this.buttons = document.querySelectorAll('.search-button');

    this._setup();
    this._listen();
};

window.osuny.Search.prototype = Object.create(window.osuny.Popup.prototype);

window.osuny.Search.prototype._setup = function () {
    this.setPageFind();
    this.setAccessibility();
};

window.osuny.Search.prototype.setPageFind = function () {
    this.pageFindUI = new PagefindUI({
        element: this.element,
        showSubResults: true
    });

    // Listen to user's input
    this.input = document.querySelector('.pagefind-ui__search-input');
};

window.osuny.Search.prototype._listen = function () {
    var inPageWithToc = document.body.querySelector('.toc-cta');
    window.osuny.Popup.prototype._listen.call(this);

    this.buttons.forEach(function (button) {
        button.addEventListener('click', this.toggle.bind(this, true, button));
        if (inPageWithToc) {
            button.classList.add('in-page-with-toc');
        }
    }.bind(this));

    this.input.addEventListener('input', this.onInputChange.bind(this));

    this.observeMutations();
};

window.osuny.Search.prototype.observeMutations = function () {
    var previousResults = [],
        results = [],
        firstResult;

    this.observer = new MutationObserver(function () {
        results = this.element.querySelectorAll('.pagefind-ui__result');
        if (results.length > 0 && previousResults.length > 0 && results.length !== previousResults.length) {
            firstResult = results[previousResults.length];
            setTimeout(this.focusFirstNextResult.bind(firstResult), 100);
        }
        previousResults = results;
    }.bind(this));

    this.observer.observe(this.element, { childList: true, subtree: true });
};

window.osuny.Search.prototype.focusFirstNextResult = function () {
    var anchor = this.querySelector('a');
    if (anchor) {
        anchor.focus();
    }
};

window.osuny.Search.prototype.onInputChange = function () {
    // Delay before screen readers speak results message
    var speakDelay = 1500;

    // Clear aria live
    this.accessibleMessageContainer.innerHTML = '';
    clearTimeout(this.a11yTimeout);
    this.a11yTimeout = setTimeout(this.updateAccessibility.bind(this), speakDelay);

};

window.osuny.Search.prototype.toggle = function (open, triggerElement) {
    window.osuny.Popup.prototype.toggle.call(this, open, triggerElement);
    if (this.state.opened) {
        this.input.focus();
    } else {
        this.clear();
    }
};

window.osuny.Search.prototype.clear = function () {
    var button = this.element.querySelector('.pagefind-ui__button'),
        message = this.element.querySelector('.pagefind-ui__message'),
        results = this.element.querySelector('.pagefind-ui__results');

    if (this.input) {
        this.input.value = '';
    }

    if (button) {
        button.parentElement.removeChild(button);
    }

    if (message) {
        message.innerText = '';
    }

    if (results) {
        results.innerHTML = '';
    }
};

window.osuny.Search.prototype.setAccessibility = function () {
    this.input.setAttribute('title', this.input.getAttribute('placeholder'));

    // Add element to alert screen reader of the search results
    this.accessibleMessageContainer = document.createElement('div');
    this.element.append(this.accessibleMessageContainer);
    this.accessibleMessageContainer.setAttribute('aria-live', 'polite');
    this.accessibleMessageContainer.setAttribute('aria-atomic', 'true');
    this.accessibleMessageContainer.classList.add('sr-only', 'pagefind-ui__accessible-message');
};

window.osuny.Search.prototype.updateAccessibility = function () {
    this.updateAccessibilityMessage();
    this.updateAccessibilityTags();
};

window.osuny.Search.prototype.updateAccessibilityTags = function () {
    var results = this.element.querySelectorAll('.pagefind-ui__result');
    results.forEach(this.updateAccessibilityResult);
};

window.osuny.Search.prototype.updateAccessibilityResult = function (result) {
    var image = result.querySelector('img'),
        title = result.querySelector('.pagefind-ui__result-title');

    if (image) {
        image.setAttribute('alt', '');
    }

    if (title) {
        title.setAttribute('role', 'heading');
        title.setAttribute('aria-level', '2');
    }
};

window.osuny.Search.prototype.updateAccessibilityMessage = function () {
    var message = this.element.querySelector('.pagefind-ui__message');
    if (!message) {
        return;
    }
    message.setAttribute('aria-hidden', 'true');

    if (this.input.value !== '') {
        this.accessibleMessage = document.createElement('p');
        this.accessibleMessage.innerText = message.innerText;
        this.accessibleMessageContainer.appendChild(this.accessibleMessage);
    }
};

// Selectors
window.addEventListener('DOMContentLoaded', function () {
    var element = document.querySelector('#search');
    if (typeof PagefindUI !== 'undefined' && element) {
        window.osuny.search = new window.osuny.Search(element);
    }
});
