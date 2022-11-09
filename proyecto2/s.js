const API_URL = "https://agify.io/"
const formulario = document.querySelector("#formulario");
const xhr = new XMLHttpRequest();
//import axios from axios;

//crear el evento
formulario.addEventListener("submit", validarFormulario)


//mis funciones
function validarFormulario(e) {
    e.preventDefault();
    const nombre = document.querySelector("#nombre").value


    const respuesta = document.getElementById("respuesta");
    respuesta.textContent = `Hola ${nombre} `
}
//numero entre 1 y 6
console.log(respuesta);

xhr.withCredentials = true;
xhr.addEventListener("load", function() {
    if (this.respuesta == this.respuesta) {
        console.log(this.respuesta);
    }
});
xhr.open("nombre", "https://agify.io/nombre");
//xhr.setRequestHeader(nombre);
//xhr.send(nombre);
console.log(xhr);

const option = {
    method: "GET",
    URL: "https://agify.io/nombre",
    params: { name: "nombre", apikey: "" }
    /* headers: {
         "https://agify.io/KEY": " / ",
         "https://agify.io/HOST": "https://agify.io/"
     }*/
};
/*axios.request(option).then(function(respuesta) {
    console.log(respuesta.API_URL);
}).catch(function(err) {
    console.log(err);
});*/