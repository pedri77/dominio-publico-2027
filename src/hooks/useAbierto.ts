import {useEffect, useState} from 'react';
import {APERTURA} from '../content';

/** Milisegundos que faltan para la apertura (≤ 0 si ya pasó). `?abierto` en la URL simula el día después. */
export const faltan = () => (new URLSearchParams(location.search).has('abierto') ? -1 : APERTURA.getTime() - Date.now());

/** true desde la medianoche del 1 de enero de 2027. Cambia sola si la página está abierta en ese momento. */
export function useAbierto() {
  const [abierto, setAbierto] = useState(() => faltan() <= 0);
  useEffect(() => {
    if (abierto) return;
    // setTimeout no admite más de ~24,8 días: se reprograma por tramos.
    let t = 0;
    const programar = () => {
      const f = faltan();
      if (f <= 0) return setAbierto(true);
      t = window.setTimeout(programar, Math.min(f, 2 ** 31 - 1));
    };
    programar();
    return () => clearTimeout(t);
  }, [abierto]);
  return abierto;
}

/** Descompone milisegundos en días, horas, minutos y segundos. */
export function partes(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60] as const;
}
