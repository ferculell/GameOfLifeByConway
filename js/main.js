const celulas = [];
let densidadPoblacional = [];
let plantillaTablero = "";

for (let i = 0; i < 400; i++) {
  plantillaTablero += `
                <div id="${i}" class="casilla grid-item"></div>
                `;
  celulas.push(0);
}
document.querySelector("#tablero").innerHTML = plantillaTablero;

const tablero = document.getElementsByTagName("div");

function plantarCelula(event) {
  let i = event.target.id;
  celulas[parseInt(i)] = 1;
  if (i != "tablero" && i != "") {
    document.getElementById(i).classList.add("live");
  }
}

function dibujar(miEvento) {
  for (let casillero of tablero) {
    // Limpiamos manejadores de eventos previos
    casillero.onmouseover = null;
    casillero.onclick = null;

    switch (miEvento) {
      case "mouseover":
        casillero.onmouseover = plantarCelula;
        break;
      case "click":
        casillero.onclick = plantarCelula;
        break;
      default:
        console.error("Algo salió mal.");
        break;
    }
  }
}

function poblarTablero() {
  for (let i = 0; i < celulas.length; i++) {
    celulas[i] = Math.round(Math.random());
  }
  renderizar();
}

function limpiarTablero() {
  for (let i = 0; i < celulas.length; i++) {
    celulas[i] = 0;
  }
  densidadPoblacional = []; // Reinicia el historial de densidad poblacional
  renderizar();
}

function renderizar() {
  for (let i = 0; i < celulas.length; i++) {
    let divCelula = document.getElementById(i.toString());
    if (celulas[i] == 1) {
      divCelula.classList.add("live");
    } else if (divCelula.classList.contains("live")) {
      divCelula.classList.remove("live");
    }
  }
}

function actualizar() {
  let vecindad;
  for (let i = 0; i < celulas.length; i++) {
    if (i == 0) {
      vecindad = celulas[i + 1] + celulas[i + 20] + celulas[i + 21];
    } else if (i == 19) {
      vecindad = celulas[i - 1] + celulas[i + 19] + celulas[i + 20];
    } else if (i == 380) {
      vecindad = celulas[i - 20] + celulas[i - 19] + celulas[i + 1];
    } else if (i == 399) {
      vecindad = celulas[i - 21] + celulas[i - 20] + celulas[i - 1];
    } else if (i % 20 == 0) {
      vecindad =
        celulas[i - 20] +
        celulas[i - 19] +
        celulas[i + 1] +
        celulas[i + 20] +
        celulas[i + 21];
    } else if ((i + 1) % 20 == 0) {
      vecindad =
        celulas[i - 21] +
        celulas[i - 20] +
        celulas[i - 1] +
        celulas[i + 19] +
        celulas[i + 20];
    } else if (i < 20) {
      vecindad =
        celulas[i - 1] +
        celulas[i + 1] +
        celulas[i + 19] +
        celulas[i + 20] +
        celulas[i + 21];
    } else if (i > 379) {
      vecindad =
        celulas[i - 21] +
        celulas[i - 20] +
        celulas[i - 19] +
        celulas[i - 1] +
        celulas[i + 1];
    } else {
      vecindad =
        celulas[i - 21] +
        celulas[i - 20] +
        celulas[i - 19] +
        celulas[i - 1] +
        celulas[i + 1] +
        celulas[i + 19] +
        celulas[i + 20] +
        celulas[i + 21];
    }

    if (celulas[i] == 1 && (vecindad < 2 || vecindad > 3)) {
      celulas[i] = 0;
    } else if (celulas[i] == 0 && vecindad == 3) {
      celulas[i] = 1;
    }
  }

  // Calcula la densidad poblacional de cada generación
  let celulasVivas = celulas.reduce((acc, cur) => acc + cur, 0);
  let porcentajeVivas = celulasVivas / celulas.length;
  densidadPoblacional.push(porcentajeVivas);

  renderizar();
}

let vida;

function activar() {
  vida = setInterval(actualizar, 200);
}

function desactivar() {
  clearInterval(vida);
  console.log(densidadPoblacional);  // Muestra por consola las estadísticas acumuladas
}
