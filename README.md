# Robot Vision XR V17 — Dense WebGL Point Cloud

Versión enfocada en mejorar la legibilidad de la nube de puntos 3D desde el celular.

## Mejoras principales
- `LIVE 3D` ahora renderiza con **WebGL** en lugar de Canvas 2D.
- Nube de puntos más densa para que se distingan mejor sillas, escritorios, paredes y piso.
- `WORLD 3D` incorpora **confirmación temporal** para reducir polvo y puntos flotantes.
- Conserva los modos:
  - RGB
  - DEPTH
  - LIVE 3D
  - WORLD 3D
  - COMPARE

## Cómo publicar en GitHub Pages
1. Borra los archivos viejos del repo.
2. Sube el contenido de este ZIP a la raíz del repo.
3. Espera 1–3 minutos.
4. Abre tu URL:
   `https://a01796049.github.io/robot-vision-xr/`
5. Si no actualiza, prueba con:
   `?v=17`

## Recomendación de prueba
- Usa `RANGO 4.0M` en interiores.
- Prueba `DENSIDAD MED` o `HIGH`.
- Compara `RGB -> DEPTH -> LIVE 3D -> WORLD 3D`.

## Siguiente objetivo
V18/V19: estabilización semántica y luego detección de objetos como segunda fase.
