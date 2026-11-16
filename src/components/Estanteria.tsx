import {useEffect, useMemo, useRef, useState} from 'react';
import {estanteria, obras, relojes, tipos, type RelojId, type TipoId} from '../content';
import {useAbierto} from '../hooks/useAbierto';
import {useAparecer} from '../hooks/useAparecer';
import {bloquearScroll} from '../lib/scroll';

/**
 * Estantería de precintos: rejilla de fichas filtrable por reloj y por tipo, cada una con su cinta roja.
 * Antes del 1 de enero el botón «Simular la medianoche» rompe todas las cintas en cascada (transición CSS
 * escalonada por índice); desde el 1 de enero salen ya rotas. No va ligada al scroll: es la parte que se usa.
 * Teclado: filtros con aria-pressed; en la ficha, ← y → pasan de obra y Esc cierra.
 */

const RELOJ = Object.fromEntries(relojes.map((r) => [r.id, r]));
const TIPO = Object.fromEntries(tipos.map((t) => [t.id, t]));

export function Estanteria() {
  const ref = useAparecer<HTMLElement>();
  const abierto = useAbierto();
  const [simulado, setSimulado] = useState(false);
  const libre = abierto || simulado;
  const [reloj, setReloj] = useState<RelojId | null>(null);
  const [tipo, setTipo] = useState<TipoId | null>(null);
  const [abierta, setAbierta] = useState<number | null>(null);
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const origenRef = useRef<HTMLElement | null>(null);

  const visibles = useMemo(() => obras.filter((o) => (!reloj || o.reloj === reloj) && (!tipo || o.tipo === tipo)), [reloj, tipo]);
  const ficha = abierta === null ? null : visibles[abierta];

  useEffect(() => {
    const d = dialogoRef.current!;
    if (abierta !== null && !d.open) {
      d.showModal();
      bloquearScroll(true);
    } else if (abierta === null && d.open) {
      d.close();
    }
  }, [abierta]);

  const cerrar = () => {
    setAbierta(null);
    bloquearScroll(false);
    origenRef.current?.focus();
  };
  const mover = (paso: number) => setAbierta((a) => (a === null ? a : (a + paso + visibles.length) % visibles.length));

  return (
    <section ref={ref} id="estanteria" aria-labelledby="estanteria-titulo" className="relative bg-superficie px-4 pt-[12svh] pb-[14svh] sm:px-6 md:px-[6vw]">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p data-aparece className="font-mono text-etiqueta tracking-[0.14em] text-rojo uppercase">
              {estanteria.antetitulo}
            </p>
            <h2 id="estanteria-titulo" data-aparece style={{'--i': 1} as React.CSSProperties} className="mt-3 font-display text-display font-semibold text-tinta">
              {estanteria.titulo}
            </h2>
            <p data-aparece style={{'--i': 2} as React.CSSProperties} className="mt-3 max-w-[36rem] text-body text-texto-2">
              {estanteria.cuerpo}
            </p>
          </div>
          {!abierto && (
            <button
              type="button"
              data-aparece
              style={{'--i': 3} as React.CSSProperties}
              aria-pressed={simulado}
              onClick={() => setSimulado((s) => !s)}
              className="justify-self-start bg-rojo px-5 py-3 font-mono text-etiqueta tracking-[0.14em] text-void uppercase transition-colors hover:bg-rojo-profundo md:justify-self-end"
            >
              {simulado ? estanteria.volverPrecinto : estanteria.simular} {simulado ? '↺' : '✂'}
            </button>
          )}
        </div>

        <div data-aparece style={{'--i': 3} as React.CSSProperties} className="mt-8 grid gap-3">
          <div role="group" aria-label="Filtrar por reloj" className="flex flex-wrap gap-2">
            <Chip activo={reloj === null} onClick={() => setReloj(null)} etiqueta={estanteria.todos} cuenta={obras.length} />
            {relojes.map((r) => (
              <Chip key={r.id} activo={reloj === r.id} onClick={() => setReloj(r.id)} etiqueta={`${r.corto} · ${r.anio}`} cuenta={obras.filter((o) => o.reloj === r.id).length} />
            ))}
          </div>
          <div role="group" aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
            <Chip activo={tipo === null} onClick={() => setTipo(null)} etiqueta={estanteria.todos} />
            {tipos.map((t) => (
              <Chip key={t.id} activo={tipo === t.id} onClick={() => setTipo(t.id)} etiqueta={`${t.signo} ${t.nombre}`} />
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {estanteria.resultados(visibles.length)}
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-[2px] bg-tinta p-[2px] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visibles.map((o, i) => (
            <li key={o.id} className="bg-void">
              <button
                type="button"
                onClick={(e) => {
                  origenRef.current = e.currentTarget;
                  setAbierta(i);
                }}
                aria-haspopup="dialog"
                aria-label={`${o.titulo}, ${o.autor}. ${libre ? estanteria.libre : estanteria.precinto}`}
                className="group relative flex aspect-[4/5] w-full flex-col justify-between p-3 text-left transition-colors duration-200 hover:bg-elevado md:p-4"
              >
                <span className="flex items-start justify-between font-mono text-[0.625rem] tracking-[0.12em] text-texto-3 uppercase">
                  <span>
                    {TIPO[o.tipo].signo} {RELOJ[o.reloj].corto}
                  </span>
                  <span className="tabular-nums">{o.anio}</span>
                </span>
                <span>
                  <span className="block font-display text-[clamp(1.0625rem,1.5vw,1.375rem)] leading-[1.1] font-semibold text-tinta group-hover:text-rojo">{o.titulo}</span>
                  <span className="mt-1 block text-[0.8125rem] leading-snug text-texto-2">{o.autor}</span>
                </span>
                <span className="precinto" aria-hidden="true" style={{'--corte': libre ? 1 : 0} as React.CSSProperties}>
                  {['Precintado ·', '· 01·01·2027'].map((t) => (
                    <span key={t} style={{transitionDelay: `${libre ? Math.min(i, 24) * 35 : 0}ms`}}>
                      {t}
                    </span>
                  ))}
                </span>
                {libre && <span className="absolute right-3 bottom-3 size-2.5 bg-rojo md:right-4 md:bottom-4" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogoRef}
        aria-labelledby="ficha-titulo"
        onClose={cerrar}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') mover(1);
          if (e.key === 'ArrowLeft') mover(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) cerrar();
        }}
        className="m-auto max-h-[92svh] w-[min(46rem,94vw)] overflow-auto bg-void p-0 text-tinta shadow-[12px_12px_0_var(--color-tinta)] ring-2 ring-tinta"
      >
        {ficha && (
          <div className="flex flex-col p-6 md:p-10">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-etiqueta tracking-[0.14em] text-texto-3 uppercase">
                {TIPO[ficha.tipo].signo} {TIPO[ficha.tipo].nombre} · {RELOJ[ficha.reloj].nombre}
              </span>
              <button type="button" onClick={cerrar} className="px-3 py-1 text-[0.875rem] font-semibold ring-1 ring-tinta hover:bg-tinta hover:text-void">
                {estanteria.cerrar} ✕
              </button>
            </div>
            <h3 id="ficha-titulo" className="mt-6 font-display text-[clamp(1.875rem,4vw,3rem)] leading-[1.02] font-bold tracking-[-0.02em]">
              {ficha.titulo}
            </h3>
            {ficha.original && <p className="mt-1 text-body text-texto-3 italic">{ficha.original}</p>}
            <p className="mt-2 text-body font-medium text-rojo">
              {ficha.autor} · {ficha.anio}
            </p>
            <p className="mt-6 text-lead">{ficha.texto}</p>
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t-2 border-tinta pt-4 text-[0.9375rem]">
              <dt className="text-texto-3">Regla</dt>
              <dd>{RELOJ[ficha.reloj].regla}</dd>
              <dt className="text-texto-3">Estado</dt>
              <dd className="font-semibold">{abierto ? estanteria.libre : simulado ? `${estanteria.libre} (simulación)` : estanteria.precinto}</dd>
            </dl>
            {ficha.ojo && (
              <div className="mt-6 bg-rojo p-4 text-void">
                <p className="font-mono text-etiqueta tracking-[0.14em] uppercase">{estanteria.ojo}</p>
                <p className="mt-2 text-body">{ficha.ojo}</p>
              </div>
            )}
            <div className="mt-8 flex justify-between gap-3">
              <button type="button" onClick={() => mover(-1)} className="px-4 py-2 text-[0.875rem] font-semibold ring-1 ring-tinta hover:bg-tinta hover:text-void">
                ← {estanteria.anterior}
              </button>
              <button type="button" onClick={() => mover(1)} className="px-4 py-2 text-[0.875rem] font-semibold ring-1 ring-tinta hover:bg-tinta hover:text-void">
                {estanteria.siguiente} →
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}

function Chip({activo, onClick, etiqueta, cuenta}: {activo: boolean; onClick: () => void; etiqueta: string; cuenta?: number}) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`flex items-center gap-2 px-3.5 py-1.5 text-[0.9375rem] font-medium ring-1 transition-colors duration-150 ${activo ? 'bg-tinta text-void ring-tinta' : 'bg-transparent text-tinta ring-borde hover:ring-tinta'}`}
    >
      {etiqueta}
      {cuenta !== undefined && <span className={`font-mono text-[0.6875rem] ${activo ? 'text-void/70' : 'text-texto-3'}`}>{cuenta}</span>}
    </button>
  );
}
