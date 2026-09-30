# Robot Vision XR — V19.1 Fusion Hotfix

## Corrección principal
V19 tenía la cámara activa, pero el contenedor visual `#aiStage` permanecía oculto.
V19.1 corrige esa condición y fuerza la visualización del video RGB antes de iniciar los modelos de IA.

## Prueba recomendada
1. Inicia `AI VISION`.
2. Confirma que RGB muestre la cámara inmediatamente.
3. Después prueba:
   - AI DEPTH
   - LIVE 3D
   - OBJECTS
   - SEMANTIC MAP

## GitHub Pages
Sube estos cuatro archivos a la raíz del repositorio:
- index.html
- .nojekyll
- README.md
- VERSION.txt

Prueba con:
https://a01796049.github.io/robot-vision-xr/?v=19.1
