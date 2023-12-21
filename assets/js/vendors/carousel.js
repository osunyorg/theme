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
            stepButtons = this.splide.root.querySelectorAll('.splide__pagination button'),
            elements = this.splide.root.querySelectorAll('.splide__pagination, .splide__slide'),
            autoplay = this.splide.Components.Autoplay;

        this.listen();

        if (toggleButton) {
            stepButtons.forEach((stepButton) => {
                stepButton.innerHTML = '<i></i>';
            });

            this.splide.on('autoplay:play', () => {
                toggleButton.classList.add('is-active');
                console.log(toggleButton)
            });

            this.splide.on('autoplay:playing', (rate) => {

                var activeStepButton = this.splide.root.querySelector('.splide__pagination .is-active i');
                activeStepButton.style.width = rate * 100 + '%';
            });

            this.splide.on('autoplay:pause', () => {
                toggleButton.classList.remove('is-active');
            });

            elements.forEach(element => {
                element.addEventListener('click', () => {
                    autoplay.pause();
                })
            });

            this.splide.on('drag', () => {
                autoplay.pause();
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
