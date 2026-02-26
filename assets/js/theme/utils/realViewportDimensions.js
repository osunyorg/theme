function setRealViewportHeight () {
    var rvh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--rvh', rvh + 'px');
};

function setRealViewportWidth () {
    // https://destroytoday.com/blog/100vw-and-the-horizontal-overflow-you-probably-didnt-know-about
    // The window.innerWidth does not return the real viewport width, it's include scrollbar (that is ignored by css's unit `vw`)
    var rvw = document.body.clientWidth * 0.01;
    document.documentElement.style.setProperty('--rvw', rvw + 'px');
};

function setRealViewportSize () {
    setRealViewportHeight();
    setRealViewportWidth();
};

window.addEventListener('load', setRealViewportSize);
window.addEventListener('resize', setRealViewportSize);

