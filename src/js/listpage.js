/**
 * listpage.js — renderiza las listas de actividades y cursos desde JSON.
 * Nombres de mes en español, tarjetas con fecha y estado "próximo".
 *
 * El renderizado es configurable:
 *  - showImage: muestra una foto por tarjeta y, si se activa como clickeable,
 *    abre un lightbox con la imagen del elemento al pulsar la tarjeta.
 *    El lightbox permite navegar entre las imágenes con flechas (como la
 *    galería).
 *  - showYear:  incluye el año en el bloque de fecha.
 *  - modifier:  clase de estilo opcional (p. ej. 'curso') para variantes.
 *  - clickable: cuando es true, la tarjeta con imagen es interactiva y abre
 *    el lightbox (clic en toda la tarjeta, Enter o Espacio).
 * Cada página decide qué opciones activa.
 */

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** Convierte '2025-05-24' en una entrada con día, mes y año. */
function dateParts(item) {
  const d = new Date((item.date || '').slice(0, 10) + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return { day: '–', month: '', year: '' };
  return { day: d.getDate(), month: MESES[d.getMonth()], year: d.getFullYear() };
}

/** Datos de fecha en formato corto para el lightbox: '18 ENE 2025'. */
function formatDate(item) {
  const d = new Date((item.date || '').slice(0, 10) + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getDate()} ${MESES[d.getMonth()].toUpperCase()} ${d.getFullYear()}`;
}

/**
 * Abre el lightbox de un curso (reutiliza las clases .lightbox) con
 * navegación entre todos los cursos (flechas anterior/siguiente, igual que
 * la galería). Al pulsar una tarjeta se parte desde el curso correspondiente
 * y se puede recorrer el resto con ArrowLeft/ArrowRight o los botones.
 */
function openImageLightbox(list, index) {
  const cards = Array.from(list.querySelectorAll('article[role="button"]'));
  if (!cards.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Visor de imagen ampliada');
  overlay.innerHTML = `
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
  document.body.appendChild(overlay);

  const img = overlay.querySelector('.lightbox__img');
  const caption = overlay.querySelector('.lightbox__caption');
  const closeBtn = overlay.querySelector('.lightbox__close');
  const prevBtn = overlay.querySelector('.lightbox__prev');
  const nextBtn = overlay.querySelector('.lightbox__next');
  let current = index;

  function dataOf(card) {
    const figure = card.querySelector('[data-src]');
    return {
      src: figure?.dataset.src || card.querySelector('img')?.src || '',
      alt: figure?.dataset.alt || '',
      caption: figure?.dataset.caption || figure?.dataset.alt || '',
    };
  }

  function show(i) {
    current = (i + cards.length) % cards.length;
    const { src, alt, caption: cap } = dataOf(cards[current]);
    img.src = src;
    img.alt = alt;
    caption.textContent = cap;
  }

  function close() {
    overlay.classList.remove('is-open');
    document.removeEventListener('keydown', onKey);
    overlay.remove();
    cards[current]?.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
  }

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', onKey);

  show(index);
  overlay.classList.add('is-open');
  closeBtn.focus();
}

function renderCard(item, options = {}) {
  const { day, month, year } = dateParts(item);
  const upcoming = item.upcoming;
  const meta = [];

  if (item.club) meta.push(item.club);
  if (item.schedule) meta.push(item.schedule);

  const instructors = [item.instructor, item.instructor2].filter(Boolean).join(' · ');

  const modifier = options.modifier ? ` event-card--${options.modifier}` : '';
  const clickable = options.showImage && options.clickable;
  const interactiveAttrs = clickable && item.image
    ? ' role="button" tabindex="0" aria-haspopup="dialog"'
    : '';

  const fechaLarga = formatDate(item);
  const caption = options.clickable && fechaLarga ? `${item.title} | ${fechaLarga}` : item.title;

  const photo = options.showImage && item.image
    ? `<figure class="event-media" data-src="${item.image}" data-alt="${item.title}" data-caption="${caption}" aria-hidden="true">
        <img src="${item.image}" alt="" loading="lazy" decoding="async">
      </figure>`
    : '';

  const yearMarkup = options.showYear && year
    ? `<span class="year">${year}</span>`
    : '';

  const mediaModifier = photo ? (modifier || ' event-card--media') : '';

  return `
    <article class="event-card reveal${upcoming ? ' event-card--upcoming' : ''}${mediaModifier}"${interactiveAttrs}>
      ${photo}
      <div class="event-main">
        <div class="event-date" aria-hidden="true">
          <span class="day">${day}</span>
          <span class="month">${month}</span>
          ${yearMarkup}
        </div>
        <div class="event-card__body">
          ${upcoming ? '<span class="event-badge">Próximo</span>' : ''}
          <h3 class="event-card__title">${item.title}</h3>
          ${instructors ? `<p class="event-meta"><strong>${instructors}</strong></p>` : ''}
          ${meta.length ? `<p class="event-meta">${meta.join(' · ')}</p>` : ''}
        </div>
      </div>
    </article>
  `;
}

function bindLightbox(list, clickable) {
  if (!clickable) return;

  list.addEventListener('click', (e) => {
    const card = e.target.closest('article[role="button"]');
    if (!card) return;
    const figure = card.querySelector('[data-src]');
    if (!figure) return;
    const index = Array.from(list.querySelectorAll('article[role="button"]')).indexOf(card);
    openImageLightbox(list, index);
  });

  list.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('[role="button"][tabindex="0"]');
    if (!card) return;
    const figure = card.querySelector('[data-src]');
    if (!figure) return;
    e.preventDefault();
    const index = Array.from(list.querySelectorAll('article[role="button"]')).indexOf(card);
    openImageLightbox(list, index);
  });
}

async function loadList(container, url, emptyCopy, options) {
  if (!container) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('bad status');
    const items = await res.json();
    // Ordenar cronológico descendente (los próximos primero por fecha)
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!items.length) {
      container.innerHTML = `<div class="state-box"><p>${emptyCopy}</p></div>`;
      return;
    }
    container.innerHTML = items.map((item) => renderCard(item, options)).join('');
    bindLightbox(container, options.clickable);
  } catch {
    container.innerHTML = `
      <div class="state-box" role="alert">
        <h3>No se pudo cargar el contenido</h3>
        <p>Revisa tu conexión e inténtalo de nuevo.</p>
        <button type="button" class="btn btn--primary" data-retry>Reintentar</button>
      </div>
    `;
    container
      .querySelector('[data-retry]')
      ?.addEventListener('click', () => loadList(container, url, emptyCopy, options));
  }
}

export function initListPage({ listEl, url, emptyCopy, showImage = false, showYear = false, modifier = '', clickable = false }) {
  const list = document.querySelector(listEl);
  if (!list) return;
  loadList(list, url, emptyCopy, { showImage, showYear, modifier, clickable });
}
