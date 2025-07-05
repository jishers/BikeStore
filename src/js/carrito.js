// Solo define la variable si no existe
if (typeof productosEnCarrito === 'undefined') {
    productosEnCarrito = window.productosEnCarrito || JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    window.productosEnCarrito = productosEnCarrito;
}

// Selección de elementos del DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// Variables para el modal de factura
const facturaModal = document.getElementById('factura-modal');
const closeFacturaModal = document.getElementById('close-factura-modal');
const confirmarCompra = document.getElementById('confirmar-compra');
const cancelarCompra = document.getElementById('cancelar-compra');

// Variables para el modal de descripción
const descripcionModal = document.getElementById('descripcion-modal');
const closeDescripcionModal = document.getElementById('close-descripcion-modal');
const descripcionImagen = document.getElementById('descripcion-imagen');
const descripcionTitulo = document.getElementById('descripcion-titulo');
const descripcionTexto = document.getElementById('descripcion-texto');
const descripcionPrecio = document.getElementById('descripcion-precio');
const descripcionAgregar = document.getElementById('descripcion-agregar');

// Función para cargar y mostrar los productos en el carrito
function cargarProductosCarrito() {
    // Solo ejecutar si estamos en la página del carrito
    if (!document.querySelector("#carrito-vacio")) {
        return; // No estamos en la página del carrito
    }
    
    // Verificar que los elementos existan antes de usarlos
    if (!contenedorCarritoVacio || !contenedorCarritoProductos || !contenedorCarritoAcciones || !contenedorCarritoComprado) {
        console.error('Elementos del carrito no encontrados');
        return;
    }

    if (productosEnCarrito && productosEnCarrito.length > 0) {
        // Mostrar elementos del carrito
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        // Limpiar contenedor de productos
        contenedorCarritoProductos.innerHTML = "";
    
        // Crear y agregar cada producto al carrito
        productosEnCarrito.forEach(producto => {
            // Asegurarse de que la ruta de la imagen sea correcta
            let imagenSrc = producto.imagen;
            if (imagenSrc && !imagenSrc.startsWith('http')) {
                imagenSrc = 'http://localhost:3001' + imagenSrc;
            }
            
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${imagenSrc}" alt="${producto.nombre}" onerror="this.src='../img/bicicleta/BicicletaGiantContend.jpg'">
                <div class="carrito-producto-titulo">
                    <small>Nombre</small>
                    <h3>${producto.nombre}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <div class="cantidad-control">
                        <button class="btn-decrementar" data-id="${producto.id_producto}">-</button>
                        <p class="cantidad-texto">${producto.cantidad}</p>
                        <button class="btn-incrementar" data-id="${producto.id_producto}">+</button>
                    </div>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${parseFloat(producto.precio).toLocaleString()}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p class="subtotal-texto">$${(parseFloat(producto.precio) * producto.cantidad).toLocaleString()}</p>
                </div>
                <button class="carrito-producto-eliminar" data-id="${producto.id_producto}"><i class="bi bi-trash-fill"></i></button>
            `;
            contenedorCarritoProductos.append(div);
        });
    
        // Actualizar botones y total
        actualizarBotonesEliminar();
        actualizarBotonesCantidad();
        actualizarTotal();
    } else {
        // Mostrar mensaje de carrito vacío
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

// Hacer la función disponible globalmente
window.cargarProductosCarrito = cargarProductosCarrito;

// Función de inicialización que se ejecuta cuando el DOM está listo
function inicializarCarrito() {
    console.log('Inicializando carrito...'); // Debug
    
    // Cargar productos al iniciar
    cargarProductosCarrito();
    
    // Verificar si el botón existe
    console.log('Botón comprar encontrado:', botonComprar); // Debug
    
    // Event listeners para el modal de factura
    if (closeFacturaModal) {
        closeFacturaModal.addEventListener('click', ocultarFacturaModal);
    }

    if (confirmarCompra) {
        confirmarCompra.addEventListener('click', procesarCompra);
    }

    if (cancelarCompra) {
        cancelarCompra.addEventListener('click', ocultarFacturaModal);
    }

    // Event listener delegado para el botón de comprar (funciona incluso si se crea dinámicamente)
    document.addEventListener('click', (e) => {
        console.log('Click detectado en:', e.target); // Debug
        console.log('ID del elemento:', e.target.id); // Debug
        
        if (e.target && e.target.id === 'carrito-acciones-comprar') {
            e.preventDefault();
            console.log('Botón comprar clickeado - Iniciando proceso'); // Debug
            
            // Verificar si hay productos en el carrito
            console.log('Productos en carrito:', productosEnCarrito); // Debug
            if (!productosEnCarrito || productosEnCarrito.length === 0) {
                console.log('Carrito vacío - Mostrando error'); // Debug
                Toastify({
                    text: "El carrito está vacío",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #ff6b6b, #ee5a24)",
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
                return;
            }
            
            // Verificar si el usuario está logueado
            const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
            console.log('Usuario logueado:', usuarioLogueado); // Debug
            
            if (!usuarioLogueado) {
                console.log('Usuario no logueado - Mostrando login'); // Debug
                // Si no está logueado, mostrar modal de login
                if (typeof mostrarLogin === 'function') {
                    mostrarLogin();
                } else {
                    // Redirigir a la página de login
                    window.location.href = 'login-registro.html';
                }
                return;
            }
            
            // Si está logueado, redirigir directamente a factura-test.html
            console.log('Usuario logueado - Redirigiendo a factura-test.html'); // Debug
            console.log('URL actual:', window.location.href); // Debug
            
            // Intentar diferentes métodos de redirección
            try {
                console.log('Intentando redirección...'); // Debug
                window.location.href = 'factura-test.html';
                console.log('Redirección ejecutada'); // Debug
            } catch (error) {
                console.error('Error en redirección:', error); // Debug
                // Método alternativo
                window.location.replace('factura-test.html');
            }
        }
    });
    
    // También agregar un event listener directo al botón por si acaso
    const botonComprarDirecto = document.getElementById('carrito-acciones-comprar');
    if (botonComprarDirecto) {
        console.log('Botón comprar encontrado directamente'); // Debug
        botonComprarDirecto.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Botón comprar clickeado (evento directo)'); // Debug
            
            // Verificar si hay productos en el carrito
            if (!productosEnCarrito || productosEnCarrito.length === 0) {
                Toastify({
                    text: "El carrito está vacío",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #ff6b6b, #ee5a24)",
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
                return;
            }
            
            // Verificar si el usuario está logueado
            const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
            if (!usuarioLogueado) {
                if (typeof mostrarLogin === 'function') {
                    mostrarLogin();
                } else {
                    window.location.href = 'login-registro.html';
                }
                return;
            }
            
            // Redirigir a factura-test.html
            console.log('Redirigiendo a factura-test.html (evento directo)'); // Debug
            try {
                window.location.href = 'factura-test.html';
                console.log('Redirección directa ejecutada'); // Debug
            } catch (error) {
                console.error('Error en redirección directa:', error); // Debug
                window.location.replace('factura-test.html');
            }
        });
    } else {
        console.log('Botón comprar NO encontrado directamente'); // Debug
    }

    // Evento para cerrar el modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (facturaModal && e.target === facturaModal) {
            ocultarFacturaModal();
        }
    });
}

// Ejecutar inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCarrito);
} else {
    inicializarCarrito();
}

// Función para actualizar los botones de eliminar
function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

// Función para actualizar los botones de cantidad
function actualizarBotonesCantidad() {
    const botonesIncrementar = document.querySelectorAll(".btn-incrementar");
    const botonesDecrementar = document.querySelectorAll(".btn-decrementar");

    botonesIncrementar.forEach(boton => {
        boton.addEventListener("click", incrementarCantidad);
    });

    botonesDecrementar.forEach(boton => {
        boton.addEventListener("click", decrementarCantidad);
    });
}

// Función para incrementar la cantidad de un producto
function incrementarCantidad(e) {
    const id = e.currentTarget.getAttribute("data-id");
    const producto = productosEnCarrito.find(p => p.id_producto == id);
    if (producto) {
        producto.cantidad++;
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        cargarProductosCarrito();
    }
}

// Función para decrementar la cantidad de un producto
function decrementarCantidad(e) {
    const id = e.currentTarget.getAttribute("data-id");
    const producto = productosEnCarrito.find(p => p.id_producto == id);
    if (producto && producto.cantidad > 1) {
        producto.cantidad--;
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        cargarProductosCarrito();
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(e) {
    // Mostrar notificación de producto eliminado
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right,rgb(73, 75, 75),rgb(51, 53, 53))",
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

    // Eliminar producto del carrito
    const idBoton = e.currentTarget.getAttribute("data-id");
    const index = productosEnCarrito.findIndex(producto => producto.id_producto == idBoton);
    
    if (index !== -1) {
        productosEnCarrito.splice(index, 1);
        cargarProductosCarrito();
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    }
}

// Event listener para el botón de vaciar carrito
if (botonVaciar) {
    botonVaciar.addEventListener("click", vaciarCarrito);
}

// Función para vaciar el carrito
function vaciarCarrito() {
    // Mostrar confirmación con SweetAlert2
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
      })
}

// Función para actualizar el total del carrito
function actualizarTotal() {
    if (!contenedorTotal) return;
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (parseFloat(producto.precio) * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado.toLocaleString()}`;
}

// Función para mostrar el modal de descripción
function mostrarDescripcionModal(producto) {
    if (!descripcionImagen || !descripcionTitulo || !descripcionTexto || !descripcionPrecio || !descripcionAgregar) {
        console.error('Elementos del modal de descripción no encontrados');
        return;
    }
    
    descripcionImagen.src = producto.imagen;
    descripcionImagen.alt = producto.nombre;
    descripcionTitulo.textContent = producto.nombre;
    descripcionTexto.textContent = producto.descripcion;
    descripcionPrecio.textContent = `$${parseFloat(producto.precio).toLocaleString()}`;
    
    // Guardar el ID del producto en el botón para usarlo al agregar al carrito
    descripcionAgregar.dataset.id = producto.id_producto;
    
    if (descripcionModal) {
        descripcionModal.style.display = 'block';
    }
}

// Función para ocultar el modal de descripción
function ocultarDescripcionModal() {
    if (descripcionModal) {
        descripcionModal.style.display = 'none';
    }
}

// Evento para cerrar el modal de descripción
if (closeDescripcionModal) {
    closeDescripcionModal.addEventListener('click', ocultarDescripcionModal);
}

// Evento para cerrar el modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (descripcionModal && e.target === descripcionModal) {
        ocultarDescripcionModal();
    }
});

// Evento para agregar al carrito desde el modal de descripción
if (descripcionAgregar) {
    descripcionAgregar.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const producto = productosEnCarrito.find(p => p.id_producto === id);
        if (producto) {
            agregarAlCarrito(producto);
            ocultarDescripcionModal();
        }
    });
}

// Función para mostrar el modal de factura
function mostrarFacturaModal() {
    console.log('Función mostrarFacturaModal ejecutada'); // Debug
    
    if (!facturaModal) {
        console.error('Modal de factura no encontrado'); // Debug
        return;
    }
    
    console.log('Modal de factura encontrado:', facturaModal); // Debug
    
    // Verificar si el usuario está logueado
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
    console.log('Usuario logueado:', usuarioLogueado); // Debug
    
    if (!usuarioLogueado) {
        console.log('Usuario no logueado, mostrando login'); // Debug
        // Si no está logueado, mostrar modal de login
        if (typeof mostrarLogin === 'function') {
            mostrarLogin();
        } else {
            // Redirigir a la página de login
            window.location.href = 'login-registro.html';
        }
        return;
    }
    
    // Llenar datos del cliente
    document.getElementById('cliente-nombre').textContent = usuarioLogueado.nombre || 'No disponible';
    document.getElementById('cliente-direccion').textContent = usuarioLogueado.direccion || 'No disponible';
    document.getElementById('cliente-telefono').textContent = usuarioLogueado.telefono || 'No disponible';
    document.getElementById('cliente-email').textContent = usuarioLogueado.email || 'No disponible';
    
    // Llenar fecha actual
    const fecha = new Date();
    document.getElementById('factura-fecha').textContent = fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Llenar productos
    const productosLista = document.getElementById('factura-productos-lista');
    productosLista.innerHTML = '';
    
    productosEnCarrito.forEach(producto => {
        const subtotal = parseFloat(producto.precio) * producto.cantidad;
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto-factura';
        productoDiv.innerHTML = `
            <div class="producto-factura-info">
                <div class="producto-factura-nombre">${producto.nombre}</div>
                <div class="producto-factura-detalles">
                    Cantidad: ${producto.cantidad} | Precio unitario: $${parseFloat(producto.precio).toLocaleString()}
                </div>
            </div>
            <div class="producto-factura-subtotal">
                $${subtotal.toLocaleString()}
            </div>
        `;
        productosLista.appendChild(productoDiv);
    });
    
    // Calcular y mostrar totales
    const subtotal = productosEnCarrito.reduce((acc, producto) => acc + (parseFloat(producto.precio) * producto.cantidad), 0);
    document.getElementById('factura-subtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('factura-total').textContent = `$${subtotal.toLocaleString()}`;
    
    console.log('Mostrando modal de factura...'); // Debug
    // Mostrar modal
    facturaModal.style.display = 'flex';
    console.log('Modal mostrado, display:', facturaModal.style.display); // Debug
    console.log('Modal visible:', facturaModal.offsetParent !== null); // Debug
    console.log('Modal z-index:', facturaModal.style.zIndex); // Debug
}

// Función para ocultar el modal de factura
function ocultarFacturaModal() {
    if (facturaModal) {
        facturaModal.style.display = 'none';
        console.log('Modal de factura ocultado'); // Debug
    }
}

// Función para procesar la compra
function procesarCompra() {
    // Mostrar confirmación
    Swal.fire({
        title: '¿Confirmar compra?',
        icon: 'question',
        html: '¿Estás seguro de que quieres proceder con la compra?',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Obtener datos del usuario
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            
            if (!usuario) {
                Swal.fire({
                    title: 'Error',
                    text: 'Debes iniciar sesión para realizar una compra',
                    icon: 'error'
                });
                return;
            }

            // Calcular totales
            const cantidadTotal = productosEnCarrito.reduce((acc, p) => acc + p.cantidad, 0);
            const precioTotal = productosEnCarrito.reduce((acc, p) => acc + (parseFloat(p.precio) * p.cantidad), 0);

            // Preparar detalles de la venta
            const detalles = productosEnCarrito.map(p => ({
                id_producto: p.id_producto,
                cantidad_producto: p.cantidad,
                precio_unitario: parseFloat(p.precio)
            }));

            // Datos de la venta
            const ventaData = {
                id_usuario: usuario.id_usuario,
                cantidad_productos: cantidadTotal,
                precio_productos: precioTotal,
                metodo_pago: 'contra_entrega',
                detalles: detalles
            };

            console.log('Enviando venta al servidor:', ventaData);

            // Enviar venta al servidor
            const url = getServerUrl() + '/api/ventas';
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ventaData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al procesar la venta');
                }
                return response.json();
            })
            .then(data => {
                console.log('Venta procesada exitosamente:', data);

                // Vaciar carrito
                productosEnCarrito.length = 0;
                localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

                // Obtener datos del usuario para mostrar
                const nombre = usuario?.nombre || 'No disponible';
                const direccion = usuario?.direccion || 'No disponible';
                const email = usuario?.email || 'No disponible';
                const telefono = usuario?.telefono || 'No disponible';

                // Mostrar mensaje de éxito con datos
                Swal.fire({
                    title: '¡Compra exitosa!',
                    icon: 'success',
                    html: `
                        <h3>¡Gracias por tu compra!</h3>
                        <p><b>Nombre:</b> ${nombre}</p>
                        <p><b>Dirección:</b> ${direccion}</p>
                        <p><b>Email:</b> ${email}</p>
                        <p><b>Teléfono:</b> ${telefono}</p>
                        <p><b>Pago:</b> Contraentrega</p>
                        <p><b>Total:</b> $${precioTotal.toLocaleString()}</p>
                        <br>
                        <button id="seguir-comprando-btn" class="swal2-confirm swal2-styled" style="background:#28a745;">Seguir comprando</button>
                    `,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        const btn = document.getElementById('seguir-comprando-btn');
                        if (btn) {
                            btn.addEventListener('click', () => {
                                // Redirigir al panel principal
                                window.location.href = 'index.html';
                            });
                        }
                    }
                });

                // Ocultar modal de factura si está abierto
                ocultarFacturaModal && ocultarFacturaModal();
                
                // Mostrar mensaje de compra exitosa en la página
                if (contenedorCarritoVacio && contenedorCarritoProductos && contenedorCarritoAcciones && contenedorCarritoComprado) {
                    contenedorCarritoVacio.classList.remove("disabled");
                    contenedorCarritoProductos.classList.add("disabled");
                    contenedorCarritoAcciones.classList.add("disabled");
                    contenedorCarritoComprado.classList.remove("disabled");
                }
            })
            .catch(error => {
                console.error('Error al procesar la venta:', error);
                Swal.fire({
                    title: 'Error en la Compra',
                    text: 'Hubo un problema al procesar tu compra. Por favor, intenta de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Entendido'
                });
            });
        }
    });
}

// Función para obtener la URL base del servidor
function getServerUrl() {
    // Si estamos en el puerto 3001, usar rutas relativas
    if (window.location.port === '3001') {
        return '';
    }
    // Si no, usar la URL completa del servidor
    return 'http://localhost:3001';
}

// Función global para probar redirección manualmente
window.probarRedireccion = function() {
    console.log('=== FUNCIÓN PROBAR REDIRECCIÓN EJECUTADA ===');
    
    // Obtener productos del carrito
    const productos = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    console.log('Productos en carrito:', productos);
    
    // Obtener usuario logueado
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    console.log('Usuario logueado:', usuario);
    
    // Verificar si hay productos
    if (!productos || productos.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Verificar si el usuario está logueado
    if (!usuario) {
        alert('No estás logueado');
        return;
    }
    
    // Redirigir a factura-test.html
    console.log('Todo OK - Redirigiendo a factura-test.html...');
    console.log('URL actual:', window.location.href);
    
    // Usar location.replace para asegurar la redirección
    window.location.replace('factura-test.html');
};

// Función global para verificar el estado del botón
window.verificarBotonComprar = function() {
    const boton = document.getElementById('carrito-acciones-comprar');
    console.log('Botón comprar encontrado:', boton);
    if (boton) {
        console.log('ID del botón:', boton.id);
        console.log('Clases del botón:', boton.className);
        console.log('Texto del botón:', boton.textContent);
        console.log('Event listeners:', boton.onclick);
    }
};