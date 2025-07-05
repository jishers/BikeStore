// Obtener productos del carrito desde localStorage
let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

// Elementos del DOM
const facturaFecha = document.getElementById('factura-fecha');
const clienteNombre = document.getElementById('cliente-nombre');
const clienteDireccion = document.getElementById('cliente-direccion');
const clienteTelefono = document.getElementById('cliente-telefono');
const clienteEmail = document.getElementById('cliente-email');
const productosTablaBody = document.getElementById('productos-tabla-body');
const facturaSubtotal = document.getElementById('factura-subtotal');
const facturaTotal = document.getElementById('factura-total');
const confirmarCompra = document.getElementById('confirmar-compra');

// Debug: Verificar si los elementos se encontraron
console.log('Elementos del DOM encontrados:');
console.log('facturaFecha:', facturaFecha);
console.log('clienteNombre:', clienteNombre);
console.log('productosTablaBody:', productosTablaBody);
console.log('facturaSubtotal:', facturaSubtotal);
console.log('facturaTotal:', facturaTotal);
console.log('confirmarCompra:', confirmarCompra);

// Función para inicializar la factura
function inicializarFactura() {
    console.log('Inicializando factura...');
    console.log('Productos en carrito:', productosEnCarrito);
    
    // Verificar si hay productos en el carrito
    if (!productosEnCarrito || productosEnCarrito.length === 0) {
        console.log('No hay productos en el carrito');
        mostrarError('No hay productos en el carrito');
        return;
    }
    
    // Verificar si el usuario está logueado
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (!usuarioLogueado) {
        mostrarError('Debes iniciar sesión para continuar');
        setTimeout(() => {
            window.location.href = 'login-registro.html';
        }, 2000);
        return;
    }
    
    // Llenar datos del cliente
    llenarDatosCliente(usuarioLogueado);
    
    // Llenar fecha
    llenarFecha();
    
    // Llenar productos
    llenarProductos();
    
    // Calcular y mostrar totales
    calcularTotales();
    
    // Configurar event listeners
    configurarEventListeners();
}

// Función para llenar los datos del cliente
function llenarDatosCliente(usuario) {
    console.log('Llenando datos del cliente:', usuario);
    clienteNombre.textContent = usuario.nombre || 'No disponible';
    clienteDireccion.textContent = usuario.direccion || 'No disponible';
    clienteTelefono.textContent = usuario.telefono || 'No disponible';
    clienteEmail.textContent = usuario.email || 'No disponible';
    console.log('Datos del cliente llenados');
}

// Función para llenar la fecha
function llenarFecha() {
    const fecha = new Date();
    facturaFecha.textContent = fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para llenar los productos en la tabla
function llenarProductos() {
    console.log('Llenando productos en la tabla');
    productosTablaBody.innerHTML = '';
    
    productosEnCarrito.forEach(producto => {
        console.log('Procesando producto:', producto);
        const subtotal = parseFloat(producto.precio) * producto.cantidad;
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>
                <strong>${producto.nombre}</strong>
                <br>
                <small style="color: #666;">${producto.descripcion || 'Sin descripción'}</small>
            </td>
            <td>${producto.cantidad}</td>
            <td>$${parseFloat(producto.precio).toLocaleString()}</td>
            <td><strong>$${subtotal.toLocaleString()}</strong></td>
        `;
        productosTablaBody.appendChild(fila);
    });
    console.log('Productos llenados en la tabla');
}

// Función para calcular y mostrar totales
function calcularTotales() {
    const subtotal = productosEnCarrito.reduce((acc, producto) => {
        return acc + (parseFloat(producto.precio) * producto.cantidad);
    }, 0);
    
    facturaSubtotal.textContent = `$${subtotal.toLocaleString()}`;
    facturaTotal.textContent = `$${subtotal.toLocaleString()}`;
}

// Función para configurar event listeners
function configurarEventListeners() {
    // Event listener para confirmar compra
    if (confirmarCompra) {
        confirmarCompra.addEventListener('click', procesarCompra);
    }
}

// Función para procesar la compra
function procesarCompra() {
    // Mostrar confirmación
    Swal.fire({
        title: '¿Confirmar compra?',
        icon: 'question',
        html: `
            <p>¿Estás seguro de que quieres proceder con la compra?</p>
            <p><strong>Total:</strong> ${facturaTotal.textContent}</p>
        `,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#8B0000',
        cancelButtonColor: '#6c757d'
    }).then((result) => {
        if (result.isConfirmed) {
            // Simular procesamiento de compra
            Swal.fire({
                title: 'Procesando compra...',
                html: 'Por favor espera mientras procesamos tu compra.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Simular delay de procesamiento
            setTimeout(() => {
                // Mostrar mensaje de éxito
                Swal.fire({
                    title: '¡Compra exitosa!',
                    icon: 'success',
                    html: `
                        <p>Tu compra ha sido procesada correctamente.</p>
                        <p>Recibirás un email de confirmación.</p>
                        <p><strong>Número de factura:</strong> #${generarNumeroFactura()}</p>
                    `,
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#28a745'
                }).then(() => {
                    // Vaciar carrito
                    productosEnCarrito = [];
                    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                    
                    // Mostrar notificación
                    Toastify({
                        text: "¡Compra realizada con éxito!",
                        duration: 5000,
                        close: true,
                        gravity: "top",
                        position: "right",
                        stopOnFocus: true,
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                            borderRadius: "2rem",
                            textTransform: "uppercase",
                            fontSize: ".75rem"
                        },
                        offset: {
                            x: '1.5rem',
                            y: '1.5rem'
                        },
                        onClick: function(){}
                    }).showToast();
                    
                    // Redirigir a la página principal
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                });
            }, 2000);
        }
    });
}

// Función para generar número de factura
function generarNumeroFactura() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minuto = String(fecha.getMinutes()).padStart(2, '0');
    const segundo = String(fecha.getSeconds()).padStart(2, '0');
    
    return `${año}${mes}${dia}${hora}${minuto}${segundo}`;
}

// Función para mostrar errores
function mostrarError(mensaje) {
    Swal.fire({
        title: 'Error',
        text: mensaje,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc3545'
    });
}

// Función para imprimir factura
function imprimirFactura() {
    window.print();
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarFactura);
} else {
    inicializarFactura();
}

// Agregar atajo de teclado para imprimir (Ctrl+P)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        imprimirFactura();
    }
});

// Hacer funciones disponibles globalmente
window.imprimirFactura = imprimirFactura;
window.procesarCompra = procesarCompra;

// Log final para verificar que el script se cargó
console.log('Script factura.js cargado completamente'); 