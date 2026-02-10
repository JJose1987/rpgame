/* JavaScript */
/* https://www.degraeve.com/reference/urlencoding.php */
/* https://www.compart.com/en/unicode/ */
/* https://codepoints.net/ */
// Variables
var h, w;
var canvas, ctx;

const squares = 8;
const margin  = 1;

let boardSize = 0;
let squareSize = 0;

var board = {
    player_one: {col: 4, row: 4, color: '#000000', src: "0x2617", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], attack: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], move : false, life : 4, stamina : 3, maxStamina : 3, maxLife : 4}
  , enemies   : []
};

var typePieces = [
    {src: "0x265F", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  // Rey
  , {src: "0x265E", walk: [[+2, +1], [+2, -1], [-2, +1], [-2, -1], [+1, +2], [-1, +2], [+1, -2], [-1, -2]], stamina : 1, life : 1}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  // Reina
  , {src: "0x265D", walk: [[+1, +1], [+1, -1], [-1, -1], [-1, +1], [+2, +2], [+2, -2], [-2, -2], [-2, +2], [+3, +3], [+3, -3], [-3, -3], [-3, +3], [+4, +4], [+4, -4], [-4, -4], [-4, +4], [+5, +5], [+5, -5], [-5, -5], [-5, +5], [+6, +6], [+6, -6], [-6, -6], [-6, +6], [+7, +7], [+7, -7], [-7, -7], [-7, +7], [+8, +8], [+8, -8], [-8, -8], [-8, +8]], stamina : 1, life : 1}                                                                                                                                                                                                                                                                                                                                  // Torre
  , {src: "0x265C", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -8], [+2, +0], [-2, +0], [+0, +2], [+0, -7], [+3, +0], [-3, +0], [+0, +3], [+0, -6], [+4, +0], [-4, +0], [+0, +4], [+0, -5], [+5, +0], [-5, +0], [+0, +5], [+0, -4], [+6, +0], [-6, +0], [+0, +6], [+0, -3], [+7, +0], [-7, +0], [+0, +7], [+0, -2], [+8, +0], [-8, +0], [+0, +8], [+0, -1]], stamina : 1, life : 1}                                                                                                                                                                                                                                                                                                                                  // Alfin
  , {src: "0x265B", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1], [+2, +0], [-2, +0], [+0, +2], [+0, -2], [+2, +2], [-2, +2], [-2, -2], [+2, -2], [+3, +0], [-3, +0], [+0, +3], [+0, -3], [+3, +3], [-3, +3], [-3, -3], [+3, -3], [+4, +0], [-4, +0], [+0, +4], [+0, -4], [+4, +4], [-4, +4], [-4, -4], [+4, -4], [+5, +0], [-5, +0], [+0, +5], [+0, -5], [+5, +5], [-5, +5], [-5, -5], [+5, -5], [+6, +0], [-6, +0], [+0, +6], [+0, -6], [+6, +6], [-6, +6], [-6, -6], [+6, -6], [+7, +0], [-7, +0], [+0, +7], [+0, -7], [+7, +7], [-7, +7], [-7, -7], [+7, -7], [+8, +0], [-8, +0], [+0, +8], [+0, -8], [+8, +8], [-8, +8], [-8, -8], [+8, -8]], stamina : 1, life : 1}  // Caballo
  , {src: "0x265A", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  // Peon
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

// Funciones
function main() {
    canvas = $('#board')[0];
    ctx = canvas.getContext('2d');

    $(window).on('resize orientationchange', resizeCanvas);
    $('#board').on('click', function(e) {
        var c = e.pageX - ($(this).offset()).left;
        var r = e.pageY - ($(this).offset()).top;

        clickBoard(c, r);
    });

    $('#board').on('mousemove', function(e) {
        var c = e.pageX - ($(this).offset()).left;
        var r = e.pageY - ($(this).offset()).top;

        mousemoveBoard(c, r);
    });

    var ind = Math.floor(Math.random() * typePieces.length);
    var edge = Math.random() < 0.5 ? 1 : 8;
    var mid  = 1 + Math.floor(Math.random() * 8);
    var flip = Math.random() < 0.5;

    board.enemies.push({col: flip ? edge : mid, row: flip ? mid : edge, color: '#880808', src: typePieces[ind].src, walk: typePieces[ind].walk});

    update();
}

// Asignar valor del campo
function set(object) {
    var index = $(object).attr('name');

    update();
}

// Actualizar valores de la clase
function update() {
    resizeCanvas();
}

// Redimensionar el Canvas
function resizeCanvas() {
    boardSize = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = boardSize * dpr;
    canvas.height = boardSize * dpr;
    canvas.style.width = boardSize + 'px';
    canvas.style.height = boardSize + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    squareSize = boardSize / (squares + (margin * 2));

    draw();
}

// Dibujar
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the Board
    drawBoard();
    // Draw on the Board
    //      * player_one
    if (board.player_one.life > 0) {
        //      * Añadir y mover enemies
        if (board.player_one.stamina == 0) {
            // Mover enemigos
            $.each(board.enemies, function(index, value) {
                let bestMove = { col: value.col, row: value.row };
                let minDistance = Math.hypot(board.player_one.col - value.col, board.player_one.row - value.row);

                // 1. Evaluar cada movimiento posible según su propiedad 'walk'
                $.each(value.walk, function(i, step) {
                    let futureCol = value.col + step[0];
                    let futureRow = value.row + step[1];

                    // 2. Verificar que el movimiento esté dentro del tablero
                    if (futureCol >= 1 && futureCol <= squares && futureRow >= 1 && futureRow <= squares) {

                        // 3. No mover a la casilla EXACTA del jugador (dejarlo a su alrededor)
                        if (!(futureCol === board.player_one.col && futureRow === board.player_one.row)) {

                            // 4. Calcular distancia Euclidiana al jugador
                            let dist = Math.hypot(board.player_one.col - futureCol, board.player_one.row - futureRow);

                            if (dist < minDistance) {
                                // 5. Detectar colisión con OTROS enemigos antes de confirmar
                                let collision = false;
                                $.each(board.enemies, function(idx, other) {
                                    if (index !== idx && other.col === futureCol && other.row === futureRow) {
                                        collision = true;
                                        return false;
                                    }
                                });

                                if (!collision) {
                                    minDistance = dist;
                                    bestMove = { col: futureCol, row: futureRow };
                                }
                            }
                        }
                    }
                });

                // 6. Si el enemigo ya está adyacente al jugador y no se movió, "ataca"
                let distFinal = Math.hypot(board.player_one.col - value.col, board.player_one.row - value.row);
                if (distFinal <= 1.5) { // Está en una casilla contigua (incluyendo diagonales)
                    board.player_one.life -= 1;
                }

                // Aplicar el mejor movimiento encontrado
                value.col = bestMove.col;
                value.row = bestMove.row;
            });
            // Añadir
            if (board.enemies.length < Math.pow(squares, 2)) {
                // Escoge el enemigo al azar
                var ind = Math.floor(Math.random() * typePieces.length);
                var edge = Math.random() < 0.5 ? 1 : 8;
                var mid  = 1 + Math.floor(Math.random() * 8);
                var flip = Math.random() < 0.5;

                var aux_enemies = {col: flip ? edge : mid, row: flip ? mid : edge, color: '#880808', src: typePieces[ind].src, walk: typePieces[ind].walk};
                // Detectamos colisión con OTROS enemigos
                var collision = false;

                $.each(board.enemies, function(i, othervalue) {
                    if (othervalue.col === aux_enemies.col && othervalue.row === aux_enemies.row) {
                        collision = true;
                        return false; // Rompemos el bucle interno, ya encontramos un choque
                    }
                });
                // Si NO hay colisión,incluimos la enemigo
                if (!collision) {
                    if (aux_enemies.col != board.player_one.col && aux_enemies.row != board.player_one.row) {
                        board.enemies.push(aux_enemies);
                    }
                }
            }

            board.player_one.stamina = board.player_one.maxStamina;
        }

        if (board.player_one.move == true && board.player_one.stamina > 0) {
            // Señalar el personaje escogido
            ctx.beginPath();
            ctx.fillStyle = '#829769';
            ctx.fillRect((board.player_one.col * squareSize), (board.player_one.row * squareSize), squareSize, squareSize);
            ctx.fill();
        }
        // Dibujamos al protagonista
        drawPlayer(board.player_one, board.enemies);

        // Dibujar a los enemigos
        $.each(board.enemies, function(index, value) {
            drawPlayer(value, [board.player_one]);
        });

    }

    if (board.player_one.life > 0) {
        // Life Marcador
        for (let l = 0; l < board.player_one.life; l++) {
            ctx.beginPath();
            ctx.font         = (squareSize / 2) + 'px Consolas';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle    = '#ff0000';
            ctx.fillText(String.fromCodePoint('0x2665'), squareSize + (l * squareSize / 2), (squareSize / 5));
            ctx.fill();
        }

        // Stamina Marcador
        for (let s = 0; s < board.player_one.stamina; s++) {
            ctx.beginPath();
            ctx.font         = (squareSize / 2) + 'px Consolas';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle    = '#0000ff';
            ctx.fillText(String.fromCodePoint('0x2666'), squareSize + (s * squareSize / 2), (squareSize / 1.5));
            ctx.fill();
        }

        ctx.beginPath();
        ctx.font         = (squareSize * 0.5) + 'px Consolas';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = '#ffffff';
        ctx.fillText('POINTS', squareSize * 8.15, squareSize * 0.25);
        ctx.fill();

        ctx.beginPath();
        ctx.font         = (squareSize * 0.5) + 'px Consolas';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = '#ffffff';
        ctx.fillText('00000000', squareSize * 7.85, squareSize * 0.75);
        ctx.fill();
    } else if (board.player_one.life <= 0) {
        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the Board
        drawBoard();

        ctx.beginPath();
        ctx.font         = (squareSize * 1) + 'px Consolas';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = '#ffffff';
        ctx.fillText('GAME OVER', squareSize * 3.5, squareSize * 0.5);
        ctx.fill();

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

// Dibujar el tablero
function drawBoard() {
    for (let r = 0; r < squares + (margin * 2); r++) {
        for (let c = 0; c < squares + (margin * 2); c++) {
            if (((r > 0) && (r < squares + 1)) && ((c > 0) && (c < squares + 1))) {
                ctx.fillStyle = (r + c) % 2 === 0 ? '#f0d9b5' : '#b58863';
                ctx.fillRect(c * squareSize, r * squareSize, squareSize, squareSize);
            }
        }
    }
}

// Dibujar Jugador
function drawPlayer(obj, collisions = null) {
    var x = squareSize * ((obj.row + 0.5) + (obj.row * 0.02));
    var y = squareSize *  (obj.col + 0.5);

    $.each(obj.walk, function(index, value) {
        var c = obj.col + value[0];
        var r = obj.row + value[1];

        if (((r > 0) && (r < squares + 1)) && ((c > 0) && (c < squares + 1))) {
            // Detectamos colisión con OTROS enemigos
            var collision = -1;

            $.each(collisions, function(i, othervalue) {
                // Si otro enemigo YA está en la casilla a la que quiero ir
                if (othervalue.col === c && othervalue.row === r) {
                    collision = i;

                    if (collisions[0] != board.player_one) {
                        ctx.beginPath();
                        ctx.fillStyle = '#aaa23a';
                        ctx.fillRect((othervalue.col * squareSize), (othervalue.row * squareSize), squareSize, squareSize);
                        ctx.fill();
                    }
                    return; // Rompemos el bucle interno, ya encontramos un choque
                }
            });

            if (!(collision > -1)) {
                if (collisions[0] != board.player_one) {
                    drawPoligon(ctx, {color    : '#829769'
                                    , colorLine: (r + c) % 2 === 0 ? '#b58863' : '#f0d9b5'
                                    , x        : ((c * squareSize) + squareSize / 2)
                                    , y        : ((r * squareSize) + squareSize / 2)
                                    , size     : (squareSize / 7)
                                    , sides    : 6
                                    , fill     : true
                                    , rotate   : 90});
                } else {
                    drawPoligon(ctx, {color    : '#aaa23a'
                                    , colorLine: (r + c) % 2 === 0 ? '#b58863' : '#f0d9b5'
                                    , x        : ((c * squareSize) + squareSize / 2)
                                    , y        : ((r * squareSize) + squareSize / 2)
                                    , size     : (squareSize / 7)
                                    , sides    : 3
                                    , fill     : true
                                    , rotate   : 90});
                }
            }
        }
    });

    ctx.beginPath();
    ctx.font         = squareSize + 'px Consolas';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = obj.color;
    ctx.fillText(String.fromCodePoint(obj.src), y, x);
    ctx.fill();
}

// Click en la ficha
function clickBoard(c = 0, r = 0) {
    var aux_r = parseInt(r / squareSize);
    var aux_c = parseInt(c / squareSize);

    if (board.player_one.move == true && board.player_one.stamina > 0) {
        $.each(board.player_one.walk, function(index, value) {
            if (aux_r == (value[1] + board.player_one.row) && aux_c == (value[0] + board.player_one.col)) {
                if (((aux_r > 0) && (aux_r < squares + 1)) && ((aux_c > 0) && (aux_c < squares + 1))) {
                    board.player_one.move = false;
                    board.player_one.stamina -= 1;

                    // Detectamos colisión con OTROS enemigos
                    var collision = -1;

                    $.each(board.enemies, function(i, othervalue) {
                        // Si otro enemigo YA está en la casilla a la que quiero ir
                        if (othervalue.col === aux_c && othervalue.row === aux_r) {
                            collision = i;
                            return; // Rompemos el bucle interno, ya encontramos un choque
                        }
                    });
                    if (collision > -1) {
                        board.enemies.splice(collision, 1);
                    } else {
                        board.player_one.col = aux_c;
                        board.player_one.row = aux_r;
                    }

                    draw();
                    return; // Rompemos el bucle interno, ya encontramos un choque
                }
            }
        });
    } else if (aux_r == board.player_one.row && board.player_one.col == aux_c) {
        if (board.player_one.life > 0) {
            board.player_one.move = true;
        } else {
            // Reempezar la partida
            board.player_one.life    = board.player_one.maxLife;
            board.player_one.stamina = board.player_one.maxStamina;
            
            board.enemies            = [];
        }
        draw();
    }
}

// Mover el raton sobre teclado
function mousemoveBoard(c = 0, r = 0) {
    var aux_r = parseInt(r / squareSize);
    var aux_c = parseInt(c / squareSize);
    /*
    if ((aux_r > 0 && aux_c > 0) && (aux_r < 9 && aux_c < 9)) {
        // Area de juego
    }
    */
}