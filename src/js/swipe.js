/**
 * swipe.js — detección de gestos swipe en elementos táctiles.
 * Úsalo en lightboxes, carruseles, etc.
 *
 *   enableSwipe(el, { onSwipeLeft, onSwipeRight })
 *
 * Se eliminan los listeners automáticamente con el returned remove().
 */

const THRESHOLD = 50;

export function enableSwipe(el, { onSwipeLeft, onSwipeRight }) {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  function onTouchStart(e) {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    tracking = true;
  }

  function onTouchEnd(e) {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) < THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0 && onSwipeRight) onSwipeRight();
    if (dx > 0 && onSwipeLeft) onSwipeLeft();
  }

  el.addEventListener('touchstart', onTouchStart, { passive: true });
  el.addEventListener('touchend', onTouchEnd, { passive: true });
  el.addEventListener('touchcancel', () => { tracking = false; }, { passive: true });

  return function remove() {
    el.removeEventListener('touchstart', onTouchStart);
    el.removeEventListener('touchend', onTouchEnd);
  };
}
