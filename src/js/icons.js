/**
 * icons.js — Iconos inline SVG (sin librerías).
 * Trazo fino y consistente; usan `currentColor` para los estados.
 */

const STROKE = 'currentColor';

/** Enso: círculo semicompleto (firma del club). */
export function ensoSVG(size = '100%') {
  return `<svg class="enso" viewBox="0 0 200 200" width="${size}" height="${size}"
    aria-hidden="true" focusable="false" fill="none">
    <circle cx="100" cy="100" r="74" stroke="${STROKE}" stroke-width="3"
      stroke-linecap="round" stroke-dasharray="464 1200" opacity="0.85"/>
  </svg>`;
}

/** Marca / logotipo: círculo con centro (hara). */
export function brandMark() {
  return `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" class="brand-mark">
    <circle cx="24" cy="24" r="20" stroke="${STROKE}" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="24" cy="24" r="7" fill="${STROKE}"/>
  </svg>`;
}

function socialIcon(path) {
  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="${STROKE}" aria-hidden="true" focusable="false">${path}</svg>`;
}

export const socials = {
  instagram: socialIcon(
    '<path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.3-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.4 1.3-.1 1.7-.1 4.9-.1zm0 1.8c-3.1 0-3.5 0-4.8.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.3 1-.4 2.1-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.4.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4-1.3-.1-1.7-.1-4.8-.1zm0 3.1a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm5.2-3.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/>'
  ),
  youtube: socialIcon(
    '<path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 16 24 12 24 12s0-4-.5-5.8zM9.6 15.5V8.5l6 3.5-6 3.5z"/>'
  ),
  facebook: socialIcon(
    '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/>'
  ),
  tiktok: socialIcon(
    '<path d="M19.6 5.5a6.2 6.2 0 0 1-3.5-1.8 6.2 6.2 0 0 1-1.6-3.7H11v14.5a2.9 2.9 0 1 1-2.5-2.9V9.1a6.5 6.5 0 1 0 5.6 6.6V9.8a8 8 0 0 0 4.6 1.5V8.2a6 6 0 0 1-.6 0c-.5 0-1-.1-1.5-.3v-2.4z"/>'
  ),
};

export function iconButton(label, iconHtml, extra = '') {
  return {
    label,
    html: `<span class="sr-only">${label}</span>${iconHtml}`,
    extra,
  };
}
