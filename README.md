# Robot Vision XR — V24.3 Stable Obstacles

## Objetivo
Mantener intacto el point cloud de V24.2 y mejorar la estabilidad temporal de los recuadros.

## Cambios
- Tracking temporal ligero de FLOOR / SURFACE / OBSTACLE
- Suavizado de posición y tamaño
- Confirmación de una región durante varios frames antes de mostrarla
- Persistencia corta si la detección desaparece unos pocos frames
- Matching por tipo, IoU y distancia entre centros
- Máximo 2 etiquetas visibles para conservar limpieza visual

## Se mantiene
- Zero-install
- Sin WebXR / ARCore
- Look del point cloud de V24.2
- NEAR / MID / FAR
- GEOM confidence

## GitHub Pages
Prueba: https://a01796049.github.io/robot-vision-xr/?v=24.3
