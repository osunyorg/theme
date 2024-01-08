import Splide from '@splidejs/splide';

Splide.defaults = {
    i18n: {
        first: 'Aller au premier slide',
        last: 'Aller au dernier slide',
        next: 'Slide suivant',
        pageX: 'Aller à la page %s',
        pause: 'Mettre en pause le carousel',
        play: 'Démarrer le carousel',
        prev: 'Slide précedent',
        slideX: 'Aller au slide %s'
    }
};

class Carousel {
    constructor (element) {
        this.element = element;
        this.init();
    }

    init () {
        this.splide = new Splide(this.element).mount();
        const toggleButton = this.splide.root.querySelector('.splide__toggle'),
            stepButtons = this.splide.root.querySelectorAll('.splide__pagination button');

        this.listen();

        if (toggleButton) {
            stepButtons.forEach((stepButton) => {
                stepButton.innerHTML = '<i></i>';
            });

            this.splide.on('autoplay:playing', (rate) => {
                const activeStepButton = this.splide.root.querySelector('.splide__pagination .is-active i');
                activeStepButton.style.width = rate * 100 + '%';
            });

            stepButtons.forEach((stepButton) => {
                const progressBar = stepButton.querySelector('i');
                stepButton.addEventListener('click', () => {
                    progressBar.style.removeProperty("width");
                })
            });
        }
    }

    listen() {
        this.splide.on('move', () => {
            this.splide.root.classList.add('is-moving')
        });

        this.splide.on('moved', () => {
            this.splide.root.classList.remove('is-moving')
        });
    }
}

(function () {
    var splides = document.getElementsByClassName('splide'),
        i = 0;
    for (i = 0; i < splides.length; i+=1) {
        new Carousel(splides[i]);
    }
}());
