// Selección de elementos del DOM para el menú móvil
const openMenu = document.querySelector("#open-menu");
const closeMenu = document.querySelector("#close-menu");
const aside = document.querySelector(".nav-top");

// Evento para abrir el menú móvil
if (openMenu && aside) {
    openMenu.addEventListener("click", () => {
        aside.classList.add("aside-visible");
    });
}

// Evento para cerrar el menú móvil
if (closeMenu && aside) {
    closeMenu.addEventListener("click", () => {
        aside.classList.remove("aside-visible");
    });
}