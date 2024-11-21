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
    var focusableChildren = element.querySelectorAll('a, button');
    focusableChildren.forEach(function (child) {
        setAriaVisibility(child, enable, true);
    });
    if (isChild) {
        element[enable ? 'removeAttribute' : 'setAttribute']('tabindex', '-1');
    } else {
        element.setAttribute('tabindex', enable ? '0' : '-1');
    }
    element.setAttribute('aria-hidden', String(!enable));
};

export {
    a11yClick,
    setButtonEnability,
    setAriaVisibility
};
