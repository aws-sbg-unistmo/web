// Envía los formularios con data-formulario="unete|contacto" a la API (API Gateway + Lambda).
// PUBLIC_API_URL lo pone GitHub Actions al compilar. Sin API (por ejemplo en local) ofrece mandar un correo.
const API = (import.meta.env.PUBLIC_API_URL ?? '').replace(/\/$/, '');
const CORREO = 'aws.unistmo@gmail.com';

function datos(form: HTMLFormElement) {
  const fd = new FormData(form);
  const salida: Record<string, unknown> = {};
  for (const [clave, valor] of fd.entries()) {
    if (typeof valor !== 'string') continue;
    const campo = form.elements.namedItem(clave);
    const esGrupo = campo instanceof RadioNodeList && (campo[0] as HTMLInputElement)?.type === 'checkbox';
    if (esGrupo) (salida[clave] = (salida[clave] as string[] | undefined) ?? []), (salida[clave] as string[]).push(valor);
    else salida[clave] = valor.trim();
  }
  return salida;
}

function confeti(origen: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const lienzo = document.createElement('canvas');
  lienzo.className = 'pointer-events-none fixed inset-0 z-[70] size-full';
  document.body.append(lienzo);
  const ctx = lienzo.getContext('2d')!;
  lienzo.width = innerWidth;
  lienzo.height = innerHeight;
  const r = origen.getBoundingClientRect();
  const colores = ['#FF57E9', '#AD5CFF', '#42B4FF', '#00E582', '#FF9900', '#ffffff'];
  const piezas = Array.from({ length: 140 }, () => ({
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
    vx: (Math.random() - 0.5) * 16,
    vy: Math.random() * -14 - 4,
    g: 0.35 + Math.random() * 0.2,
    s: 4 + Math.random() * 6,
    a: Math.random() * Math.PI,
    va: (Math.random() - 0.5) * 0.4,
    c: colores[Math.floor(Math.random() * colores.length)],
  }));
  let vida = 0;
  const cuadro = () => {
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    for (const p of piezas) {
      p.vy += p.g;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.a += p.va;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    }
    if (++vida < 150) requestAnimationFrame(cuadro);
    else lienzo.remove();
  };
  cuadro();
}

document.querySelectorAll<HTMLFormElement>('form[data-formulario]').forEach((form) => {
  const tipo = form.dataset.formulario!;
  const boton = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const aviso = form.querySelector<HTMLElement>('[data-aviso]')!;
  const exito = document.querySelector<HTMLElement>(`[data-exito="${tipo}"]`);

  const mostrarAviso = (texto: string, esError = true) => {
    aviso.textContent = texto;
    aviso.hidden = false;
    aviso.classList.toggle('text-red-300', esError);
    aviso.classList.toggle('text-menta', !esError);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    aviso.hidden = true;
    if (!form.reportValidity()) return;
    const cuerpo = datos(form);

    if (!API) {
      // Sin backend configurado: abre el correo con los datos ya escritos
      const texto = Object.entries(cuerpo)
        .filter(([k]) => !['empresa', 'cf-turnstile-response', 'privacidad'].includes(k))
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join('\n');
      window.location.href = `mailto:${CORREO}?subject=${encodeURIComponent(`[Web] ${tipo}`)}&body=${encodeURIComponent(texto)}`;
      mostrarAviso('Abrimos tu correo con los datos listos para enviar. ¡Gracias!', false);
      return;
    }

    if (!cuerpo['cf-turnstile-response']) {
      mostrarAviso('Espera un momento a que termine la verificación anti-bots e inténtalo de nuevo.');
      return;
    }

    boton.disabled = true;
    boton.dataset.estado = 'enviando';
    try {
      const res = await fetch(`${API}/${tipo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se pudo enviar');
      form.hidden = true;
      if (exito) {
        exito.hidden = false;
        exito.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => confeti(exito), 450); // cuando ya terminó de desplazarse
      }
    } catch (err) {
      mostrarAviso(`${(err as Error).message}. Inténtalo de nuevo o escríbenos a ${CORREO}.`);
      (window as any).turnstile?.reset();
    } finally {
      boton.disabled = false;
      delete boton.dataset.estado;
    }
  });
});
