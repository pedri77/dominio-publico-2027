import {creditos} from '../content';
import {useAjustarTexto} from '../hooks/useAjustarTexto';
import {useAparecer} from '../hooks/useAparecer';
import {irA} from '../lib/scroll';

/** Cierre: fuentes, aviso legal y wordmark de borde a borde sobre bloque rojo. */
export function Creditos() {
  const ref = useAparecer<HTMLElement>();
  const marca = useAjustarTexto<HTMLSpanElement>();
  return (
    <footer ref={ref} aria-labelledby="creditos-titulo" className="relative bg-void pt-[12svh]">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1fr] md:px-[6vw]">
        <div>
          <p data-aparece className="font-mono text-etiqueta tracking-[0.14em] text-rojo uppercase">
            {creditos.antetitulo}
          </p>
          <h2 id="creditos-titulo" data-aparece style={{'--i': 1} as React.CSSProperties} className="mt-3 font-display text-display font-semibold text-tinta">
            {creditos.titulo}
          </h2>
          <p data-aparece style={{'--i': 2} as React.CSSProperties} className="mt-5 max-w-[36rem] text-body text-texto-2">
            {creditos.cuerpo}
          </p>
          <button
            type="button"
            onClick={() => irA('#inicio')}
            data-aparece
            style={{'--i': 3} as React.CSSProperties}
            className="mt-8 px-5 py-2.5 text-[0.9375rem] font-semibold text-tinta ring-2 ring-tinta transition-colors hover:bg-tinta hover:text-void"
          >
            ↑ {creditos.volver}
          </button>
        </div>
        <div data-aparece style={{'--i': 2} as React.CSSProperties}>
          <p className="border-l-4 border-rojo pl-4 text-body text-tinta">{creditos.aviso}</p>
          <ul className="mt-8 grid gap-2 text-[0.9375rem]">
            {creditos.fuentes.map((f) => (
              <li key={f.url}>
                <a href={f.url} target="_blank" rel="noopener" className="underline decoration-borde underline-offset-4 transition-colors hover:text-rojo hover:decoration-rojo">
                  {f.texto} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[0.8125rem] text-texto-3">{creditos.firma}</p>
        </div>
      </div>
      <div className="mt-[10svh] overflow-hidden bg-rojo px-4 pt-[0.1em] sm:px-6 md:px-[6vw]" aria-hidden="true">
        <span ref={marca} className="inline-block font-display leading-[1.05] font-bold tracking-[-0.04em] whitespace-nowrap text-void uppercase">
          {creditos.wordmark}
        </span>
      </div>
    </footer>
  );
}
