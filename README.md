City Mini Simulator
Captura de pantalla de la aplicación <!-- Si tienes una captura de pantalla, puedes agregarla aquí -->

Descripción
City Mini Simulator es una aplicación de simulación de ciudad en tiempo real que permite a los usuarios observar cómo se genera una ciudad virtual con zonas residenciales, comerciales e industriales, carreteras, edificios en construcción y ciudadanos que se mueven entre sus hogares y lugares de trabajo. La aplicación incluye un panel de estadísticas que muestra información en tiempo real sobre la ciudad.

Características Principales
Generación de Terreno: El terreno se genera automáticamente con ríos, montañas y bosques.

Zonificación Automática: Las zonas residenciales, comerciales e industriales se asignan automáticamente en función del terreno.

Construcción de Carreteras: Se generan carreteras principales y calles secundarias para conectar las zonas.

Edificios en Construcción: Los edificios se construyen progresivamente y muestran su estado de construcción.

Ciudadanos: Los ciudadanos se mueven entre sus hogares y lugares de trabajo utilizando un sistema de rutas simplificado.

Panel de Estadísticas: Muestra información en tiempo real sobre la población, el tiempo, las zonas y la contaminación.

Interfaz Responsiva: La interfaz se ajusta para mantener un tamaño fijo en todos los elementos, independientemente del tamaño de la ventana.

Estructura del Proyecto
El proyecto consta de tres archivos principales:

1. index.html
Este archivo es el punto de entrada de la aplicación. Define la estructura básica de la página web y carga los recursos necesarios, como el archivo CSS y el archivo JavaScript.

html
Copy
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SimCity HD - Redimensionable</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
  <script src="sketch.js"></script>
</head>
<body>
  <div id="container">
    <h1>City mini Simulator</h1>
    <div id="canvas-container"></div>
  </div>
</body>
</html>
Run HTML
2. sketch.js
Este archivo contiene la lógica principal de la aplicación. Utiliza la biblioteca p5.js para renderizar el mapa, las zonas, los edificios, los ciudadanos y el panel de estadísticas. También maneja la generación del terreno, la zonificación automática, la construcción de carreteras y la simulación en tiempo real.

javascript
Copy
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

// ... (resto del código)
3. style.css
Este archivo define los estilos CSS para la interfaz de la aplicación. Asegura que el lienzo y los elementos de la interfaz se muestren correctamente y se ajusten al tamaño de la ventana.

css
Copy
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
  }
  
  #container {
    text-align: center;
  }
  
  h1 {
    color: #333;
    margin-bottom: 20px;
  }
  
  #canvas-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border: 2px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
Cómo Ejecutar la Aplicación
Clona el Repositorio:

bash
Copy
git clone https://github.com/tu-usuario/city-mini-simulator.git
cd city-mini-simulator
Abre el Archivo index.html:

Abre el archivo index.html en tu navegador web.

Interactúa con la Aplicación:

Observa cómo la ciudad se genera automáticamente.

Mira a los ciudadanos moverse entre sus hogares y lugares de trabajo.

Consulta el panel de estadísticas para ver el progreso de la ciudad.

Requisitos del Sistema
Navegador Web: La aplicación está diseñada para ejecutarse en navegadores modernos (Chrome, Firefox, Edge, etc.).

JavaScript: La aplicación utiliza JavaScript y la biblioteca p5.js para la renderización gráfica.

Tecnologías Utilizadas
JavaScript: Lenguaje de programación principal.

p5.js: Biblioteca de JavaScript para renderización gráfica.

HTML/CSS: Para la estructura y el diseño de la interfaz.

Capturas de Pantalla
<!-- Si tienes capturas de pantalla, puedes agregarlas aquí -->
Captura de pantalla 1
Captura de pantalla 2

Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

Contribuciones
¡Las contribuciones son bienvenidas! Si deseas mejorar el proyecto, sigue estos pasos:

Haz un fork del repositorio.

Crea una rama para tu feature (git checkout -b feature/nueva-feature).

Realiza tus cambios y haz commit (git commit -m 'Agrega nueva feature').

Haz push a la rama (git push origin feature/nueva-feature).

Abre un Pull Request.

Contacto
Si tienes alguna pregunta o sugerencia, no dudes en contactarme:

Nombre: [Tu Nombre]

Email: [tu-email@example.com]

GitHub: tu-usuario

¡Gracias por usar City Mini Simulator! Esperamos que disfrutes observando cómo se desarrolla tu ciudad virtual. 🏙️🚀
