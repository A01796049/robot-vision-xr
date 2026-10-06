# Robot Vision XR — V23 Real Depth

## Principales cambios
- Mantiene el look de V21/V22.1.
- Usa ARCore Depth real.
- Distancias calculadas con mediana robusta de múltiples muestras.
- Rechazo de outliers.
- Etiquetas: `OBSTACLE · 1.24m · GEOM 94%`.
- GEOM = confianza geométrica.
- Persistencia temporal de 3 frames.
- Jitter subpixel para reducir banding.
- Máximo 3 etiquetas visibles.

## GitHub Pages
Sube `index.html`, `.nojekyll`, `README.md` y `VERSION.txt`.

Prueba:
https://a01796049.github.io/robot-vision-xr/?v=23
