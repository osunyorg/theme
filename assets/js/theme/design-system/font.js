// Fix async font load
document.fonts.ready.then(function () {
    window.dispatchEvent(new Event('resize'));
});
