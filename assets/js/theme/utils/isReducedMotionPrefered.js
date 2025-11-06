export var isReducedMotionPrefered = function () {
    // Grab the prefers reduced media query.
    var mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return !mediaQuery || mediaQuery.matches;
};
