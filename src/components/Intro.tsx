import {intro} from '../content';
import {useAparecer} from '../hooks/useAparecer';

/** Pausa tras la portada: texto plano que entra al verse, con una regla roja a la izquierda. */
export function Intro() {
  const ref = useAparecer<HTMLElement>();
  return (
    <section ref={ref} aria-labelledby="intro-titulo" className="relative bg-void px-4 pt-[14svh] pb-[16svh] sm:px-6 md:px-[6vw]">
      <div className="mx-auto grid max-w-[90rem] gap-6 md:grid-cols-[1fr_2fr]">
        <p data-aparece className="font-mono text-etiqueta tracking-[0.14em] text-rojo uppercase">
          {intro.antetitulo}
        </p>
        <div className="border-l-4 border-tinta pl-5 md:pl-8">
          <h2 id="intro-titulo" data-aparece style={{'--i': 1} as React.CSSProperties} className="font-display text-display font-semibold text-tinta">
            {intro.titulo}
          </h2>
          <p data-aparece style={{'--i': 2} as React.CSSProperties} className="mt-6 max-w-[42rem] text-lead text-texto-2">
            {intro.cuerpo}
          </p>
        </div>
      </div>
    </section>
  );
}
