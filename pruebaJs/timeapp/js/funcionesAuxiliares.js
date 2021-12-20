
//devuelve una cadena de dos digitos del valor que se le pasa, si no tiene dos digitos se le añade un cero a la izquierda
function dosDigitos(valor) {
    if (valor < 10) {
        return `0${valor}`;
    } else {
        return `${valor}`;
    }
} 
//devuelve hora utc partiendo de hora local
function aUTC(fechaLocal) {
    let fechaN = new Date();
    return new Date(fechaN.setHours(fechaLocal.getUTCHours()));
}

//devuelve la fecha con formato en español
function fechaEnEspañol(dias, meses, fecha) {
    return dias[fecha.getDay()] + ", " + fecha.getDate() + " de " + meses[fecha.getMonth()] + " de " + fecha.getFullYear()
}

//crea una etiqueta
function crearEtiquetaSola(eti, text = null) {
    eti = document.createElement(eti);
    if (text !== null) {
        eti.innerHTML = text;
    }
    return eti;
}

//crea una etiqueta con un atributo
function crearEtiquetasConUnAtt(eti, att, textAtt, inn = null) {
    eti = document.createElement(eti);
    eti.setAttribute(att, textAtt);
    if (inn !== null) {
        eti.innerHTML = inn;
    }
    return eti;
}

//crea una etiqueta con dos atributos
function crearEtiquetasConDosAtt(eti, att, textAtt, att2, textAtt2, inn = null) {
    eti = document.createElement(eti);
    eti.setAttribute(att, textAtt);
    eti.setAttribute(att2, textAtt2);
    if (inn !== null) {
        eti.innerHTML = inn;
    }
    return eti;
}

//funcion para sacar los datos del localStorage
function leerDatos(nom) {
    return JSON.parse(localStorage.getItem(nom));
}

//funcion para guardar los datos en el localStorage
function guardarDatos(nom, datos) {
    localStorage.setItem(nom, JSON.stringify(datos));
}

function redondear(num){
    return Math.round(num);
}

function pasarKelvinCelsius(num){
    return num - 273.15;
}