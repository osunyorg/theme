import gLightbox from 'glightbox';

let lightboxBtn;

const lightbox = gLightbox({
    openEffect: 'fade',
    closeEffect: 'fade',
    onOpen: () => {
        lightboxBtn = document.activeElement;
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