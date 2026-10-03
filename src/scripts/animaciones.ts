// Animaciones de toda la página. Se activan con atributos en el HTML:
//   data-reveal            aparece al hacer scroll (data-delay="0.2" para retrasarlo)
//   data-stagger           sus hijos aparecen uno tras otro
//   data-parallax="0.2"    se desplaza más lento que el scroll
//   data-contar="6"        número que cuenta desde 0
//   data-tilt              tarjeta que se inclina con el cursor y brilla donde está el mouse
//   data-magnetico         botón que se acerca al cursor
//   data-palabras          título que entra palabra por palabra
// Con "reducir movimiento" activado en el sistema, todo se muestra sin animar.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const punteroFino = window.matchMedia('(pointer: fine)').matches;
const todos = <T extends Element = HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T & HTMLElement>(sel));

// Luz que sigue al cursor (fondo general y tarjetas)
if (punteroFino) {
  const foco = document.getElementById('foco');
  window.addEventListener('pointermove', (e) => {
    foco?.style.setProperty('--mx', `${e.clientX}px`);
    foco?.style.setProperty('--my', `${e.clientY}px`);
  }, { passive: true });
}

if (reducir) {
  todos('[data-contar]').forEach((el) => (el.textContent = el.dataset.contar ?? el.textContent));
} else {
  // Desplazamiento suave sincronizado con GSAP
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  todos<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const destino = a.getAttribute('href');
      const elemento = destino && destino.length > 1 ? document.querySelector<HTMLElement>(destino) : null;
      if (elemento) {
        e.preventDefault();
        // Lenis ya respeta el scroll-margin-top del CSS (deja espacio para el header y la barra "En esta página").
        // Si el destino no lo tiene, se deja el espacio del header a mano.
        const conMargen = parseFloat(getComputedStyle(elemento).scrollMarginTop) > 0;
        lenis.scrollTo(elemento, { offset: conMargen ? 0 : -88 });
      }
    }),
  );

  // Títulos que entran palabra por palabra
  todos('[data-palabras]').forEach((el) => {
    const palabras = el.querySelectorAll('.palabra > span');
    gsap.from(palabras, {
      yPercent: 110,
      rotate: 4,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.07,
      delay: Number(el.dataset.delay ?? 0.15),
      scrollTrigger: el.hasAttribute('data-inmediato') ? undefined : { trigger: el, start: 'top 88%' },
    });
  });

  todos('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 48,
      opacity: 0,
      filter: 'blur(8px)',
      duration: 1,
      ease: 'power3.out',
      delay: Number(el.dataset.delay ?? 0),
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  todos('[data-stagger]').forEach((grupo) => {
    gsap.from(grupo.children, {
      y: 56,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: grupo, start: 'top 85%' },
    });
  });

  todos('[data-parallax]').forEach((el) => {
    const fuerza = Number(el.dataset.parallax ?? 0.2);
    gsap.to(el, {
      yPercent: -100 * fuerza,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  todos('[data-contar]').forEach((el) => {
    const meta = Number(el.dataset.contar);
    const valor = { n: 0 };
    gsap.to(valor, {
      n: meta,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => (el.textContent = Math.round(valor.n).toString()),
    });
  });

  // Secciones con scroll horizontal fijado (solo en pantallas grandes)
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    todos('[data-horizontal]').forEach((seccion) => {
      const pista = seccion.querySelector<HTMLElement>('.pista-ruta');
      if (!pista) return;
      const distancia = () => Math.max(0, pista.scrollWidth - window.innerWidth);
      const comun = { trigger: seccion, start: 'top top', end: () => `+=${distancia()}`, scrub: 0.8, invalidateOnRefresh: true };
      gsap.to(pista, { x: () => -distancia(), ease: 'none', scrollTrigger: { ...comun, pin: true, anticipatePin: 1 } });
      const barra = seccion.querySelector('.barra-ruta');
      if (barra) gsap.to(barra, { scaleX: 1, ease: 'none', scrollTrigger: comun });
    });
  });

  // Etiquetas tipo terminal: el texto se "descifra" al aparecer
  const signos = '!<>-_\\/[]{}=+*^?#01';
  todos('.chip').forEach((chip) => {
    if (chip.children.length) return;
    const final = chip.textContent ?? '';
    ScrollTrigger.create({
      trigger: chip,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        let cuadro = 0;
        const total = 22;
        const paso = () => {
          const avance = Math.floor((cuadro / total) * final.length);
          chip.textContent = final
            .split('')
            .map((c, i) => (i < avance || c === ' ' ? c : signos[Math.floor(Math.random() * signos.length)]))
            .join('');
          if (++cuadro <= total) requestAnimationFrame(paso);
          else chip.textContent = final;
        };
        paso();
      },
    });
  });

  // Al bajar, el contenido de la portada sube y se desvanece mientras el video se acerca
  const portada = document.getElementById('portada');
  if (portada) {
    const contenido = portada.querySelector('.max-w-2xl');
    const trigger = { trigger: portada, start: 'top top', end: 'bottom top', scrub: true };
    if (contenido) gsap.to(contenido, { yPercent: -18, opacity: 0.15, ease: 'none', scrollTrigger: trigger });
    const capa = document.getElementById('capa-video');
    if (capa) gsap.to(capa, { scale: 1.08, ease: 'none', scrollTrigger: trigger });
  }

  // Líneas de tiempo que se dibujan al hacer scroll
  todos('[data-linea]').forEach((linea) => {
    gsap.fromTo(linea, { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: linea.parentElement ?? linea, start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
    });
  });

  // Barra de progreso de lectura
  const barra = document.getElementById('progreso');
  if (barra) {
    gsap.to(barra, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  }

  if (punteroFino) {
    todos('[data-tilt]').forEach((tarjeta) => {
      const rx = gsap.quickTo(tarjeta, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(tarjeta, 'rotationY', { duration: 0.6, ease: 'power3' });
      gsap.set(tarjeta, { transformPerspective: 900 });
      tarjeta.addEventListener('pointermove', (e) => {
        const r = tarjeta.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        tarjeta.style.setProperty('--tx', `${x * 100}%`);
        tarjeta.style.setProperty('--ty', `${y * 100}%`);
        ry((x - 0.5) * 10);
        rx((0.5 - y) * 10);
      });
      tarjeta.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });

    todos('[data-magnetico]').forEach((boton) => {
      const mx = gsap.quickTo(boton, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      const my = gsap.quickTo(boton, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      boton.addEventListener('pointermove', (e) => {
        const r = boton.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.3);
        my((e.clientY - r.top - r.height / 2) * 0.4);
      });
      boton.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
  }
}
