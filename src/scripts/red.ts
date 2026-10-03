// Red de nodos conectados que flota sobre el video de la portada.
// Se pausa cuando el canvas sale de la pantalla y no corre con "reducir movimiento".
export function iniciarRed(canvas: HTMLCanvasElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const colores = ['255,87,233', '173,92,255', '66,180,255'];
  let ancho = 0;
  let alto = 0;
  let nodos: { x: number; y: number; vx: number; vy: number; r: number; c: string }[] = [];
  const raton = { x: -9999, y: -9999 };
  let visible = true;
  let cuadro = 0;

  const ajustar = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ancho = canvas.clientWidth;
    alto = canvas.clientHeight;
    canvas.width = ancho * dpr;
    canvas.height = alto * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cantidad = Math.round(Math.min(70, (ancho * alto) / 22000));
    nodos = Array.from({ length: cantidad }, () => ({
      x: Math.random() * ancho,
      y: Math.random() * alto,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
      c: colores[Math.floor(Math.random() * colores.length)],
    }));
  };

  const dibujar = () => {
    ctx.clearRect(0, 0, ancho, alto);
    const enlace = 140;
    for (let i = 0; i < nodos.length; i++) {
      const a = nodos[i];
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > ancho) a.vx *= -1;
      if (a.y < 0 || a.y > alto) a.vy *= -1;

      // Los nodos se apartan un poco del cursor
      const dxr = a.x - raton.x;
      const dyr = a.y - raton.y;
      const dr = Math.hypot(dxr, dyr);
      if (dr < 120) {
        a.x += (dxr / dr) * 0.8;
        a.y += (dyr / dr) * 0.8;
      }

      for (let j = i + 1; j < nodos.length; j++) {
        const b = nodos[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < enlace) {
          ctx.strokeStyle = `rgba(${a.c},${(1 - d / enlace) * 0.35})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${a.c},0.9)`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (visible) cuadro = requestAnimationFrame(dibujar);
  };

  new IntersectionObserver(([entrada]) => {
    visible = entrada.isIntersecting;
    cancelAnimationFrame(cuadro);
    if (visible) cuadro = requestAnimationFrame(dibujar);
  }).observe(canvas);

  canvas.parentElement?.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    raton.x = e.clientX - r.left;
    raton.y = e.clientY - r.top;
  });
  canvas.parentElement?.addEventListener('pointerleave', () => { raton.x = raton.y = -9999; });

  let espera = 0;
  window.addEventListener('resize', () => {
    clearTimeout(espera);
    espera = window.setTimeout(ajustar, 200);
  });
  ajustar();
}
