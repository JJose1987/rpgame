/* JavaScript */
/* https://www.degraeve.com/reference/urlencoding.php */
/*
    Imagen : "Un ## en estilo pixel art, [descripción]. El diseño es detallado con sombras y colores vibrantes, en un fondo blanco, en un estilo de juego retro similar a los RPG clásicos de 16 bits."
    Cartas 2 caracteristicas: N Dados de ataque o defensa, N Usos, 4 distancia magia, 3 distancia arco

    Dientes  Comprar armas y provisiones
*/
// Variables
var cnv;
var ctx;

var kwargs_p = {color : '#000000', x : 0, y : 0, size : 0, sides : 1, fill : true};


var colors = ['#89b83f', '#eacb5a', '#36481c', '#eeda43', '#d49d4c', '#bdb9ae']

// Funciones
function main() {
    // Cargar valores
    cnv = document.getElementById('game');
    ctx = cnv.getContext('2d');
    // Eventos
    // Código a ejecutar cuando la ventana cambia de tamaño
    $(window).resize(function() {
        $('canvas')
            .attr('height', $(window).height() * 0.965)
            .attr('width' , $(window).width()  * 0.975);
    });

    //
    $('canvas')
        .attr('height', height * 0.965)
        .attr('width' , width  * 0.975);
    update();
}

// Actualizar valores de la clase
function update() {
    table();
}

// Dibujar tablero
function table() {
    
}