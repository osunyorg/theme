export function focusTrap(event, element, isOpened) {
    const focusables = 'a, button, input, textarea, select, details, [tabindex], [contenteditable="true"]',
    elements = element.querySelectorAll(focusables),
    focusableInDialog = Array.from(elements).filter(element => element.tabIndex >= 0),
    firstFocusable = focusableInDialog[0],
    lastFocusable = focusableInDialog.at(-1);

    if (!isOpened) {
        return;
    }
    if (!element.contains(event.target) && event.shiftKey) {
        lastFocusable.focus();
        event.preventDefault();
    }
    else if (!element.contains(event.target)) {
        firstFocusable.focus();
        event.preventDefault();
    }
}
