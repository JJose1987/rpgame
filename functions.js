/* JavaScript */
/* Enlaces de referencia para la codificación y los caracteres Unicode utilizados para dibujar las piezas */
/* https://www.degraeve.com/reference/urlencoding.php */
/* https://www.compart.com/en/unicode/ */
/* https://codepoints.net/ */
// Variables globales
var h, w; // Variables pensadas para almacenar el alto (height) y ancho (width) de la ventana (no se usan activamente abajo)
var canvas, ctx; // Variables para referenciar el elemento HTML canvas y su contexto de dibujo 2D

const squares = 8; // Define que el tablero de juego principal es de 8x8 casillas
const margin  = 1; // Define un margen de 1 casilla alrededor del tablero (haciendo una cuadrícula real de 10x10)

let boardSize  = 0; // Almacenará el tamaño total del tablero en píxeles (se calcula dinámicamente)
let squareSize = 0; // Almacenará el tamaño en píxeles de cada casilla individual

// Objeto principal que guarda el estado de la partida
var board = {
    // Configuración inicial del jugador
    player_one: {
        col: 4, // Posición inicial en la columna 4
        row: 4, // Posición inicial en la fila 4
        src: "0x26C2", // Código Unicode para la pieza (símbolo visual)
        color: '#000000', // Color del jugador (negro)
        walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], // Movimientos posibles (como el Rey: 1 paso en cualquier dirección)
        stamina : 2, // Energía actual para moverse
        life : 3, // Vidas actuales
        maxStamina : 2, // Energía máxima por turno
        maxLife : 3, // Vidas máximas
        move : false, // Booleano que indica si el jugador ha seleccionado su pieza para moverse
        point: 0 // Puntuación actual
    },
    enemies: [] // Array vacío donde se irán guardando los enemigos que aparezcan en el tablero
};

// Catálogo de todas las piezas (enemigos) que pueden aparecer en el juego
var typePieces = [
    // Piezas Negras (Peón, Caballo, Alfil, Torre, Reina, Rey)
    // Cada objeto define su símbolo (src), color, cantidad disponible en la "bolsa" (count), patrón de movimiento (walk), vida, daño y puntos que otorga al matarlo.
    {src: "0x265F", color: '#000000', count: 8, walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1, point: 01}  // Peón negro (8 copias)
  , {src: "0x265E", color: '#000000', count: 2, walk: [[+2, +1], [+2, -1], [-2, +1], [-2, -1], [+1, +2], [-1, +2], [+1, -2], [-1, -2]], stamina : 1, life : 1, point: 03}  // Caballo negro (2 copias)
  // (Nota: El alfil tiene todos los movimientos diagonales posibles mapeados)
  , {src: "0x265D", color: '#000000', count: 2, walk: [[+1, +1], [+1, -1], [-1, -1], [-1, +1], [+2, +2], [+2, -2], [-2, -2], [-2, +2], [+3, +3], [+3, -3], [-3, -3], [-3, +3], [+4, +4], [+4, -4], [-4, -4], [-4, +4], [+5, +5], [+5, -5], [-5, -5], [-5, +5], [+6, +6], [+6, -6], [-6, -6], [-6, +6], [+7, +7], [+7, -7], [-7, -7], [-7, +7], [+8, +8], [+8, -8], [-8, -8], [-8, +8]], stamina : 1, life : 1, point: 03} // Alfil negro
  // (Nota: La torre tiene todos los movimientos ortogonales mapeados)
  , {src: "0x265C", color: '#000000', count: 2, walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -8], [+2, +0], [-2, +0], [+0, +2], [+0, -7], [+3, +0], [-3, +0], [+0, +3], [+0, -6], [+4, +0], [-4, +0], [+0, +4], [+0, -5], [+5, +0], [-5, +0], [+0, +5], [+0, -4], [+6, +0], [-6, +0], [+0, +6], [+0, -3], [+7, +0], [-7, +0], [+0, +7], [+0, -2], [+8, +0], [-8, +0], [+0, +8], [+0, -1]], stamina : 1, life : 1, point: 05} // Torre negra
  // (Nota: La Reina combina Torre y Alfil)
  , {src: "0x265B", color: '#000000', count: 1, walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1], [+2, +0], [-2, +0], [+0, +2], [+0, -2], [+2, +2], [-2, +2], [-2, -2], [+2, -2], [+3, +0], [-3, +0], [+0, +3], [+0, -3], [+3, +3], [-3, +3], [-3, -3], [+3, -3], [+4, +0], [-4, +0], [+0, +4], [+0, -4], [+4, +4], [-4, +4], [-4, -4], [+4, -4], [+5, +0], [-5, +0], [+0, +5], [+0, -5], [+5, +5], [-5, +5], [-5, -5], [+5, -5], [+6, +0], [-6, +0], [+0, +6], [+0, -6], [+6, +6], [-6, +6], [-6, -6], [+6, -6], [+7, +0], [-7, +0], [+0, +7], [+0, -7], [+7, +7], [-7, +7], [-7, -7], [+7, -7], [+8, +0], [-8, +0], [+0, +8], [+0, -8], [+8, +8], [-8, +8], [-8, -8], [+8, -8]], stamina : 1, life : 1, point: 09}  // Reina negra
  , {src: "0x265A", color: '#000000', count: 1, walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1, point: 10} // Rey negro

    // Piezas Blancas (Mismos atributos que las negras pero con color blanco)
  , {src: "0x265F", color: '#ffffff', count: 8, walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1, point: 01}  // Peón blanco
  , {src: "0x265E", color: '#ffffff', count: 2, walk: [[+2, +1], [+2, -1], [-2, +1], [-2, -1], [+1, +2], [-1, +2], [+1, -2], [-1, -2]], stamina : 1, life : 1, point: 03}  // Caballo blanco
  , {src: "0x265D", color: '#ffffff', count: 2, walk: [[+1, +1], [+1, -1], [-1, -1], [-1, +1], [+2, +2], [+2, -2], [-2, -2], [-2, +2], [+3, +3], [+3, -3], [-3, -3], [-3, +3], [+4, +4], [+4, -4], [-4, -4], [-4, +4], [+5, +5], [+5, -5], [-5, -5], [-5, +5], [+6, +6], [+6, -6], [-6, -6], [-6, +6], [+7, +7], [+7, -7], [-7, -7], [-7, +7], [+8, +8], [+8, -8], [-8, -8], [-8, +8]], stamina : 1, life : 1, point: 03} // Alfil blanco
  , {src: "0x265C", color: '#ffffff', count: 2, walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -8], [+2, +0], [-2, +0], [+0, +2], [+0, -7], [+3, +0], [-3, +0], [+0, +3], [+0, -6], [+4, +0], [-4, +0], [+0, +4], [+0, -5], [+5, +0], [-5, +0], [+0, +5], [+0, -4], [+6, +0], [-6, +0], [+0, +6], [+0, -3], [+7, +0], [-7, +0], [+0, +7], [+0, -2], [+8, +0], [-8, +0], [+0, +8], [+0, -1]], stamina : 1, life : 1, point: 05} // Torre blanca
  , {src: "0x265B", color: '#ffffff', count: 1, walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1], [+2, +0], [-2, +0], [+0, +2], [+0, -2], [+2, +2], [-2, +2], [-2, -2], [+2, -2], [+3, +0], [-3, +0], [+0, +3], [+0, -3], [+3, +3], [-3, +3], [-3, -3], [+3, -3], [+4, +0], [-4, +0], [+0, +4], [+0, -4], [+4, +4], [-4, +4], [-4, -4], [+4, -4], [+5, +0], [-5, +0], [+0, +5], [+0, -5], [+5, +5], [-5, +5], [-5, -5], [+5, -5], [+6, +0], [-6, +0], [+0, +6], [+0, -6], [+6, +6], [-6, +6], [-6, -6], [+6, -6], [+7, +0], [-7, +0], [+0, +7], [+0, -7], [+7, +7], [-7, +7], [-7, -7], [+7, -7], [+8, +0], [-8, +0], [+0, +8], [+0, -8], [+8, +8], [-8, +8], [-8, -8], [+8, -8]], stamina : 1, life : 1, point: 09}  // Reina blanca
  , {src: "0x265A", color: '#ffffff', count: 1, walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1, point: 10} // Rey blanco
];

var typeWeapons = [
    {src: "0x1F5E1"  }
  , {src: "0x1F3F9"  }
  , {src: "0x1F6E1"  }
  , {src: "0x2694"   }
  , {src: "0x1F525"  }
  , {src: "0x1FA93"  }
  , {src: "0x1F432"  }
  , {src: "0x1F356"  }
];


var arrayDice = [
    {src: "0x2680" , value: 1}
  , {src: "0x2681" , value: 2}
  , {src: "0x2682" , value: 3}
  , {src: "0x2683" , value: 4}
  , {src: "0x2684" , value: 5}
  , {src: "0x2685" , value: 6}
];

var WeaponSkill = [
    {src: "0x2398"   }
  , {src: "0x1F3B2"  }
  , {src: "0x1F3AF"  }
  , {src: "0x1F480"  }
]

// Funciones principales
function main() {
    canvas = $('#board')[0]; // Obtiene el elemento canvas del DOM usando jQuery
    ctx = canvas.getContext('2d'); // Obtiene el contexto 2D para poder dibujar en él

    $(window).on('resize orientationchange', resizeCanvas); // Escucha eventos de cambio de tamaño de ventana para ajustar el tablero
    // Evento que detecta cuando el usuario hace clic en el tablero
    $('#board').on('click', function(e) {
        var c = e.pageX - ($(this).offset()).left; // Calcula la coordenada X del clic relativa al canvas
        var r = e.pageY - ($(this).offset()).top;  // Calcula la coordenada Y del clic relativa al canvas
        clickBoard(c, r); // Llama a la función que procesa el clic
    });

    // Evento que detecta el movimiento del ratón sobre el tablero
    $('#board').on('mousemove', function(e) {
        var c = e.pageX - ($(this).offset()).left; // Coordenada X relativa
        var r = e.pageY - ($(this).offset()).top;  // Coordenada Y relativa
        mousemoveBoard(c, r); // Llama a la función que procesa el movimiento (actualmente vacía)
    });

    // --- Lógica para forzar la aparición del primer enemigo al iniciar ---
    var ind  = Math.floor(Math.random() * typePieces.length); // Elige un tipo de enemigo al azar
    var edge = Math.random() < 0.5 ? 1 : squares; // Decide un borde exterior (fila/col 1 o la máxima)
    var mid  = 1 + Math.floor(Math.random() * squares); // Decide una posición central aleatoria
    var flip = Math.random() < 0.5; // Moneda al aire para decidir si nace en el eje X o Y
    // Añade el primer enemigo al array de enemigos activos
    board.enemies.push({col: flip ? edge : mid, row: flip ? mid : edge, color: typePieces[ind].color, src: typePieces[ind].src, walk: typePieces[ind].walk});
    typePieces[ind].count = typePieces[ind].count - 1; // Resta 1 al inventario global de esa pieza

    // Si es un Rey saldra una pieza extra
    while (board.enemies.at(-1)['src'] == '0x265A' || board.enemies.at(-1)['src'] == '0x265B') {
        addEnemies(board.enemies.at(-1)['color']);
    }

    update(); // Llama a la función de actualización inicial
}

// Función auxiliar (no se usa activamente en el flujo principal del código)
function set(object) {
    var index = $(object).attr('name'); // Obtiene el nombre del objeto jQuery
    update(); // Fuerza un renderizado
}

// Función para actualizar y dibujar
function update() {
    resizeCanvas(); // Ajusta el tamaño de la pantalla, lo cual internamente llama a draw()
}

// Redimensionar el Canvas para que sea responsivo
function resizeCanvas() {
    // Calcula el tamaño del tablero: 90% del lado más pequeño de la ventana
    boardSize = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    const dpr = window.devicePixelRatio || 1; // Obtiene el ratio de píxeles (para pantallas de alta resolución/retina)

    // Ajusta el tamaño real de los píxeles del canvas
    canvas.width = boardSize * dpr;
    canvas.height = boardSize * dpr;
    // Ajusta el tamaño visual del canvas mediante CSS
    canvas.style.width = boardSize + 'px';
    canvas.style.height = boardSize + 'px';

    // Escala el contexto para que los dibujos coincidan con el ratio de píxeles
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Calcula el tamaño en píxeles de una sola casilla (tablero + 2 de margen)
    squareSize = boardSize / (squares + (margin * 2));

    draw(); // Llama a la función de renderizado principal
}

// Función principal de renderizado y lógica de turnos de enemigos
function draw() {
    // 1. Limpia todo el canvas para dibujar el nuevo fotograma
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. Dibuja las casillas del tablero de ajedrez
    drawBoard();
    
    // 3. Verifica si el jugador sigue vivo
    if (board.player_one.life > 0) {
        
        // --- TURNO DE LOS ENEMIGOS ---
        // Si el jugador se ha quedado sin stamina, es el turno de la IA (los enemigos)
        if (board.player_one.stamina == 0) {
            
            // Itera sobre cada enemigo presente en el tablero
            $.each(board.enemies, function(index, value) {
                let bestMove = { col: value.col, row: value.row }; // Inicializa el mejor movimiento a su posición actual
                let minDistance = Math.hypot(board.player_one.col - value.col, board.player_one.row - value.row); // Distancia actual al jugador
                let hasAttacked = false; // Flag para saber si el enemigo ataca en este turno

                // Evalúa cada movimiento posible que puede hacer esa pieza de ajedrez
                $.each(value.walk, function(i, step) {
                    let futureCol = value.col + step[0]; // Columna destino
                    let futureRow = value.row + step[1]; // Fila destino

                    // Verifica que la casilla destino está dentro del tablero jugable (1 a 8)
                    if (futureCol >= 1 && futureCol <= squares && futureRow >= 1 && futureRow <= squares) {

                        // 3. No mover a la casilla EXACTA del jugador (dejarlo a su alrededor)

                        // Si el enemigo puede moverse EXACTAMENTE a la casilla del jugador, lo ataca
                        if (futureCol === board.player_one.col && futureRow === board.player_one.row) {
                            board.player_one.life -= 1; // Le quita una vida al jugador
                            hasAttacked = true; // Marca que atacó
                            return false; // Detiene el bucle `.each` para esta pieza (ya no busca más movimientos)
                        }

                        // Si el movimiento no es un ataque directo, busca acercarse
                        if (!(futureCol === board.player_one.col && futureRow === board.player_one.row)) {

                            // Calcula la distancia desde la casilla futura hasta el jugador
                            let dist = Math.hypot(board.player_one.col - futureCol, board.player_one.row - futureRow);

                            // Si este movimiento lo acerca más que el anterior
                            if (dist < minDistance) {
                                let collision = false; // Flag para evitar que dos enemigos se pisen
                                // Comprueba que la casilla futura no esté ocupada por otro enemigo
                                $.each(board.enemies, function(idx, other) {
                                    if (index !== idx && other.col === futureCol && other.row === futureRow) {
                                        collision = true;
                                        return false; // Sale del bucle de colisión
                                    }
                                });

                                // Si está libre, este es temporalmente el mejor movimiento
                                if (!collision) {
                                    minDistance = dist;
                                    bestMove = { col: futureCol, row: futureRow };
                                }
                            }
                        }
                    }
                });

                // Al final de la evaluación, si el enemigo no atacó, se mueve a la mejor casilla encontrada
                if (!hasAttacked) {
                    value.col = bestMove.col;
                    value.row = bestMove.row;
                }
            });

            // Añade nuevos enemigos al final del turno
            addEnemies();
            
            // Regla especial: Si hay un Rey (0x265A) o Reina (0x265B) en el tablero, hace "spawn" de una pieza extra
            var conKQ = $.grep(board.enemies, function(item) {
                return (item.src == '0x265A' || item.src == '0x265B');
            });

            if (conKQ.length > 0) {
                $.each(conKQ, function(index, value) {
                    addEnemies(value.color); // Spawnea un enemigo del mismo color que el Rey/Reina
                });
            }

            // Restaura la energía (stamina) del jugador para que empiece su turno
            board.player_one.stamina = board.player_one.maxStamina;
        }

        // --- DIBUJADO DE ESTADOS Y PERSONAJES ---
        // Si es el turno del jugador y ha hecho clic en su pieza (move == true)
        if (board.player_one.move == true && board.player_one.stamina > 0) {
            // Dibuja un cuadrado verde oscuro para resaltar que el jugador está seleccionado
            ctx.beginPath();
            ctx.fillStyle = '#829769';
            ctx.fillRect((board.player_one.col * squareSize), (board.player_one.row * squareSize), squareSize, squareSize);
            ctx.fill();
        }
        
        // Dibuja al jugador y los polígonos que indican sus movimientos posibles
        drawPlayer(board.player_one, board.enemies);

        // Dibuja a cada uno de los enemigos
        $.each(board.enemies, function(index, value) {
            drawPlayer(value, [board.player_one]); // Pasa al jugador como "colisión" para el enemigo
        });

    }

    // --- DIBUJADO DE LA INTERFAZ DE USUARIO (HUD) ---
    if (board.player_one.life > 0) {
        // Dibuja los corazones (Vidas) en la parte superior izquierda (margen)
        for (let l = 0; l < board.player_one.life; l++) {
            ctx.beginPath();
            ctx.font         = (squareSize / 2) + 'px Consolas';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle    = '#ff0000'; // Color rojo
            ctx.fillText(String.fromCodePoint('0x2665'), squareSize + (l * squareSize / 2), (squareSize / 5)); // 0x2665 es un corazón
            ctx.fill();
        }

        // Dibuja los diamantes (Stamina) debajo de las vidas
        for (let s = 0; s < board.player_one.stamina; s++) {
            ctx.beginPath();
            ctx.font         = (squareSize / 2) + 'px Consolas';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle    = '#0000ff'; // Color azul
            ctx.fillText(String.fromCodePoint('0x2666'), squareSize + (s * squareSize / 2), (squareSize / 1.5)); // 0x2666 es un diamante
            ctx.fill();
        }

        // Dibuja la palabra "POINTS" en la parte superior derecha
        var texto = {value: 'POINTS  ', width: 0};
        texto.width = obtenerAnchoTexto(texto.value, (squareSize * 0.5) + 'px Consolas');

        ctx.beginPath();
        ctx.font         = (squareSize * 0.5) + 'px Consolas';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = '#ffffff'; // Color blanco
        ctx.fillText(texto.value, (squareSize * (squares + 2 * margin)) - texto.width, squareSize * 0.25);
        ctx.fill();

        // Dibuja la puntuación numérica (con ceros a la izquierda, ej: 00000150)
        texto = {value: ('00000000' + board.player_one.point).slice(-8), width: 0};
        texto.width = obtenerAnchoTexto(texto.value, (squareSize * 0.5) + 'px Consolas');

        ctx.beginPath();
        ctx.font         = (squareSize * 0.5) + 'px Consolas';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = '#ffffff';
        ctx.fillText(texto.value, (squareSize * (squares + 2 * margin)) - texto.width, squareSize * 0.75);
        ctx.fill();
    } else if (board.player_one.life <= 0) {
        // --- PANTALLA DE GAME OVER ---
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia la pantalla
        drawBoard(); // Dibuja el tablero vacío
        
        // Texto "GAME OVER"
        ctx.beginPath();
        ctx.font         = squareSize + 'px Consolas';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = '#ffffff';
        ctx.fillText('GAME OVER', squareSize * 3.5, squareSize * 0.5);
        ctx.fill();

        // Dibuja un símbolo de "Reiniciar" (0x2B6E - Flecha circular) donde murió el jugador
        ctx.beginPath();
        ctx.font         = squareSize + 'px Consolas';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = '#000000';

        var x = squareSize * ((board.player_one.row + 0.5) + (board.player_one.row * 0.02));
        var y = squareSize * (board.player_one.col + 0.5);

        ctx.fillText(String.fromCodePoint('0x2B6E'), y, x);
        ctx.fill();
    }
}

// Dibujar el tablero a cuadros
function drawBoard() {
    // Itera por filas y columnas (incluyendo los márgenes)
    for (let r = 0; r < squares + (margin * 2); r++) {
        for (let c = 0; c < squares + (margin * 2); c++) {
            // Solo dibuja cuadros en el área de juego (ignorando la fila/columna 0 y 9 que son márgenes)
            if (((r > 0) && (r < squares + 1)) && ((c > 0) && (c < squares + 1))) {
                // Alterna colores basado en si la suma de fila y columna es par o impar
                ctx.fillStyle = (r + c) % 2 === 0 ? '#f0d9b5' : '#b58863';
                ctx.fillRect(c * squareSize, r * squareSize, squareSize, squareSize);
            }
        }
    }
}

// Dibuja una pieza (Jugador o Enemigo) y sus marcas de movimiento posible
function drawPlayer(obj, collisions = null) {
    // Calcula el centro exacto de la casilla en píxeles
    var x = squareSize * ((obj.row + 0.5) + (obj.row * 0.02));
    var y = squareSize *  (obj.col + 0.5);

    // Dibuja los indicadores visuales de a dónde se puede mover la pieza
    $.each(obj.walk, function(index, value) {
        var c = obj.col + value[0]; // Columna posible
        var r = obj.row + value[1]; // Fila posible

        // Se asegura que la casilla posible esté dentro del tablero jugable
        if (((r > 0) && (r < squares + 1)) && ((c > 0) && (c < squares + 1))) {
            var collision = -1;

            // Revisa si en esa casilla destino ya hay una pieza (del array `collisions`)
            $.each(collisions, function(i, othervalue) {
                if (othervalue.col === c && othervalue.row === r) {
                    collision = i; // Guarda el índice del choque

                    // Si es el jugador comprobando movimientos y encuentra un enemigo, marca la casilla de color mostaza (indica que puede atacar ahí)
                    if (collisions[0] != board.player_one) {
                        ctx.beginPath();
                        ctx.fillStyle = '#aaa23a';
                        ctx.fillRect((othervalue.col * squareSize), (othervalue.row * squareSize), squareSize, squareSize);
                        ctx.fill();
                    }
                    return; // Detiene la búsqueda de colisiones para esta casilla
                }
            });

            // Si NO hay colisión con esa casilla...
            if (!(collision > -1)) {
                if (collisions[0] != board.player_one) {
                    // ... y somos el jugador, dibuja un hexágono verde como indicador de movimiento libre.
                    // (Nota: la función drawPoligon no está definida en este archivo, asumo que está en otro lado)
                    drawPoligon(ctx, {color    : '#829769'
                                    , colorLine: (r + c) % 2 === 0 ? '#b58863' : '#f0d9b5'
                                    , x        : ((c * squareSize) + squareSize / 2)
                                    , y        : ((r * squareSize) + squareSize / 2)
                                    , size     : (squareSize / 7)
                                    , sides    : 6  // Hexágono
                                    , fill     : true
                                    , rotate   : 90});
                } else {
                    // ... si son los enemigos, dibuja un triángulo mostaza (indica la amenaza de que ellos pueden pisar ahí)
                    drawPoligon(ctx, {color    : '#aaa23a'
                                    , colorLine: (r + c) % 2 === 0 ? '#b58863' : '#f0d9b5'
                                    , x        : ((c * squareSize) + squareSize / 2)
                                    , y        : ((r * squareSize) + squareSize / 2)
                                    , size     : (squareSize / 7)
                                    , sides    : 3  // Triángulo
                                    , fill     : true
                                    , rotate   : 90});
                }
            }
        }
    });

    // Dibuja el carácter Unicode (el símbolo de ajedrez en sí) en el centro de la casilla
    ctx.beginPath();
    ctx.font         = squareSize + 'px Consolas';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = obj.color;
    ctx.fillText(String.fromCodePoint(obj.src), y, x);
    ctx.fill();
}

// Maneja la lógica al hacer clic en el tablero
function clickBoard(c = 0, r = 0) {
    // Convierte las coordenadas del ratón en píxeles a filas y columnas de la cuadrícula
    var aux_r = parseInt(r / squareSize);
    var aux_c = parseInt(c / squareSize);

    // Caso A: El jugador ya tiene su pieza seleccionada (lista para moverse) y tiene energía
    if (board.player_one.move == true && board.player_one.stamina > 0) {
        // Itera sobre los movimientos permitidos del jugador
        $.each(board.player_one.walk, function(index, value) {
            // Verifica si la casilla clicada coincide con un movimiento válido
            if (aux_r == (value[1] + board.player_one.row) && aux_c == (value[0] + board.player_one.col)) {
                // Verifica que el clic fue dentro de los límites jugables del tablero
                if (((aux_r > 0) && (aux_r < squares + 1)) && ((aux_c > 0) && (aux_c < squares + 1))) {
                    board.player_one.move = false; // Deselecciona la pieza tras moverse
                    board.player_one.stamina -= 1; // Resta una unidad de energía

                    // Detectamos si el movimiento es a una casilla ocupada por un enemigo
                    var collision = -1;

                    $.each(board.enemies, function(i, othervalue) {
                        // Si otro enemigo YA está en la casilla a la que quiero ir
                        if (othervalue.col === aux_c && othervalue.row === aux_r) {
                            collision = i; // Guarda el índice del enemigo atacado
                            return; 
                        }
                    });
                    // Si pisó a un enemigo (lo mató)
                    if (collision > -1) {
                        // Busca de qué tipo de pieza enemiga se trata en la bolsa general
                        $.each(typePieces, function(ind, item) {
                            if ((board.enemies[collision].color == typePieces[ind].color)
                                    && (board.enemies[collision].src == typePieces[ind].src)) {
                                
                                typePieces[ind].count = typePieces[ind].count + 1; // Devuelve la pieza al inventario global para que pueda reaparecer después
                                // Suma los puntos del enemigo al marcador del jugador
                                board.player_one.point = board.player_one.point + typePieces[ind].point;

                                return;
                            }
                        });
                        // Elimina la pieza muerta del array de enemigos activos
                        board.enemies.splice(collision, 1);
                    }

                    // Actualiza la posición del jugador a la nueva casilla
                    board.player_one.col = aux_c;
                    board.player_one.row = aux_r;

                    draw(); // Redibuja el tablero con los cambios
                    return;  // Rompemos el bucle interno, ya encontramos un choque
                }
            }
        });
    // Caso B: El jugador hace clic en su propia casilla
    } else if (aux_r == board.player_one.row && board.player_one.col == aux_c) {
        if (board.player_one.life > 0) {
            board.player_one.move = true; // Selecciona la pieza para moverla
        } else {
            // Si está muerto (Game Over) y hace clic en sí mismo, se reinicia la partida
            board.player_one.life    = board.player_one.maxLife;
            board.player_one.stamina = board.player_one.maxStamina;

            board.enemies            = []; // Borra a los enemigos
            board.point              = 0;  // Reinicia puntos (Ojo: aquí la variable correcta sería board.player_one.point, esto parece un pequeño bug en el código original)
        }
        draw(); // Redibuja
    }
}

// Función vacía preparada para manejar efectos de 'hover' del ratón en el futuro
function mousemoveBoard(c = 0, r = 0) {
    var aux_r = parseInt(r / squareSize);
    var aux_c = parseInt(c / squareSize);
    /* Lógica comentada originalmente para limitar acciones al área de juego */
}

// Calcula el ancho en píxeles que ocupará una cadena de texto (útil para alinear el marcador)
function obtenerAnchoTexto(texto, fuente) {
    ctx.font = fuente; // Aplica la fuente
    return (ctx.measureText(texto)).width; // Mide la anchura
}

// Genera un nuevo enemigo en el tablero
function addEnemies(color = '') {
    // Filtra las piezas del catálogo que aún tienen stock ('count' > 0). 
    // Si se especificó un color por parámetro, filtra también por ese color.
    var conTypePieces = $.grep(typePieces, function(item) {
        return ((color == '')? (item.count > 0) : (item.count > 0 && item.color == color));
    });

    // Si aún quedan piezas disponibles en el inventario global
    if (conTypePieces.length > 0) {
        var ind  = Math.floor(Math.random() * conTypePieces.length); // Escoge una pieza al azar del array filtrado
        var edge = Math.random() < 0.5 ? 1 : squares; // Decide un borde exterior (1 u 8)
        var mid  = 1 + Math.floor(Math.random() * squares); // Decide un valor medio al azar
        var flip = Math.random() < 0.5; // Decide la orientación de spawn

        // Crea el objeto del nuevo enemigo y lo coloca por defecto en un borde del tablero
        var aux_enemies = {col: flip ? edge : mid, row: flip ? mid : edge, color: conTypePieces[ind].color, src: conTypePieces[ind].src, walk: conTypePieces[ind].walk, point: conTypePieces[ind].point};
        // Resta 1 al stock de esa pieza en el catálogo general
        $.each(typePieces, function(ind, item) {
            if ((aux_enemies.color == typePieces[ind].color)
                    && (aux_enemies.src == typePieces[ind].src)) {
                typePieces[ind].count = typePieces[ind].count - 1;
                return;
            }
        });

        // Comprueba si la casilla elegida al azar para el spawn ya está ocupada por otro enemigo
        var collision = false;

        $.each(board.enemies, function(i, othervalue) {
            if (othervalue.col === aux_enemies.col && othervalue.row === aux_enemies.row) {
                collision = true;
                return false; // Rompemos el bucle interno, ya encontramos un choque
            }
        });

        // Si hay colisión en el borde elegido, buscará CUALQUIER posición libre en los cuatro bordes
        if (collision) {
            let possiblePositions = [];
            // Genera todas las posiciones del perímetro (fila 1, fila 8, col 1, col 8)
            for (let i = 1; i <= squares; i++) {
                possiblePositions.push({c: 1, r: i}, {c: squares, r: i}, {c: i, r: 1}, {c: i, r: squares});
            }

            // Desordena el array para que no nazcan siempre en la misma esquina si hay atasco
            possiblePositions.sort(() => Math.random() - 0.5);

            for (let pos of possiblePositions) {
                // Comprueba si la casilla perimetral está ocupada por un enemigo o por el jugador
                let isOccupied = board.enemies.some(e => e.col === pos.c && e.row === pos.r) ||
                (pos.c === board.player_one.col && pos.r === board.player_one.row); // (Bug corregido en comentario: el código original decía pos.y, lo asumo como pos.r)

                if (!isOccupied) {
                    // Si encuentra un hueco en el borde, lo asigna ahí y resuelve la colisión
                    aux_enemies.col = pos.c;
                    aux_enemies.row = pos.r;
                    collision = false;
                    break;
                }
            }
        }

        // Si se resolvió la colisión y la casilla de spawn no es justo donde está el jugador...
        if (!collision) {
            if (aux_enemies.col != board.player_one.col && aux_enemies.row != board.player_one.row) {
                // ...mete definitivamente al enemigo en la partida
                board.enemies.push(aux_enemies);
            }
        }
    }
}