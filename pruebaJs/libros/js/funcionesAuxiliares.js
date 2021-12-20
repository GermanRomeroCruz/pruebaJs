
//funcion para sacar los datos del localStorage
function leerDatos(nom){
    return JSON.parse(localStorage.getItem(nom));
}
//funcion para guardar los datos en el localStorage
function guardarDatos(nom,datos){
    localStorage.setItem(nom,JSON.stringify(datos));
}
//crea etiqueta
function crearEtiquetaSola(eti,text = null){
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

//crea una etiqueta con dos atributo
function crearEtiquetasConDosAtt(eti,att,textAtt,att2,textAtt2,inn = null){
    eti = document.createElement(eti);
    eti.setAttribute(att,textAtt);
    eti.setAttribute(att2,textAtt2);
    if (inn !== null) {
        eti.innerHTML = inn;
    }
    return eti;
}

//crea una etiqueta con tres atributo
function crearEtiquetasConTresAtt(eti,att,textAtt,att2,textAtt2,att3,textAtt3,inn = null){
    eti = document.createElement(eti);
    eti.setAttribute(att,textAtt);
    eti.setAttribute(att2,textAtt2);
    eti.setAttribute(att3,textAtt3);
    if (inn !== null) {
        eti.innerHTML = inn;
    }
    return eti;
}

//funcion para crear una etiqueta pasandole el nombre de la etiqueta con 4 atributos y los 4 textos de los atributos con un
//texto alternativo para el innerhtml que de base es null
function crearEtiquetasConCuatroAtt(eti,att,textAtt,att2,textAtt2,att3,textAtt3,att4,textAtt4,inn = null){
    eti = document.createElement(eti);
    eti.setAttribute(att,textAtt);
    eti.setAttribute(att2,textAtt2);
    eti.setAttribute(att3,textAtt3);
    eti.setAttribute(att4,textAtt4);
    if (inn !== null) {
        eti.innerHTML = inn;
    }
    return eti;
}

//crea una etiqueta con cinco atributo
function crearEtiquetasConCincoAtt(eti,att,textAtt,att2,textAtt2,att3,textAtt3,att4,textAtt4,att5,textAtt5,inn = null){
    eti = document.createElement(eti);
    eti.setAttribute(att,textAtt);
    eti.setAttribute(att2,textAtt2);
    eti.setAttribute(att3,textAtt3);
    eti.setAttribute(att4,textAtt4);
    eti.setAttribute(att5,textAtt5);
    if (inn !== null) {
        eti.innerHTML = inn;
    }
    return eti;
}
//funcion para crear input o cualquier etiqueta, pasandole dos arrays con la informacion que va a ponerles y el nombre de la etiqueta
function crearInput(eti,arr1,arr2){
    eti = document.createElement(eti);
    for (let i = 0; i < arr1.length; i++){
        eti.setAttribute(arr1[i],arr2[i]);
    }
    return eti;
}
//fución para el error de un input, le pone la case error
function errorInput(e){
    e.className = 'error';
}
//devuelve un array de los inputs del formulario con los campos que estan rellenos
function cogerInputsForm(){
    let arr = [...document.querySelector('form').querySelectorAll('input')];
    arr.shift();
    return arr;
}
//devuelve si es sii o no en el select
function cogerSelect(){
    return (document.querySelectorAll('option')[0].selected)?'Sí':'No';
}
//me coge los values de los input y los devuelve en un array
function cogerValuesInputsForm(inputs){
    return inputs.map(e=>e.value);
}
//funcion para validar que el nombre no este vacio
function validarInputTexto(e){
    if (e.value === '') {
        errorInput(e);
        return false;
    }
    return true;
}
//función para ordenar el array
function ordenarArray(arr){
    let datosConTituloMayuscula = ponerTituloMayusculas(arr);
    return datosConTituloMayuscula.sort(function(a,b){return (a.nombre < b.nombre)?-1:0});
} 
//función para agregar el libro al array y lo guarda en el local storage
function agregarLibro(datos,arr){
    console.log(arr)
    let obj = {id:datos.length,nombre:arr[0],autor:arr[1],stock:arr[3],precio:arr[2]};
    datos.push(obj);
    let datosOrdenados = ordenarArray(datos);
    localStorage.setItem('books',JSON.stringify(datosOrdenados));
}
//función que devuelve si está disponible o no
function enStock(arr){
    return (arr=== 'Sí')?'Disponible':'Vendido';
}
//pone el título en mayúsculas
function ponerTituloMayusculas(arr){
    let may = arr;
    for (let i = 0; i < arr.length; i++) {
        may[i].nombre= arr[i].nombre.toUpperCase();
    }
    return may;
}