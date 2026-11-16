import {useEffect, useRef} from 'react';
import {portada, relojes} from '../content';
import {faltan, partes, useAbierto} from '../hooks/useAbierto';
import {easeInOutSine, easeOutCubic, lerp, progresoFijado, tramo} from '../lib/math';
import {enCadaFotograma} from '../lib/scroll';

/**
 * Portada: un © gigante con un precinto rojo encima. El scroll rompe el precinto, parte el círculo en dos
 * y deja «PD» en su sitio; después suben tres bloques Bauhaus con los tres relojes. La cuenta atrás va
 * por la hora real, no por el scroll.
 *
 * Guion de scroll (p), sección de 400 svh:
 *   0.00 – 0.05  quieto: titular, © precintado y cuenta atrás; la invitación se apaga
 *   0.06 – 0.22  el precinto se rompe: cada mitad sale hacia su lado (easeOutCubic)
 *   0.18 – 0.48  el círculo se parte: mitades separándose y girando; la C gira, encoge y se apaga
 *   0.36 – 0.56  «PD» crece desde el centro
 *   0.60 – 0.84  suben los tres bloques (EE. UU., Europa, España), escalonados; la bajada se apaga
 *   0.84 – 1.00  todo quieto hasta soltarse (no hay pantalla vacía: los bloques enlazan con los relojes)
 */

const ALTO_VH = 400;
const COLORES = ['bg-elevado text-tinta ring-1 ring-inset ring-tinta', 'bg-tinta text-void', 'bg-rojo text-void'];

export function Portada() {
  const raizRef = useRef<HTMLElement>(null);
  const izqRef = useRef<SVGGElement>(null);
  const derRef = useRef<SVGGElement>(null);
  const ceRef = useRef<SVGGElement>(null);
  const pdRef = useRef<SVGTextElement>(null);
  const cintaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bloqueRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bajadaRef = useRef<HTMLDivElement>(null);
  const invitaRef = useRef<HTMLParagraphElement>(null);
  const cifraRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const abierto = useAbierto();

  // Cuenta atrás: hora real, una escritura por segundo directamente en el DOM.
  useEffect(() => {
    if (abierto) return;
    const pinta = () => partes(faltan()).forEach((v, i) => {
      const el = cifraRefs.current[i];
      if (el) el.textContent = String(v).padStart(i === 0 ? 3 : 2, '0');
    });
    pinta();
    const t = window.setInterval(pinta, 1000);
    return () => clearInterval(t);
  }, [abierto]);

  useEffect(() => {
    let pAnterior = -1;
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      if (!raiz) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible || Math.abs(p - pAnterior) < 0.00005) return;
      pAnterior = p;

      invitaRef.current!.style.opacity = String(1 - tramo(p, 0, 0.05));

      const corte = easeOutCubic(tramo(p, 0.06, 0.22));
      cintaRefs.current.forEach((el, i) => {
        if (!el) return;
        const s = i === 0 ? -1 : 1;
        el.style.transform = `translate3d(${s * corte * 70}%, ${-s * corte * 120}%, 0) rotate(${s * corte * 8}deg)`;
        el.style.opacity = String(1 - tramo(p, 0.14, 0.24));
      });

      const k = easeInOutSine(tramo(p, 0.18, 0.48));
      izqRef.current!.style.transform = `translate(${-k * 95}px, ${k * 28}px) rotate(${-k * 22}deg)`;
      derRef.current!.style.transform = `translate(${k * 95}px, ${-k * 28}px) rotate(${k * 22}deg)`;
      izqRef.current!.style.opacity = derRef.current!.style.opacity = String(1 - 0.85 * k);
      ceRef.current!.style.transform = `rotate(${-k * 140}deg) scale(${1 - 0.85 * k})`;
      ceRef.current!.style.opacity = String(1 - tramo(p, 0.3, 0.46));

      const s = easeOutCubic(tramo(p, 0.36, 0.56));
      pdRef.current!.style.transform = `scale(${lerp(0.4, 1, s)})`;
      pdRef.current!.style.opacity = String(s);

      const b = tramo(p, 0.6, 0.84);
      bloqueRefs.current.forEach((el, i) => {
        if (!el) return;
        const q = easeOutCubic(tramo(b, i * 0.18, i * 0.18 + 0.64));
        el.style.transform = `translate3d(0, ${(1 - q) * 110}%, 0)`;
      });
      bajadaRef.current!.style.opacity = String(1 - tramo(p, 0.6, 0.72) * 0.85);
    });
  }, []);

  return (
    <section ref={raizRef} id="inicio" aria-labelledby="portada-titulo" className="relative" style={{height: `${ALTO_VH}svh`}}>
      <div className="rejilla grano sticky top-0 h-pantalla overflow-hidden bg-void">
        <div className="relative mx-auto grid h-full max-w-[90rem] grid-rows-[auto_1fr] gap-4 px-4 pt-[9svh] sm:px-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:grid-rows-1 md:items-center md:gap-[4vw] md:px-[6vw] md:pt-0 md:pb-[14svh]">
          {/* © precintado */}
          <div className="relative mx-auto w-[min(62vw,34svh)] md:order-2 md:w-[min(34vw,58svh)]" aria-hidden="true">
            <svg viewBox="-200 -200 400 400" className="block w-full overflow-visible">
              <g ref={izqRef}>
                <path d="M 0 -172 A 172 172 0 0 0 0 172" fill="none" stroke="var(--color-tinta)" strokeWidth={26} />
              </g>
              <g ref={derRef}>
                <path d="M 0 -172 A 172 172 0 0 1 0 172" fill="none" stroke="var(--color-tinta)" strokeWidth={26} />
              </g>
              <g ref={ceRef}>
                <path d="M 64 -64 A 90 90 0 1 0 64 64" fill="none" stroke="var(--color-rojo)" strokeWidth={36} />
              </g>
              <text
                ref={pdRef}
                x={0}
                y={8}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-display"
                fontSize={170}
                fontWeight={700}
                letterSpacing={-6}
                fill="var(--color-tinta)"
                style={{opacity: 0, transformBox: 'fill-box', transformOrigin: 'center'}}
              >
                PD
              </text>
            </svg>
            <div className="absolute inset-x-[-18%] top-1/2 flex -translate-y-1/2 -rotate-[14deg] justify-center">
              {['Precintado ·', '· hasta 01·01·2027'].map((t, i) => (
                <span
                  key={t}
                  ref={(el) => {
                    cintaRefs.current[i] = el;
                  }}
                  className={`block bg-rojo py-2.5 md:py-3 font-mono text-[clamp(0.6875rem,1.2vw,1rem)] font-medium tracking-[0.14em] whitespace-nowrap text-void uppercase shadow-[0_2px_0_oklch(17%_0.012_60/0.25)] ${i === 0 ? 'pr-2 pl-6 text-right' : 'pr-6 pl-2'}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Titular y cuenta atrás */}
          <div className="relative md:order-1">
            <p className="font-mono text-etiqueta tracking-[0.14em] text-rojo uppercase">{portada.antetitulo}</p>
            <h1 id="portada-titulo" className="mt-3 font-display text-hero font-bold text-tinta uppercase md:mt-5">
              {portada.titulo}
              <span className="mt-2 block text-display font-medium tracking-[-0.01em] text-rojo normal-case">{portada.destacado}</span>
            </h1>
            <div ref={bajadaRef}>
              <p className="mt-4 max-w-[30rem] text-body text-texto-2 md:mt-6 md:text-lead">{portada.bajada}</p>
              {abierto ? (
                <p className="mt-6 inline-block bg-tinta px-3 py-2 font-mono text-etiqueta tracking-[0.14em] text-void uppercase">{portada.abierto}</p>
              ) : (
                <div className="mt-5 md:mt-8" role="timer" aria-label={`${portada.cuentaEtiqueta} 1 de enero de 2027`}>
                  <p className="font-mono text-etiqueta tracking-[0.14em] text-texto-3 uppercase">{portada.cuentaEtiqueta}</p>
                  <div className="mt-2 flex gap-1.5" aria-hidden="true">
                    {portada.unidades.map((u, i) => (
                      <span key={u} className="flex items-baseline gap-1 bg-tinta px-2 py-1.5 text-void md:px-3 md:py-2">
                        <span
                          ref={(el) => {
                            cifraRefs.current[i] = el;
                          }}
                          className="font-mono text-[clamp(1.125rem,2.2vw,1.75rem)] font-medium tabular-nums"
                        >
                          {i === 0 ? '000' : '00'}
                        </span>
                        <span className="font-mono text-[0.75rem] text-void/70">{u}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <p ref={invitaRef} className="absolute right-4 bottom-[3svh] font-mono text-etiqueta tracking-[0.14em] text-texto-3 uppercase sm:right-6 md:right-[6vw]">
          {portada.invitacion} ↓
        </p>

        {/* Los tres relojes suben como bloques */}
        <div className="absolute inset-x-0 bottom-0 grid h-[22svh] grid-cols-3 md:h-[26svh]" aria-hidden="true">
          {relojes.map((r, i) => (
            <div
              key={r.id}
              ref={(el) => {
                bloqueRefs.current[i] = el;
              }}
              className={`flex flex-col justify-between p-3 md:p-6 ${COLORES[i]}`}
              style={{transform: 'translate3d(0, 110%, 0)'}}
            >
              <span className="font-mono text-[0.625rem] tracking-[0.14em] uppercase md:text-etiqueta">{r.corto}</span>
              <span className="font-display text-[clamp(2.25rem,8vw,7.5rem)] leading-[0.85] font-bold tracking-[-0.04em]">{r.anio}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
