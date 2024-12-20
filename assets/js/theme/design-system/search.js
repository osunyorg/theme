/* eslint-disable no-undef */
import { ariaHideBodyChildren } from '../utils/a11y';
import { focusTrap } from '../utils/focus-trap';

const CLASSES = {
    modalOpened: 'has-search-opened'
};

class Search {
    constructor (container) {
        this.state = {
            isOpened: false
        };
        this.buttons = document.querySelectorAll('.pagefind-ui__toggle');
        this.toggleButton;
        this.element = document.querySelector('.search__modal');
        this.closeButton = this.element.querySelector('.search__close');
        // this.a11yButton = document.querySelector('[href="#search-button"]');

        this.searchInstance = new PagefindUI({
            element: container,
            showSubResults: true
        });

        if (!this.element) {
            return;
        }

        this.listen();
        this.setAccessibility();
    }

    setAccessibility () {
        const input = document.querySelector('.pagefind-ui__search-input'),
            // Delay before screen readers speak results message
            speakDelay = 1500;
        input.setAttribute('title', input.getAttribute('placeholder'));

        // Add element to alert screen reader of the search results
        this.accessibleMessageContainer = document.createElement('div');
        this.element.append(this.accessibleMessageContainer);
        this.accessibleMessageContainer.setAttribute('aria-live', 'polite');
        this.accessibleMessageContainer.setAttribute('aria-atomic', 'true');
        this.accessibleMessageContainer.classList.add('sr-only', 'pagefind-ui__accessible-message');

        input.addEventListener('input', () => {
            this.accessibleMessageContainer.innerHTML = '';
            if (input.value !== '') {
                this.accessibleMessage = document.createElement('p');
                this.accessibleMessageContainer.appendChild(this.accessibleMessage);
            }
            clearTimeout(this.a11yTimeout);
            this.a11yTimeout = setTimeout(this.updateAccessibility.bind(this), speakDelay);
        });
    }

    updateAccessibility () {
        this.updateAccessibilityMessageRole();
        this.updateAccessibilityTags();
    }

    updateAccessibilityTags () {
        const results = this.element.querySelectorAll('.pagefind-ui__result');

        results.forEach(this.updateAccessibilityResult);
    }

    updateAccessibilityResult (result) {
        let image = result.querySelector('img'),
            title = result.querySelector('.pagefind-ui__result-title');

        if (image) {
            image.setAttribute('alt', '');
        }
        if (title) {
            title.setAttribute('role', 'heading');
            title.setAttribute('aria-level', '2');
        }
    }

    updateAccessibilityMessageRole () {
        const message = this.element.querySelector('.pagefind-ui__message');
        if (!message) {
            return;
        }
        message.setAttribute('aria-hidden', 'true');
        this.accessibleMessage.innerText = message.innerText;
    }

    listen () {
        if (document.body.querySelector('.toc-cta')) {
            this.buttons.forEach(button => {
                button.classList.add('in-page-with-toc');
            });
        }
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.toggleButton = button;
                this.toggle(true);
                this.removedItems = this.element.querySelector('.pagefind-ui__suppressed', '.pagefind-ui__search-clear');
                if (this.removedItems) {
                    this.removedItems.remove();
                }
            });
        });
        this.closeButton.addEventListener('click', () => {
            this.clearSearch();
            this.toggle(false);
        });

        window.addEventListener('keydown', (event) => {
            if (event.keyCode === 27 || event.key === 'Escape') {
                if (this.state.isOpened) {
                    this.toggle(false);
                    this.toggleButton.focus();
                }
            } else if (event.key === 'Tab' && this.state.isOpened) {
                focusTrap(event, this.element, this.state.isOpened);
            }
            this.buttonMore = this.element.querySelector('.pagefind-ui__results + button');
            if (this.buttonMore && this.state.isOpened) {
                this.buttonMore.addEventListener('click', () => {
                    this.buttonMoreFocus();
                });
            }
        });

        // if (this.a11yButton) {
        //     a11yClick(this.a11yButton, (event) => {
        //         if (isMobile()) {
        //             event.preventDefault();
        //             this.toggle(true);
        //         }
        //     });
        // }
    }

    clearSearch () {
        const button = this.element.querySelector('.pagefind-ui__button'),
            message = this.element.querySelector('.pagefind-ui__message'),
            results = this.element.querySelector('.pagefind-ui__results');

        if (this.input) {
            this.input.value = '';
            this.searchInstance.triggerSearch(false);
        }

        if (message) {
            message.innerText = '';
        }
        if (results) {
            results.innerHTML = '';
        }
        if (button) {
            button.parentElement.removeChild(button);
        }
    }

    buttonMoreFocus () {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(addedNode => {
                    if (addedNode instanceof HTMLAnchorElement) {
                        addedNode.focus();
                    }
                });
            });
        });

        observer.observe(this.element, { childList: true, subtree: true });
    }

    toggle(open = !this.state.isOpened, button) {
        this.state.isOpened = open;
        this.element.setAttribute('aria-hidden', !this.state.isOpened);
        this.toggleButton.setAttribute('aria-expanded', this.state.isOpened);

        const classAction = this.state.isOpened ? 'add' : 'remove';
        document.documentElement.classList[classAction](CLASSES.modalOpened);

        if (open) {
            this.input = this.element.querySelector('input');
            this.input.focus();
        } else {
            document.body.style.overflow = 'unset';
            this.button.focus();
            this.accessibleMessageContainer.innerHTML = '';
        }
        ariaHideBodyChildren(this.element, open);
    }
}

// Selectors
window.addEventListener('DOMContentLoaded', () => {
    const pageFindContainer = document.querySelector('#search');

    if (typeof PagefindUI === 'undefined') return;

    if (pageFindContainer) {
        new Search(pageFindContainer);
    }
});
