/* JavaScript */
/* https://www.degraeve.com/reference/urlencoding.php */
/*
    Imagen : "En estilo realista, [animal] zombie, en posición agresiva y de ataque, con una runa roja dibujada encima de los ojos, ojos verdes, el color del pelo muy oscuro y color de la piel muy clara un pergamino atado en una de sus piernas, [descripcion]. El diseño es detallado con sombras y colores vibrantes, en un fondo blanco.
    Cartas 2 caracteristicas: N Dados de ataque o defensa, N Usos, 4 distancia magia, 3 distancia arco

    Dientes  Comprar armas y provisiones

    Valores (1 a 6)
        1     : Pifia   – -1
        2-3   : Fallo   – +0
        4-5   : Acierto – +1
        6     : Crítico – +2

///
cartas imagen
Imagen de estilo real que representa un pergamino antiguo de color beige claro con bordes enrollados en la parte superior e inferior. En la esquina inferior derecha del interior de dentro del pergamino por encima del enrollado inferior, se encuentra dibujado un dado rojo de seis caras con puntos blancos en vista isometrica. El fondo es completamente blanco.
En el centro del pergamino habra dibujado en estilo pixel art []

cartas posibles al buscar (3d6)
(1ºd6)
    01 Nada
    02 Vida   (En estilo realista, una bota de vino en piel de rata zombie con lineas rojas dibujadas y una runa. El diseño es detallado con sombras y colores vibrantes, en un fondo blanco.)
    03 Invoca (3ºd6 para indicar elemento)
    04 Espada (2ºd6 para indicar si => [3 (1 manos) 3+ (2 manos)], 3ºd6 para indicar elemento)
    05 Arco   (3ºd6 para indicar elemento)
    06 Escudo (2ºd6 para indicar si => [3 (1 manos) 3+ (2 manos)], 3ºd6 para indicar elemento)

3ºd6
    01 Zombie - Lanzar 1d20
    02 Sangre - Vida       / Veneno
    03 Fuego  - Ataque     / Defensa
    04 Luz    - Precisión  / Evasión
    05 Viento - Iniciativa / Resistencia al aturdimiento
    06 Rayo   - Crítico    / Resistencia al crítico

1d20 el zombie es resultado de sumar todos los dados
    01, araña
    02, murcielago
    03, cuervo
    04, rata
    05, lobo
    06, normal
    07, arquero
    08, gordo
    09, musculoso
    10, nigromante
    11, caballo
    12, caballo espada
    13, caballo arquero
    14, caballo gordo
    15, caballo musculoso
    16, caballo nigromante
    17, buitre
    18, condor
    19, volador armado
    20, volador nigromante
*/
// Variables
var cnv;
var ctx;

var h = $(window).height() * 0.994;
var w = $(window).width()  * 0.998;

var mouse = {x : 0, y : 0};
var coord = {x : 0, y : 0};

var tile = {x : 55, y : 55};
/**/
var a00 = new Image();
/**/
// Funciones
function main() {
    //
    if (isPhone) {
        tile = {x : 10, y : 10};
    }
    // Cargar valores
    cnv = document.getElementById('game');
    ctx = cnv.getContext('2d');
    // Eventos
    // Ejecutar cuando la ventana cambia de tamaño
    $(window).resize(function() {
        h = $(window).height() * 0.994;
        w = $(window).width()  * 0.998;

        update();
    });

    // Ejecutar al hacer click en el canvas
    $('#game').on('click', function(event) {
        var rect = this.getBoundingClientRect();

        mouse['x'] = event.clientX - rect.left;
        mouse['y'] = event.clientY - rect.top;

        coord['x'] = parseInt(mouse['x'] / tile['x']);
        coord['y'] = parseInt(mouse['y'] / tile['y']);
    });

    //
    update();
}

// Actualizar valores de la clase
function update() {
    $('canvas')
        .attr('height', h)
        .attr('width' , w);

    table();
}

// Dibujar tablero
function table() {
    var radio = 15;

    var karg = {colorLine : '#fffffff', size : (h / radio), sides : 4, fill : false, rotate : (90 / 2), line : 0.25};
    var lado = karg['size'] * (Math.PI / (karg['sides'] / 2));

    for (var x = 0; x <= (w / tile['x']); x++) {
        for (var y = 0; y <= (h / tile['y']); y++) {
            karg['x'] = lado * (x == 0?0.5:(x + 0.39 - (((x - 1) >= 0?(x - 1):0) * 0.09)));
            karg['y'] = lado * (y == 0?0.5:(y + 0.39 - (((y - 1) >= 0?(y - 1):0) * 0.09)));

            drawPoligon(ctx, karg);
        }
    }
    
    a00.onload = function() {
        ctx.drawImage(a00, 0, 0, X, Y);
        
    };
    
    a00.src = '16bit/a-00.jpg';
}
