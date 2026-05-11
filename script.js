 // Selecciona el menú y el encabezado del html y Style.css
 const menu = document.querySelector("nav");
 const header = document.querySelector("#mi-encabezado");

 // Obtén la altura del encabezado
 const headerHeight = header.offsetHeight;

 // Función que cambia el color de fondo del menú cuando se desplaza
 window.addEventListener("scroll", () => {
     if (window.scrollY > headerHeight) {
         menu.style.backgroundColor = "rgba(0, 0, 0, 0)"; // Cambia el color de fondo a azul
     } else {
         menu.style.backgroundColor = "rgba(0, 0, 0, 0)"; // Vuelve al fondo transparente
     }
 });

// Activar el efecto de manera aleatorea 
const glitch = document.querySelector(".glitch-screen");

setInterval(() => {

    const random = Math.random();

    if(random > 0.92){

        glitch.style.opacity = "1";

        glitch.style.background =
        `url('img/noise.gif')`;

        setTimeout(() => {
            glitch.style.opacity = "0";
        }, 120);

    }

}, 3000);
/*Cambiar fondos*/ 
const fondos = [
    "img/bg1.gif",
    "img/bg2.gif",
    "img/bg3.gif"
];

setInterval(() => {

    const random =
    fondos[Math.floor(Math.random() * fondos.length)];

    document.body.style.backgroundImage =
    `url(${random})`;

}, 30000);
