'use strict'; //falta abort para la peticion con el confirm
(function() {

	let books = [{id: 0, nombre:'La Bestia', autor:'Carmen Mola', stock:'Sí', precio: 22.99}, 
                {id: 1, nombre:'Nunca', autor:'Ken Follet', stock:'Sí', precio: 24.99}, 
                {id: 2, nombre:'Astérix tras las huellas del grifo', autor:'René Goscinny y Jean-Yves Ferri', stock:'No', precio: 9.95}];
    let libros;
    let TEXT_FORM = [{id: null,nombre:' ',autor:' ',stock:' ',precio: null}];

    document.addEventListener('DOMContentLoaded',crearHTML);

    //funcion para crear el html 
    function crearHTML(){
        libros = leerDatos('books') || ordenarArray(books);
        crearArticulos(libros);
        let añadir = document.querySelector('.añadir');
        añadir.addEventListener('click',eventoAñadir);
    }

    //funcion para crear los articulos, se le pasa un array de objetos  
    function crearArticulos(arrObj){
        document.querySelector('#logo').setAttribute('class','w-100 ')
        let section = document.querySelector('section');
        for (let i = 0; i < arrObj.length; i++){
            let articulo = crearEtiquetasConDosAtt('article','id',arrObj[i].id,'style','width: 18rem');
            articulo.appendChild(crearEtiquetasConUnAtt('h5','class','card-title text-center', arrObj[i].nombre));
            articulo.appendChild(crearEtiquetasConUnAtt('h6','class','card-subtitle mb-2 text-muted text-center', arrObj[i].autor));
            articulo.appendChild(crearEtiquetasConUnAtt('h6','class','card-text text-center', arrObj[i].precio));
            articulo.appendChild(crearEtiquetasConUnAtt('h6','class','card-text text-center' , enStock(arrObj[i].stock)));
            section.appendChild(articulo);
        }
    }


    
    
    //evento del boton añadir
    function eventoAñadir(){
        crearForm(TEXT_FORM);
    }

    //funcion para crear los form, se le pasa el texto del boton y un array 
    function crearForm(TEXT_FORM){
        let att = ['Nombre','Autor','Stock','Precio'];
        let form = crearEtiquetaSola('form');
        form.appendChild(crearEtiquetaSola('h2','Datos del Libro'));
        form.appendChild(crearEtiquetasConDosAtt('input','type','hidden','value','4'));
        for (let i = 0; i < 4;i++){
            let p = crearEtiquetaSola('p');
            p.appendChild(crearEtiquetasConUnAtt('label','for',att[i],att[i]));
            if (i < 2 ){
                p.appendChild(crearEtiquetasConCuatroAtt('input','type','text','required','','value','','id',att[i]));
            }else if (i === 2) {
                let select  = crearEtiquetasConUnAtt('select', 'name', 'Stock');
                select.appendChild(crearEtiquetasConDosAtt('option','value','si','selected','', 'Sí'));
                select.appendChild(crearEtiquetasConUnAtt('option','value','no', 'No'));
                p.appendChild(select);
            }else if (i === 3) {
                p.appendChild(crearEtiquetasConCincoAtt('input','type','number','required','','value','','id',att[i],'step',"0.01"));
            }
            form.appendChild(p);
        }
        let div = crearEtiquetaSola('div');
        div.appendChild(crearEtiquetaSola('button','Agregar'));
        div.appendChild(crearEtiquetaSola('button','No Agregar'));
        div.addEventListener('click',gestionarAgregar);
        form.appendChild(div);
        let modal = document.querySelector('#modal');
        modal.classList.value = 'mostrar';
        modal.appendChild(form);
    }

    //función para gestionar el evento de agregar, mira que sean validos los inputs y si es así los agrega al array 
    //que lo guarda en el local storage también y crea el html de nuevo
    function gestionarAgregar(e){
        if(e.target.innerHTML === 'Agregar'){
            let inputs = cogerInputsForm();
            inputs.forEach(e=>e.classList.remove('error'));
            if (validarInputTexto(inputs[0]) && validarInputTexto(inputs[1]) && validarInputTexto(inputs[2])) {
                let values =cogerValuesInputsForm(inputs);
                values.push(cogerSelect());
                agregarLibro(libros,values);
                crearHTML();
                return true;
            }else{
                console.log('1');
                e.preventDefault();
                return false;
            }
        }else{
            e.preventDefault();
            e.target.parentElement.parentElement.parentElement.className = 'ocultar';
            e.target.parentElement.parentElement.remove();
        }
    }

})();