let tiempoRestante = 60;
let temporizadorID;
let provincias = [
  "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos",
  "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén",
  "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
  "Santiago del Estero", "Tierra del Fuego", "Tucumán"
];

let provinciaFaltante = "";

function startGame() {
 
  const index = Math.floor(Math.random() * provincias.length);
  provinciaFaltante = provincias[index];
  console.log("🔍 Provincia seleccionada:", provinciaFaltante);

  clearInterval(temporizadorID); // detener si estaba corriendo
  tiempoRestante = 60;
  document.getElementById("timer").innerText = `⏱ Tiempo restante: ${tiempoRestante}s`;

  temporizadorID = setInterval(() => {
    tiempoRestante--;
    document.getElementById("timer").innerText = `⏱ Tiempo restante: ${tiempoRestante}s`;

    if (tiempoRestante <= 0) {
      clearInterval(temporizadorID);
      document.getElementById("result").innerText = `⏳ Tiempo agotado. Era: ${provinciaFaltante}`;
      document.getElementById("result").style.color = "orange";
    }
  }, 1000);

  fetch("mapa-argentina-nivel1.svg")
    .then(response => response.text())
    .then(svgText => {
      document.getElementById("map-container").innerHTML = svgText;

      setTimeout(() => {
        const svg = document.querySelector("#map-container svg");

        // Mostrar nombres sobre cada provincia (menos la que falta)
        provincias.forEach(nombre => {
          const grupo = document.getElementById(nombre);
          if (!grupo) {
            console.warn("❌ No se encontró la provincia:", nombre);
            return;
          }

          // Obtener el centro de la provincia (aproximado con su bounding box)
          const bbox = grupo.getBBox();
          const texto = document.createElementNS("http://www.w3.org/2000/svg", "text");
          texto.textContent = nombre;
          texto.setAttribute("x", bbox.x + bbox.width / 2);
          texto.setAttribute("y", bbox.y + bbox.height / 2);
          texto.setAttribute("text-anchor", "middle");
          texto.setAttribute("alignment-baseline", "middle");
          texto.setAttribute("font-size", "12");
          texto.setAttribute("fill", "#000");
          texto.setAttribute("class", "nombre-provincia");
          texto.setAttribute("data-provincia", nombre);
          texto.setAttribute("pointer-events", "none");

          svg.appendChild(texto);
        });

        // Ocultar provincia y su nombre
        const grupoFaltante = document.getElementById(provinciaFaltante);
        if (grupoFaltante) {
          console.log("✅ Ocultando provincia:", provinciaFaltante);

          // Ocultar visualmente la provincia (relleno y borde)
          grupoFaltante.querySelectorAll("path, rect, polygon, circle").forEach(el => {
            el.setAttribute("fill", "#f0f0f0");
            el.setAttribute("stroke", "#f0f0f0");
          });
          grupoFaltante.setAttribute("style", "display: none !important;");

          // Ocultar su nombre (text añadido dinámicamente)
          const textos = svg.querySelectorAll(`text[data-provincia='${provinciaFaltante}']`);
          textos.forEach(t => t.remove());
        } else {
          console.warn("⚠️ No se encontró el ID de la provincia faltante:", provinciaFaltante);
        }

      }, 0);
    })
    .catch(err => console.error("❌ Error al cargar el mapa:", err));
}

function checkGuess() {
  const input = document.getElementById("user-guess").value.trim();
  const resultado = document.getElementById("result");

  if (input.toLowerCase() === provinciaFaltante.toLowerCase()) {
    resultado.innerText = "✅ ¡Correcto!";
    resultado.style.color = "green";
  } else {
    resultado.innerText = "❌ Incorrecto. Intenta nuevamente.";
    resultado.style.color = "red";
  }
}

window.onload = startGame;