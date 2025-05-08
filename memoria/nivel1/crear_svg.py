svg_content = '''<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <!-- Provincias representadas como rectángulos de ejemplo -->
  <rect id="Buenos Aires" x="100" y="100" width="100" height="50" fill="#ccc" stroke="#000"/>
  <rect id="Santa Fe" x="250" y="100" width="100" height="50" fill="#ccc" stroke="#000"/>
  <rect id="Córdoba" x="400" y="100" width="100" height="50" fill="#ccc" stroke="#000"/>
  <rect id="Salta" x="100" y="200" width="100" height="50" fill="#ccc" stroke="#000"/>
  <rect id="Mendoza" x="250" y="200" width="100" height="50" fill="#ccc" stroke="#000"/>
  <rect id="Santa Cruz" x="400" y="200" width="100" height="50" fill="#ccc" stroke="#000"/>
  <!-- Agregá más provincias siguiendo este patrón -->
</svg>
'''

with open("argentina_provincias_ids_corregidos.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

print("SVG generado: argentina_provincias_ids_corregidos.svg")