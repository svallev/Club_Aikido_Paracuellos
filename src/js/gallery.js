/**
 * gallery.js — cuadrícula de Instagram + lightbox accesible.
 * La fuente de datos puede ser la función Netlify o un fallback local.
 */

function buildLightbox(grid) {
  const container = document.createElement('div');
  container.className = 'lightbox';
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-modal', 'true');
  container.setAttribute('aria-label', 'Visor de imagen ampliada');
  container.innerHTML = `
    <button class="lightbox__btn lightbox__close" aria-label="Cerrar visor">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
    <button class="lightbox__btn lightbox__prev" aria-label="Imagen anterior">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>
    </button>
    <button class="lightbox__btn lightbox__next" aria-label="Imagen siguiente">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
    </button>
    <img class="lightbox__img" src="" alt="">
    <p class="lightbox__caption"></p>
  `;
  document.body.appendChild(container);

  const img = container.querySelector('.lightbox__img');
  const caption = container.querySelector('.lightbox__caption');
  const closeBtn = container.querySelector('.lightbox__close');
  const prevBtn = container.querySelector('.lightbox__prev');
  const nextBtn = container.querySelector('.lightbox__next');

  const items = Array.from(grid.querySelectorAll('[data-src]'));
  let current = -1;

  function show(index) {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    current = index;
    const el = items[index];
    const src = el.dataset.src || el.querySelector('img')?.src || '';
    img.src = src;
    img.alt = el.dataset.alt || '';
    caption.textContent = el.dataset.caption || '';
  }

  function open(index) {
    container.classList.add('is-open');
    show(index);
    closeBtn.focus();
    document.addEventListener('keydown', onKey);
  }

  function close() {
    container.classList.remove('is-open');
    document.removeEventListener('keydown', onKey);
    grid.querySelector('.media button')?.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
  }

  grid.addEventListener('click', (e) => {
    const t = e.target.closest('[data-src]');
    if (t) {
      e.preventDefault();
      open(items.indexOf(t));
    }
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
  container.addEventListener('click', (e) => {
    if (e.target === container) close();
  });

  return { close };
}

function renderGrid(data) {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  grid.innerHTML = data
    .map((item) => {
      // Rutas relativas para funcionar bajo cualquier raíz (GitHub Pages, etc.).
      const src = item.media_url.replace(/^\//, '');
      return `
        <figure class="media gallery-item" data-src="${src}" data-alt="${item.caption || ''}" data-caption="${item.caption || ''}">
          <img src="${src}" alt="${item.caption || 'Fotografía del club'}" loading="lazy" decoding="async">
        </figure>
      `;
    })
    .join('');

  buildLightbox(grid);
}

export async function initGallery() {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  try {
    // Fuente local: la galería se sirve desde data/gallery.json (ruta relativa
    // para funcionar bajo cualquier raíz, incl. GitHub Pages).
    const res = await fetch('data/gallery.json');
    if (!res.ok) throw new Error('no fallback');
    const data = await res.json();
    renderGrid(data.items || []);
  } catch {
    grid.innerHTML = `
      <div class="state-box">
        <h3>La galería aún no está disponible</h3>
        <p>Añade imágenes a «data/gallery.json».</p>
      </div>
    `;
  }
}
