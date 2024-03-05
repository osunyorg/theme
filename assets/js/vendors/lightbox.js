import gLightbox from 'glightbox';

let siteLang = document.querySelector('html').getAttribute('lang');

let lightboxBtn;

const lightbox = gLightbox({
    selector: '.glightbox',
    openEffect: 'fade',
    closeEffect: 'fade',
    onOpen: () => {
        lightboxBtn = document.activeElement;
        const lightboxContainer = document.querySelector('#glightbox-body');
        lightboxContainer.setAttribute('aria-modal', 'true');

        if(siteLang == "fr") {
            const nextButton = document.querySelector('.gnext');
            const prevButton = document.querySelector('.gprev');
            const closeButton = document.querySelector('.gclose');
        
            nextButton.setAttribute('aria-label', 'Suivant');
            prevButton.setAttribute('aria-label', 'Précédent');
            closeButton.setAttribute('aria-label', 'Fermer');
        }
    },
    onClose: () => {
        if (lightboxBtn) {
            lightboxBtn.focus();
        }
    }
});

lightbox.on('slide_changed', () => {
    const currentSlide = document.querySelector('.gslide.current');
    if (currentSlide) {
        currentSlide.setAttribute("tabindex", "0");
        currentSlide.focus();
    }
});