/* JavaScript */
/* https://www.degraeve.com/reference/urlencoding.php */
/* https://www.compart.com/en/unicode/ */
// Variables
var h, w;
var canvas, ctx;

const squares = 8;

let boardSize = 0;
let squareSize = 0;

const piece = [{row: 1, col: 0, color: '#000000', src: "0x265F"}
             , ];

// Funciones
function main() {
    canvas = $('#board')[0];
    ctx = canvas.getContext('2d');
    
    $(window).on('resize orientationchange', resizeCanvas);

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

    squareSize = boardSize / squares;

    draw();
}

// Dibujar
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPlayer(piece[0]);
    drawPlayer(piece[1]);
}

// Dibujar el tablero
function drawBoard() {
    for (let r = 0; r < squares; r++) {
        for (let c = 0; c < squares; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#f0d9b5' : '#b58863';
            ctx.fillRect(
                c * squareSize,
                r * squareSize,
                squareSize,
                squareSize
            );
        }
    }
}

// Dibujar Jugador
function drawPlayer(player) {

    var x = (player.row * squareSize + squareSize / 2);
    var y = (player.col * squareSize + squareSize / 2);

    ctx.beginPath();
    ctx.fillStyle    = player.color;
    ctx.font         = squareSize + 'px Consolas';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String.fromCodePoint(player.src), y, x);
    ctx.fill();

    /*
    ctx.beginPath();
    ctx.strokeRect((player.col * squareSize), (player.row * squareSize), squareSize, squareSize);
    ctx.fillStyle = player.color;
    ctx.fill();
    */
}