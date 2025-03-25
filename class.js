/* JavaScript */
// Clases
class Objeto {
    /* Constructor donde le pasamos los datos de entrada, para ello le pasamos el nombreparametro = VALUE */
    constructor(kwargs) {
        //*********************************************************************************
        //*********************************************************************************
    }
    
    /* Metodo para cargar varios valores */
    sets() {
        
    }

    /* Metodo para cargar el valor en el indice */
    set(ix, value) {
        this.kwargs[ix] = value;
    }

    /* Metodo para retornar la clase en cadena de caracteres */
    get str() {
        var out = '';

        return out;
    }

    /* Metodo para retornar el campo que le pidamos */
    get(ix) {
        if (this.kwargs[ix] != 'undefined') {
            return this.kwargs[ix];
        } else {
            return 'undefined';
        }
    }
}