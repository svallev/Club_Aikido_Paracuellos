/**
 * main.js — lógica compartida de la interfaz:
 * cabecera, menú móvil, inyección de iconos SVG y micro-interacciones.
 */
import { socials } from './icons.js';
import { trapFocus } from './focus-trap.js';

/* Inyecta todos los iconos sociales como inline SVG en [data-social] */
function injectSocials() {
  document.querySelectorAll('[data-social]').forEach((el) => {
    const key = el.dataset.social;
    if (socials[key]) {
      el.innerHTML = socials[key];
    }
  });
}

/* Cabecera: estado "scrolled" */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  update();
  // Throttle sencillo sin window scroll listener en cada frame (usa rAF pasivo)
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}

/* Menú móvil con gestor de foco y cierre con ESC */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const close = menu?.querySelector('.mobile-menu-close');
  const links = menu ? Array.from(menu.querySelectorAll('a')) : [];
  let release = null;

  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');

    // Reenviar foco
    if (open) {
      document.body.style.overflow = 'hidden';
      release = trapFocus(menu);
      (close || links[0])?.focus();
    } else {
      document.body.style.overflow = '';
      if (release) { release(); release = null; }
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => {
    setOpen(!menu.classList.contains('is-open'));
  });

  close?.addEventListener('click', () => setOpen(false));

  links.forEach((link) => link.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
  });
}

/* Sombreado sutil en imágenes (si no soporta) — no aplica; se hace en CSS */
function initYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}

export function initChrome() {
  injectSocials();
  initHeader();
  initMobileMenu();
  initYear();
}

document.addEventListener('DOMContentLoaded', initChrome);
