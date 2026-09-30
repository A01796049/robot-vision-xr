# Robot Vision XR — V19.2 AI Diagnostic

## Qué cambia
V19.2 está enfocada en hacer visible y estable la parte de IA:

- Ya no fuerza `WebGPU` ni `q4`.
- Transformers.js recibe directamente un `HTMLCanvasElement` como entrada.
- Agrega diagnóstico visible:
  - RUNTIME
  - DEPTH
  - OBJECTS
- Agrega dos pruebas manuales:
  - `TEST DEPTH`
  - `TEST OBJECTS`
- Solo después de una prueba exitosa se activa la inferencia continua.

## Orden de prueba
1. Inicia `AI VISION`.
2. Debes ver RGB.
3. Presiona `TEST DEPTH`.
4. Espera a que DEPTH muestre `OK`.
5. Revisa `AI DEPTH` y `LIVE 3D`.
6. Presiona `TEST OBJECTS`.
7. Espera a que OBJECTS muestre `OK`.
8. Revisa `OBJECTS` y `SEMANTIC MAP`.

## GitHub Pages
Sube:
- index.html
- .nojekyll
- README.md
- VERSION.txt

Prueba con:
https://a01796049.github.io/robot-vision-xr/?v=19.2
