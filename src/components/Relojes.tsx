import {useEffect, useRef} from 'react';
import {relojes, relojesTexto} from '../content';
import {easeOutCubic, lerp, progresoFijado, tramo} from '../lib/math';
import {enCadaFotograma} from '../lib/scroll';

/**
 * Tres relojes: una esfera de años (1920–1960) con una aguja por país. Cada aguja barre hasta el año
 * cuyas obras se liberan en 2027 y el panel de al lado cuenta su regla. La aguja no decora: lee el dato.
 *
 * Guion de scroll (p), sección de 360 svh:
 *   0.00 – 0.08  la esfera se dibuja y aparecen las marcas
 *   tramo i (i = 0, 1, 2) de 0.08 + i·0.3 a 0.38 + i·0.3:
 *     primer 45 %  la aguja i barre de 1920 a su año (easeOutCubic); la cifra central cuenta con ella
 *     todo        el panel i se ve; los demás se apagan (fundido de 0,04 en los bordes)
 *   al acabar su tramo, cada aguja se queda en su año con menos peso
 */

const ALTO_VH = 360;
const A0 = -135;
const A1 = 135;
const DESDE = 1920;
const HASTA = 1960;
const R = 150;
const TONOS = ['var(--color-texto-3)', 'var(--color-tinta)', 'var(--color-rojo)'];

const angulo = (anio: number) => lerp(A0, A1, (anio - DESDE) / (HASTA - DESDE));
const punto = (a: number, r: number) => {
  const rad = ((a - 90) * Math.PI) / 180;
  return [r * Math.cos(rad), r * Math.sin(rad)] as const;
};
const arco = (a0: number, a1: number, r: number) => {
  const [x0, y0] = punto(a0, r);
  const [x1, y1] = punto(a1, r);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};

export function Relojes() {
  const raizRef = useRef<HTMLElement>(null);
  const esferaRef = useRef<SVGPathElement>(null);
  const marcasRef = useRef<SVGGElement>(null);
  const agujaRefs = useRef<(SVGGElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cifraRef = useRef<HTMLSpanElement>(null);
  const paisRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let pAnterior = -1;
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      if (!raiz) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible || Math.abs(p - pAnterior) < 0.00005) return;
      pAnterior = p;

      const dibuja = tramo(p, 0, 0.08);
      esferaRef.current!.style.strokeDashoffset = String(1 - dibuja);
      marcasRef.current!.style.opacity = String(dibuja);

      let activo = 0;
      relojes.forEach((r, i) => {
        const a = 0.08 + i * 0.3;
        const b = a + 0.3;
        const barre = easeOutCubic(tramo(p, a, a + 0.135));
        const anio = lerp(DESDE, r.anio, barre);
        const aguja = agujaRefs.current[i]!;
        aguja.style.transform = `rotate(${angulo(anio)}deg)`;
        const dentro = p >= a && (p < b || i === relojes.length - 1);
        aguja.style.opacity = String(barre === 0 ? 0 : dentro ? 1 : 0.35);
        const panel = panelRefs.current[i]!;
        const entra = i === 0 ? 1 : tramo(p, a - 0.02, a + 0.02);
        const sale = i === relojes.length - 1 ? 0 : tramo(p, b - 0.02, b + 0.02);
        panel.style.opacity = String(entra * (1 - sale));
        panel.style.transform = `translate3d(0, ${(1 - entra) * 16 - sale * 16}px, 0)`;
        panel.style.visibility = entra * (1 - sale) > 0.01 ? 'visible' : 'hidden';
        if (p >= a - 0.001) activo = i;
        if (dentro) cifraRef.current!.textContent = String(Math.round(anio));
      });
      paisRef.current!.textContent = relojes[activo].corto;
    });
  }, []);

  const marcas = Array.from({length: HASTA - DESDE + 1}, (_, i) => {
    const anio = DESDE + i;
    const grande = anio % 10 === 0;
    const media = anio % 5 === 0;
    const a = angulo(anio);
    const [x0, y0] = punto(a, R - (grande ? 20 : media ? 13 : 7));
    const [x1, y1] = punto(a, R - 1);
    return <line key={anio} x1={x0} y1={y0} x2={x1} y2={y1} strokeWidth={grande ? 3 : 1.25} />;
  });
  const decenas = [1920, 1930, 1940, 1950, 1960].map((anio) => {
    const [x, y] = punto(angulo(anio), R - 40);
    return (
      <text key={anio} x={x} y={y} textAnchor="middle" dominantBaseline="middle">
        {anio}
      </text>
    );
  });

  return (
    <section ref={raizRef} id="relojes" aria-labelledby="relojes-titulo" className="relative" style={{height: `${ALTO_VH}svh`}}>
      <div className="sticky top-0 h-pantalla overflow-hidden bg-void">
        <div className="mx-auto grid h-full max-w-[90rem] grid-rows-[auto_auto_1fr] content-center gap-[3svh] px-4 sm:px-6 md:grid-cols-[1fr_1fr] md:grid-rows-[auto_1fr] md:gap-x-[5vw] md:px-[6vw]">
          <header className="md:col-span-2">
            <p className="font-mono text-etiqueta tracking-[0.14em] text-rojo uppercase">{relojesTexto.antetitulo}</p>
            <h2 id="relojes-titulo" className="mt-2 max-w-[22ch] font-display text-display font-semibold text-tinta">
              {relojesTexto.titulo}
            </h2>
            <ul className="sr-only">
              {relojes.map((r) => (
                <li key={r.id}>
                  {r.nombre}: {r.regla}. {r.cuenta}. {r.texto}
                </li>
              ))}
            </ul>
          </header>

          <div className="relative mx-auto w-[min(76vw,34svh)] md:w-[min(38vw,56svh)]">
            <svg viewBox="-170 -170 340 340" className="block w-full" role="img" aria-label={relojesTexto.etiqueta}>
              <circle r={R + 12} fill="var(--color-elevado)" stroke="var(--color-tinta)" strokeWidth={2} />
              <path ref={esferaRef} d={arco(A0, A1, R)} pathLength={1} strokeDasharray="1 1" fill="none" stroke="var(--color-tinta)" strokeWidth={2} />
              <g ref={marcasRef} stroke="var(--color-tinta)" fill="var(--color-texto-2)" fontSize={12} className="font-mono">
                {marcas}
                <g stroke="none">{decenas}</g>
              </g>
              {relojes.map((r, i) => (
                <g
                  key={r.id}
                  ref={(el) => {
                    agujaRefs.current[i] = el;
                  }}
                  style={{transform: `rotate(${A0}deg)`, opacity: 0}}
                >
                  <line x1={0} y1={22} x2={0} y2={-(R - 24 - i * 18)} stroke={TONOS[i]} strokeWidth={i === 1 ? 5 : 4} strokeLinecap="square" />
                  <rect x={-7} y={-(R - 24 - i * 18) - 7} width={14} height={14} fill={TONOS[i]} />
                </g>
              ))}
              <circle r={10} fill="var(--color-tinta)" />
            </svg>
            <div className="pointer-events-none absolute inset-x-0 bottom-[12%] text-center" aria-hidden="true">
              <span ref={cifraRef} className="block font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-none font-bold tabular-nums text-tinta">
                {DESDE}
              </span>
              <span ref={paisRef} className="font-mono text-[0.625rem] tracking-[0.14em] text-texto-3 uppercase">
                {relojes[0].corto}
              </span>
            </div>
          </div>

          <div className="relative min-h-[34svh] md:min-h-[44svh]">
            {relojes.map((r, i) => (
              <div
                key={r.id}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                aria-hidden="true"
                className="absolute inset-0 flex flex-col justify-center"
                style={{opacity: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden'}}
              >
                <p className="flex items-center gap-3 font-mono text-etiqueta tracking-[0.14em] uppercase">
                  <span className="inline-block size-3" style={{background: TONOS[i]}} aria-hidden="true" />
                  {r.nombre}
                </p>
                <p className="mt-3 font-display text-[clamp(2rem,4.6vw,4.25rem)] leading-none font-bold tracking-[-0.03em] text-tinta tabular-nums">{r.cuenta}</p>
                <p className="mt-3 text-lead font-medium text-rojo">{r.regla}</p>
                <p className="mt-3 max-w-[34rem] text-body text-texto-2">{r.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
