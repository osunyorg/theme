import { focusTrap } from '../utils/focus-trap';

class Search {
    constructor(button, pageFind) {
        this.state = {
            isOpened: false
        };
        this.button = button;
        this.element = document.querySelector('.search__modal');
        this.closeButton = this.element.querySelector('.search__close');
        this.searchInstance = pageFind;

        if (!this.element) {
            return;
        }

        this.input = this.element.querySelector('input');
        this.listen();
    }

    listen() {
        if (document.body.querySelector(".toc-cta")) {
            this.button.classList.add('in-page-with-toc');
        }
        this.button.addEventListener('click', () => {
            this.toggle(true);
            this.removedItems = this.element.querySelector('.pagefind-ui__suppressed', '.pagefind-ui__search-clear');
            if (this.removedItems) {
                this.removedItems.remove();
            }
        });
        this.closeButton.addEventListener('click', () => {
            this.clearSearch();
            this.toggle(false);
        });

        window.addEventListener('keydown', (event) => {
            if (event.keyCode === 27 || event.key === 'Escape') {
                if (this.state.isOpened) {
                    this.toggle(false);
                    this.button.focus();
                }
            } 
            else if (event.key === "Tab" && this.state.isOpened) {
                focusTrap(event, this.element, this.state.isOpened);
            }
            this.buttonMore = this.element.querySelector('.pagefind-ui__results + button');
            if (this.buttonMore && this.state.isOpened) {
                this.buttonMore.addEventListener('click', () => {
                    this.buttonMoreFocus();
                });
            }
        });
    }

    clearSearch() {
        const button = this.element.querySelector('.pagefind-ui__button');
        const message =  this.element.querySelector('.pagefind-ui__message');
        const results = this.element.querySelector('.pagefind-ui__results')
            
        this.input.value = "";
        this.searchInstance.triggerSearch(false);

        if (message) {
            message.innerText = "";
        }
        if (results) {
            results.innerHTML = "";
        }
        if (button) {
            button.parentElement.removeChild(button);
        }
    }

    buttonMoreFocus() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
            mutation.addedNodes.forEach(addedNode => {
                if (addedNode instanceof HTMLAnchorElement) {
                    addedNode.focus();
                }
                });
            });
        });  
        const observerConfig = { childList: true, subtree: true };
        observer.observe(this.element, observerConfig);
    }

    toggle(open = !this.state.isOpened) {
        this.state.isOpened = open;
        this.element.setAttribute('aria-hidden', !this.state.isOpened);
        this.button.setAttribute('aria-expanded', this.state.isOpened);

        if (open) {
            this.input = this.element.querySelector('input');
            this.input.focus();

            this.inertElements = [];
            const allElements = document.querySelectorAll('body *');

            allElements.forEach(el => {
                if (el === this.element || this.element.contains(el) || el.contains(this.element)) {
                    return;
                }
    
                el.setAttribute('inert', '');
                this.inertElements.push(el);
            });
        } else {
            document.body.style.overflow = 'unset';

            if (this.inertElements) {
                this.inertElements.forEach(el => {
                    el.removeAttribute('inert');
                });
                this.inertElements = null;
            }
        }
    }
}

// Selectors
window.addEventListener('DOMContentLoaded', () => {
    const pageFindSearch = document.querySelector("#search");

    if (typeof PagefindUI == "undefined") return;

    if (pageFindSearch) {
        let pageFind = new PagefindUI({
            element: pageFindSearch,
            showSubResults: true
        });
        (function () {
            const searchButton = document.querySelector(".pagefind-ui__toggle");
            new Search(searchButton, pageFind);
        })();
    }

});
