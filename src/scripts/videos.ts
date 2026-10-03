// Videos con la clase "video-diferido": solo se descargan cuando están por aparecer en pantalla.
// Lo importan varios componentes; el navegador lo ejecuta una sola vez por página.
const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll<HTMLVideoElement>('video.video-diferido').forEach((video) => {
  if (reducir) return;
  new IntersectionObserver((entradas, obs) => {
    if (!entradas[0].isIntersecting) return;
    video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((s) => (s.src = s.dataset.src!));
    video.load();
    video.play().catch(() => {});
    obs.disconnect();
  }, { rootMargin: '300px' }).observe(video);
});
