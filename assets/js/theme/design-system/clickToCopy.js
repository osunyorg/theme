class ClickToCopy {
    constructor (button) {
        this.button = button;
        this.text = this.button.getAttribute('data-click-to-copy');
        this.timeout = null;
        this.listen();
    }

    listen () {
        this.button.addEventListener('click', this.copy.bind(this));

        this.button.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.copy();
            }
        });
    }

    copy () {
        navigator.clipboard.writeText(this.text).then(() => {
            this.button.classList.add('is-copied');
            clearTimeout(this.timeout);
            setTimeout(() => {
                this.button.classList.remove('is-copied');
            }, 3000);
        });
    }
}

// Selectors
(function () {
    const clickToCopy = document.querySelectorAll("[data-click-to-copy]");
    clickToCopy.forEach(button => {
        new ClickToCopy(button);
    })
})();