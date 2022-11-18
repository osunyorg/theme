const actionKeys = [
  'Enter',
  'Space'
];

const a11yClick = function(element, action) {
  element.addEventListener('click', action);
  element.addEventListener('keydown', (event) => {
    console.log(event)
    actionKeys.forEach(key => {
      if (key === event.code) {
        action(event);
      }
    })
  });
}

export {
  a11yClick
}