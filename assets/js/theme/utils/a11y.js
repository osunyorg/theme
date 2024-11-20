var actionKeys = [
        'Enter',
        'Space'
    ],
    a11yClick,
    setButtonEnability,
    setAriaVisibility,
    setTabIndex;

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

setTabIndex = function (element, enable) {
    element.setAttribute('tabindex', enable ? '0' : '-1');
};

setAriaVisibility = function (element, enable) {
    var focusableChildren = element.querySelectorAll('a, button');
    element.setAttribute('aria-hidden', !enable);
    setTabIndex(element, enable);
    focusableChildren.forEach(function (child) {
        setTabIndex(child, enable);
    });
};

export {
    a11yClick,
    setButtonEnability,
    setAriaVisibility
};
