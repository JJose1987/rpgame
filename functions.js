/* JavaScript */
/* https://www.degraeve.com/reference/urlencoding.php */
/*
    Imagen : "En estilo pixel art, [animal] zombie, agresivo, con una runa roja dibujada encima de los ojos, ojos verdes, el color del pelo muy oscuro y color de la piel muy clara un pergamino atado en una de sus piernas, [descripción]. El diseño es detallado con sombras y colores vibrantes, en un fondo blanco, en un estilo de juego retro similar a los RPG clásicos de 16 bits.
    Cartas 2 caracteristicas: N Dados de ataque o defensa, N Usos, 4 distancia magia, 3 distancia arco

    Dientes  Comprar armas y provisiones

    Valores (1 a 6)
        1     : Pifia   – -1
        2-3   : Fallo   – +0
        4-5   : Acierto – +1
        6     : Crítico – +2

///
cartas imagen
Imagen de estilo pixel art que representa un pergamino antiguo de color beige claro con bordes enrollados en la parte superior e inferior. En el centro del pergamino habra dibujado [], rodeada de un aura. En la esquina inferior derecha del interior de dentro del pergamino por encima del enrollado inferior, se encuentra dibujado un dado rojo de seis caras con puntos blancos en vista isometrica. El fondo es completamente blanco.

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
    16, caballo nigromante
    17, elefante
    18, elefante espada
    19, elefante nigromante
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

// Funciones
function main() {
    // Cargar valores
    cnv = document.getElementById('game');
    ctx = cnv.getContext('2d');
    // Eventos
    // Código a ejecutar cuando la ventana cambia de tamaño
    $(window).resize(function() {
        h = $(window).height() * 0.965;
        w = $(window).width()  * 0.975;

        $('canvas')
            .attr('height', h)
            .attr('width' , w);
    });

    //
    $('canvas')
        .attr('height', h)
        .attr('width' , w);
    update();
}

// Actualizar valores de la clase
function update() {
    table();
}
// Invertir un color dado
function InversoColor(hex) {
    return rgbToHex((255 - hexToRgb(hex)['r']), (255 - hexToRgb(hex)['g']), (255 - hexToRgb(hex)['b']));
}

// Dibujar tablero
function table() {
    var radio = 24;
    var size = h / radio;

    var karg = {colorLine : '#fffffff', size : size, sides : 6, fill : false, rotate : (90 / 1.5), line : 1};
    var lado = size * (Math.PI / (karg['sides'] / 2));

    for (var x = 0; x <= parseInt(radio / 0.63); x++) {
        for (var y = 0; y <= parseInt(radio / 1.8); y++) {
            karg['x'] = x * (lado * (1 + 0.42));
            karg['y'] = y * (lado * (1 + (1 / 1.5))) + (x % 2 == 0?0:lado * (1 / 1.2));

            drawPoligon(ctx, karg);
        }   
    }
}