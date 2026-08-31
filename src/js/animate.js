/**
 * animate.js — animaciones GSAP + ScrollTrigger.
 * Todo el movimiento está motivado (jerarquía / narrativa / feedback)
 * y se desactiva por completo bajo prefers-reduced-motion.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
  // Colapsar a estático respetando la preferencia del usuario.
  gsap.globalTimeline.pause();
  ScrollTrigger.config({ ignoreMobileResize: true });
}

function initHero() {
  if (reduceMotion) {
    gsap.set('.hero__kicker, .hero__title, .hero__lead, .hero__cta, .enso', { clearProps: 'all' });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Enso: trazo que se dibuja (firma del sitio)
  tl.fromTo(
    '.enso circle',
    { strokeDashoffset: 1200 },
    { strokeDashoffset: 464, duration: 1.6, ease: 'power2.inOut' },
    0.2
  );

  tl.fromTo('.hero__kicker', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.3);

  // Título: revelado palabra a palabra con desenfoque
  const words = gsap.utils.toArray('.hero__title .word');
  tl.fromTo(
    words,
    { opacity: 0, y: 24, filter: 'blur(6px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.09 },
    0.42
  );

  tl.fromTo('.hero__lead', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.75);

  tl.fromTo(
    '.hero__cta > *',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
    0.9
  );

  tl.fromTo('.hero__affil', { opacity: 0 }, { opacity: 1, duration: 0.7 }, 1.1);
}

function initReveals() {
  const els = gsap.utils.toArray('.reveal');
  if (!els.length || reduceMotion) return;

  gsap.set(els, { opacity: 0, y: 28, filter: 'blur(4px)' });

  els.forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'power3.out',
      delay: (i % 4) * 0.05,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });
}

/* Horarios: pin del título + apilado de paneles (solo escritorio) */
function initSchedule() {
  const wrap = document.querySelector('.schedule-chapter');
  const children = wrap ? gsap.utils.toArray(wrap.children) : [];

  if (reduceMotion || !wrap || window.innerWidth < 1024 || children.length < 2) {
    return;
  }

  const panels = wrap.querySelectorAll('.schedule-panel');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: 'top 20%',
      end: '+=120%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  tl.fromTo(panels, { filter: 'blur(0px)' }, { filter: 'blur(4px)', ease: 'none' }, 0);

  panels.forEach((panel, i) => {
    if (i === 0) return;
    const prev = panels[i - 1];
    tl.fromTo(
      prev,
      { scale: 1, opacity: 1 },
      { scale: 0.94, opacity: 0.4, duration: 0.5, ease: 'power1.inOut' }
    ).fromTo(
      panel,
      { y: 40, opacity: 0.3 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power1.inOut' },
      '<'
    );
  });
}

/* Imágenes: escala y fundido al entrar/salir (foto de club) */
function initMedia() {
  if (reduceMotion) return;
  const items = gsap.utils.toArray('[data-media-scroll]');
  items.forEach((item) => {
    gsap.fromTo(
      item,
      { scale: 0.88, opacity: 0.3 },
      {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'top 30%',
          scrub: 0.8,
        },
      }
    );
    gsap.to(item, {
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: 'bottom 50%',
        end: 'bottom top',
        scrub: 0.8,
      },
    });
  });
}

export function initAnimations() {
  initHero();
  initReveals();
  initSchedule();
  initMedia();
  ScrollTrigger.refresh();
}
