var actionKeys = [
        'Enter',
        'Space'
    ],
    a11yClick,
    setButtonEnability,
    setAriaVisibility,
    ariaHideBodyChildren,
    parentQuerySelector,
    setDescribedBy;

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

ariaHideBodyChildren = function (element, inert) {
    var bodyChildren = document.body.children,
        action = inert ? 'setAttribute' : 'removeAttribute',
        ignoredElements = ['SCRIPT', 'STYLE'];

    Array.prototype.forEach.call(bodyChildren, function (child) {
        if (element !== child && !child.contains(element) && ignoredElements.indexOf(child.nodeName) === -1) {
            child[action]('aria-hidden', 'true');
        }
    }.bind(this));
};

parentQuerySelector = function (element, parentSelector, targetSelector) {
    var parent = element.closest(parentSelector),
        target;
    if (!parent) {
        return;
    }
    target = parent.querySelector(targetSelector);
    return target;
};

setDescribedBy = function () {
    var elementsToDescribe = document.querySelectorAll('[data-describedby]'),
        title;
    elementsToDescribe.forEach(function (element, index) {
        title = parentQuerySelector(element, '.block', '.block-title');
        if (title) {
            title.id = title.id ? title.id : 'aria-title-' + index;
            element.setAttribute('aria-describedby', title.id);
            element.removeAttribute('data-describedby');
        }
    });
};

setDescribedBy();

export {
    a11yClick,
    setButtonEnability,
    setAriaVisibility,
    ariaHideBodyChildren,
    parentQuerySelector
};
