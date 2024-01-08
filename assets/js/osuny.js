"use strict";

window.osuny = {
  responsivity: {
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400
    },
    isMobile: function isMobile() {
      return window.innerWidth <= window.osuny.responsivity.breakpoints.md;
    }
  },
  a11y: {
    actionKeys: ['Enter', 'Space'],
    click: function a11yClick (element, action) {
      element.addEventListener('click', action);
      element.addEventListener('keydown', function (event) {
        actionKeys.forEach(function (key) {
          if (key === event.code) {
            action(event);
          }
        });
      });
    }
  }
};
