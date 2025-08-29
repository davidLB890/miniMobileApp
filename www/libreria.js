function cargarSelect(select, key){
   
    //let key = localStorage.getItem("apiKey")
    if(key){
        fetch(url + 'ciudades.php', { 
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
                
                document.querySelector(select).innerHTML = "" //PREGUNTAR POR QUÉ AL PASARLE EL SELECT COMO PARAMETRO MANDA AL ERROR
                for (let i = 0; i < data.ciudades.length; i++) {
                    const unaCiudad = data.ciudades[i];
                    document.querySelector(select).innerHTML += `
                    <ion-select-option value="${unaCiudad.id}">${unaCiudad.nombre}</ion-select-option>`
                }
            }
        })
        .catch(function(error) {
            presentToast(error, 'No Autorizado', 'primary');
        });

    }else{
        router.push('/login');
    }

}

function cargarSelectCat(select, key){
   
    //let key = localStorage.getItem("apiKey")
    if(key){
        fetch(url + 'categorias.php', { 
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
                
                document.querySelector(select).innerHTML = "" //PREGUNTAR POR QUÉ AL PASARLE EL SELECT COMO PARAMETRO MANDA AL ERROR
                for (let i = 0; i < data.categorias.length; i++) {
                    const unaCat = data.categorias[i];
                    document.querySelector(select).innerHTML += `
                    <ion-select-option value="${unaCat.id}">${unaCat.nombre}</ion-select-option>`
                }
            }
        })
        .catch(function(error) {
            presentToast(error, 'No Autorizado', 'primary');
        });

    }else{
        router.push('/login');
    }

}

function calcularDistancia(a, b){

    console.log("haversine", { a, b });
    const EARTH_RADIUS_IN_MEETERS = 6378137;
    //const EARTH_RADIUS_IN_KILOMETERS = 6378;

    const R = EARTH_RADIUS_IN_MEETERS;
    const aLat = a.latitude || a.lat || a.latitud;
    const bLat = b.latitude || b.lat || b.latitud;
    const aLng = a.longitude || a.longitud || a.lng || a.lon;
    const bLng = b.longitude || b.longitud || b.lng || b.lon;
    const dLat = ((bLat - aLat) * Math.PI) / 180.0;
    const dLon = ((bLng - aLng) * Math.PI) / 180.0;
    const f = 
        Math.pow(Math.sin(dLat / 2.0), 2) +
        Math.cos((aLat * Math.PI) / 180.0) *
        Math.cos((bLat * Math.PI) / 180.0) *
        Math.pow(Math.sin(dLon / 2.0), 2);
        
    const c = 2 * Math.atan2(Math.sqrt(f), Math.sqrt(1 - f));
    return R * c;
}



function buscarLatlngPorId(ciudades, id){
    var latlng;

    for (let i = 0; i < ciudades.ciudades.length; i++) {
        const unaCiudad = ciudades.ciudades[i];
        if(unaCiudad.id == id){
            latlng = L.latLng(unaCiudad.latitud, unaCiudad.longitud);
            return latlng
        }
    }

    return latlng;
}

function buscarNombrePorId(ciudades, id){
    var nombre;

    for (let i = 0; i < ciudades.ciudades.length; i++) {
        const unaCiudad = ciudades.ciudades[i];
        if(unaCiudad.id == id){
            nombre =unaCiudad.nombre
            return nombre
        }
    }

    return nombre;
}
function buscarIdDeptoPorIdCiudad(ciudades, idCiudad){
    var idDepto;
    //let idDeptoCiudad;

    for (let i = 0; i < ciudades.ciudades.length; i++) {
        const ciudad = ciudades.ciudades[i];
        if(ciudad.id == idCiudad){
            idDepto = ciudad.id_departamento
            return idDepto;
        }
    }

    return idDepto;
}
