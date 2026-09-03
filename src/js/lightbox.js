/**
 * lightbox.js — lightbox accesible reutilizable.
 * Soporta navegación con flechas, swipe táctil, focus trap y tecla ESC.
 *
 *   createLightbox({ items, startIndex, onClose })
 *     items: Array<{ src, alt, caption }>
 *     startIndex: number
 *     onClose: callback al cerrar (opcional)
 *
 *   Retorna { close }.
 */

import { enableSwipe } from './swipe.js';
import { trapFocus } from './focus-trap.js';

const ICONS = {
  close: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  prev: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>',
  next: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>',
};

function buildMarkup(hasCounter) {
  return `
    <button class="lightbox__btn lightbox__close" aria-label="Cerrar visor">${ICONS.close}</button>
    <button class="lightbox__btn lightbox__prev" aria-label="Imagen anterior">${ICONS.prev}</button>
    <button class="lightbox__btn lightbox__next" aria-label="Imagen siguiente">${ICONS.next}</button>
    <img class="lightbox__img" src="" alt="" id="lightbox-img">
    <p class="lightbox__caption" id="lightbox-caption"></p>
    ${hasCounter ? '<p class="lightbox__counter sr-only" aria-live="polite"></p>' : ''}
  `;
}

export function createLightbox({ items, startIndex = 0, onClose, hasCounter = false }) {
  const container = document.createElement('div');
  container.className = 'lightbox';
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-modal', 'true');
  container.setAttribute('aria-label', 'Visor de imagen ampliada');
  container.innerHTML = buildMarkup(hasCounter);
  document.body.appendChild(container);

  if (hasCounter) {
    container.setAttribute('aria-describedby', 'lightbox-caption');
  }

  const img = container.querySelector('.lightbox__img');
  const caption = container.querySelector('.lightbox__caption');
  const counter = container.querySelector('.lightbox__counter');
  const closeBtn = container.querySelector('.lightbox__close');
  const prevBtn = container.querySelector('.lightbox__prev');
  const nextBtn = container.querySelector('.lightbox__next');

  let current = startIndex;
  let removeSwipe = null;
  let release = null;

  function show(index) {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    current = index;
    const item = items[current];
    img.src = item.src;
    img.alt = item.alt || '';
    caption.textContent = item.caption || '';
    if (counter) counter.textContent = `${current + 1} de ${items.length}`;
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
  }

  function open() {
    container.classList.add('is-open');
    show(startIndex);
    release = trapFocus(container);
    closeBtn.focus();
    document.addEventListener('keydown', onKey);
    removeSwipe = enableSwipe(container, {
      onSwipeLeft: () => show(current + 1),
      onSwipeRight: () => show(current - 1),
    });
  }

  function close() {
    container.classList.remove('is-open');
    document.removeEventListener('keydown', onKey);
    if (removeSwipe) { removeSwipe(); removeSwipe = null; }
    if (release) { release(); release = null; }
    container.remove();
    if (onClose) onClose(current);
  }

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
  container.addEventListener('click', (e) => {
    if (e.target === container) close();
  });

  open();

  return { close, container };
}
