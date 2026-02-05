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
    player_one: {col: 4, row: 4, color: '#000000', src: "0x265F", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], attack: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], move : false, life : 4, stamina : 3, maxStamina : 3, maxLife : 4}
  , enemies   : []
};

var typePieces = [
    {src: "0x265A", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1}
  , {src: "0x265B", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1}
  , {src: "0x265C", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1}
  , {src: "0x265D", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1}
  , {src: "0x265E", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1}
  , {src: "0x2617", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1}
  , {src: "0x265F", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1}
  , {src: "0x2623", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1}
  , {src: "0x2622", walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]], stamina : 1, life : 1}
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
        if (board.player_one.move == true && board.player_one.stamina > 0) {
            // Señalar el personaje escogido
            ctx.beginPath();
            ctx.fillStyle = '#829769';
            ctx.fillRect((board.player_one.col * squareSize), (board.player_one.row * squareSize), squareSize, squareSize);
            ctx.fill();
            
            // Marca a donde se puede mover
            $.each(board.player_one.walk, function(index, value) {
                var c = board.player_one.col + value[0];
                var r = board.player_one.row + value[1];
                
                if (((r > 0) && (r < squares + 1)) && ((c > 0) && (c < squares + 1))) {
                    // Detectamos colisión con OTROS enemigos
                    var collision = -1;

                    $.each(board.enemies, function(i, othervalue) {
                        // Si otro enemigo YA está en la casilla a la que quiero ir
                        if (othervalue.col === c && othervalue.row === r) {
                            collision = i;
                            
                            ctx.beginPath();
                            ctx.fillStyle = '#aaa23a';
                            ctx.fillRect((othervalue.col * squareSize), (othervalue.row * squareSize), squareSize, squareSize);
                            ctx.fill();
                            
                            return; // Rompemos el bucle interno, ya encontramos un choque
                        }
                    });

                    if (!(collision > -1)) {
                        ctx.beginPath();
                        ctx.fillStyle = '#829769';
                        ctx.arc(((c * squareSize) + squareSize / 2), ((r * squareSize) + squareSize / 2), squareSize / 7, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
    
            });
        }
        // Dibujamos al protagonista
        drawPlayer(board.player_one);
    
        //      * Añadir y mover enemies
        if (board.player_one.stamina == 0) {
            // Mover
            $.each(board.enemies, function(index, value) {
                // Calculamos la diferencia de distancia entre el jugador y el enemigo actual
                var diffCol = board.player_one.col - value.col;
                var diffRow = board.player_one.row - value.row;
                
                // Math.sign devuelve:
                //  1 si el jugador está a la derecha/abajo
                // -1 si el jugador está a la izquierda/arriba
                //  0 si están en la misma línea
    
                var stepCol = Math.sign(diffCol);
                var stepRow = Math.sign(diffRow);
                
                // 2. Predecimos la futura posición
                var futureCol = value.col + stepCol;
                var futureRow = value.row + stepRow;
                
                // 3. Detectamos colisión con OTROS enemigos
                var collision = false;
                
                $.each(board.enemies, function(i, othervalue) {
                    // No comparamos con nosotros mismos (index !== i)
                    if (index !== i) {
                        // Si otro enemigo YA está en la casilla a la que quiero ir
                        if (othervalue.col === futureCol && othervalue.row === futureRow) {
                            collision = true;
                            return false; // Rompemos el bucle interno, ya encontramos un choque
                        }
                    }
                });
                
                // 4. Si NO hay colisión, hacemos el movimiento efectivo
                if (!collision) {
                    // 5. Detectamos si colisiona con el personaje y quitamos un punto de vida
                    if (futureCol == board.player_one.col && futureRow == board.player_one.row) {
                        board.player_one.life -= 1;
                    } else {
                        value.col = futureCol;
                        value.row = futureRow;
                    }
                }
                
            });
            // Añadir
            if (board.enemies.length < Math.pow(squares, 2)) {
                // Escoge el enemigo al azar
                var ind = Math.floor(Math.random() * typePieces.length);
                var aux_enemies = {col: 1, row: 1, color: '#880808', src: typePieces[ind].src}

                if (Math.floor(Math.random() * 2) == 0) {
                    aux_enemies.row = Math.random() < 0.5 ? 1 : 8;            
                    aux_enemies.col = 1 + Math.floor(Math.random() * 8);
                } else {
                    aux_enemies.row = 1 + Math.floor(Math.random() * 8);
                    aux_enemies.col = Math.random() < 0.5 ? 1 : 8; 
                }
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
    
        $.each(board.enemies, function(index, value) {
            drawPlayer(value);
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
    } else if (board.player_one.life <= 0) {
        ctx.beginPath();
        ctx.font         = 'italic ' + (squareSize * 1) + 'px Consolas';
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
function drawPlayer(player) {
    var x = squareSize * ((player.row + 0.5) + (player.row * 0.02));
    var y = squareSize * (player.col + 0.5);

    ctx.beginPath();
    ctx.font         = squareSize + 'px Consolas';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = player.color;
    ctx.fillText(String.fromCodePoint(player.src), y, x);
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
            board.player_one.life    = board.player_one.maxLife;
            board.player_one.stamina = board.player_one.maxStamina;
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