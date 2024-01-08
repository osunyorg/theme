"use strict";

window.osuny.breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};
window.osuny.isMobile = function isMobile() {
  return window.innerWidth <= window.osuny.breakpoints.md;
};