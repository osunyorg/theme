import { getFocusableElements } from '../utils/a11y';

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