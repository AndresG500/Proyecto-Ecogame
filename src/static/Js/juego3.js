const HUMAN = "X"
const AI = "O"

let tablero = Array(9).fill(null)
let juegoTerminado = false
let bloqueado = false

const WINNERS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const botones = Array.from(document.querySelectorAll(".tablero .casilla"))

// Dibuja la ficha en el tablero visual
function pintaFicha(idx, quien) {
  const btn = botones[idx]
  if (!btn) return
  btn.innerHTML = ""
  if (quien === HUMAN) {
    btn.innerHTML = '<img src="image/fichax.png" alt="X" class="ficha-btn">'
    btn.setAttribute("aria-label", "X")
  } else if (quien === AI) {
    btn.innerHTML = '<img src="image/fichao.png" alt="O" class="ficha-btn">'
    btn.setAttribute("aria-label", "O")
  } else {
    btn.removeAttribute("aria-label")
  }
  btn.disabled = tablero[idx] !== null || juegoTerminado
}

// Actualiza el tablero visual
function render() {
  tablero.forEach((val, i) => pintaFicha(i, val))
  if (juegoTerminado) {
    botones.forEach((b) => (b.disabled = true))
  } else {
    botones.forEach((b, i) => (b.disabled = tablero[i] !== null || bloqueado))
  }
}

// Verifica si hay ganador
function hayGanador(tab) {
  for (const [a, b, c] of WINNERS) {
    if (tab[a] && tab[a] === tab[b] && tab[a] === tab[c]) {
      return tab[a]
    }
  }
  return null
}

// Verifica si el tablero está lleno
function tableroLleno(tab) {
  return tab.every((c) => c !== null)
}

// Muestra el mensaje en el modal flotante
function mostrarModal(mensaje) {
  document.getElementById("texto-modal").textContent = mensaje
  document.getElementById("modal-mensaje").style.display = "block"
}

document.getElementById("cerrar-modal").onclick = () => {
  document.getElementById("modal-mensaje").style.display = "none"
}

// Finaliza el juego si corresponde
function finalizarSiCorresponde() {
  const ganador = hayGanador(tablero)
  if (ganador) {
    juegoTerminado = true
    render()
    if (ganador === HUMAN) {
      mostrarModal("¡Ganaste! 🎉")
    } else {
      mostrarModal("La máquina gana 🤖")
    }
    return
  }
  if (tableroLleno(tablero)) {
    juegoTerminado = true
    render()
    mostrarModal("¡Empate! 😐")
  }
}

// La máquina juega de forma aleatoria y sencilla
function turnoIA() {
  bloqueado = true
  render()
  setTimeout(() => {
    // Busca casillas libres
    const libres = tablero.map((v, i) => (v === null ? i : null)).filter((i) => i !== null)
    if (libres.length === 0 || juegoTerminado) {
      bloqueado = false
      render()
      return
    }
    // Elige una casilla libre al azar
    const idx = libres[Math.floor(Math.random() * libres.length)]
    tablero[idx] = AI
    bloqueado = false
    render()
    finalizarSiCorresponde()
  }, 500)
}

// Cuando el usuario marca una celda
window.marcarCelda = (numero) => {
  if (juegoTerminado || bloqueado) return
  const i = Number(numero) - 1
  if (i < 0 || i > 8) return
  if (tablero[i] !== null) return
  tablero[i] = HUMAN
  render()
  finalizarSiCorresponde()
  if (!juegoTerminado) turnoIA()
}

// Reinicia el juego
window.reiniciarJuego = () => {
  tablero = Array(9).fill(null)
  juegoTerminado = false
  bloqueado = false
  render()
}

render()
