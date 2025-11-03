var breakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1440,
    xxxl: 1600
};

var isMobile = function() {
    return window.innerWidth <= breakpoints.lg 
}

export {
    breakpoints,
    isMobile
}