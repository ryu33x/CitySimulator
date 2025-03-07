let BASE_WIDTH = 1200;
let BASE_HEIGHT = 800;
let CELL_SIZE = 10;  // Tamaño fijo de las celdas
let INFO_PANEL_WIDTH = 240;  // Ancho fijo del panel de estadísticas
let MARGIN = 20;  // Margen externo de 20px

let logicalCols, logicalRows;
let windowWidth, windowHeight;
let mapWidth, mapHeight;

let terrain = [];
let zones = [];
let roads = [];
let pollution = [];
let buildings = [];
let citizens = [];
let timeCounter = 0;
let running = true;

function setup() {
  // Inicializar el lienzo con un tamaño fijo
  windowWidth = BASE_WIDTH;
  windowHeight = BASE_HEIGHT;
  createCanvas(windowWidth, windowHeight);
  frameRate(30);  // Reducir la tasa de fotogramas para ahorrar recursos

  // Calcular dimensiones iniciales
  calculateDimensions();

  // Inicializar sistemas del juego
  terrain = generateTerrain();
  zones = autoZone();
  roads = buildRoads();
  pollution = Array.from({ length: logicalRows }, () => Array(logicalCols).fill(0));
  buildings = generateBuildings();
  citizens = generateCitizens();
}

function draw() {
  background(255);

  // Dibujar mapa
  for (let row = 0; row < logicalRows; row++) {
    for (let col = 0; col < logicalCols; col++) {
      let x = col * CELL_SIZE + MARGIN;  // Aplicar margen izquierdo
      let y = row * CELL_SIZE + MARGIN;  // Aplicar margen superior

      // Terreno
      if (terrain[row][col] === 1) {
        fill(0, 120, 200);
      } else if (terrain[row][col] === 2) {
        fill(100, 100, 100);
      } else if (terrain[row][col] === 3) {
        fill(34, 139, 34);
      } else {
        if (zones[row][col] === 1) {
          fill(240, 210, 180);
        } else if (zones[row][col] === 2) {
          fill(255, 50, 50);
        } else if (zones[row][col] === 3) {
          fill(80, 80, 80);
        } else {
          fill(200, 200, 180);
        }
      }

      rect(x, y, CELL_SIZE, CELL_SIZE);

      // Edificios
      let building = buildings[row][col];
      if (building) {
        if (building.underConstruction) {
          fill(150, 150, 150);
          rect(x + 2, y + 2 + (1 - building.constructionProgress) * CELL_SIZE, CELL_SIZE - 4, building.constructionProgress * CELL_SIZE - 4);
        } else {
          fill(240, 210, 180);
          rect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        }
      }

      // Carreteras
      if (roads[row][col] > 0) {
        fill(40, 40, 40);
        rect(x, y, CELL_SIZE, CELL_SIZE);
      }
    }
  }

  // Dibujar ciudadanos
  for (let citizen of citizens) {
    citizen.update();
    citizen.draw();
  }

  // Dibujar panel de información
  drawInfoPanel();

  // Actualizar tiempo
  timeCounter++;

  // Actualizar construcciones (menos frecuente para ahorrar recursos)
  if (frameCount % 10 === 0) {  // Actualizar cada 10 fotogramas
    for (let row = 0; row < logicalRows; row++) {
      for (let col = 0; col < logicalCols; col++) {
        let building = buildings[row][col];
        if (building && building.underConstruction) {
          building.constructionProgress += 0.005; // Velocidad de construcción
          if (building.constructionProgress >= 1.0) {
            building.underConstruction = false;
          }
        }
      }
    }
  }
}

function calculateDimensions() {
  // Calcular el tamaño del mapa y las celdas
  mapWidth = windowWidth - INFO_PANEL_WIDTH - 2 * MARGIN;  // Restar el margen izquierdo y derecho
  mapHeight = windowHeight - 2 * MARGIN;  // Restar el margen superior e inferior

  // Calcular el número de filas y columnas basado en el tamaño fijo de las celdas
  logicalCols = Math.floor(mapWidth / CELL_SIZE);
  logicalRows = Math.floor(mapHeight / CELL_SIZE);
}

function generateTerrain() {
  let terrain = Array.from({ length: logicalRows }, () => Array(logicalCols).fill(0));
  let noise = Array.from({ length: logicalRows }, () => Array.from({ length: logicalCols }, () => Math.random()));

  // Río serpenteante
  let riverCurve = Array.from({ length: logicalRows }, (_, i) => Math.sin((i / logicalRows) * 4 * Math.PI));
  let riverCol = riverCurve.map(val => Math.floor(logicalCols / 2 + val * logicalCols * 0.15));
  riverCol = riverCol.map(val => Math.max(20, Math.min(logicalCols - 20, val)));

  for (let row = 0; row < logicalRows; row++) {
    let startCol = Math.max(0, riverCol[row] - 3);
    let endCol = Math.min(logicalCols, riverCol[row] + 4);
    for (let col = startCol; col < endCol; col++) {
      terrain[row][col] = 1;
    }
  }

  // Montañas
  for (let row = 0; row < logicalRows; row++) {
    for (let col = 0; col < logicalCols; col++) {
      if (Math.random() > 0.88 && row < logicalRows * 0.4) {
        terrain[row][col] = 2;
      }
    }
  }

  // Bosques
  for (let row = 0; row < logicalRows; row++) {
    for (let col = 0; col < logicalCols; col++) {
      if (noise[row][col] > 0.6 && terrain[row][col] === 0 && Math.random() > 0.75) {
        terrain[row][col] = 3;
      }
    }
  }

  return terrain;
}

function autoZone() {
  let zones = Array.from({ length: logicalRows }, () => Array(logicalCols).fill(0));
  let commercialValue = Array.from({ length: logicalRows }, () => Array(logicalCols).fill(0));

  for (let row = 0; row < logicalRows; row++) {
    for (let col = 0; col < logicalCols; col++) {
      if (terrain[row][col] !== 0) continue;

      let neighbors = terrain.slice(Math.max(0, row - 5), Math.min(logicalRows, row + 6))
                            .map(r => r.slice(Math.max(0, col - 5), Math.min(logicalCols, col + 6)));
      commercialValue[row][col] = neighbors.flat().filter(val => val === 0).length / 121;
    }
  }

  let residentialCount = 0;
  let commercialCount = 0;
  let industrialCount = 0;

  let maxResidential = Math.floor(logicalRows * logicalCols * 0.3);
  let maxCommercial = Math.floor(logicalRows * logicalCols * 0.2);

  for (let row = 0; row < logicalRows; row++) {
    for (let col = 0; col < logicalCols; col++) {
      if (terrain[row][col] !== 0) continue;

      if (commercialValue[row][col] > 0.25 && commercialCount < maxCommercial) {
        zones[row][col] = 2;
        commercialCount++;
      } else if (row < logicalRows / 1.5 && residentialCount < maxResidential) {
        zones[row][col] = 1;
        residentialCount++;
      } else {
        zones[row][col] = 3;
        industrialCount++;
      }
    }
  }

  return zones;
}

function buildRoads() {
  let roads = Array.from({ length: logicalRows }, () => Array(logicalCols).fill(0));

  // Autopista principal
  let mainHighwayRow = Math.floor(logicalRows / 2);
  for (let row = mainHighwayRow - 1; row <= mainHighwayRow + 1; row++) {
    for (let col = 0; col < logicalCols; col++) {
      roads[row][col] = 2;
    }
  }

  // Calles comerciales
  let commercialAreas = [];
  for (let row = 0; row < logicalRows; row++) {
    for (let col = 0; col < logicalCols; col++) {
      if (zones[row][col] === 2) {
        commercialAreas.push([row, col]);
      }
    }
  }

  for (let i = 0; i < Math.floor(commercialAreas.length / 3); i++) {
    let [row, col] = commercialAreas[i];
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (r >= 0 && r < logicalRows && c >= 0 && c < logicalCols) {
          roads[r][c] = 1;
        }
      }
    }
  }

  return roads;
}

function generateBuildings() {
  let buildings = Array.from({ length: logicalRows }, () => Array(logicalCols).fill(null));

  for (let row = 0; row < logicalRows; row++) {
    for (let col = 0; col < logicalCols; col++) {
      if (zones[row][col] !== 0 && terrain[row][col] === 0) {
        buildings[row][col] = new Building(zones[row][col]);
      }
    }
  }

  return buildings;
}

function generateCitizens() {
  let citizens = [];
  let residential = [];
  let commercial = [];
  let industrial = [];

  for (let row = 0; row < logicalRows; row++) {
    for (let col = 0; col < logicalCols; col++) {
      if (zones[row][col] === 1) residential.push([row, col]);
      if (zones[row][col] === 2) commercial.push([row, col]);
      if (zones[row][col] === 3) industrial.push([row, col]);
    }
  }

  // Sistema de respaldo para zonas vacías
  if (residential.length === 0) residential = industrial;
  if (commercial.length === 0) commercial = residential;
  if (industrial.length === 0) industrial = commercial;

  for (let i = 0; i < 50; i++) {  // Reducir el número de ciudadanos
    if (residential.length > 0) {
      let home = residential[Math.floor(Math.random() * residential.length)];
      let workType = Math.random() < 0.5 ? commercial : industrial;
      if (workType.length > 0) {
        let work = workType[Math.floor(Math.random() * workType.length)];
        citizens.push(new Citizen(home, work));
      }
    }
  }

  return citizens;
}

class Citizen {
  constructor(home, work) {
    this.home = home;
    this.work = work;
    this.path = this.calculatePath();
    this.currentStep = 0;
    this.progress = 0.0;
    this.speed = 2.5;
  }

  calculatePath() {
    // Implementación simplificada de A* para el camino
    let path = [];
    let current = this.home;
    while (current[0] !== this.work[0] || current[1] !== this.work[1]) {
      if (current[0] < this.work[0]) current[0]++;
      else if (current[0] > this.work[0]) current[0]--;
      if (current[1] < this.work[1]) current[1]++;
      else if (current[1] > this.work[1]) current[1]--;
      path.push([current[0], current[1]]);
    }
    return path;
  }

  update() {
    if (this.currentStep < this.path.length - 1) {
      this.progress += this.speed * (deltaTime / 1000);
      if (this.progress >= 1.0) {
        this.progress = 0.0;
        this.currentStep++;
      }
    }
  }

  draw() {
    let x = this.path[this.currentStep][1] * CELL_SIZE + MARGIN;  // Aplicar margen izquierdo
    let y = this.path[this.currentStep][0] * CELL_SIZE + MARGIN;  // Aplicar margen superior
    fill(255, 0, 0);
    ellipse(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2, CELL_SIZE / 2);
  }
}

class Building {
  constructor(zoneType) {
    this.zoneType = zoneType;
    this.constructionProgress = 0.0;
    this.underConstruction = true;
    this.size = [1, 1, 1, 2][Math.floor(Math.random() * 4)];
    this.colorVariation = Math.floor(Math.random() * 2);
  }
}

function drawInfoPanel() {
  let panelX = mapWidth + 2 * MARGIN;  // Aplicar margen izquierdo
  let panelWidth = INFO_PANEL_WIDTH;
  let panelHeight = windowHeight - 2 * MARGIN;  // Aplicar margen superior e inferior

  // Fondo del panel
  fill(30, 40, 50);
  rect(panelX, MARGIN, panelWidth, panelHeight);

  // Configurar fuentes escalables
  textSize(16);  // Tamaño de fuente fijo
  fill(255);

  // Título
  text("Estadísticas", panelX + 10, MARGIN + 30);

  // Estadísticas
  let stats = [
    `Población: ${citizens.length}`,
    `Tiempo: ${Math.floor(timeCounter / 60)}:${timeCounter % 60}`,
    `Residencial: ${zones.flat().filter(z => z === 1).length}`,
    `Comercial: ${zones.flat().filter(z => z === 2).length}`,
    `Industrial: ${zones.flat().filter(z => z === 3).length}`,
    `Edificios: ${buildings.flat().filter(b => b && !b.underConstruction).length}`
  ];

  let yPos = MARGIN + 60;
  for (let stat of stats) {
    text(stat, panelX + 10, yPos);
    yPos += 20;  // Espaciado fijo
  }

  // Barra de contaminación
  let pollutionLevel = pollution.flat().reduce((a, b) => a + b, 0) / (logicalRows * logicalCols);
  let barWidth = panelWidth - 20;
  fill(50, 50, 50);
  rect(panelX + 10, yPos + 10, barWidth, 10);
  fill(50, 200, 50);
  rect(panelX + 10, yPos + 10, barWidth * (1 - pollutionLevel), 10);
}