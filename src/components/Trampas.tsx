import {trampas} from '../content';
import {useAparecer} from '../hooks/useAparecer';

/**
 * La letra pequeña: seis casos en filas, cada uno con lo que sí se libera (bloque de tinta) y lo que no
 * (bloque con borde rojo). Entra con la aparición estándar, escalonada por fila.
 */
export function Trampas() {
  const ref = useAparecer<HTMLElement>();
  return (
    <section ref={ref} id="letra-pequena" aria-labelledby="trampas-titulo" className="relative bg-void px-4 pt-[14svh] pb-[10svh] sm:px-6 md:px-[6vw]">
      <div className="mx-auto max-w-[90rem]">
        <p data-aparece className="font-mono text-etiqueta tracking-[0.14em] text-rojo uppercase">
          {trampas.antetitulo}
        </p>
        <h2 id="trampas-titulo" data-aparece style={{'--i': 1} as React.CSSProperties} className="mt-3 font-display text-display font-semibold text-tinta">
          {trampas.titulo}
        </h2>
        <ol className="mt-10 border-t-2 border-tinta">
          {trampas.casos.map((c, i) => (
            <li
              key={c.obra}
              data-aparece
              style={{'--i': i % 3} as React.CSSProperties}
              className="grid gap-3 border-b border-borde py-5 md:grid-cols-[3.5rem_1.1fr_1fr_1fr] md:items-center md:gap-6 md:py-6"
            >
              <span className="font-mono text-etiqueta text-texto-3 tabular-nums" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display text-[clamp(1.375rem,2.2vw,1.875rem)] leading-tight font-semibold text-tinta">{c.obra}</h3>
                <p className="mt-1 text-[0.9375rem] text-texto-2">{c.porque}</p>
              </div>
              <p className="bg-tinta px-4 py-3 text-void">
                <span className="block font-mono text-[0.625rem] tracking-[0.14em] text-void/60 uppercase">{trampas.si}</span>
                <span className="text-body font-medium">{c.si}</span>
              </p>
              <p className="px-4 py-3 text-tinta ring-2 ring-rojo ring-inset">
                <span className="block font-mono text-[0.625rem] tracking-[0.14em] text-rojo uppercase">{trampas.no}</span>
                <span className="text-body font-medium">{c.no}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
