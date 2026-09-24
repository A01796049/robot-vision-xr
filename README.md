# Robot Vision XR V18 — Semantic AI Mapping Preview

## Incluye
- RGB
- DEPTH
- LIVE 3D (WebGL dense point cloud)
- WORLD 3D
- OBJECTS (COCO-SSD / TensorFlow.js)
- COMPARE
- Semantic Map: detecciones + profundidad + coordenadas XYZ

## Importante
La detección integrada dentro de la sesión XR utiliza la API experimental WebXR Raw Camera Access (`camera-access`).
Si Chrome/ARCore no la concede, las vistas RGB/DEPTH/LIVE 3D/WORLD 3D seguirán funcionando, pero OBJECTS mostrará que la cámara XR no está disponible para IA.

## Dependencias
Se cargan desde CDN al abrir la página:
- TensorFlow.js 4.22.0
- COCO-SSD 2.2.3 (lite_mobilenet_v2)

La primera carga necesita internet para descargar el modelo; posteriormente el navegador puede reutilizar caché.

## GitHub Pages
Sube a la raíz:
- index.html
- .nojekyll
- README.md
- VERSION.txt

Prueba con:
`https://a01796049.github.io/robot-vision-xr/?v=18`

## Cómo probar
1. Espera a que `Object AI` muestre `COCO-SSD listo`.
2. Inicia WebXR.
3. Recorre: RGB → DEPTH → LIVE 3D → OBJECTS → WORLD 3D.
4. En OBJECTS revisa cajas, clase, confianza y distancia.
5. En WORLD 3D cambia a WORLD TOP para ver las etiquetas semánticas persistentes.
