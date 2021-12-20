'use strict'; //falta abort para la peticion con el confirm

const timeApp = (function() {
 
	const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	let URL = "http://localhost:3000/";
    let uri = "http://api.openweathermap.org/data/2.5/weather?q=";
    let uriIcon = "http://openweathermap.org/img/wn/";
    let uriIconPng =".png"; 
    let apiKey = "&APPID=7368fdb247dbb2861138d48e8e504f03";
    let uriDefCiu;
    let ciudad;
    const ciudades = ['PEKIN', 'LONDON', 'TOKIO', 'PARIS', 'MADRID'];
    let tiempoHora;
    let inicio = true;
    let datosVacios = true;
    let intervalo;
    let confirmar;
    let peticionAb;
    let tiempoAb;
    let cambioCiudad = true;
    let idNuevo;

    //Es la función que se carga al cargar el index, mira si hay alguna ciudad guardada en local storage, y si la hay carga esa, sino carga la uri que recibe desde el index
	function main(uriInicial) {
        uriDefCiu = leerDatos(`ciudad`) || uriInicial;
        if (leerDatos('ciudad') === null) {
            pedirDatos(uriDefCiu, exitoCiudaes, error);
        } else {
            ciudad = uriDefCiu;
            pedirDatos(uri+ciudad.name+apiKey, exitoCiudaes, error);
        }
    }

    //´Función para hacer la llamada AJAX, se le pasa la uri, la funcíón de si tiene exito la llamada, y la función de si da error
	function pedirDatos(uri, exito, error) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    clearInterval(intervalo);
                    exito(xhr);
                } else {
                    error(xhr);
                }
            }
        }
        abortarPeticion(xhr, 500);
        xhr.open('GET', uri);
        xhr.send();
    }

    //Convierte la respuesta en JSON, luego lo guarda en el local storage y despues llama a la función crear html
    function exitoCiudaes(xhr) {
        ciudad = JSON.parse(xhr.response);
        guardarDatos('ciudad', ciudad);
        crearHtml();
    }

    //Si da error pone el estatus del error en consola para ver que pasó
    function error(xhr) {
        console.log(`error: ${xhr.status} ${xhr.statusText}`);
    }
    

    //Función para crear el html, si diera la casualidad de que no hubiera datos para mostrar entondes mostraría error
    function crearHtml() {
        let main = document.querySelector('main');
        if (datosVacios) {
            ponerNombreCiudad(ciudad.name);
            ponerHora();
            tiempoHora = setInterval(ponerHora, 1000);
            ponerFechaEspañol();
            ponerIcon();
            ponerDivCiudades();
        } else {
            ponerNombreCiudad('No Info');
            ponerHora();
            ponerFechaEspañol();
            ponerDivCiudades();
        }
    }

    //Pone el nombre de la ciudad en el html
    function ponerNombreCiudad(nb) {
        let ciu = document.querySelector('#ciudad').querySelector('span');
        ciu.innerHTML = nb;
    }
	
	//pone la hora en el html, poniendo la hora en dos dígitos siempre, y si diera error pondría no info, y si existe el div lo reemplaza, sino lo agrega si es la primera vez que se carga la página
	function ponerHora() {
        let main = document.querySelector('main');
        let divHora;
        let p = crearEtiquetaSola('p');
        if (datosVacios) {
            let horaUTC = aUTC(new Date());
            let hor = parseInt(horaUTC.getHours() + (ciudad.timezone /60/60));
            if (hor === 24) {
                hor = '00';
            } else if (hor > 24) {
                hor = dosDigitos(hor - 24 + '');
            } else {
                hor = dosDigitos(hor + '');
            }
            divHora = crearEtiquetasConDosAtt('div', 'id', 'reloj', 'data-fecha', conseguirFechaConGuion(horaUTC));
            p.innerHTML = `<span>${hor}</span>:<span>${dosDigitos(horaUTC.getMinutes())}</span>:<span>${dosDigitos(horaUTC.getSeconds())}`;
        } else {
            divHora = crearEtiquetasConDosAtt('div', 'id', 'reloj', 'data-fecha', conseguirFechaConGuion(new Date()));
            p.innerHTML = `No info`;
            p.style.color = '#c35';
        }
        divHora.appendChild(p);
        if (main.querySelector('#reloj') !== null) {
            main.replaceChild(divHora, main.querySelector('#reloj'));
        } else {
            main.appendChild(divHora);
        }
    }

    //Una función para poner la fecha con guiones entre medias y se lea mejor
    function conseguirFechaConGuion(fecha) {
        return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth()+1)}-${dosDigitos(fecha.getDate())}`;
    }

    //Para poner la fecha en español
    function ponerFechaEspañol() {
        let main = document.querySelector('main');
        let divFechaEsp = crearEtiquetasConUnAtt('div', 'id', 'fecha');
        if (datosVacios) {
            let day = new Date();
            divFechaEsp.innerHTML = `${fechaEnEspañol(DIAS,MESES,day)}`;
            divFechaEsp.style.color = 'BLACK';
        } else {
            divFechaEsp.innerHTML = `No Info`;
            divFechaEsp.style.color = '#c35';
        }
        if (main.querySelector('#fecha') !== null) {
            main.replaceChild(divFechaEsp, main.querySelector('#fecha'));
        } else {
            main.appendChild(divFechaEsp);
        }
    }

    //Función para poner el icono del tiempo
    function ponerIcon() {
        let main = document.querySelector('main');
        let divTemp = crearEtiquetasConUnAtt('div', 'id', 'temperatura');
        let divSol = crearEtiquetasConUnAtt('div', 'id', 'sol');
        let p = crearEtiquetaSola('p');
        let img;
        if (datosVacios) {
            divTemp.innerHTML = `Temperatura: ${redondear(pasarKelvinCelsius(ciudad.main.temp))} ºC`;
            img = crearEtiquetasConUnAtt('img','src',uriIcon+ciudad.weather[0].icon+uriIconPng);
            divSol.appendChild(img);
        } else {
            p.innerHTML = `No Info`;
            p.style.color = '#c35';
            divSol.appendChild(p);
        }
        if (main.querySelector('#sol') !== null) {
            main.replaceChild(divTemp, main.querySelector('#temperatura'));
             divTemp.appendChild(divSol);
        } else {
            divTemp.appendChild(divSol);
            main.appendChild(divTemp);
            
        }
    }

    //Para poner la lista de las ciudades
    function ponerDivCiudades() {
        let main = document.querySelector('main');
        let divCiu = crearEtiquetasConUnAtt('div', 'id', 'ciudades');
        let ul = crearEtiquetaSola('ul');
        for (let i = 0; i < ciudades.length; i++) {
            let li = crearEtiquetaSola('li');
            let p;
            if (ciudades[i] !== undefined) {
                p = crearEtiquetasConDosAtt('p', 'data-id', ciudades[i], 'data-mostrar', 'true');
            } else {
                p = crearEtiquetasConUnAtt('p', 'data-id', ciudades[i]);
            }
            p.innerHTML = `${ciudades[i]}`;
            li.appendChild(p);
            ul.appendChild(li);
        }
        divCiu.addEventListener('click', elegirCiudad);
        divCiu.appendChild(ul);
        if (main.querySelector('#ciudades') !== null) {
            main.replaceChild(divCiu, main.querySelector('#ciudades'));
        } else {
            main.appendChild(divCiu);
        }
    }

    //Función para cuando se dispara el evento, se mira quien lo disparó y pide los datos
    function elegirCiudad(e) {
        if (e.target.tagName !== 'DIV') {
            clearInterval(tiempoHora);
            inicio = false;
            if (e.target.getAttribute('data-id') !== null) {
                idNuevo = e.target.getAttribute('data-id');
            } else {
                idNuevo = e.target.parentNode.getAttribute('data-id');
            }
            cambioCiudad = false;
            pedirDatos(uri+idNuevo+apiKey, exitoCiudaes, error);
        }
    }

    //Por si tarda en responder la llamada AJAX te saldrá un mensaje de si quieres cancelarla
    function aumentarTiempo() {
        confirmar = confirm('¿Quieres cancelar la petición de datos?');
        if (confirmar) {
            clearInterval(intervalo);
            peticionAb.abort();
            peticionAb = null;
            alert('Ha cancelado la petición');
            if (cambioCiudad === false) {
                crearHtml();
            }
        } else {
            clearInterval(intervalo);
            intervalo = setInterval(aumentarTiempo, tiempoAb);
        }
    }

    //Función para cancelar la petición
    function abortarPeticion(peticion, tiempo) {
        tiempoAb = tiempo;
        peticionAb = peticion;
        intervalo = setInterval(aumentarTiempo, tiempo);
    }

    //devuelve la función main aunque llame desde el index el iniciar
	return { iniciar: main };
})();