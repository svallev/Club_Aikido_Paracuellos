/**
 * focus-trap.js — trapping focus inside a dialog container.
 *
 * Usage:
 *   const release = trapFocus(dialogEl);
 *   // … later …
 *   release(); // restores previous focus
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Trap keyboard focus inside `container` until `release()` is called.
 * Returns a release function that removes the trap and restores previous focus.
 */
export function trapFocus(container) {
  const previous = document.activeElement;
  const focusable = [...container.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.offsetParent !== null
  );

  function onKey(e) {
    if (e.key !== 'Tab') return;
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  container.addEventListener('keydown', onKey);

  return function release() {
    container.removeEventListener('keydown', onKey);
    if (previous && previous.isConnected) previous.focus();
  };
}
