const instructionsDiv = document.getElementById('instructions');
const hiddenCardsContainer = document.getElementById('hidden-cards');
const cardResponsiveRow1 = document.getElementById('cardResponsiveRow1');
const cardResponsiveRow2 = document.getElementById('cardResponsiveRow2');
const visibleCardsContainer = document.getElementById('visible-cards');
const targetDisplay = document.getElementById('target-number');
const timerDisplay = document.getElementById('timer');
const checkBtn = document.getElementById('check');
const resetBtn = document.getElementById('reset');
const messageDisplay = document.getElementById('message');
const expressionInput = document.getElementById('expression');
const operators = document.getElementById('operators');

let selectedHidden = [];
let targetNumber = null;
let timer = 60;
let interval;
let usedNumbers = new Set();

// Sonidos (coloca los archivos en la misma carpeta o ajusta ruta)
const sounds = {
  flip: new Audio('flip.mp3'),
  correct: new Audio('correct.mp3'),
  incorrect: new Audio('incorrect.mp3'),
  timeUp: new Audio('timeup.mp3'),
  pocotiempo: new Audio('pocotiempo.mp3'),
  piropo: new Audio('silvido.mp3')
};

function pushNumber(card){
  expressionInput.value += card.dataset.value;
  usedNumbers.add(card);
  card.classList.add('disabled');
}

function barajarDe0a10() {
  let array = [...Array(10).keys()];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Crear cartas ocultas (grises)
function createHiddenCards() {
  cardResponsiveRow1.innerHTML = '';
  cardResponsiveRow2.innerHTML = '';
  const numbers = barajarDe0a10();

  numbers.forEach(num => {
  
    const card = document.createElement('div');
    card.className = 'card hidden';
  //card.className = 'card revelated';
    card.textContent = num;
    card.dataset.value = num;
    card.addEventListener('click', () => {
      if (selectedHidden.length < 2 && !card.classList.contains('revealed')) {
        card.classList.remove('hidden');
        card.classList.add('revealed');
        selectedHidden.push(Number(card.dataset.value));
        sounds.flip.play();

        if (selectedHidden.length === 2) {
          targetNumber = selectedHidden[0] * 10 + selectedHidden[1];
          targetDisplay.textContent = `Número objetivo: ${targetNumber}`;
          startTimer();
        }
      }
    });
    if(cardResponsiveRow1.childElementCount == cardResponsiveRow2.childElementCount)
      cardResponsiveRow1.appendChild(card);
    else 
      cardResponsiveRow2.appendChild(card);
  });
  hiddenCardsContainer.appendChild(cardResponsiveRow1)
}

function startTimer() {
  if(window.innerWidth < 900){
    visibleCardsContainer.style.display= 'initial';
    operators.style.display= 'inherit';
    hiddenCardsContainer.style.display = 'none';
    visibleCardsContainer.classList.add('fadeIn')
    operators.classList.add('fadeIn')
  }

  clearInterval(interval);
  timer = 60;
  interval = setInterval(() => {
    timer--;
    timerDisplay.textContent = `Tiempo: ${timer}`;
    updateTimerStyle();

    if (timer == 3) {
      sounds.pocotiempo.play();
      document.getElementById('buzzer').removeAttribute('hidden');
      setInterval(() => {
        if(document.getElementById('buzzer').innerHTML.codePointAt() == 128264){
          document.getElementById('buzzer').innerHTML = '&#128265'
        } else if(document.getElementById('buzzer').innerHTML.codePointAt() == 128265){
          document.getElementById('buzzer').innerHTML = '&#128266'
        } else if(document.getElementById('buzzer').innerHTML.codePointAt() == 128266){
          document.getElementById('buzzer').innerHTML = '&#128264'
        }
      }, 300);
    }

    if (timer <= 0) {
      clearInterval(interval);
      messageDisplay.textContent = '¡Tiempo agotado!';
      sounds.timeUp.play();
      document.getElementById('buzzer').setAttribute('hidden', 'hidden');
    }
  }, 1000);
}

function updateTimerStyle() {
  if (timer <= 20) {
    timerDisplay.style.backgroundColor = 'red';
    timerDisplay.style.color = 'white';
  } else if (timer <= 40) {
    timerDisplay.style.backgroundColor = 'yellow';
    timerDisplay.style.color = 'black';
  } else {
    timerDisplay.style.backgroundColor = 'green';
  }
}

// Operadores
document.querySelectorAll('.operator').forEach(btn => {
  btn.addEventListener('click', () => {
    expressionInput.value += btn.dataset.op;
    btn.classList.add('disabled');
  });
});

checkBtn.addEventListener('click', () => {
  const expr = expressionInput.value;
  try {
    if (!/^.*\*.*\+.*-.*$/.test(expr)) {
      messageDisplay.textContent = 'Debes usar los operadores en orden: x + -';
      document.getElementById('usar-los-tres-operadores').className = 'incorrect'
      //document.getElementById('usar-los-tres-operadores')
      sounds.incorrect.play();

      setTimeout(() => {
        document.getElementById('usar-los-tres-operadores').className = ''
        messageDisplay.textContent = '';
        messageDisplay.className = 'message-box';
      }, 3000);
      return;
    }
    if (/(^|[^0-9])1\*|(\*)1([^0-9]|$)/.test(expr)) {
      messageDisplay.textContent = '🚫 No se permite multiplicar directamente por 1. Usa otros números.';
      messageDisplay.className = 'message-box incorrect';
      document.getElementById('multiplicar-por-1').className = 'incorrect'
      sounds.incorrect.play();
    
      setTimeout(() => {
        document.getElementById('multiplicar-por-1').className = ''
        messageDisplay.textContent = '';
        messageDisplay.className = 'message-box';
      }, 3000);
      return;
    }

    const result = eval(expr);
    if (result === targetNumber) {
      messageDisplay.textContent = '¡Correcto!';
      if(timer <= 40) {
        sounds.correct.play();
      } else {
        sounds.piropo.play();
      }
      
      clearInterval(interval); // Detiene el cronómetro

      // 🎉 Confeti visual
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });

      const winMessage = document.createElement('div');
      winMessage.textContent = '¡Ganaste!';
      winMessage.classList.add('win-message');
      document.body.appendChild(winMessage);

      // Animación para el mensaje flotante
      setTimeout(() => {
        winMessage.style.opacity = 0; // Hacer desaparecer el mensaje después de 3 segundos
        setTimeout(() => winMessage.remove(), 500); // Eliminarlo completamente después de la animación
      }, 3000);
    } else {
      messageDisplay.textContent = 'Incorrecto, intenta de nuevo.';
      sounds.incorrect.play();
    }
  } catch (e) {
    messageDisplay.textContent = 'Expresión inválida.';
  }
});

// 🔁 Reiniciar el juego
resetBtn.addEventListener('click', () => {

  estadoInicial();

  if(window.innerWidth < 900){
    hiddenCardsContainer.style.display = 'inherit';
  }

  //Reset timer
  clearInterval(interval);
  timer = 60;
  timerDisplay.textContent = `Tiempo: ${timer}`;
  updateTimerStyle()

  //hidden visible cards and operators
  cardResponsiveRow1.style.display = 'none !important;';

  //Reset cards 
  const visibleCards = document.querySelectorAll(".card, .disabled");    
  Array.prototype.forEach.call(visibleCards, function(vc) {
    vc.classList.remove("disabled");
    vc.classList.add('visible');
  });

  messageDisplay.textContent = '';
  targetDisplay.textContent = '';
  selectedHidden = [];
  targetNumber = null;
  
  usedNumbers.clear();
  document.querySelectorAll('.operator').forEach(op => op.classList.remove('disabled'));
  
  createHiddenCards();
});

expressionInput.addEventListener('input', () => {

  const expr = expressionInput.value;
  
  
  // Limpiar estados
  usedNumbers.clear();

  // Rehabilitar todas las tarjetas visibles
  document.querySelectorAll('#visible-cards .card').forEach(card => {
    card.classList.remove('disabled');
  });
  
  // Rehabilitar todos los operadores
  document.querySelectorAll('.operator').forEach(op => {
    op.classList.remove('disabled');
  });
  
  // Ver qué números y operadores están presentes en la expresión
  for (let i = 1; i <= 9; i++) {
    if (expr.includes(i.toString())) {
      usedNumbers.add(i);
      const card = document.querySelector(`#visible-cards .card[data-value="${i}"]`);
      card?.classList.add('disabled');
    }
  }
  
  const operators = ['x', '+', '-'];
  operators.forEach(op => {
    if (expr.includes(op)) {
      const button = document.querySelector(`.operator[data-op="${op}"]`);
      button?.classList.add('disabled');
    }
  });
});

function estadoInicial() {

  if(window.innerWidth < 1000){
    expressionInput.setAttribute('readonly', 'readonly')
  }

  sounds.pocotiempo.pause()
  document.getElementById('buzzer').setAttribute('hidden', 'hidden');
  expressionInput.value = '';
  if(window.innerWidth < 900){
    visibleCardsContainer.style.display = 'none';
    operators.style.display= 'none';
  }
}
// Inicializar juego
createHiddenCards();
estadoInicial();
