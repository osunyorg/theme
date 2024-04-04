const breakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
};

const isMobile = function() {
    return window.innerWidth <= breakpoints.lg 
}

export {
    breakpoints,
    isMobile
}