// Puntos debajo de cada carrusel de celular ([data-carrusel]): marcan la tarjeta que se ve y llevan a otra al tocarlos.
document.querySelectorAll<HTMLElement>('[data-carrusel]').forEach((pista) => {
  const tarjetas = Array.from(pista.children) as HTMLElement[];
  if (tarjetas.length < 2) return;
  const puntos = document.createElement('div');
  puntos.className = pista.dataset.carrusel === 'lg' ? 'puntos-carrusel lg' : 'puntos-carrusel';
  const margen = () => parseFloat(getComputedStyle(pista).scrollPaddingLeft) || 0;
  const botones = tarjetas.map((t, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Ver tarjeta ${i + 1} de ${tarjetas.length}`);
    b.addEventListener('click', () => pista.scrollTo({ left: t.offsetLeft - margen(), behavior: 'smooth' }));
    puntos.append(b);
    return b;
  });
  pista.after(puntos);
  let actual = -1;
  const marcar = () => {
    const paso = tarjetas[1].offsetLeft - tarjetas[0].offsetLeft || 1;
    // Al llegar al final se marca la última aunque no quepa completa al inicio
    const fin = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 4;
    const i = fin ? tarjetas.length - 1 : Math.min(tarjetas.length - 1, Math.round(pista.scrollLeft / paso));
    if (i === actual) return;
    actual = i;
    botones.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
  };
  let pendiente = false;
  pista.addEventListener('scroll', () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => { pendiente = false; marcar(); });
  }, { passive: true });
  marcar();
});
