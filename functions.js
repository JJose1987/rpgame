/* JavaScript */

// Variables globales de entorno y renderizado
var canvas, ctx;
const squares = 8; // Tablero principal de 8x8
const margin  = 1; // Margen de 1 casilla alrededor

let boardSize  = 0;
let squareSize = 0;
let screenFlash = 0; // Controla la opacidad del flash de daño

// Caché global para evitar recargar las imágenes en cada frame
const imageCache = {};

// Objeto principal del estado de la partida
var board = {
    playerOne: {
          col: 4
        , row: 4
        , vCol: 4               // Posición visual (para animaciones fluidas)
        , vRow: 4               // Posición visual (para animaciones fluidas)
        , src: '0x26C2'
        , assets : 'rogue.b4feb415'
        , color: '#000000'
        , walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]] // Movimiento tipo Rey
        , stamina : 2
        , life : 3
        , maxStamina : 2
        , maxLife : 3
        , move : false
        , point: 0
    }
    , corpse: []
    , enemies: []
};

// Catálogo de enemigos (Piezas de Ajedrez)
var typePieces = [
    // Piezas Negras
        // Peón
    {src: '0x265F', color: '#000000', count: 8, point: 01, assets : 'bP.09539f32', walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1]], hit: [[+1, +1], [-1, +1], [-1, -1], [+1, -1]]}
        // Caballo
  , {src: '0x265E', color: '#000000', count: 2, point: 03, assets : 'bN.28c70309', walk: [[+2, +1], [+2, -1], [-2, +1], [-2, -1], [+1, +2], [-1, +2], [+1, -2], [-1, -2]]}
        // Alfil
  , {src: '0x265D', color: '#000000', count: 2, point: 03, assets : 'bB.77e9debf', walk: [[+1, +1], [+1, -1], [-1, -1], [-1, +1], [+2, +2], [+2, -2], [-2, -2], [-2, +2], [+3, +3], [+3, -3], [-3, -3], [-3, +3], [+4, +4], [+4, -4], [-4, -4], [-4, +4], [+5, +5], [+5, -5], [-5, -5], [-5, +5], [+6, +6], [+6, -6], [-6, -6], [-6, +6], [+7, +7], [+7, -7], [-7, -7], [-7, +7], [+8, +8], [+8, -8], [-8, -8], [-8, +8]]}
        // Torre
  , {src: '0x265C', color: '#000000', count: 2, point: 05, assets : 'bR.7b4fa825', walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -8], [+2, +0], [-2, +0], [+0, +2], [+0, -7], [+3, +0], [-3, +0], [+0, +3], [+0, -6], [+4, +0], [-4, +0], [+0, +4], [+0, -5], [+5, +0], [-5, +0], [+0, +5], [+0, -4], [+6, +0], [-6, +0], [+0, +6], [+0, -3], [+7, +0], [-7, +0], [+0, +7], [+0, -2], [+8, +0], [-8, +0], [+0, +8], [+0, -1]]}
        // Reina
  , {src: '0x265B', color: '#000000', count: 1, point: 09, assets : 'bQ.b60573d7', walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1], [+2, +0], [-2, +0], [+0, +2], [+0, -2], [+2, +2], [-2, +2], [-2, -2], [+2, -2], [+3, +0], [-3, +0], [+0, +3], [+0, -3], [+3, +3], [-3, +3], [-3, -3], [+3, -3], [+4, +0], [-4, +0], [+0, +4], [+0, -4], [+4, +4], [-4, +4], [-4, -4], [+4, -4], [+5, +0], [-5, +0], [+0, +5], [+0, -5], [+5, +5], [-5, +5], [-5, -5], [+5, -5], [+6, +0], [-6, +0], [+0, +6], [+0, -6], [+6, +6], [-6, +6], [-6, -6], [+6, -6], [+7, +0], [-7, +0], [+0, +7], [+0, -7], [+7, +7], [-7, +7], [-7, -7], [+7, -7], [+8, +0], [-8, +0], [+0, +8], [+0, -8], [+8, +8], [-8, +8], [-8, -8], [+8, -8]]}
        // Rey
  , {src: '0x265A', color: '#000000', count: 1, point: 10, assets : 'bK.b83f0a15', walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]]}

    // Piezas Blancas
        // Peón
  , {src: '0x265F', color: '#ffffff', count: 8, point: 01, assets : 'wP.0596b7ce', walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1]], hit: [[+1, +1], [-1, +1], [-1, -1], [+1, -1]]}
        // Caballo
  , {src: '0x265E', color: '#ffffff', count: 2, point: 03, assets : 'wN.ef4cde0a', walk: [[+2, +1], [+2, -1], [-2, +1], [-2, -1], [+1, +2], [-1, +2], [+1, -2], [-1, -2]]}
        // Alfil
  , {src: '0x265D', color: '#ffffff', count: 2, point: 03, assets : 'wB.b7d1a118', walk: [[+1, +1], [+1, -1], [-1, -1], [-1, +1], [+2, +2], [+2, -2], [-2, -2], [-2, +2], [+3, +3], [+3, -3], [-3, -3], [-3, +3], [+4, +4], [+4, -4], [-4, -4], [-4, +4], [+5, +5], [+5, -5], [-5, -5], [-5, +5], [+6, +6], [+6, -6], [-6, -6], [-6, +6], [+7, +7], [+7, -7], [-7, -7], [-7, +7], [+8, +8], [+8, -8], [-8, -8], [-8, +8]]}
        // Torre
  , {src: '0x265C', color: '#ffffff', count: 2, point: 05, assets : 'wR.53013fc8', walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -8], [+2, +0], [-2, +0], [+0, +2], [+0, -7], [+3, +0], [-3, +0], [+0, +3], [+0, -6], [+4, +0], [-4, +0], [+0, +4], [+0, -5], [+5, +0], [-5, +0], [+0, +5], [+0, -4], [+6, +0], [-6, +0], [+0, +6], [+0, -3], [+7, +0], [-7, +0], [+0, +7], [+0, -2], [+8, +0], [-8, +0], [+0, +8], [+0, -1]]}
        // Reina
  , {src: '0x265B', color: '#ffffff', count: 1, point: 09, assets : 'wQ.c3dc7fce', walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1], [+2, +0], [-2, +0], [+0, +2], [+0, -2], [+2, +2], [-2, +2], [-2, -2], [+2, -2], [+3, +0], [-3, +0], [+0, +3], [+0, -3], [+3, +3], [-3, +3], [-3, -3], [+3, -3], [+4, +0], [-4, +0], [+0, +4], [+0, -4], [+4, +4], [-4, +4], [-4, -4], [+4, -4], [+5, +0], [-5, +0], [+0, +5], [+0, -5], [+5, +5], [-5, +5], [-5, -5], [+5, -5], [+6, +0], [-6, +0], [+0, +6], [+0, -6], [+6, +6], [-6, +6], [-6, -6], [+6, -6], [+7, +0], [-7, +0], [+0, +7], [+0, -7], [+7, +7], [-7, +7], [-7, -7], [+7, -7], [+8, +0], [-8, +0], [+0, +8], [+0, -8], [+8, +8], [-8, +8], [-8, -8], [+8, -8]]}
        // Rey
  , {src: '0x265A', color: '#ffffff', count: 1, point: 10, assets : 'wK.6a015951', walk: [[+1, +0], [-1, +0], [+0, +1], [+0, -1], [+1, +1], [-1, +1], [-1, -1], [+1, -1]]}
];

// Inicialización del juego
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

    // Spawn inicial
    addEnemies();
    resizeCanvas();

    // Iniciar el bucle de juego continuo de alta tasa de refresco
    gameLoop();
}

// Bucle principal de actualización mecánica y gráfica nativa
function gameLoop() {
    updateLogic();
    draw();
    requestAnimationFrame(gameLoop);
}

// Maneja las interpolaciones físicas de movimiento fluido (Lerp)
function updateLogic() {
    const lerpSpeed = 0.2; // Velocidad de suavizado de la animación

    // Suavizar posición del jugador
    board.playerOne.vCol += (board.playerOne.col - board.playerOne.vCol) * lerpSpeed;
    board.playerOne.vRow += (board.playerOne.row - board.playerOne.vRow) * lerpSpeed;

    // Suavizar posición de enemigos
    $.each(board.enemies, function(index, enemy) {
        enemy.vCol += (enemy.col - enemy.vCol) * lerpSpeed;
        enemy.vRow += (enemy.row - enemy.vRow) * lerpSpeed;
    });

    // Desvanecer el flash de daño paulatinamente
    if (screenFlash > 0) {
        screenFlash -= 0.03;
        if (screenFlash < 0) screenFlash = 0;
    }
}

function resizeCanvas() {
    boardSize = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = boardSize * dpr;
    canvas.height = boardSize * dpr;
    canvas.style.width = boardSize + 'px';
    canvas.style.height = boardSize + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    squareSize = boardSize / (squares + (margin * 2));
}

// Ejecuta de forma controlada el turno de la IA Inteligente
function endTurn() {
    if (board.playerOne.life <= 0) return;

    $.each(board.enemies, function(index, value) {
        let bestMove = { col: value.col, row: value.row };
        let minDistance = Math.hypot(board.playerOne.col - value.col, board.playerOne.row - value.row);
        let hasAttacked = false;

        
        $.each(value.walk, function(i, step) {
            let futureCol = value.col + step[0];
            let futureRow = value.row + step[1];

            // Verificación estricta de límites del tablero (1 a 8)
            if (futureCol < 1 || futureCol > 8 || futureRow < 1 || futureRow > 8) return;
            
            // 1. LÓGICA DE ATAQUE
            if (value.src == '0x265F') {
                $.each(value.hit, function(iHit, stepHit) {
                    let futureHitCol = value.col + stepHit[0];
                    let futureHitRow = value.row + stepHit[1];
                    
                    if (futureHitCol === board.playerOne.col && futureHitRow === board.playerOne.row) {
                        board.playerOne.life -= 1;
                        screenFlash = 0.6; // Activa el flash visual de daño en pantalla
                        board.corpse.push({ col: futureHitCol, row: futureHitRow });

                        value.col = futureHitCol;
                        value.row = futureHitRow;
                        hasAttacked = true;
                        return false;
                    }
                });
                
                if (futureCol === board.playerOne.col && futureRow === board.playerOne.row) {
                    hasAttacked = false;
                    return false;
                }
                
            } else {
                if (futureCol === board.playerOne.col && futureRow === board.playerOne.row) {
                    board.playerOne.life -= 1;
                    screenFlash = 0.6; // Activa el flash visual de daño en pantalla
                    board.corpse.push({ col: futureCol, row: futureRow });
    
                    value.col = futureCol;
                    value.row = futureRow;
                    hasAttacked = true;
                    return false;
                }
            }

            // 2. CAMINO DE ACERCAMIENTO ÓPTIMO
            let dist = Math.hypot(board.playerOne.col - futureCol, board.playerOne.row - futureRow);
            if (dist < minDistance) {
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
        });

        if (!hasAttacked) {
            value.col = bestMove.col;
            value.row = bestMove.row;
        } else if (board.playerOne.life > 0) {
            // Reposiciona al jugador en caso de sobrevivir a un ataque directo
            let newBox = getRandomEmptySquare();
            if (newBox) {
                board.playerOne.col = newBox.col;
                board.playerOne.row = newBox.row;
                board.playerOne.vCol = newBox.col;
                board.playerOne.vRow = newBox.row;
            }
            return false; 
        }
    });

    // Spawns de fin de turno
    addEnemies();
    board.enemies
        .filter(e => ['0x265A', '0x265B'].includes(e.src))
        .forEach(e => addEnemies(e.color));

    // Devolver el control y energía al jugador
    board.playerOne.stamina = board.playerOne.maxStamina;
}

// Dibuja los componentes en la pantalla
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();

    if (board.playerOne.life > 0) {
        // Resaltar casilla del jugador seleccionado
        if (board.playerOne.stamina > 0) {
            ctx.fillStyle = '#829769';
            ctx.fillRect((board.playerOne.col * squareSize), (board.playerOne.row * squareSize), squareSize, squareSize);
        }

        var possibleMovements = [board.playerOne];
        $.merge(possibleMovements, board.enemies);
        
        // Indicar si el personaje principal con alguno de personajes de alrededor
        /*
        $.each(board.playerOne.walk, function(index, value) {
            if (((r > 0) && (r < squares + 1)) && ((c > 0) && (c < squares + 1))) {
                var collision = -1;
                
                
            }
        });
        */


        // Indicar los posibles movimientos y lugares donde puede haber impactos
        $.each(possibleMovements, function(index, value) {
            $.each(value.walk, function(index0, value0) {
                var c = value.col + value0[0];
                var r = value.row + value0[1];

                if (((r > 0) && (r < squares + 1)) && ((c > 0) && (c < squares + 1))) {
                    var collision = -1;
                    
                    $.each(board.enemies, function(i, othervalue) {
                        if (othervalue.col === c && othervalue.row === r) {
                            collision = i;

                            if (!(collision > -1)) {
                                ctx.fillStyle = '#aaa23a';
                                ctx.fillRect((othervalue.col * squareSize), (othervalue.row * squareSize), squareSize, squareSize);
                            }

                            return false;
                        }
                    });
                
                    if (!(collision > -1)) {
                        if (value == board.playerOne) {
                            drawPoligon(ctx, {color  : '#82976a'
                                            , x      : ((c * squareSize) + squareSize / 2)
                                            , y      : ((r * squareSize) + squareSize / 2)
                                            , size   : (squareSize / 7)
                                            , sides  : 360
                                            , fill   : true
                                            , stroke : false});
                        } else {
                            drawPoligon(ctx, {color  : '#aaa23a'
                                            , x      : ((c * squareSize) + squareSize / 2)
                                            , y      : ((r * squareSize) + squareSize / 2)
                                            , size   : (squareSize / 7)
                                            , sides  : 360
                                            , fill   : true
                                            , stroke : false});
                        }
                    }
                }
            });
        });
        
        drawPlayer(board.playerOne, board.enemies);
        $.each(board.enemies, function(index, value) {
            drawPlayer(value, [board.playerOne]);
        });
        

        // --- INTERFAZ DEL HUD ---
        // Vidas (Corazones rojos)
        for (let l = 0; l < board.playerOne.life; l++) {
            ctx.font = (squareSize / 2) + 'px Consolas';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ff0000';
            ctx.fillText(String.fromCodePoint('0x2665'), squareSize + (l * squareSize / 2), (squareSize / 5));
        }

        // Energía (Diamantes azules)
        for (let s = 0; s < board.playerOne.stamina; s++) {
            ctx.font = (squareSize / 2) + 'px Consolas';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#0000ff';
            ctx.fillText(String.fromCodePoint('0x2666'), squareSize + (s * squareSize / 2), (squareSize / 1.5));
        }

        // Puntuación
        let txtPoints = 'POINTS  ';
        let wPoints = obtenerAnchoTexto(txtPoints, (squareSize * 0.5) + 'px Consolas');
        ctx.font = (squareSize * 0.5) + 'px Consolas';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(txtPoints, (squareSize * (squares + 2 * margin)) - wPoints - 20, squareSize * 0.25);

        let txtScore = ('00000000' + board.playerOne.point).slice(-8);
        ctx.fillText(txtScore, (squareSize * (squares + 2 * margin)) - wPoints - 20, squareSize * 0.75);

    } else {
        // --- PANTALLA GAME OVER ---
        ctx.font = squareSize + 'px Consolas';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('GAME OVER', boardSize / 2, squareSize * 0.5);

        ctx.fillStyle = '#000000';
        var x = squareSize * ((board.playerOne.row + 0.5) + (board.playerOne.row * 0.02));
        var y = squareSize * (board.playerOne.col + 0.5);
        ctx.fillText(String.fromCodePoint('0x2B6E'), y, x);
    }

    // Dibujar el Flash de impacto en pantalla si el indicador está activo
    if (screenFlash > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 0, ' + screenFlash + ')';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
}

function drawBoard() {
    for (let r = 0; r < squares + (margin * 2); r++) {
        for (let c = 0; c < squares + (margin * 2); c++) {
            if (((r > 0) && (r < squares + 1)) && ((c > 0) && (c < squares + 1))) {
                ctx.fillStyle = (r + c) % 2 === 0 ? '#f0d9b5' : '#b58863';
                ctx.fillRect(c * squareSize, r * squareSize, squareSize, squareSize);
            }
        }
    }
    
    // Marcas rojas de muertes previas
    $.each(board.corpse, function(ind, item) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
        ctx.fillRect(item.col * squareSize, item.row * squareSize, squareSize, squareSize);
    });
}

function drawPlayer(obj, collisions = null) {
    // Renderizado optimizado mediante caché de la textura de la pieza
    let url = 'https://lichess1.org/assets/hashed/' + obj.assets + '.svg';
    let newColor = '#ff5733'; // El color que quieres aplicar
    
    if (obj.src == '0x26C2') {
        if (!imageCache[url]) {
            // 1. Descargamos el SVG como texto limpio
            imageCache[url] = fetch(url)
                .then(response => response.text())
                .then(svgText => {
                    // 2. Reemplazamos el fill viejo (o lo inyectamos en el nodo <svg> o <path>)
                    // Este regex busca 'fill='...'' o añade uno si no existe. 
                    // Si el SVG original no tiene fill, podemos forzarlo reemplazando '<svg' por '<svg fill='HEX''
                    let svgModificado = svgText.replace(/fill='[^']*'/g, `fill='${newColor}'`);
                    if (!svgText.includes('fill=')) {
                        svgModificado = svgText.replace('<svg', `<svg fill='${newColor}'`);
                    }
        
                    // 3. Lo convertimos en un formato que el objeto Image entienda (Blob URL)
                    let blob = new Blob([svgModificado], {type: 'image/svg+xml'});
                    let blobUrl = URL.createObjectURL(blob);
        
                    return new Promise((resolve) => {
                        let img = new Image();
                        img.src = blobUrl;
                        img.onload = () => resolve(img);
                    });
                });
        }

        // Como ahora es asíncrono por el Fetch, manejamos la renderización:
        if (imageCache[url] instanceof Promise) {
            imageCache[url].then(img => {
                // Guardamos la imagen real en la caché para la próxima vez
                imageCache[url] = img; 
                ctx.drawImage(img, (squareSize * obj.vCol), (squareSize * obj.vRow), squareSize, squareSize);
            });
        } else {
            // Si ya está cacheada como imagen, se dibuja directo
            ctx.drawImage(imageCache[url], (squareSize * obj.vCol), (squareSize * obj.vRow), squareSize, squareSize);
        }
    } else {
        if (!imageCache[url]) {
            imageCache[url] = new Image();
            imageCache[url].src = url;
        }

        let img = imageCache[url];
        if (img.complete) {
            ctx.drawImage(img, (squareSize * obj.vCol), (squareSize * obj.vRow), squareSize, squareSize);
        } else {
            img.onload = function() {
                ctx.drawImage(img, (squareSize * obj.vCol), (squareSize * obj.vRow), squareSize, squareSize);
            };
        }
    }
}

function clickBoard(c = 0, r = 0) {
    var auxR = parseInt(r / squareSize);
    var auxC = parseInt(c / squareSize);

    if (board.playerOne.life > 0) {
        if (board.playerOne.stamina > 0) {
            $.each(board.playerOne.walk, function(index, value) {
                if (auxR == (value[1] + board.playerOne.row) && auxC == (value[0] + board.playerOne.col)) {
                    if (((auxR > 0) && (auxR < squares + 1)) && ((auxC > 0) && (auxC < squares + 1))) {
                        board.playerOne.stamina -= 1;
    
                        var collision = -1;
                        $.each(board.enemies, function(i, othervalue) {
                            if (othervalue.col === auxC && othervalue.row === auxR) {
                                collision = i;
                                return false;
                            }
                        });

                        if (collision > -1) {
                            $.each(typePieces, function(ind, item) {
                                if ((board.enemies[collision].color == typePieces[ind].color) && (board.enemies[collision].src == typePieces[ind].src)) {
                                    typePieces[ind].count += 1;
                                    board.playerOne.point += typePieces[ind].point;
                                    return false;
                                }
                            });
                            board.enemies.splice(collision, 1);
                        }
    
                        board.playerOne.col = auxC;
                        board.playerOne.row = auxR;
    
                        // Si el jugador agota su energía tras este paso, se procesa el turno de la IA
                        if (board.playerOne.stamina === 0) {
                            setTimeout(endTurn, 250); // Pequeño retraso para que el jugador vea su movimiento primero
                        }
                        return false;
                    }
                }
            });
        }
    } else {
        // Clic para revivir en Game Over
        if (auxR == board.playerOne.row && board.playerOne.col == auxC) {
            board.playerOne.life    = board.playerOne.maxLife;
            board.playerOne.stamina = board.playerOne.maxStamina;
            board.playerOne.point   = 0; // BUG SOLUCIONADO: Anteriormente apuntaba incorrectamente a board.point

            board.enemies            = [];
            board.corpse             = [];
            addEnemies();
        }
    }
}

function mousemoveBoard(c = 0, r = 0) {
    var auxR = parseInt(r / squareSize);
    var auxC = parseInt(c / squareSize);
    var paint = false;

    $.each(board.playerOne.walk, function(index, value) {
        if (auxR == (value[1] + board.playerOne.row) && auxC == (value[0] + board.playerOne.col)) {
            if (((auxR > 0) && (auxR < squares + 1)) && ((auxC > 0) && (auxC < squares + 1))) {
                paint = true;
                return false;
            }
        }
    });
    canvas.style.cursor = (paint ? 'pointer' : 'default');
}

function obtenerAnchoTexto(texto, fuente) {
    ctx.font = fuente;
    return (ctx.measureText(texto)).width;
}

function addEnemies(color = '') {
    var conTypePieces = $.grep(typePieces, function(item) {
        return ((color == '') ? item.count > 0 : (item.count > 0 && item.color == color));
    });

    if (conTypePieces.length > 0) {
        var ind  = Math.floor(Math.random() * conTypePieces.length);
        var posEnemies = getRandomEmptySquare();

        if(!posEnemies) return;

        var auxEnemies = {
              col   : posEnemies.col
            , row   : posEnemies.row
            , vCol  : posEnemies.col
            , vRow  : posEnemies.row
            , color : conTypePieces[ind].color
            , src   : conTypePieces[ind].src
            , assets: conTypePieces[ind].assets
            , walk  : conTypePieces[ind].walk
            , point : conTypePieces[ind].point
            , hit   : (conTypePieces[ind].src == '0x265F'? conTypePieces[ind].hit : conTypePieces[ind].walk)
        };

        $.each(typePieces, function(ind, item) {
            if ((auxEnemies.color == typePieces[ind].color) && (auxEnemies.src == typePieces[ind].src)) {
                typePieces[ind].count -= 1;
                return false;
            }
        });

        board.enemies.push(auxEnemies);
    }
}

function getRandomEmptySquare() {
    let emptySquares = [];
    for (let c = 1; c <= squares; c++) {
        for (let r = 1; r <= squares; r++) {
            let isPlayerHere = (board.playerOne.col === c && board.playerOne.row === r);
            let isEnemyHere = board.enemies.some(enemy => enemy.col === c && enemy.row === r);

            if (!isPlayerHere && !isEnemyHere) {
                emptySquares.push({ col: c, row: r });
            }
        }
    }
    if (emptySquares.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        return emptySquares[randomIndex];
    }
    return null;
}