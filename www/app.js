const { Capacitor } = require("@capacitor/core");

let router = document.querySelector("ion-router");

// páginas
let paginaRegistro = document.querySelector("pagina-registro");
let paginaIngresar = document.querySelector("pagina-ingresar");
let paginaDistancia = document.querySelector("pagina-distancia-ciudades");
let paginaListadoEnvio = document.querySelector("pagina-listado-envios");
let paginaDetalleEnvio = document.querySelector("pagina-detalle-envio");
let paginaAgregarEnvio = document.querySelector("pagina-agregar-envio");
let paginaCiudadMasCercana = document.querySelector("pagina-ciudad-mas-cercana");
let paginaEstadisticas = document.querySelector("pagina-estadisticas");
let paginaGastos = document.querySelector("pagina-gastos");
let paginaTop = document.querySelector("pagina-top");

//URL
let url= "https://envios.develotion.com/";
let key = localStorage.getItem("apiKey")

let ciudades;
let deptos;

/* verificadoRapido()
function verificadoRapido(){*/

    function agregarCiudadesALista(){
    
        fetch(url + 'ciudades.php', { 
            headers: {
                "apikey": key,
                "Content-Type": "application/json"
            }
        })
        .then(resp => resp.json())
        .then(function(data) {
            if (data.error) {
                presentToast(data.error, 'Error', 'danger');
            } else {
                ciudades = data
            }
        })
        .catch(function(error) {
            presentToast(error, 'No Autorizado', 'primary');
        });
    }

    function agregarDepartamentosALista(){
    
        fetch(url + 'departamentos.php', { 
            headers: {
                "apikey": key,
                "Content-Type": "application/json"
            }
        })
        .then(resp => resp.json())
        .then(function(data) {
            if (data.error) {
                presentToast(data.error, 'Error', 'danger');
            } else {
                deptos = data.departamentos
            }
        })
        .catch(function(error) {
            presentToast(error, 'No Autorizado', 'primary');
        });
    
    }

    
/*     function verificadoRapido(){
        //let keyyy = localStorage.getItem("apiKey")

         
        if(key){

            if(!ciudades && !deptos){
                
                agregarCiudadesALista();
                
                agregarDepartamentosALista();
            }
        }
         
    } */
    verificadoRapidoUno()
    function verificadoRapidoUno(){

        if(key){ 
        
            if(!ciudades && !deptos){
    
                agregarCiudadesALista();
                
                agregarDepartamentosALista();
            }
         }
    }
//}

/* ------------------cierre del menú-------------- */
let itemsMenu = document.getElementsByClassName("item-menu");

for (let i = 0; i < itemsMenu.length; i++) {
    itemsMenu[i].addEventListener("click", cerrarMenu);
}

function cerrarMenu() {
    document.querySelector("ion-menu").close();
}

/* -------------Cierre de sesión --------------------*/
document.querySelector("#itemCerrarSesion").addEventListener("click", cerrarSesion)

function cerrarSesion(){
    localStorage.removeItem("apiKey");
    localStorage.removeItem("id");
} 


// mapa
let map;
let map2;
let map3;


// cada vez que cambia la ruta de navegación muestro u oculto cosas
document.querySelector("ion-router").addEventListener("ionRouteDidChange", cambioDeRuta);


function cambioDeRuta(event) {
    let navegacion = event.detail;

    // ocultar todas las páginas y sus componentes html
    let paginas = document.getElementsByClassName('pagina');
   
    for (let i = 0; i < paginas.length; i++) {
        paginas[i].style.visibility = "hidden";
        // paginas[i].style.display = "none";
    }

    // segun la pagina a la que estemos navegando, hacemos visibles sus componentes

    if (navegacion.to === "/detalle-envio") {
        paginaDetalleEnvio.style.visibility = "visible";
        detalleEnvios()
    }

    if (navegacion.to === "/top") {
        paginaTop.style.visibility = "visible";
        deptosMasEnvios()
    }

    if (navegacion.to === "/gastos") {
        paginaGastos.style.visibility = "visible";
        calcularGastosTotales()
    }

    if (navegacion.to === "/agregar-envio") {
        
        //habria que hacer un if que verifique que hay una apiKey
        paginaAgregarEnvio.style.visibility = "visible";
        key = localStorage.getItem("apiKey")
        let ciudad1 = "#selectCiudadOrigen"
        let ciudad2 = "#selectCiudadDestino"
        let cat = "#selectCategoria"
        cargarSelect(ciudad1, key)
        cargarSelect(ciudad2, key)
        cargarSelectCat(cat, key)
        verificadoRapidoUno()
        //agregarEnvios()
    }

    if (navegacion.to === "/listado-envios") {
        paginaListadoEnvio.style.visibility = "visible";
        listarEnvios();
    }

    if (navegacion.to === "/ciudad-mas-cercana") {
        paginaCiudadMasCercana.style.visibility = "visible";
        obtenerUbicacionActual()
    }

    /* if (navegacion.to === "pagina-listado-envios") {
        paginaEstadisticas.style.visibility = "visible";
        listarLocales();
    } */

    if (navegacion.to === "/login") {
        paginaIngresar.style.visibility = "visible";
    }

    if (navegacion.to === "/" || navegacion.to === "/registro") {
        paginaRegistro.style.visibility = "visible";
    }

    if (navegacion.to === "/distancia-ciudades") {
        paginaDistancia.style.visibility = "visible";
        let key = localStorage.getItem("apiKey")
        let ciudad1 ="#slcCiudadUnoDis"
        let ciudad2 = "#slcCiudadDosDis"
        cargarSelect(ciudad1, key)
        cargarSelect(ciudad2, key)
    }
}




// -------------------  Mostrar / Ocultar Password -------------------  
document.getElementById('mostrarPass').onclick = function() {
    // si el elemento tiene como atributo icon fa-eye lo cambio a fa-eye-slash y viceversa.
    if (this.getAttribute("name") == 'eye-outline') {
        this.setAttribute("name", "eye-off-outline");
        // cambio tipo de input a password.
        document.getElementById("passwordLogin").type = 'password';
    }
    else {
        // ver password
        this.setAttribute("name", "eye-outline");
        // cambio tipo de input a text.
        document.getElementById("passwordLogin").type = 'text';
    }
}


// -------------------  Pagina Ingresar -------------------  
document.getElementById("btnIngresar").addEventListener('click', ingresar);

function ingresar() {
    let usuario = document.getElementById('usuarioLogin').value;
    let password = document.getElementById('passwordLogin').value;

    try {
        if (!usuario) {
            throw "Ingrese usuario para continuar";
        }
        if (!password) {
            throw "Ingrese contraseña para continuar";
        }
        
        fetch(url + 'login.php', {
            method: "POST",
            body: JSON.stringify({
                "usuario": usuario,
                "password": password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(respuesta => respuesta.json())
        .then(function(data){
            if (data.error){
                // mostrar mensaje de error usando un componente Toast de Ionic
                presentToast(data.error, 'Error', 'danger');
            } else {
                // si el login fue correcto, agregar el apikey al local storage
                localStorage.setItem('apiKey', data.apiKey);
                localStorage.setItem('id', data.id);
                
                router.push('/agregar-envio');
                //verificadoRapido()
                //agregarCiudadesALista();
                //agregarDepartamentosALista();
                // navegar a la pagina de envíos
                //ocultarMostrarLoginRegister()
            }
        })
        //.then(verificadoRapido())
        .catch(function(error) {
            presentToast(error, 'No Autorizado', 'primary');
        });

        document.getElementById('usuarioLogin').value = "";
        document.getElementById('passwordLogin').value = "";
    }
    catch(error) {
        presentToast(error, 'Datos Incorrectos', 'primary');
    }
    
}

/* function ocultarMostrarLoginRegister(){
    if(document.getElementById('loginItem').style.disabled == "false" && document.getElementById('registerItem').style.disabled == "false" && document.getElementById('logoutItem').style.disabled == "true"){
        document.getElementById('loginItem').style.disabled == "true";
        document.getElementById('registerItem').style.disabled == "true";
        document.getElementById('logoutItem').style.visibility = "false";
    } else {
        document.getElementById('loginItem').style.disabled == "false";
        document.getElementById('registerItem').style.disabled == "false";
        document.getElementById('logoutItem').style.disabled == "true";
    }
} */



// -------------------  Pagina Registro -------------------  
document.getElementById("btnRegistro").addEventListener('click', registro);

function registro() {
    let username = document.getElementById('inputUsername').value;
    let password = document.getElementById('inputPass').value;
    let password2 = document.getElementById('inputPass2').value;
    
    // hacer validaciones
    // todos los inputs requeridos
    // pass y pass2 son iguales
    try {
        if (!username) {
            throw "Ingrese un usuario para continuar";
        }
        if (!password) {
            throw "Ingrese contraseña para continuar";
        }
        if (password != password2) {
            throw "Contraseña y repetición no coinciden";    
        }
        
        // llamada a la API para registrarnos
        fetch(url + 'usuarios.php', {
            method: 'POST',
            body: JSON.stringify({
                "usuario": username,
                "password": password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(resp => resp.json())
        .then(function(data) {
            if (data.error) {
                // mostrar mensaje de error usando un componente Toast de Ionic
                presentToast(data.error, 'Error', 'danger');
            } else {
                localStorage.setItem('apiKey', data.apiKey);
                router.push('/locales');
            }
        })
        .catch(function(error) {
            presentToast(error, 'No Autorizado', 'primary');
        });   
    }
    catch(error) {
        presentToast(error, 'Datos Incorrectos', 'primary');
    }
}

// -------------------  Pagina Agregar Envío -------------------


document.querySelector("#btnAgregarEnvio").addEventListener("click", agregarEnvios);
function agregarEnvios() {

    let ciuOrigen = document.getElementById("selectCiudadOrigen").value
    let ciuDestino = document.getElementById("selectCiudadDestino").value
    let categoria = document.getElementById("selectCategoria").value 
    let peso = document.getElementById("inputPeso").value

    let key = localStorage.getItem("apiKey")
    //debugger
    try {
        if (!key) {
            router.push('/login');
            throw "Ingrese al sistema para continuar";
        }

        if(!ciuOrigen){
            throw "seleccione ciudad de origen"
        }
        if(!ciuDestino){
            throw "seleccione ciudad de destino"
        }
        if(!categoria){
            throw "seleccione categoria"
        }
        if(!peso){
            throw "ingrese peso"
        }

        let origen = document.querySelector("#selectCiudadOrigen").value;
        let destino = document.querySelector("#selectCiudadDestino").value;
        
        let latOrigen = buscarLatlngPorId(ciudades, origen)
        let latDestino = buscarLatlngPorId(ciudades, destino)  

        let distanciaa = calcularDistancia(latOrigen, latDestino)/1000

        let costo = calcularPrecio(distanciaa, peso)
        
        let dis = distanciaa.toString();
        let cos = costo.toString();
        
        /* let ciudad1 = "#selectCiudadOrigen" esto lo había hecho acá pero al final creo que es mejor si carga los selects desde el rout 
        let ciudad2 = "#selectCiudadDestino"
        cargarSelect(ciudad1, key)
        cargarSelect(ciudad2, key) */
        
        // llamada a la API para postear envío
        fetch(url + 'envios.php', { 
            method: "POST",
            body: JSON.stringify({
                "idUsuario": localStorage.getItem("id"),
                "idCiudadOrigen": ciuOrigen,
                "idCiudadDestino": ciuDestino,
                "peso": peso,
                "distancia": dis,
                "precio": cos,
                "idCategoria": categoria
            }),
            headers: {
                "apikey": key,
                "Content-Type": "application/json"
            }
        })
        .then(resp => resp.json())
        .then(function(data) {
            if (data.error) {
                // mostrar mensaje de error usando un componente Toast de Ionic
                presentToast(data.error, 'Error', 'danger');
            } else {
                
            }
        })
        .catch(function(error) {
            presentToast(error, 'No Autorizado', 'primary');
        });
    }
    catch(error) {
        presentToast(error, 'Datos Incorrectos', 'primary');
    }  
    
}

function calcularPrecio(distancia, peso){
    let precio; 

    let precioBase = 50;

    let precioPorKilo = Math.floor(peso)*10; //lo que quiero hacer es redondearlos hacia abajo, cosa que si pesa 1.9k que sume solamente 10

    
    distancia = Math.floor(distancia)
    let precioKilometro = Math.floor(distancia/100)*50
    if(precioKilometro == 0){
        precioKilometro = 50;
    }


    precio = precioBase + precioPorKilo + precioKilometro;

    return precio;
}

document.querySelector("#btnBuscarDistancias").addEventListener("click", distancias)

/* distancia de ciudades */
function distancias(){

    //let key = localStorage.getItem("apiKey")
    
    /* cargarSelect("#slcCiudadUnoDis")
    cargarSelect("#slcCiudadDosDis") */
    
    let origen = document.querySelector("#slcCiudadUnoDis").value;
    let destino = document.querySelector("#slcCiudadDosDis").value;
    
    let latOrigen = buscarLatlngPorId(ciudades, origen)
    let latDestino = buscarLatlngPorId(ciudades, destino)

    let distancia = calcularDistancia(latOrigen, latDestino)

    document.querySelector("#pDistancia").innerHTML= distancia;
    
    if (map != undefined) { 
        map.remove(); 
    } 
    // cargo el mapa
    map = L.map('map').setView([latOrigen.lat, latOrigen.lng], 18);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker(latOrigen).addTo(map)
    L.marker(latDestino).addTo(map)

    

}

//Función para listado de envíos
function listarEnvios(){

    fetch(url + `envios.php?idUsuario=${localStorage.getItem("id")}`, { 
        headers: {
            "apikey": key,
            "Content-Type": "application/json"
        }
    })
    .then(resp => resp.json())
    .then(function(data) {
        if (data.error) {
            // mostrar mensaje de error usando un componente Toast de Ionic
            presentToast(data.error, 'Error', 'danger');
        } else {
            
            let lista = document.getElementById("listaEnvios");
                lista.innerHTML = ""; // vacío la lista antes de mostrarla.

                let item  = '';

                for (let i = 0; i < data.envios.length; i++) { /* href="/detalle-local?id=${local._id} */
                    const unEnvio = data.envios[i];
                    item = `<ion-item href="/detalle-envio?Id=${unEnvio.id}">
                                <ion-label>
                                    <h2>Origen: ${buscarNombrePorId(ciudades, unEnvio.ciudad_origen)}</h2>
                                    <h2>Destino: ${buscarNombrePorId(ciudades, unEnvio.ciudad_destino)}</h2>
                                    <h3>Distancia: ${unEnvio.distancia.toString()} </h3>
                                    <h3>Costo:${unEnvio.precio.toString()}</h3>
                                    </ion-label>
                                    </ion-item> 
                                    <ion-item>
                                        <ion-button (click)="borrarEnvio(${unEnvio.id})" >Borrar Envio</ion-button>
                                    </ion-item>`;
                    lista.innerHTML += item;   
                }
        }
    })
    .catch(function(error) {
        presentToast(error, 'No Autorizado', 'primary');
    });
    
}

function detalleEnvios(){
    let paramString = window.location.href.split('?')[1];
    let idEnvio = paramString.split('=')[1];

    fetch(url + `envios.php?idUsuario=${localStorage.getItem("id")}`, { 
        headers: {
            "apikey": key,
            "Content-Type": "application/json"
        }
    })
    .then(resp => resp.json())
    .then(function(data) {
        if (data.error) {
            // mostrar mensaje de error usando un componente Toast de Ionic
            presentToast(data.error, 'Error', 'danger');
        } else {

            for (let i = 0; i < data.envios.length; i++) { /* href="/detalle-local?id=${local._id} */
                const unEnvio = data.envios[i];
                if(unEnvio.id == idEnvio){
                    document.querySelector("#pIdEnvio").innerHTML = "ID del envío: " +  unEnvio.id
                    document.querySelector("#pOrigen").innerHTML = "Nombre ciudad origen: " + buscarNombrePorId(ciudades, unEnvio.ciudad_origen)
                    document.querySelector("#pDestino").innerHTML = "Nombre ciudad destino: " + buscarNombrePorId(ciudades, unEnvio.ciudad_destino)
                    document.querySelector("#pPeso").innerHTML = "Peso: " + unEnvio.peso
                    document.querySelector("#paDistancia").innerHTML = "Distancia: " + unEnvio.distancia.toString()
                    document.querySelector("#pPrecio").innerHTML = "Precio: " + unEnvio.precio

                    let lOrigen = buscarLatlngPorId(ciudades, unEnvio.ciudad_origen)
                    let lDestino = buscarLatlngPorId(ciudades, unEnvio.ciudad_destino)

                    if (map2 != undefined) { 
                        map2.remove(); 
                    } 
                    // cargo el mapa
                    map2 = L.map('map2').setView([lOrigen.lat, lOrigen.lng], 18);
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map2);
                
                    L.marker(lOrigen).addTo(map2)
                    L.marker(lDestino).addTo(map2)
                }
            }
        }
    })
    .catch(function(error) {
        presentToast(error, 'No Autorizado', 'primary');
    });
}

function borrarEnvio(id){

    fetch(url + `envios.php`, { 
        method: "DEL",
        headers: {
            "apikey": key,
            "Content-Type": "application/json"
        },
        body: {
            "idEnvio": id
        }
    })
    .then(resp => resp.json())
    .then(function(data) {
        if (data.error) {
            // mostrar mensaje de error usando un componente Toast de Ionic
            presentToast(data.error, 'Error', 'danger');
        }
    })

}


function calcularGastosTotales(){

    fetch(url + `envios.php?idUsuario=${localStorage.getItem("id")}`, { 
        headers: {
            "apikey": key,
            "Content-Type": "application/json"
        }
    })
    .then(resp => resp.json())
    .then(function(data) {
        if (data.error) {
            // mostrar mensaje de error usando un componente Toast de Ionic
            presentToast(data.error, 'Error', 'danger');
        } else {
            
            let gastos = 0;

                for (let i = 0; i < data.envios.length; i++) { /* href="/detalle-local?id=${local._id} */
                    const unEnvio = data.envios[i];
                    gastos += unEnvio.precio;
                }

                document.querySelector("#pGastosTotales").innerHTML = "$" + gastos
            }
        })
}

function agregarContadorAdeptos(){

    for (let i = 0; i < deptos.length; i++) {
        const depto = deptos[i];
        
        if(!depto.miVariable){
            depto.miVariable = 0;
        }
    }
}

function deptosMasEnvios(){

    agregarContadorAdeptos()

    fetch(url + `envios.php?idUsuario=${localStorage.getItem("id")}`, { 
        headers: {
            "apikey": key,
            "Content-Type": "application/json"
        }
    })
    .then(resp => resp.json())
    .then(function(data) {
        if (data.error) {
            // mostrar mensaje de error usando un componente Toast de Ionic
            presentToast(data.error, 'Error', 'danger');
        } else {

            for (let i = 0; i < data.envios.length; i++) { 
                const unEnvio = data.envios[i];
                let idDep = buscarIdDeptoPorIdCiudad(ciudades, unEnvio.ciudad_destino)//unEnvio.ciudad_destino.id_departamento
                for (let j = 0; j < deptos.length; j++) {
                    const depto = deptos[j];
                    if(depto.id == idDep){
                        depto.miVariable ++;
                    }
                }
            }

            deptos.sort((a, b) => b.miVariable - a.miVariable)
            //Console.log(deptos)

            let a = 0;
            while (a <=  4) {
                const unDepartamento = deptos[a];
                document.querySelector("#liTop").innerHTML += `
                <ion-item>
                    <ion-label>${unDepartamento.nombre} ${unDepartamento.miVariable}</ion-label>
                </ion-item>`
                a++;
            }
        }
    })
    .catch(function(error) {
        presentToast(error, 'No Autorizado', 'primary');
    });

}

/* function ciudadCercana(){
    let latActual = obtenerUbicacionActual();
    let min = 100000000000000
    let masCercana;

    for (let i = 0; i < ciudades.length; i++) {
        const ciudad = ciudades[i];
        let latCiudad = buscarLatlngPorId(ciudades, ciudad.id);
        let distancia = calcularDistancia(latActual, latCiudad);
        if(distancia < min){
            masCercana = ciudad;
        }
    }

    document.querySelector("#pDistanciaCercana").innerHTML = masCercana.nommbre

    return masCercana;
} */

function obtenerUbicacionActual(){
    let latLng
    if(Capacitor.isNativePlatform()) {
        Capacitor.Plugins.Geolocation.getCurrentPosition({
            enableHighAccuracy: true, 
          })
        alert("sip")

        Capacitor.Plugins.Geolocation.getCurrentPosition()
        .then(info => {
            let lat = info.coords.latitude
            let long = info.coords.longitude
            latLng = L.latLng(lat, long);
            alert("hola")
            alert(latLng.lat)
            alert(latLng.lng)

            let min = 100000000000000
            let masCercana;

            for (let i = 0; i < ciudades.ciudades.length; i++) {
                const ciudad = ciudades.ciudades[i];
                let latCiudad = buscarLatlngPorId(ciudades, ciudad.id);
                let distancia = calcularDistancia(latLng, latCiudad);
                if(distancia < min){
                    masCercana = ciudad;
                    min = distancia
                }
            }
        
        document.querySelector("#pDistanciaCercana").innerHTML ="La ciudad más cercana a su ubicación es " + masCercana.nombre
            
    })

        
        /* .catch(error){
            
        } */
    }else{
        //presentToast("Esta funcionalidad solo se puede ejecutar en un dispositivo android", "Error de plataforma", "primary")
        alert("nop")
    } 
    return latLng
} 

document.querySelector("#btnCompartir").addEventListener("click", compartirEnvio);

function compartirEnvio(){
    let origen = document.querySelector("#pOrigen").value
    let destino = document.querySelector("#pDestino").value
    let peso = document.querySelector("#pPeso").value
    let distancia = document.querySelector("#paDistancia").value
    let precio = document.querySelector("#pPrecio").value

    let origenNombre = buscarNombrePorId(ciudades, origen)
    let destinoNombre = buscarNombrePorId(ciudades, destino)

    if(Capacitor.isNativePlatform()) {
        Capacitor.Plugins.Share.share({
            title: 'Acá te comparto mi envío',
            text: `Origen: ${origenNombre}, destino: ${destinoNombre}, peso: ${peso}, distancia: ${distancia}, costo: ${precio}`,
        })
    }
}




// mostrar un toast con mensaje al usuario
async function presentToast(mensaje, header, color) {
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = 3000;
    toast.color = color;
    toast.header = header;
    toast.icon = 'information-circle-outline';
    document.body.appendChild(toast);
    return toast.present();
  }































  
    // function cargarDetalleEnvio() {
    //     // obtengo el id del local de la url
    //     let paramString = window.location.href.split('?')[1];
    //     let idLocal = paramString.split('=')[1];
    
    //     // asegurarnos de que haya un usuario logueado.
    //     let token = localStorage.getItem("token"); 
       
    //     if (token) {
    //         fetch(`https://ort-tddm.herokuapp.com/locales/${idLocal}`, {
    //             headers: {
    //                 "Authorization": `Bearer ${token}`
    //             }
    //         })
    //         .then(respuesta => respuesta.json())
    //         .then(function(response) {
    //             if (response.error) {
    //                 // mostrar mensaje de error usando un componente Toast de Ionic
    //                 presentToast(response.error, 'Error', 'danger');
    //             } else {
                   
    //                 document.getElementById("localImagen").setAttribute("src", response.imagen);
    //                 document.getElementById("localNombre").innerHTML = response.nombre;
    //                 document.getElementById("localServicios").innerHTML = response.servicios;
    //                 document.getElementById("localHorario").innerHTML   = `<ion-icon name="time"></ion-icon> ${response.horario}`;
    //                 document.getElementById("localDireccion").innerHTML = `<ion-icon name="location"></ion-icon> ${response.direccion}`;
    //                 document.getElementById("localTelefono").innerHTML  = `<ion-icon name="call"></ion-icon> ${response.telefono}`;
                    
    //                 // documentación mapa https://leafletjs.com/examples/quick-start/
    //                 const lat = response.lat;
    //                 const lng = response.lng;
    //                 if (map != undefined) { 
    //                     map.remove(); 
    //                 } 
    //                 // cargo el mapa
    //                 map = L.map('map').setView([lat, lng], 18);
                  
    //                 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //                     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //                 }).addTo(map);
            
    //                 L.marker([lat, lng]).addTo(map)
    //                     .bindPopup(`<strong>${response.nombre}</strong><br> ${response.direccion}`)
    //                     .openPopup();
                   
    //             }
    //         })
    //         .catch(function(error) {
    //             presentToast(error, 'No Autorizado', 'primary');
    //         });
    
    //     } else {
    //         // no existe usuario autenticado
    //         router.push('/login');
    //     }
    // }
    
    // funcion para listar los locales 
    // function listarLocales() {
    //     // asegurarnos de que haya un usuario logueado.
    //     let token = localStorage.getItem("token"); 
       
    //     if (token) {
    //         fetch('https://ort-tddm.herokuapp.com/locales', {
    //             headers: {
    //                 "Authorization": `Bearer ${token}`
    //             }
    //         })
    //         .then(respuesta => respuesta.json())
    //         .then(function(data) {
    //             if (data.error) {
    //                 // mostrar mensaje de error usando un componente Toast de Ionic
    //                 presentToast(data.error, 'Error', 'danger');
    //             } else {
    //                 let lista = document.getElementById("listaLocales");
    //                 lista.innerHTML = ""; // vacío la lista antes de mostrarla.
    
    //                 let item  = '';
    
    //                 data.forEach(function(local, index){
    //                     item = `<ion-item href="/detalle-local?id=${local._id}">
    //                                 <ion-avatar slot="start">
    //                                     <img src="${local.imagen}" />
    //                                 </ion-avatar>
    //                                 <ion-label>
    //                                     <h2>${local.nombre}</h2>
    //                                     <h3>${local.horario}</h3>
    //                                     <p>${local.servicios}</p>
    //                                 </ion-label>
    //                             </ion-item>`; 
    //                     lista.innerHTML += item;   
    //                 });
    //             }
    //         })
    //         .catch(function(error) {
    //             presentToast(error, 'No Autorizado', 'primary');
    //         });
    
    //     } else {
    //         // no existe usuario autenticado
    //         router.push('/login');
    //     }
    // }