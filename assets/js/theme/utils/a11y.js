"use strict";

window.osuny.a11y = {
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