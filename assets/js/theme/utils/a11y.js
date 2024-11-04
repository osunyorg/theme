const actionKeys = [
  'Enter',
  'Space'
];

const a11yClick = function(element, action) {
  element.addEventListener('click', action);
  element.addEventListener('keydown', (event) => {
    actionKeys.forEach(key => {
      if (key === event.code) {
        action(event);
      }
    })
  });
}

const setButtonEnability = function(button, enable) {
  button.disabled = !enable;
  button.ariaHidden = !enable;
}

export {
  a11yClick,
  setButtonEnability
}