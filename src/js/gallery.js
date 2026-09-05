/**
 * gallery.js — cuadrícula de Instagram + lightbox accesible.
 * La fuente de datos puede ser la función Vercel (/api/instagram) o un fallback local.
 */

import { createLightbox } from './lightbox.js';

function renderGrid(data) {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  const items = data.map((item) => {
    const caption = item.caption || 'Fotografía del club';
    return { src: item.media_url, alt: caption, caption };
  });

  grid.innerHTML = items
    .map(
      (item, i) => `
      <li>
        <figure class="media gallery-item" data-index="${i}" role="button" tabindex="0" aria-label="${item.caption}">
          <img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async">
        </figure>
      </li>`
    )
    .join('');

  grid.addEventListener('click', (e) => {
    const el = e.target.closest('[data-index]');
    if (el) createLightbox({ items, startIndex: Number(el.dataset.index), hasCounter: true });
  });

  grid.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const el = e.target.closest('[data-index]');
    if (!el) return;
    e.preventDefault();
    createLightbox({ items, startIndex: Number(el.dataset.index), hasCounter: true });
  });
}

export async function initGallery() {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  try {
    const res = await fetch('/api/instagram');
    if (!res.ok) throw new Error('bad status');
    const data = await res.json();
    const items = data.items || [];
    if (items.length === 0) throw new Error('empty items');
    renderGrid(items);
  } catch {
    // Fallback local si la función aún no está disponible en local.
    try {
      const res = await fetch('/data/gallery.json');
      if (!res.ok) throw new Error('no fallback');
      const data = await res.json();
      renderGrid(data.items || []);
    } catch {
      grid.innerHTML = `
        <div class="state-box" role="alert">
          <h3>La galería aún no está disponible</h3>
          <p>Vuelve a intentarlo más tarde o revisa la configuración del sitio.</p>
        </div>
      `;
    }
  }
}
