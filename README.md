# Dominio público 2027

Web cinemática sobre lo que entra en dominio público el 1 de enero de 2027 y por qué cada país cuenta con su propio reloj:

- **EE. UU.**: obras publicadas en 1931 (publicación + 95 años).
- **Europa**: autores fallecidos en 1956 (vida + 70 años).
- **España**: autores fallecidos en 1946 (vida + 80 años para quien murió antes del 7-12-1987).

Demo: https://pedri77.github.io/dominio-publico-2027/

## Qué tiene

- Portada con un © precintado que el scroll rompe hasta dejar «PD», y una cuenta atrás real hasta la medianoche (hora de Madrid).
- Esfera de años con tres agujas, una por país.
- Estantería de 40 obras filtrable, con ficha y letra pequeña, y botón para simular la medianoche. `?abierto` en la URL muestra la web como el día después.
- Seis casos de «libre aquí, no allí».

## Contenido y derechos

Selección y textos propios. Datos de Wikipedia («2027 in public domain»), la BNE y la Ley de Propiedad Intelectual. **Sin imágenes de las obras**: hasta el 1 de enero de 2027 siguen protegidas. Es divulgación, no asesoramiento legal.

Tipografía: [Jost](https://github.com/indestructible-type/Jost) (SIL OFL) y JetBrains Mono (SIL OFL), servidas por Google Fonts.

Textos y código hechos con IA (Claude) y revisados.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3009
npm run lint && npm run build
```

React 19, Vite, Tailwind 4 y Lenis. Un solo bucle `requestAnimationFrame` escribe estilos directo al DOM; el scroll no re-renderiza. Respeta `prefers-reduced-motion`.

El despliegue a GitHub Pages lo hace `.github/workflows/pages.yml` en cada push a `main`.
