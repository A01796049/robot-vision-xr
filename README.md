# Robot Vision XR — V14 LiDAR Visual Match

Versión limpia para GitHub Pages.

## Archivos
- `index.html` — aplicación completa (HTML + CSS + JavaScript).
- `.nojekyll` — evita procesamiento innecesario de GitHub Pages.
- `README.md` — estas instrucciones.

No se necesitan carpetas `css/`, `js/`, modelos ni librerías locales.

## Publicación en GitHub Pages

1. Sube **los archivos contenidos en este ZIP** a la raíz del repositorio.
2. Debes ver directamente:
   - `index.html`
   - `.nojekyll`
   - `README.md`
3. En GitHub abre:
   `Settings > Pages`
4. En `Build and deployment` selecciona:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/(root)`
5. Guarda y espera a que GitHub Pages publique.

## URL de prueba

Si tu repositorio sigue llamándose `robot-vision-xr`:

`https://a01796049.github.io/robot-vision-xr/?v=18`

El parámetro `?v=18` ayuda a evitar caché del navegador.

## Modos disponibles

- RGB — cámara real.
- DEPTH — mapa térmico de profundidad.
- LIVE 3D — nube de puntos actual en la misma perspectiva de la cámara.
- WORLD 3D — nube de puntos acumulada en coordenadas del mundo.
- COMPARE — comparación RGB vs Robot Vision.

## Requisitos

- Chrome en Android.
- HTTPS.
- WebXR immersive-ar.
- Depth Sensing compatible con ARCore.
