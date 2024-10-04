export function focusTrap(event, element, isOpened) {
    if (!isOpened || event.key !== 'Tab') {
        return;
    }

    const focusableElements = getFocusableElements(element);
    if (focusableElements.length === 0) {
        return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    handleTabLoop(event, firstFocusable, lastFocusable, element);
}

function getFocusableElements(element) {
    const focusables = 'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
    const elements = element.querySelectorAll(focusables);
    return Array.from(elements).filter(el => !el.disabled && el.tabIndex >= 0);
}

function handleTabLoop(event, firstFocusable, lastFocusable, element) {
    const goingBackward = event.shiftKey;
    const focusTarget = goingBackward ? lastFocusable : firstFocusable;
    // get focus position (we want first or last) to create the focus loop
    const focusOnLimit = isElementFocused(element, goingBackward ? firstFocusable : lastFocusable);

    if (focusOnLimit) {
        event.preventDefault();
        focusTarget.focus();
    }
}

function isElementFocused(element, focusableElement) {
    return document.activeElement === focusableElement || !element.contains(document.activeElement);
}