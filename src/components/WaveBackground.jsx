// Fondo de olas SVG: 4 capas con loop infinito y parallax al hacer scroll.
import { useEffect, useRef } from 'react';

// Duración (s), color/opacidad, altura y factor de parallax de cada capa
const LAYERS = [
  { duration: 18, reverse: false, fill: 'rgba(6, 149, 228, 0.35)', height: 38, factor: 0.02, d: 'M0,60 C150,100 350,20 600,60 C850,100 1050,20 1200,60 L1200,120 L0,120 Z' },
  { duration: 24, reverse: true, fill: 'rgba(6, 89, 186, 0.25)', height: 46, factor: 0.04, d: 'M0,70 C200,30 400,110 600,70 C800,30 1000,110 1200,70 L1200,120 L0,120 Z' },
  { duration: 32, reverse: false, fill: 'rgba(0, 180, 216, 0.18)', height: 54, factor: 0.06, d: 'M0,50 C150,90 450,10 600,50 C750,90 1050,10 1200,50 L1200,120 L0,120 Z' },
  { duration: 42, reverse: true, fill: 'rgba(6, 89, 186, 0.1)', height: 62, factor: 0.08, d: 'M0,80 C250,40 350,120 600,80 C850,40 950,120 1200,80 L1200,120 L0,120 Z' },
];

export default function WaveBackground() {
  const layerRefs = useRef([]);

  // Parallax: desplaza cada capa en Y según el scroll, agrupado con rAF
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      layerRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `translateY(${-window.scrollY * LAYERS[i].factor}px)`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      {LAYERS.map((layer, i) => (
        // Contenedor externo: parallax (translateY). Interno: loop horizontal.
        <div
          key={i}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${layer.height}vh`, willChange: 'transform' }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              display: 'block',
              width: '200%',
              height: '100%',
              animation: `til-wave ${layer.duration}s linear infinite ${layer.reverse ? 'reverse' : 'normal'}`,
            }}
          >
            {/* Dos copias contiguas del trazo: el desplazamiento de -50% enlaza sin saltos */}
            <path d={layer.d} fill={layer.fill} transform="scale(0.5 1)" />
            <path d={layer.d} fill={layer.fill} transform="translate(600 0) scale(0.5 1)" />
          </svg>
        </div>
      ))}
    </div>
  );
}
