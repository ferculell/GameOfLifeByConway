let celulas = [];
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
  if (event.target.classList.contains("casilla")) {
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
  graficarPoblacion();
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

function graficarPoblacion() {
  let grafico = '';
  for (let i = densidadPoblacional.length - 30; i < densidadPoblacional.length; i++) {
    if (densidadPoblacional[i] != null) {
      grafico += `
        <div class="barras" style="height: ${densidadPoblacional[i] * 100}%;"></div>
      `;
    }
  }
  document.getElementById("grafico").innerHTML = grafico;
}

function mostrarGrafico() {
  let vista = document.getElementById("grafico");
  if (vista.style.display === "none") {
    vista.style.display = "flex";
  } else {
    vista.style.display = "none";
  }
}

function actualizar() {
  let vecindad;
  let nuevoEstado = [];
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
      nuevoEstado[i] = 0;
    } else if (celulas[i] == 0 && vecindad == 3) {
      nuevoEstado[i] = 1;
    } else {
      nuevoEstado[i] = celulas[i];
    }
  }

  celulas = nuevoEstado;

  // Calcula la densidad poblacional de cada generación
  let celulasVivas = celulas.reduce((acc, cur) => acc + cur, 0);
  let porcentajeVivas = celulasVivas / celulas.length;
  densidadPoblacional.push(porcentajeVivas);

  renderizar();
  graficarPoblacion();
}

let vida;

function activar() {
  vida = setInterval(actualizar, 200);
}

function desactivar() {
  clearInterval(vida);
}
