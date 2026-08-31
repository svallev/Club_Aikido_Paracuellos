/**
 * icons.js — Iconos inline SVG (sin librerías de rutas externas, extraídos de @tabler/icons).
 * Los iconos sociales usan `currentColor` para heredar el color y sus estados.
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

function socialIcon(paths) {
  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="${STROKE}" aria-hidden="true" focusable="false">${paths}</svg>`;
}

export const socials = {
  instagram: socialIcon(
    '<path d="M16 3a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-8a5 5 0 0 1 -5 -5v-8a5 5 0 0 1 5 -5zm-4 5a4 4 0 0 0 -3.995 3.8l-.005 .2a4 4 0 1 0 4 -4m4.5 -1.5a1 1 0 0 0 -.993 .883l-.007 .127a1 1 0 0 0 1.993 .117l.007 -.127a1 1 0 0 0 -1 -1" />'
  ),
  youtube: socialIcon(
    '<path d="M18 3a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-12a5 5 0 0 1 -5 -5v-8a5 5 0 0 1 5 -5zm-9 6v6a1 1 0 0 0 1.514 .857l5 -3a1 1 0 0 0 0 -1.714l-5 -3a1 1 0 0 0 -1.514 .857z" />'
  ),
  facebook: socialIcon(
    '<path d="M18 2a1 1 0 0 1 .993 .883l.007 .117v4a1 1 0 0 1 -.883 .993l-.117 .007h-3v1h3a1 1 0 0 1 .991 1.131l-.02 .112l-1 4a1 1 0 0 1 -.858 .75l-.113 .007h-2v6a1 1 0 0 1 -.883 .993l-.117 .007h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-6h-2a1 1 0 0 1 -.993 -.883l-.007 -.117v-4a1 1 0 0 1 .883 -.993l.117 -.007h2v-1a6 6 0 0 1 5.775 -5.996l.225 -.004h3z" />'
  ),
  tiktok: socialIcon(
    '<path d="M16.083 2h-4.083a1 1 0 0 0 -1 1v11.5a1.5 1.5 0 1 1 -2.519 -1.1l.12 -.1a1 1 0 0 0 .399 -.8v-4.326a1 1 0 0 0 -1.23 -.974a7.5 7.5 0 0 0 1.73 14.8l.243 -.005a7.5 7.5 0 0 0 7.257 -7.495v-2.7l.311 .153c1.122 .53 2.333 .868 3.59 .993a1 1 0 0 0 1.099 -.996v-4.033a1 1 0 0 0 -.834 -.986a5.005 5.005 0 0 1 -4.097 -4.096a1 1 0 0 0 -.986 -.835z" />'
  ),
};

export function iconButton(label, iconHtml, extra = '') {
  return {
    label,
    html: `<span class="sr-only">${label}</span>${iconHtml}`,
    extra,
  };
}
