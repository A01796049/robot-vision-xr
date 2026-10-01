# Robot Vision XR — V20 Core

Versión básica y optimizada para demo en celular.

## Qué incluye
- `RGB`
- `DEPTH`
- `POINT CLOUD`
- `SHAPES`

## Enfoque
- Solo usa `ARCore Depth`
- No incluye IA pesada
- Busca emular cómo “ve” un robot usando nube de puntos y formas geométricas simples

## Controles
- `STYLE`: DEPTH / NEON / DENSE
- `DENSIDAD`: LOW / MED / HIGH
- `RANGO`: 2.5M / 4.0M / 6.5M

## SHAPES
La vista SHAPES usa heurísticas geométricas ligeras para marcar:
- `FLOOR`
- `SURFACE`
- `OBSTACLE`

## Publicación
Sube estos archivos a la raíz de tu repo GitHub Pages:
- index.html
- .nojekyll
- README.md
- VERSION.txt

Prueba con:
https://a01796049.github.io/robot-vision-xr/?v=20
