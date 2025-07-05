// Variables globales
let productos = [];
const API_BASE = 'http://localhost:3001/api';

// Función para cargar productos desde la API
async function cargarProductosDesdeAPI() {
    try {
        const response = await fetch(`${API_BASE}/productos`);
        productos = await response.json();
        cargarProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Función para cargar productos en la interfaz
function cargarProductos(productosElegidos) {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    productosElegidos.forEach(producto => {
        const div = document.createElement('div');
        div.className = 'producto';
        div.innerHTML = `
            <img src="${producto.imagen ? 'http://localhost:3001' + producto.imagen : '../img/bicicleta/BicicletaGiantContend.jpg'}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio_venta.toLocaleString()}</p>
            <p class="stock">Stock: ${producto.stock || producto.cantidad || 0}</p>
            <button class="producto-agregar" onclick="agregarAlCarrito(${producto.id_producto})">
                <i class="bi bi-cart-plus"></i>
                Agregar al carrito
            </button>
            <button class="producto-descripcion" onclick="mostrarDescripcion(${producto.id_producto})">
                <i class="bi bi-eye"></i>
                Ver descripción
            </button>
        `;
        contenedor.appendChild(div);
    });

    actualizarBotonesAgregar();
}

// Función para actualizar el estado de los botones de agregar
function actualizarBotonesAgregar() {
    const botonesAgregar = document.querySelectorAll('.producto-agregar');
    botonesAgregar.forEach(boton => {
        const onclickAttr = boton.getAttribute('onclick');
        const match = onclickAttr ? onclickAttr.match(/\d+/) : null;
        if (match) {
            const productoId = parseInt(match[0]);
            const producto = productos.find(p => p.id_producto === productoId);
            const stock = producto ? (producto.stock || producto.cantidad || 0) : 0;
            if (stock <= 0) {
                boton.textContent = 'Sin stock';
                boton.disabled = true;
                boton.style.backgroundColor = '#ccc';
            } else {
                boton.textContent = 'Agregar al carrito';
                boton.disabled = false;
                boton.style.backgroundColor = '';
            }
        }
    });
}

// Función para agregar productos al carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id_producto === idProducto);
    if (!producto) return;

    const stock = producto.stock || producto.cantidad || 0;
    if (stock <= 0) {
        Toastify({
            text: "Producto sin stock disponible",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                borderRadius: "2rem",
            }
        }).showToast();
        return;
    }

    let productosEnCarrito = JSON.parse(localStorage.getItem('productos-en-carrito') || '[]');
    const productoExistente = productosEnCarrito.find(p => p.id_producto === idProducto);

    if (productoExistente) {
        if (productoExistente.cantidad < stock) {
            productoExistente.cantidad++;
        } else {
            Toastify({
                text: "No hay más stock disponible",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                    borderRadius: "2rem",
                }
            }).showToast();
            return;
        }
    } else {
        productosEnCarrito.push({
            id_producto: producto.id_producto,
            nombre: producto.nombre,
            precio: producto.precio_venta,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
    actualizarNumerito();

    Toastify({
        text: `Nombre: ${producto.nombre}`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
            borderRadius: "2rem",
        }
    }).showToast();
}

// Función para actualizar el contador del carrito
function actualizarNumerito() {
    const productosEnCarrito = JSON.parse(localStorage.getItem('productos-en-carrito') || '[]');
    const numerito = document.getElementById('numerito');
    if (numerito) {
        numerito.textContent = productosEnCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    }
}

// Función para buscar productos
function buscarProductos(searchTerm) {
    if (!searchTerm.trim()) {
        cargarProductos(productos);
        return;
    }

    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    cargarProductos(productosFiltrados);
}

// Función para verificar y mostrar el estado de autenticación del usuario
function verificarUsuarioAutenticado() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const loginBtn = document.getElementById('login-btn');
    const userName = document.getElementById('user-name');

    if (usuario) {
        if (loginBtn) {
            loginBtn.textContent = 'Cerrar Sesión';
            loginBtn.onclick = cerrarSesion;
        }
        if (userName) {
            userName.textContent = `Bienvenido, ${usuario.nombre}`;
            userName.style.display = 'inline';
        }
    } else {
        if (loginBtn) {
            loginBtn.textContent = 'Iniciar Sesión';
            loginBtn.onclick = () => {
                const modal = document.getElementById('modal');
                if (modal) modal.style.display = 'block';
            };
        }
        if (userName) {
            userName.style.display = 'none';
        }
    }
}

// Función para cerrar sesión
function cerrarSesion(e) {
    if (e) e.preventDefault();
    localStorage.removeItem('usuario');
    localStorage.removeItem('productos-en-carrito');
    verificarUsuarioAutenticado();
    
    Toastify({
        text: "Sesión cerrada correctamente",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
            borderRadius: "2rem",
        }
    }).showToast();
    
    // Recargar la página para actualizar el estado
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Función para mostrar descripción del producto
function mostrarDescripcion(idProducto) {
    const producto = productos.find(p => p.id_producto === idProducto);
    if (!producto) return;

    // Determinar la ruta de la imagen
    let imagenSrc = producto.imagen;
    if (imagenSrc && !imagenSrc.startsWith('http')) {
                    imagenSrc = 'http://localhost:3001' + imagenSrc;
    }

    const descripcionImagen = document.getElementById('descripcion-imagen');
    const descripcionTitulo = document.getElementById('descripcion-titulo');
    const descripcionTexto = document.getElementById('descripcion-texto');
    const descripcionPrecio = document.getElementById('descripcion-precio');
    const btnAgregar = document.getElementById('descripcion-agregar');
    const modal = document.getElementById('descripcion-modal');

    if (descripcionImagen) descripcionImagen.src = imagenSrc || '../img/bicicleta/BicicletaGiantContend.jpg';
    if (descripcionTitulo) descripcionTitulo.textContent = producto.nombre;
    if (descripcionTexto) descripcionTexto.textContent = producto.descripcion || 'Sin descripción disponible';
    if (descripcionPrecio) descripcionPrecio.textContent = `$${producto.precio_venta.toLocaleString()}`;
    
    // Configurar el botón de agregar al carrito
    if (btnAgregar) {
        btnAgregar.onclick = () => agregarAlCarrito(idProducto);
    }
    
    if (modal) modal.style.display = 'block';
}

// Event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos iniciales
    cargarProductosDesdeAPI();
    
    // Verificar usuario autenticado
    verificarUsuarioAutenticado();
    
    // Actualizar numerito del carrito
    actualizarNumerito();

    // Configurar búsqueda
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput && searchButton) {
        function handleSearch() {
            const searchTerm = searchInput.value.trim();
            buscarProductos(searchTerm);
        }
        
        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Configurar filtros de categorías
    const botonesCategoria = document.querySelectorAll('.boton-categoria');
    const tituloPrincipal = document.getElementById('titulo-principal');

    botonesCategoria.forEach(boton => {
        boton.addEventListener('click', () => {
            // Remover clase active de todos los botones
            botonesCategoria.forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            boton.classList.add('active');

            const categoria = boton.id;
            let productosFiltrados = productos;

            if (categoria !== 'todos') {
                productosFiltrados = productos.filter(producto => producto.categoria === categoria);
            }

            cargarProductos(productosFiltrados);

            // Actualizar título
            if (tituloPrincipal) {
                switch (categoria) {
                    case 'todos':
                        tituloPrincipal.textContent = 'Todos los productos';
                        break;
                    case 'bicicleta':
                        tituloPrincipal.textContent = 'Bicicletas';
                        break;
                    case 'accesorios':
                        tituloPrincipal.textContent = 'Accesorios';
                        break;
                    case 'repuestos':
                        tituloPrincipal.textContent = 'Repuestos';
                        break;
                }
            }
        });
    });

    // Configurar cierre de modales
    const closeDescripcionModal = document.getElementById('close-descripcion-modal');
    const descripcionModal = document.getElementById('descripcion-modal');
    
    if (closeDescripcionModal && descripcionModal) {
        closeDescripcionModal.addEventListener('click', () => {
            descripcionModal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === descripcionModal) {
                descripcionModal.style.display = 'none';
            }
        });
    }

    // Configurar cierre del modal de login
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('modal');
    
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Sincronizar botones de categorías y búsqueda en desktop
    const categoriasDesktop = [
        { id: 'todos-desktop', original: 'todos' },
        { id: 'bicicleta-desktop', original: 'bicicleta' },
        { id: 'accesorios-desktop', original: 'accesorios' },
        { id: 'repuestos-desktop', original: 'repuestos' }
    ];
    categoriasDesktop.forEach(cat => {
        const btn = document.getElementById(cat.id);
        const originalBtn = document.getElementById(cat.original);
        if (btn && originalBtn) {
            btn.addEventListener('click', () => {
                originalBtn.click();
                categoriasDesktop.forEach(c => {
                    const b = document.getElementById(c.id);
                    if (b) b.classList.remove('active');
                });
                btn.classList.add('active');
                // Actualizar título principal
                const tituloPrincipal = document.getElementById('titulo-principal');
                if (tituloPrincipal) {
                    switch (cat.original) {
                        case 'todos':
                            tituloPrincipal.textContent = 'Todos los productos';
                            break;
                        case 'bicicleta':
                            tituloPrincipal.textContent = 'Bicicletas';
                            break;
                        case 'accesorios':
                            tituloPrincipal.textContent = 'Accesorios';
                            break;
                        case 'repuestos':
                            tituloPrincipal.textContent = 'Repuestos';
                            break;
                    }
                }
            });
        }
        // Sincronizar el cambio de active desde el lateral
        if (originalBtn) {
            originalBtn.addEventListener('click', () => {
                categoriasDesktop.forEach(c => {
                    const b = document.getElementById(c.id);
                    if (b) b.classList.remove('active');
                });
                btn.classList.add('active');
            });
        }
    });

    // Sincronizar búsqueda desktop
    const searchInputDesktop = document.getElementById('search-input-desktop');
    const searchButtonDesktop = document.getElementById('search-button-desktop');
    const searchInputLateral = document.getElementById('search-input');
    const searchButtonLateral = document.getElementById('search-button');
    if (searchButtonDesktop && searchInputDesktop && searchInputLateral && searchButtonLateral) {
        searchButtonDesktop.addEventListener('click', () => {
            searchInputLateral.value = searchInputDesktop.value;
            searchButtonLateral.click();
        });
        searchInputDesktop.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                searchInputLateral.value = searchInputDesktop.value;
                searchButtonLateral.click();
            }
        });
        // Si buscas desde el lateral, sincroniza el input desktop
        searchButtonLateral.addEventListener('click', () => {
            searchInputDesktop.value = searchInputLateral.value;
        });
    }

    // Sincronizar el contador del carrito en la barra principal
    const numerito = document.getElementById('numerito');
    const numeritoNavbar = document.getElementById('numerito-navbar');
    if (numerito && numeritoNavbar) {
        const observer = new MutationObserver(() => {
            numeritoNavbar.textContent = numerito.textContent;
        });
        observer.observe(numerito, { childList: true, characterData: true, subtree: true });
        // Inicializar
        numeritoNavbar.textContent = numerito.textContent;
    }

    // Proteger acceso al carrito: si no hay usuario, mostrar el modal de login/registro
    function protegerCarrito(selector) {
        const carritoBtn = document.querySelector(selector);
        if (carritoBtn) {
            carritoBtn.addEventListener('click', function(e) {
                const usuario = JSON.parse(localStorage.getItem('usuario'));
                if (!usuario) {
                    e.preventDefault();
                    // Mostrar el modal de login/registro
                    const modal = document.getElementById('modal');
                    if (modal) {
                        modal.style.display = 'block';
                    } else {
                        // Si no existe el modal, redirigir como fallback
                        window.location.href = 'login-registro.html';
                    }
                }
            });
        }
    }
    protegerCarrito('.main-navbar .boton-carrito');
    protegerCarrito('.nav-top .boton-carrito');
});
