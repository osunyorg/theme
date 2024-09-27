export function focusTrap(event, element, isOpened) {
    const focusables = 'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
    const elements = element.querySelectorAll(focusables);
    const focusableInDialog = Array.from(elements).filter(el => !el.disabled && el.tabIndex >= 0);
    const firstFocusable = focusableInDialog[0];
    const lastFocusable = focusableInDialog[focusableInDialog.length - 1];

    if (!isOpened) {
        return;
    }

    if (event.key === 'Tab') {
        if (event.shiftKey) {
            if (document.activeElement === firstFocusable || !element.contains(document.activeElement)) {
                event.preventDefault();
                lastFocusable.focus();
            }
        } 
        else {
            if (document.activeElement === lastFocusable || !element.contains(document.activeElement)) {
                event.preventDefault();
                firstFocusable.focus();
            }
        }
    }
}
