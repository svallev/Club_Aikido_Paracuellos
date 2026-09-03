/**
 * listpage.js — renderiza las listas de actividades y cursos desde JSON.
 * Nombres de mes en español, tarjetas con fecha y estado "próximo".
 *
 * El renderizado es configurable:
 *  - showImage: muestra una foto por tarjeta y, si se activa como clickeable,
 *    abre un lightbox con la imagen del elemento al pulsar la tarjeta.
 *  - showYear:  incluye el año en el bloque de fecha.
 *  - modifier:  clase de estilo opcional (p. ej. 'curso') para variantes.
 *  - clickable: cuando es true, la tarjeta con imagen es interactiva y abre
 *    el lightbox (clic en toda la tarjeta, Enter o Espacio).
 * Cada página decide qué opciones activa.
 */

import { createLightbox } from './lightbox.js';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** Escapa HTML para inserción segura en innerHTML. */
function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

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
    ? `<figure class="event-media" data-src="${item.image}" data-alt="${escapeHTML(item.title)}" data-caption="${escapeHTML(caption)}" aria-hidden="true">
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
          <h3 class="event-card__title">${escapeHTML(item.title)}</h3>
          ${instructors ? `<p class="event-meta"><strong>${escapeHTML(instructors)}</strong></p>` : ''}
          ${meta.length ? `<p class="event-meta">${meta.map(escapeHTML).join(' · ')}</p>` : ''}
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
    openLightboxFromCard(list, card);
  });

  list.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('[role="button"][tabindex="0"]');
    if (!card) return;
    e.preventDefault();
    openLightboxFromCard(list, card);
  });
}

function openLightboxFromCard(list, card) {
  const cards = Array.from(list.querySelectorAll('article[role="button"]'));
  const index = cards.indexOf(card);

  const items = cards.map((c) => {
    const figure = c.querySelector('[data-src]');
    return {
      src: figure?.dataset.src || c.querySelector('img')?.src || '',
      alt: figure?.dataset.alt || '',
      caption: figure?.dataset.caption || figure?.dataset.alt || '',
    };
  });

  createLightbox({ items, startIndex: index });
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
