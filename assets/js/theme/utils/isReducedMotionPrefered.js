export const isReducedMotionPrefered = function () {
    // Grab the prefers reduced media query.
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return !mediaQuery || mediaQuery.matches;
};
