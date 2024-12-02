var setRealViewportHeight = function () {
    var rvh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--rvh', rvh + 'px');
};

window.addEventListener('load', setRealViewportHeight);
window.addEventListener('resize', setRealViewportHeight);

