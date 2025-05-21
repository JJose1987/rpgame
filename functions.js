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
    Nada
    Vida
    Invoca (dos ojos verdes brillantes con una runa roja entre ambos)
    Espada (5ºd6 para indicar si => [3 (1 manos) 3+ (2 manos)])
    Arco
    Escudo

2ºd6
    Metal	        Dureza (Mohs)	Estado a Temperatura Ambiente (25 °C)
    Indio (In)	    1.2	            Sólido (se raya con la uña)
    Plata (Ag)	    2.5–3	        Sólido
    Cobre (Cu)	    3	            Sólido
    Hierro (Fe)	    4	            Sólido
    Titanio (Ti)	6	            Sólido
    Cromo (Cr)	    8.5	            Sólido (uno de los más duros)

3ºd6
    Nada
    Veneno
    Fuego
    Electricidad
    Radio
    Explosion

magia es igual a 1ºd6 = 1, 2ºd6 = x, 3ºd6 > 1


4d6 el zombie es resultado de sumar todos los dados
    04, araña
    05, murcielago
    06, cuervo
    07, rata
    08, lobo
    09, normal
    10, arquero
    11, gordo
    12, musculoso
    13, nigromante
    14, caballo
    15, caballo espada
    16, caballo arquero
    17, caballo gordo
    18, caballo musculoso
    19, caballo nigromante
    20, dragon desnudo
    21, dragon nigromante
    22, dragon armado
    23, dios nigromante
    24, dios armado
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
