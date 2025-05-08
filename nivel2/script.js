const provincias = [
    "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos",
    "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén",
    "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
    "Santiago del Estero", "Tierra del Fuego", "Tucumán", "CABA"
];

let provinciasConUnaFaltante = [...provincias];
let provinciaFaltante = "";
let timer;
let timeLeft = 60;

function startGame() {
    // Eliminar una provincia al azar
    const index = Math.floor(Math.random() * provincias.length);
    provinciaFaltante = provincias[index];
    provinciasConUnaFaltante.splice(index, 1); // Remove one

    shuffleArray(provinciasConUnaFaltante); // Desordenar las visibles

    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";

    // Mostrar las provincias visibles
    provinciasConUnaFaltante.forEach((provincia) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerText = provincia;
        gameBoard.appendChild(card);
    });

    // Iniciar cronómetro
    timeLeft = 60;
    document.getElementById("timer").innerText = `Tiempo restante: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Tiempo restante: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("result").innerText = `⏰ ¡Tiempo agotado! La provincia era: ${provinciaFaltante}`;
        }
    }, 1000);
}

function checkGuess() {
    const userGuess = document.getElementById("user-guess").value.trim();
    if (userGuess.toLowerCase() === provinciaFaltante.toLowerCase()) {
        clearInterval(timer);
        document.getElementById("result").innerText = "✅ ¡Correcto!";
    } else {
        document.getElementById("result").innerText = "❌ Incorrecto, intenta nuevamente.";
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

window.onload = startGame;