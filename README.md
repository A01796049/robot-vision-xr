# Robot Vision XR V9 — Plane Segmentation & Stair Detection

## Publicación en GitHub Pages
Sube a la raíz del repositorio:
- index.html
- css/
- js/
- README.md

## Prueba de escaleras
1. Pulsa RESET.
2. Activa SUELO ON.
3. Escanea el piso inferior durante 3–4 segundos.
4. Recorre visualmente cada huella del escalón desde abajo hacia arriba.
5. Escanea la pared al final.
6. Espera varios ciclos de análisis.

## Interpretación
- STEP: plano horizontal candidato a peldaño.
- STAIRS: secuencia de al menos dos planos con subida y avance compatibles.
- El reconocimiento es geométrico y experimental; no usa un modelo de visión semántica.
