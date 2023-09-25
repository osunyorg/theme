window.addEventListener('load', () => {
    document.body.classList.add('is-loaded');
});
window.addEventListener('DOMContentLoaded', (event) => {
    new PagefindUI({ element: "#search", showSubResults: true });
});
