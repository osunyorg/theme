// Fix async font load
document.fonts.ready.then(() => {
  window.dispatchEvent(new Event('resize'));
});