/**
 * listpage.js — renderiza las listas de actividades y cursos desde JSON.
 * Nombres de mes en español, tarjetas con fecha y estado "próximo".
 */

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** Convierte '2025-05-24' en una entrada con día y mes. */
function dateParts(item) {
  const d = new Date((item.date || '').slice(0, 10) + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return { day: '–', month: '' };
  return { day: d.getDate(), month: MESES[d.getMonth()] };
}

function renderCard(item) {
  const { day, month } = dateParts(item);
  const upcoming = item.upcoming;
  const meta = [];

  if (item.club) meta.push(item.club);
  if (item.schedule) meta.push(item.schedule);

  const instructors = [item.instructor, item.instructor2].filter(Boolean).join(' · ');

  return `
    <article class="event-card reveal ${upcoming ? 'event-card--upcoming' : ''}">
      <div class="event-date" aria-hidden="true">
        <span class="day">${day}</span>
        <span class="month">${month}</span>
      </div>
      <div class="event-card__body">
        ${upcoming ? '<span class="event-badge">Próximo</span>' : ''}
        <h3 class="event-card__title">${item.title}</h3>
        ${instructors ? `<p class="event-meta"><strong>${instructors}</strong></p>` : ''}
        ${meta.length ? `<p class="event-meta">${meta.join(' · ')}</p>` : ''}
      </div>
    </article>
  `;
}

async function loadList(container, url, emptyCopy) {
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
    container.innerHTML = items.map(renderCard).join('');
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
      ?.addEventListener('click', () => loadList(container, url, emptyCopy));
  }
}

export function initListPage({ listEl, url, emptyCopy }) {
  const list = document.querySelector(listEl);
  if (!list) return;
  loadList(list, url, emptyCopy);
}
