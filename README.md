# Robot Vision XR — V19 Fusion

Esta versión integra dos motores en una sola app:

## AI Vision
- Cámara trasera con `getUserMedia`
- Depth Anything V2 Small (profundidad relativa por IA)
- Nube de puntos RGB / NEON
- YOLOS-Tiny para detección de objetos
- Mapa semántico aproximado

## XR Sensor
- WebXR + ARCore Depth
- DEPTH
- LIVE 3D
- WORLD 3D
- WORLD TOP

## Publicación
Sube estos archivos a la raíz de tu repositorio GitHub Pages:
- `index.html`
- `.nojekyll`
- `README.md`
- `VERSION.txt`

Prueba:
`https://a01796049.github.io/robot-vision-xr/?v=19`

## Importante
La primera ejecución de AI Vision descarga modelos desde Hugging Face/CDN, por lo que puede tardar.
Las distancias marcadas con `*` en AI Vision son aproximadas/relativas. Para distancia métrica usa XR Sensor.
