class Search {
    constructor(button, pageFind) {
        this.button = button;
        this.element = document.querySelector('.search__modal');
        this.closeButton = this.element.querySelector('.search__close');
        this.searchInstance = pageFind;


        if (!this.element) {
            return;
        }
        this.state = {
            isOpened: false
        };

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
            this.searchInstance.triggerSearch(' ');
            this.toggle(false);
        });

        window.addEventListener('keydown', (event) => {
            if (event.keyCode === 27 || event.key === 'Escape') {
                this.toggle(false);
                this.button.focus();
            } else if (event.key === "Tab" && this.state.isOpened) {
                this.innerFocus(event);
            }
        });
    }

    innerFocus(event) {
        const focusables = 'a, button, input, textarea, select, details, [tabindex], [contenteditable="true"]';
        const elements = this.element.querySelectorAll(focusables);
        
        const focusableInDialog = Array.from(elements).filter(element => element.tabIndex >= 0);
        const firstFocusable = focusableInDialog[0];
        const lastFocusable = focusableInDialog.at(-1);

        if (!this.state.isOpened) {
            return;
        }
        if (!this.element.contains(event.target) && event.shiftKey) {
            lastFocusable.focus();
            event.preventDefault();
        }
        else if (!this.element.contains(event.target)) {            
            firstFocusable.focus();
            event.preventDefault();
        }
    }

    toggle(open = !this.state.isOpened) {
        this.state.isOpened = open;
        this.element.setAttribute('aria-hidden', !this.state.isOpened);
        this.button.setAttribute('aria-expanded', this.state.isOpened);

        if (open) {
            this.input = this.element.querySelector('input');
            this.input.focus();

            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }
}

// Selectors
window.addEventListener('DOMContentLoaded', (event) => {
    const pageFindSearch = document.querySelector("#search");
    
    if (pageFindSearch) {
        let pageFind = new PagefindUI({ element: pageFindSearch, showSubResults: true });
        (function () {
            const searchButton = document.querySelector(".pagefind-ui__toggle");
            new Search(searchButton, pageFind);
        })();
    } 
    else {
        return;
    }
});
