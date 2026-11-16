import {useEffect} from 'react';
import {Creditos} from './components/Creditos';
import {Estanteria} from './components/Estanteria';
import {Intro} from './components/Intro';
import {PalabraAPalabra} from './components/patrones/PalabraAPalabra';
import {Portada} from './components/Portada';
import {Relojes} from './components/Relojes';
import {Trampas} from './components/Trampas';
import {tesis} from './content';
import {useMovimientoReducido} from './hooks/useMovimientoReducido';
import {iniciarScroll} from './lib/scroll';

/** Orden del guion: precinto · qué pasa · tres relojes · estantería · letra pequeña · tesis · fuentes. */
export default function App() {
  const reducido = useMovimientoReducido();
  useEffect(() => iniciarScroll(reducido), [reducido]);
  return (
    <main>
      <Portada />
      <Intro />
      <Relojes />
      <Estanteria />
      <Trampas />
      <PalabraAPalabra frase={tesis.frase} firma={tesis.firma} etiqueta={tesis.etiqueta} tono="bg-tinta text-void" />
      <Creditos />
    </main>
  );
}
