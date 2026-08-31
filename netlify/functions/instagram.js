/**
 * netlify/functions/instagram.js
 * Proxía el feed de Instagram usando el "Instagram Basic Display API".
 *
 * Variables de entorno (configúralas en Netlify):
 *   INSTAGRAM_APP_ID     — ID de la app de Facebook/Instagram
 *   INSTAGRAM_APP_SECRET — Secreto de la app
 *   INSTAGRAM_TOKEN      — Token de acceso de larga duración del usuario
 *
 * Fallback: si no hay credenciales o la API falla, devuelve un payload vacío
 * para que el frontend use /data/gallery.json (fallback local).
 */

const CACHE_MINUTES = 60;

const json = (body, status = 200) => ({
  statusCode: status,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': `public, max-age=${CACHE_MINUTES * 60}`,
  },
  body: JSON.stringify(body),
});

async function fetchInstagram() {
  const token = process.env.INSTAGRAM_TOKEN;
  if (!token) return { items: [] };

  const url =
    `https://graph.instagram.com/me/media` +
    `?fields=id,media_type,media_url,permalink,caption,timestamp` +
    `&access_token=${encodeURIComponent(token)}&limit=24`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Instagram API ${res.status}`);

  const data = await res.json();
  const items = (data.data || [])
    .filter((p) => p.media_type === 'IMAGE' || p.media_type === 'CAROUSEL_ALBUM')
    .map((p) => ({
      id: p.id,
      media_url: p.media_url,
      permalink: p.permalink || '#',
      caption: p.caption || '',
      timestamp: p.timestamp,
    }));

  return { items };
}

export async function handler() {
  try {
    const payload = await fetchInstagram();
    return json(payload);
  } catch (err) {
    // Devuelve vacío para que el frontend use el fallback local.
    return json({ items: [], error: String(err && err.message) }, 200);
  }
}
