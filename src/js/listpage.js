/**
 * listpage.js — renderiza las listas de actividades y cursos desde JSON.
 * Nombres de mes en español, tarjetas con fecha y estado "próximo".
 *
 * El renderizado es configurable:
 *  - showImage: muestra una foto (decorativa, sin enlace) por tarjeta.
 *  - showYear:  incluye el año en el bloque de fecha.
 * Cada página decide qué opciones activa.
 */

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** Convierte '2025-05-24' en una entrada con día, mes y año. */
function dateParts(item) {
  const d = new Date((item.date || '').slice(0, 10) + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return { day: '–', month: '', year: '' };
  return { day: d.getDate(), month: MESES[d.getMonth()], year: d.getFullYear() };
}

function renderCard(item, options = {}) {
  const { day, month, year } = dateParts(item);
  const upcoming = item.upcoming;
  const meta = [];

  if (item.club) meta.push(item.club);
  if (item.schedule) meta.push(item.schedule);

  const instructors = [item.instructor, item.instructor2].filter(Boolean).join(' · ');

  const photo = options.showImage && item.image
    ? `<figure class="event-media" aria-hidden="true">
        <img src="${item.image}" alt="" loading="lazy" decoding="async">
      </figure>`
    : '';

  const yearMarkup = options.showYear && year
    ? `<span class="year">${year}</span>`
    : '';

  const mediaModifier = photo ? ' event-card--media' : '';

  return `
    <article class="event-card reveal${upcoming ? ' event-card--upcoming' : ''}${mediaModifier}">
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

export function initListPage({ listEl, url, emptyCopy, showImage = false, showYear = false }) {
  const list = document.querySelector(listEl);
  if (!list) return;
  loadList(list, url, emptyCopy, { showImage, showYear });
}
