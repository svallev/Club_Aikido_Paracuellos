# Guía de administración de contenido

**Web del C.D.E. Aikido Paracuellos** — [clubaikidoparacuellos.es](https://clubaikidoparacuellos.es)

---

## Índice

1. [Estructura general](#1-estructura-general)
2. [Añadir o editar actividades](#2-añadir-o-editar-actividades)
3. [Añadir o editar cursos](#3-añadir-o-editar-cursos)
4. [Añadir o editar fotos de la galería](#4-añadir-o-editar-fotos-de-la-galería)
5. [Requisitos de las imágenes](#5-requisitos-de-las-imágenes)
6. [Cómo publicar los cambios](#6-cómo-publicar-los-cambios)
7. [Errores comunes](#7-errores-comunes)

---

## 1. Estructura general

Todo el contenido de la web se carga automáticamente desde archivos **JSON** que viven en la carpeta:

```
public/data/
├── actividades.json   ← Actividades
├── cursos.json        ← Cursos y seminarios
└── gallery.json       ← Galería de fotos (respaldo local)
```

Las imágenes están en subcarpetas dentro de `public/images/`:

```
public/images/
├── actividades/    ← Fotos de actividades
├── cursos/         ← Fotos de cursos
└── gallery/        ← Fotos de la galería
```

**No es necesario tocar ningún archivo HTML ni JavaScript.** Solo hay que editar los JSON y subir las imágenes.

---

## 2. Añadir o editar actividades

Archivo: **`public/data/actividades.json`**

### Formato de cada actividad

```json
{
  "id": "boxeo-2026-03",
  "title": "Práctica Boxeo",
  "image": "/images/actividades/boxeo.webp",
  "club": "Club Aikido Paracuellos",
  "instructor": "José Gómez, Shidoin 4º Dan Aikikai, 6º Dan AEAC",
  "schedule": "Sábado a las 10:00 h",
  "date": "2026-03-15",
  "upcoming": false
}
```

### Campos explicados

| Campo | Obligatorio | Descripción |
|---|---|---|
| `id` | Sí | Identificador único. Usa el formato `nombre-AAAA-MM` (ej: `yoga-2026-06`). Sin espacios, sin tildes, todo minúsculas. |
| `title` | Sí | Nombre de la actividad tal como aparecerá en la web. |
| `image` | Sí | Ruta de la imagen. Debe empezar por `/images/actividades/` y terminar en `.webp`. |
| `club` | No | Nombre del club. Si no se rellena, no se muestra. |
| `instructor` | No | Nombre y titulación del instructor. Si no se rellena, no se muestra. |
| `instructor2` | No | Segundo instructor (si lo hay). |
| `schedule` | No | Día, hora y duración. Ej: `"Sábado de 10:00 a 14:00 h"`. |
| `date` | Sí | Fecha en formato `AAAA-MM-DD`. Se usa para ordenar: las más nuevas aparecen arriba. |
| `upcoming` | Sí | `true` si la actividad es futura (aparecerá con badge "Próximo"). `false` si ya pasó. |
| `partial` | No | Si el evento no se puede asistir completo, poner `true`. |

### Ejemplo: añadir una actividad nueva

Abrir `public/data/actividades.json` y añadir un nuevo objeto al **principio** del array (o al final, da igual: la web ordena automáticamente por fecha):

```json
{
  "id": "meditacion-2026-10",
  "title": "Taller de Meditación",
  "image": "/images/actividades/meditacion.webp",
  "club": "Club Aikido Paracuellos",
  "instructor": "María López",
  "schedule": "Domingo de 10:00 a 12:00 h",
  "date": "2026-10-05",
  "upcoming": true
}
```

> **Importante:** La imagen `/images/actividades/meditacion.webp` debe existir antes de publicar.

### Marcar una actividad como pasada

Cuando la fecha de una actividad pasa, cambiar `"upcoming": true` a `"upcoming": false`. El badge "Próximo" desaparecerá automáticamente.

---

## 3. Añadir o editar cursos

Archivo: **`public/data/cursos.json`**

### Formato de cada curso

```json
{
  "id": "godo-geiko-2026",
  "title": "Aikido Godo Geiko",
  "club": "Club Aikido Paracuellos · Club Aikido Aikidumaru",
  "instructor": "José Manuel Fraga, 4º Dan Aikikai y Aikikan - Shidoin",
  "instructor2": "Rubén Menchero, 5º Dan RFEJYDA, 4º Dan Aikikai - Shidoin",
  "schedule": "Sábado de 10:00 a 13:00 h y de 16:00 a 19:00 h",
  "date": "2026-04-25",
  "upcoming": true,
  "image": "/images/cursos/godo-geiko-2026.webp"
}
```

### Campos explicados

| Campo | Obligatorio | Descripción |
|---|---|---|
| `id` | Sí | Identificador único. Formato: `nombre-AAAA` o `nombre-AAAA-MM`. Minúsculas, sin espacios ni tildes. |
| `title` | Sí | Nombre del curso o seminario. |
| `image` | Sí | Ruta de la imagen. Debe empezar por `/images/cursos/` y terminar en `.webp`. |
| `club` | Sí | Nombre del club o clubs organizadores. |
| `instructor` | Sí | Nombre y titulación del instructor principal. |
| `instructor2` | No | Segundo instructor (si lo hay). |
| `schedule` | No | Día, hora y duración. Ej: `"Sábado de 10:00 a 14:00 h; domingo de 10:00 a 14:00 h"`. |
| `date` | Sí | Fecha de inicio en formato `AAAA-MM-DD`. Se usa para ordenar. |
| `upcoming` | Sí | `true` si el curso es futuro. `false` si ya pasó. |

### Ejemplo: añadir un curso nuevo

```json
{
  "id": "semintador-2026-12",
  "title": "Seminario de Invierno",
  "club": "Club Aikido Paracuellos",
  "instructor": "Pedro Ruiz, 7º Dan Shihan",
  "schedule": "Sábado y domingo de 10:00 a 14:00 h",
  "date": "2026-12-12",
  "upcoming": true,
  "image": "/images/cursos/seminario-invierno-2026.webp"
}
```

---

## 4. Añadir o editar fotos de la galería

### Opción A: Galería automática desde Instagram (producción)

En producción, la web intenta cargar las fotos desde la cuenta de Instagram del club. Si la conexión con Instagram falla o no está configurada, usa el archivo de respaldo local.

No hay que hacer nada manualmente para la opción de Instagram: las fotos se actualizan solas.

### Opción B: Galería manual con el archivo local

Archivo: **`public/data/gallery.json`**

Este archivo se usa en desarrollo local y como respaldo en producción.

### Formato de cada foto

```json
{
  "id": "aikidoparacuellos-058",
  "media_url": "/images/gallery/AikidoParacuellos_058.webp",
  "caption": "Clase de niños en el dojo"
}
```

| Campo | Obligatorio | Descripción |
|---|---|---|
| `id` | Sí | Identificador único. Formato: `aikidoparacuellos-NNN`. |
| `media_url` | Sí | Ruta de la imagen. Debe empezar por `/images/gallery/` y terminar en `.webp`. |
| `caption` | No | Texto descriptivo que aparece al hacer clic en la foto. |

### Ejemplo: añadir una foto

1. Subir la imagen a `public/images/gallery/AikidoParacuellos_058.webp`.
2. Abrir `public/data/gallery.json`.
3. Añadir el objeto dentro del array `items`:

```json
{
  "id": "aikidoparacuellos-058",
  "media_url": "/images/gallery/AikidoParacuellos_058.webp",
  "caption": "Práctica de Katate-dori"
}
```

4. Guardar el archivo.

---

## 5. Requisitos de las imágenes

Todas las imágenes deben cumplir estos requisitos:

| Requisito | Detalle |
|---|---|
| **Formato** | `.webp` (obligatorio). La web no carga otros formatos. |
| **Nombre** | Sin espacios, sin tildes, minúsculas. Ej: `defensa-personal.webp` |
| **Carpeta correcta** | Actividades → `public/images/actividades/` · Cursos → `public/images/cursos/` · Galería → `public/images/gallery/` |
| **Tamaño recomendado** | 800–1200 px de ancho. Más de 2000 px ralentiza la web. |
| **Peso** | Menos de 300 KB por imagen. Usar herramientas de compresión (ej: [squoosh.app](https://squoosh.app)). |
| **Proporción** | 4:3 o 16:9 para actividades/cursos. 1:1 o 4:3 para galería. |

### Cómo convertir una foto a .webp

1. Ir a [squoosh.app](https://squoosh.app).
2. Arrastrar la foto.
3. En la columna derecha, seleccionar **WebP**.
4. Ajustar la calidad al 75–80%.
5. Descargar y renombrar el archivo según la convención.

---

## 6. Cómo publicar los cambios

Una vez editados los JSON y subidas las imágenes:

### Opción 1: Panel de Netlify (recomendada)

1. Abrir el panel de Netlify del sitio.
2. Ir a **Deploys** → **Trigger deploy** → **Deploy site**.
3. Esperar a que termine (1–2 minutos).
4. La web se actualizará automáticamente.

### Opción 2: Si se tiene acceso al repositorio Git

```bash
# 1. Subir los cambios al repositorio
git add public/data/ public/images/
git commit -m "Actualizar contenido: [actividades/cursos/galería]"
git push

# 2. Netlify despliega automáticamente al hacer push
```

> **Nota:** Solo funciona si el repositorio está conectado a Netlify con deploy automático.

---

## 7. Errores comunes

### La imagen no aparece

- **Causa más frecuente:** La ruta en el JSON no coincide con el nombre real del archivo.
- **Comprobar:** Abrir `public/images/` y verificar que el archivo existe con exactamente el mismo nombre.
- **Solución:** Corregir la ruta en el JSON para que coincida.

### La actividad o curso no aparece en la web

- **Causa 1:** El JSON tiene un error de sintaxis (coma de más, llave sin cerrar, etc.).
- **Solución:** Abrir el archivo en un editor de código y buscar errores visuales. Un JSON válido no tiene comas después del último elemento de un array.
- **Causa 2:** El campo `date` tiene un formato incorrecto.
- **Solución:** Usar siempre `AAAA-MM-DD` (ej: `2026-03-15`).

### La galería muestra "La galería aún no está disponible"

- **Causa:** No hay conexión con Instagram y el archivo `gallery.json` tiene un error o no existe.
- **Solución:** Verificar que `public/data/gallery.json` existe y tiene formato válido.

### Errores de sintaxis JSON

Si se rompe el JSON, la página no cargará contenido. Para detectar errores:

1. Abrir el archivo en VS Code o similar.
2. Si hay un error, VS Code subraya la línea en rojo.
3. Errores típicos:
   - Falta una coma `,` entre objetos del array.
   - Sobra una coma al final del último elemento (ej: `[ {...}, {...}, ]` → eliminar la coma final).
   - Falta una comilla `"` o una llave `}`.

---

## Resumen rápido

| Qué quiero hacer | Archivo a editar | Qué toco |
|---|---|---|
| Añadir una actividad | `public/data/actividades.json` | Añadir objeto + subir imagen a `public/images/actividades/` |
| Añadir un curso | `public/data/cursos.json` | Añadir objeto + subir imagen a `public/images/cursos/` |
| Añadir foto a galería | `public/data/gallery.json` | Añadir objeto + subir imagen a `public/images/gallery/` |
| Marcar actividad como pasada | `public/data/actividades.json` | Cambiar `upcoming` a `false` |
| Marcar curso como próximo | `public/data/cursos.json` | Cambiar `upcoming` a `true` |
| Publicar cambios | Panel de Netlify | Deploys → Trigger deploy |

---

*Última actualización: Septiembre 2026*
