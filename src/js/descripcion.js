// Selección de elementos del DOM para el modal de descripción
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Evento para cerrar el modal con el botón de cerrar
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

// Evento para cerrar el modal al hacer clic fuera del contenido
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});