var actionKeys = [
        'Enter',
        'Space'
    ],
    a11yClick,
    setButtonEnability,
    setAriaVisibility;

a11yClick = function (element, action) {
    element.addEventListener('click', action);
    element.addEventListener('keydown', function (event) {
        if (actionKeys.includes(event.code)) {
            action(event);
        }
    });
};

setButtonEnability = function (button, enable) {
    button.disabled = !enable;
    button.ariaHidden = !enable;
};

setAriaVisibility = function (element, enable, isChild) {
    var focusableChildren = element.querySelectorAll('a, button, [role="button"]'),
        action = enable ? 'removeAttribute' : 'setAttribute';
    focusableChildren.forEach(function (child) {
        setAriaVisibility(child, enable, true);
    });
    if (isChild) {
        element[action]('tabindex', '-1');
    } else {
        element[action]('aria-hidden', 'true');
    }
};

export {
    a11yClick,
    setButtonEnability,
    setAriaVisibility
};
