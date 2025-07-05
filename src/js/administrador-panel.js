// Script específico para el panel de administración
document.addEventListener('DOMContentLoaded', function() {
    const API_BASE = 'http://localhost:3001/api';
    
    // Verificar si el usuario está autenticado como administrador
    function verificarAdmin() {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (!usuario || usuario.rol !== 'admin') {
            // Si no es admin, redirigir al login
            window.location.href = 'index.html';
            return false;
        }
        
        // Mostrar información del administrador
        const adminName = document.getElementById('admin-name');
        if (adminName) {
            adminName.textContent = `${usuario.nombre} ${usuario.apellido}`;
        }
        
        return true;
    }
    
    // Función para cerrar sesión
    function cerrarSesion() {
        localStorage.removeItem('usuario');
        window.location.href = 'index.html';
    }
    
    // Evento para el botón de cerrar sesión del dashboard
    const logoutBtnDashboard = document.getElementById('logout-btn-dashboard');
    console.log('Botón logout encontrado:', !!logoutBtnDashboard);
    if (logoutBtnDashboard) {
        logoutBtnDashboard.addEventListener('click', () => {
            console.log('Clic en botón logout');
            cerrarSesion();
        });
    }
    
    // Verificar admin al cargar la página
    if (!verificarAdmin()) {
        return;
    }
    
    // Definir TODAS las variables de elementos del DOM al inicio
    const dashboardGestionarProductos = document.getElementById('dashboard-gestionar-productos');
    const dashboardInformes = document.getElementById('dashboard-informes');
    const dashboardGestionarUsuarios = document.getElementById('dashboard-gestionar-usuarios');
    const dashboardAddProduct = document.getElementById('dashboard-add-product');
    const dashboardLogout = document.getElementById('dashboard-logout');
    
    // Variables para modales y formularios
    const adminViewProductsModal = document.getElementById('admin-view-products-modal');
    const adminReportFormContainer = document.getElementById('admin-report-form-container');
    const adminUsersFormContainer = document.getElementById('admin-users-form-container');
    const adminProductFormContainer = document.getElementById('admin-product-form-container');
    
    // Variables para vistas de productos
    const categoriesView = document.getElementById('categories-view');
    const productsView = document.getElementById('products-view');
    const backToCategoriesBtn = document.getElementById('back-to-categories');
    const productsGrid = document.getElementById('products-grid');
    const noProductsMessage = document.getElementById('no-products-message');
    const selectedCategoryName = document.getElementById('selected-category-name');
    
    // Variables para formularios y botones
    const adminAddProductBtn = document.getElementById('admin-add-product-btn');
    const closeAdminFormBtn = document.getElementById('close-admin-form-btn');
    const adminProductForm = document.getElementById('admin-product-form');
    const adminViewProductsBtn = document.getElementById('admin-view-products-btn');
    const closeViewProductsModal = document.getElementById('close-view-products-modal');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Variables para informes
    const adminReportBtn = document.getElementById('admin-report-btn');
    const closeAdminReportBtn = document.getElementById('close-admin-report-btn');
    const adminReportForm = document.getElementById('admin-report-form');
    const reportPeriodSelect = document.getElementById('report-period');
    const reportDateRange = document.getElementById('report-date-range');
    
    // Manejar el cambio de período para mostrar/ocultar campos de fecha personalizada
    if (reportPeriodSelect) {
        reportPeriodSelect.addEventListener('change', () => {
            const period = reportPeriodSelect.value;
            if (period === 'custom') {
                if (reportDateRange) reportDateRange.style.display = 'block';
            } else {
                if (reportDateRange) reportDateRange.style.display = 'none';
            }
        });
    }
    
    // Variables para usuarios
    const adminUsersBtn = document.getElementById('admin-users-btn');
    const closeAdminUsersBtn = document.getElementById('close-admin-users-btn');
    
    // Variables para editar productos
    const adminEditProductModal = document.getElementById('admin-edit-product-modal');
    const closeEditProductModal = document.getElementById('close-edit-product-modal');
    const adminEditProductForm = document.getElementById('admin-edit-product-form');
    
    // Debug: Verificar que los elementos se están encontrando
    console.log('Elementos del dashboard encontrados:', {
        dashboardGestionarProductos: !!dashboardGestionarProductos,
        dashboardInformes: !!dashboardInformes,
        dashboardGestionarUsuarios: !!dashboardGestionarUsuarios,
        dashboardAddProduct: !!dashboardAddProduct,
        adminViewProductsModal: !!adminViewProductsModal,
        adminReportFormContainer: !!adminReportFormContainer,
        adminUsersFormContainer: !!adminUsersFormContainer,
        adminProductFormContainer: !!adminProductFormContainer
    });
    
    // Botón Gestionar Productos - Abre el modal de ver productos
    if (dashboardGestionarProductos) {
        dashboardGestionarProductos.addEventListener('click', () => {
            if (adminViewProductsModal) {
                adminViewProductsModal.style.display = 'block';
                // Mostrar vista de categorías por defecto
                if (categoriesView) categoriesView.style.display = 'block';
                if (productsView) productsView.style.display = 'none';
                if (backToCategoriesBtn) backToCategoriesBtn.style.display = 'none';
            }
        });
    }
    
    // Botón Informes - Abre el formulario de informes
    if (dashboardInformes) {
        dashboardInformes.addEventListener('click', () => {
            if (adminReportFormContainer) {
                adminReportFormContainer.style.display = 'block';
            }
        });
    }
    
    // Botón Gestionar Usuarios - Abre el formulario de usuarios
    if (dashboardGestionarUsuarios) {
        dashboardGestionarUsuarios.addEventListener('click', async () => {
            if (adminUsersFormContainer) {
                adminUsersFormContainer.style.display = 'block';
            }
            
            try {
                const usuario = JSON.parse(localStorage.getItem('usuario'));
                const response = await fetch(`${API_BASE}/usuarios?rol=admin&id_usuario=${usuario ? usuario.id_usuario : ''}`, {
                    method: 'GET'
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    const usersContent = document.getElementById('admin-users-content');
                    if (usersContent) {
                        let html = '<h4>Usuarios Registrados:</h4><div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse;">';
                        html += '<tr style="background: #f5f5f5;"><th style="padding: 10px; border: 1px solid #ddd;">ID</th><th style="padding: 10px; border: 1px solid #ddd;">Nombre</th><th style="padding: 10px; border: 1px solid #ddd;">Correo</th><th style="padding: 10px; border: 1px solid #ddd;">Rol</th><th style="padding: 10px; border: 1px solid #ddd;">Fecha Registro</th></tr>';
                        
                        data.forEach(user => {
                            html += `<tr><td style="padding: 10px; border: 1px solid #ddd;">${user.id_usuario}</td><td style="padding: 10px; border: 1px solid #ddd;">${user.nombre} ${user.apellido}</td><td style="padding: 10px; border: 1px solid #ddd;">${user.correo}</td><td style="padding: 10px; border: 1px solid #ddd;">${user.rol}</td><td style="padding: 10px; border: 1px solid #ddd;">${user.fecha_registro}</td></tr>`;
                        });
                        
                        html += '</table></div>';
                        usersContent.innerHTML = html;
                    }
                } else {
                    Toastify({
                        text: data.error || 'Error al cargar usuarios',
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                            borderRadius: "2rem",
                        }
                    }).showToast();
                }
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
                Toastify({
                    text: 'Error de red',
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                        borderRadius: "2rem",
                    }
                }).showToast();
            }
        });
    }
    
    // Funcionalidad para agregar productos
    if (adminAddProductBtn) {
        adminAddProductBtn.addEventListener('click', () => {
            if (adminProductFormContainer) {
                adminProductFormContainer.style.display = 'block';
                // Limpiar el formulario al abrirlo
                if (adminProductForm) adminProductForm.reset();
                const adminProductFormMsg = document.getElementById('admin-product-form-msg');
                if (adminProductFormMsg) {
                    adminProductFormMsg.innerHTML = '';
                    adminProductFormMsg.className = '';
                }
            }   
        });
    }
    
    if (closeAdminFormBtn) {
        closeAdminFormBtn.addEventListener('click', () => {
            if (adminProductFormContainer) {
                adminProductFormContainer.style.display = 'none';
                // Limpiar el formulario al cerrarlo
                if (adminProductForm) adminProductForm.reset();
                const adminProductFormMsg = document.getElementById('admin-product-form-msg');
                if (adminProductFormMsg) {
                    adminProductFormMsg.innerHTML = '';
                    adminProductFormMsg.className = '';
                }
            }
        });
    }
    
    // Manejo del formulario de agregar producto
    if (adminProductForm) {
        adminProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Debug: Verificar valores del formulario
            const categoriaValue = document.getElementById('product-categoria')?.value || '';
            console.log('🔍 DEBUG - Valores del formulario:');
            console.log('Categoría seleccionada:', categoriaValue);
            console.log('Tipo de categoría:', typeof categoriaValue);
            console.log('Longitud de categoría:', categoriaValue.length);
            console.log('¿Es "repuestos"?', categoriaValue === 'repuestos');
            console.log('¿Es "bicicleta"?', categoriaValue === 'bicicleta');
            
            const formData = new FormData();
            formData.append('nombre', document.getElementById('product-nombre')?.value || '');
            formData.append('precio_venta', document.getElementById('product-precio')?.value || '');
            formData.append('descripcion', document.getElementById('product-descripcion')?.value || '');
            formData.append('cantidad', document.getElementById('product-cantidad')?.value || '');
            formData.append('categoria', categoriaValue);
            
            const imagenInput = document.getElementById('product-imagen');
            if (imagenInput && imagenInput.files.length > 0) {
                formData.append('imagen', imagenInput.files[0]);
            }
            
            formData.append('rol', 'admin'); // Para el middleware de autenticación
            
            // Agregar el ID del usuario logueado
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            if (usuario && usuario.id_usuario) {
                formData.append('id_usuario', usuario.id_usuario);
            }
            
            try {
                const response = await fetch(`${API_BASE}/productos`, {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                // Debug: Verificar respuesta del servidor
                console.log('🔍 DEBUG - Respuesta del servidor:');
                console.log('Status:', response.status);
                console.log('OK:', response.ok);
                console.log('Data:', data);
                
                const adminProductFormMsg = document.getElementById('admin-product-form-msg');
                
                if (response.ok) {
                    // Mostrar mensaje de éxito en el contenedor
                    if (adminProductFormMsg) {
                        adminProductFormMsg.innerHTML = '<span style="color: #28a745; font-weight: 600;">✅ Producto agregado exitosamente</span>';
                        adminProductFormMsg.className = 'success';
                    }
                    
                    Toastify({
                        text: "Producto agregado exitosamente",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #8B0000, #DC143C)",
                            borderRadius: "2rem",
                        }
                    }).showToast();
                    
                    // Limpiar formulario después de un breve delay
                    setTimeout(() => {
                        if (adminProductForm) adminProductForm.reset();
                        if (adminProductFormContainer) adminProductFormContainer.style.display = 'none';
                        if (adminProductFormMsg) {
                            adminProductFormMsg.innerHTML = '';
                            adminProductFormMsg.className = '';
                        }
                    }, 2000);
                } else {
                    // Mostrar mensaje de error en el contenedor
                    if (adminProductFormMsg) {
                        adminProductFormMsg.innerHTML = `<span style="color: #dc3545; font-weight: 600;">❌ ${data.error || 'Error al agregar producto'}</span>`;
                        adminProductFormMsg.className = 'error';
                    }
                    
                    Toastify({
                        text: data.error || 'Error al agregar producto',
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                            borderRadius: "2rem",
                        }
                    }).showToast();
                }
            } catch (error) {
                const adminProductFormMsg = document.getElementById('admin-product-form-msg');
                if (adminProductFormMsg) {
                    adminProductFormMsg.innerHTML = '<span style="color: #dc3545; font-weight: 600;">❌ Error de red</span>';
                    adminProductFormMsg.className = 'error';
                }
                
                Toastify({
                    text: 'Error de red',
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                        borderRadius: "2rem",
                    }
                }).showToast();
            }
        });
    }
    
    // Funcionalidad para ver productos
    if (adminViewProductsBtn) {
        adminViewProductsBtn.addEventListener('click', () => {
            if (adminViewProductsModal) {
                adminViewProductsModal.style.display = 'block';
                // Mostrar vista de categorías por defecto
                if (categoriesView) categoriesView.style.display = 'block';
                if (productsView) productsView.style.display = 'none';
                if (backToCategoriesBtn) backToCategoriesBtn.style.display = 'none';
            }
        });
    }
    
    if (closeViewProductsModal) {
        closeViewProductsModal.addEventListener('click', () => {
            if (adminViewProductsModal) {
                adminViewProductsModal.style.display = 'none';
            }
        });
    }
    
    // Funcionalidad para botones de categorías
    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const category = btn.getAttribute('data-category');
                const categoryName = btn.textContent.trim();
                
                // Ocultar vista de categorías y mostrar vista de productos
                if (categoriesView) categoriesView.style.display = 'none';
                if (productsView) productsView.style.display = 'block';
                if (backToCategoriesBtn) backToCategoriesBtn.style.display = 'inline-block';
                
                // Actualizar título de la categoría
                if (selectedCategoryName) selectedCategoryName.textContent = categoryName;
                
                // Cargar productos de la categoría
                await cargarProductosPorCategoria(category);
            });
        });
    }
    
    // Botón para volver a categorías
    if (backToCategoriesBtn) {
        backToCategoriesBtn.addEventListener('click', () => {
            if (categoriesView) categoriesView.style.display = 'block';
            if (productsView) productsView.style.display = 'none';
            if (backToCategoriesBtn) backToCategoriesBtn.style.display = 'none';
        });
    }
    
    // Función para cargar productos por categoría
    async function cargarProductosPorCategoria(categoria) {
        if (!productsGrid || !noProductsMessage) {
            console.warn('Elementos de productos no encontrados');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/productos`);
            const data = await response.json();
            
            if (response.ok) {
                // Filtrar productos por categoría
                const productosFiltrados = data.filter(producto => producto.categoria === categoria);
                
                if (productosFiltrados.length > 0) {
                    productsGrid.innerHTML = '';
                    noProductsMessage.style.display = 'none';
                    
                    productosFiltrados.forEach(producto => {
                        const productCard = document.createElement('div');
                        productCard.className = 'product-card-modal';
                        
                        // Determinar la ruta de la imagen
                        let imagenSrc = producto.imagen;
                        if (imagenSrc && !imagenSrc.startsWith('http')) {
                            imagenSrc = 'http://localhost:3001' + imagenSrc;
                        }
                        
                        // Mostrar stock
                        const stockActual = producto.stock || producto.cantidad || 0;
                        
                        productCard.innerHTML = `
                            <div style="background: white; border-radius: 15px; padding: 1.5rem; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: all 0.3s ease; border: 2px solid transparent;">
                                <img src="${imagenSrc || '../img/bicicleta/BicicletaGiantContend.jpg'}" 
                                     alt="${producto.nombre}" 
                                     style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 1rem; border: 2px solid #e1e5e9;">
                                <h4 style="margin: 0 0 0.5rem 0; color: #333; font-size: 1.2rem; font-weight: 600;">${producto.nombre}</h4>
                                <div style="color: #8B0000; font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">$${parseFloat(producto.precio_venta).toLocaleString()}</div>
                                <div style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">Stock: ${stockActual}</div>
                                <div style="display: flex; gap: 0.5rem; justify-content: center;">
                                    <button class="btn-edit" onclick="editarProducto(${producto.id_producto})"
                                            style="background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; transition: all 0.3s ease; flex: 1;">
                                        <i class="bi bi-pencil-fill" style="margin-right: 0.3rem;"></i> Editar
                                    </button>
                                    <button class="btn-delete" onclick="eliminarProducto(${producto.id_producto})"
                                            style="background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; transition: all 0.3s ease; flex: 1;">
                                        <i class="bi bi-trash-fill" style="margin-right: 0.3rem;"></i> Eliminar
                                    </button>
                                </div>
                            </div>
                        `;
                        
                        // Agregar efectos hover
                        productCard.addEventListener('mouseenter', () => {
                            const div = productCard.querySelector('div');
                            if (div) {
                                div.style.transform = 'translateY(-5px)';
                                div.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                                div.style.borderColor = '#8B0000';
                            }
                        });
                        
                        productCard.addEventListener('mouseleave', () => {
                            const div = productCard.querySelector('div');
                            if (div) {
                                div.style.transform = 'translateY(0)';
                                div.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                                div.style.borderColor = 'transparent';
                            }
                        });
                        
                        productsGrid.appendChild(productCard);
                    });
                } else {
                    productsGrid.innerHTML = '';
                    noProductsMessage.style.display = 'block';
                }
            } else {
                productsGrid.innerHTML = '';
                noProductsMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
            Toastify({
                text: 'Error al cargar productos',
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                    borderRadius: "2rem",
                }
            }).showToast();
        }
    }
    
    // Funciones globales para editar y eliminar productos
    window.editarProducto = async function(idProducto) {
        try {
            // Obtener datos del producto
            const response = await fetch(`${API_BASE}/productos/${idProducto}`);
            const producto = await response.json();
            
            if (!response.ok) {
                Toastify({
                    text: 'Error al cargar datos del producto',
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
            
            // Llenar el formulario con los datos del producto
            const editId = document.getElementById('edit-product-id');
            const editNombre = document.getElementById('edit-product-nombre');
            const editPrecio = document.getElementById('edit-product-precio');
            const editDescripcion = document.getElementById('edit-product-descripcion');
            const editCantidad = document.getElementById('edit-product-cantidad');
            const editCategoria = document.getElementById('edit-product-categoria');
            
            if (editId) editId.value = producto.id_producto;
            if (editNombre) editNombre.value = producto.nombre;
            if (editPrecio) editPrecio.value = producto.precio_venta;
            if (editDescripcion) editDescripcion.value = producto.descripcion || '';
            if (editCantidad) editCantidad.value = producto.stock || 0;
            if (editCategoria) editCategoria.value = producto.categoria;
            
            // Mostrar imagen actual si existe
            const currentImagePreview = document.getElementById('current-image-preview');
            const currentImage = document.getElementById('current-image');
            
            if (producto.imagen && currentImage) {
                currentImage.src = `http://localhost:3001${producto.imagen}`;
                if (currentImagePreview) currentImagePreview.style.display = 'block';
            } else if (currentImagePreview) {
                currentImagePreview.style.display = 'none';
            }
            
            // Mostrar el modal
            if (adminEditProductModal) adminEditProductModal.style.display = 'block';
            
        } catch (error) {
            console.error('Error al cargar datos del producto:', error);
            Toastify({
                text: 'Error al cargar datos del producto',
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                    borderRadius: "2rem",
                }
            }).showToast();
        }
    };
    
    window.eliminarProducto = async function(idProducto) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                // Obtener el usuario logueado
                const usuario = JSON.parse(localStorage.getItem('usuario'));
                
                const response = await fetch(`${API_BASE}/productos/${idProducto}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        rol: 'admin',
                        id_usuario: usuario ? usuario.id_usuario : null
                    })
                });
                
                if (response.ok) {
                    Toastify({
                        text: 'Producto eliminado exitosamente',
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #8B0000, #DC143C)",
                            borderRadius: "2rem",
                        }
                    }).showToast();
                    
                    // Recargar productos de la categoría actual
                    const currentCategory = document.querySelector('.category-btn.active')?.getAttribute('data-category');
                    if (currentCategory) {
                        await cargarProductosPorCategoria(currentCategory);
                    }
                } else {
                    const data = await response.json();
                    Toastify({
                        text: data.error || 'Error al eliminar producto',
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                            borderRadius: "2rem",
                        }
                    }).showToast();
                }
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                Toastify({
                    text: 'Error de red',
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                        borderRadius: "2rem",
                    }
                }).showToast();
            }
        }
    };
    
    // Funcionalidad para generar informes
    if (adminReportBtn) {
        adminReportBtn.addEventListener('click', () => {
            if (adminReportFormContainer) {
                adminReportFormContainer.style.display = 'block';
            }
        });
    }
    
    if (closeAdminReportBtn) {
        closeAdminReportBtn.addEventListener('click', () => {
            if (adminReportFormContainer) {
                adminReportFormContainer.style.display = 'none';
            }
        });
    }
    
    // Mostrar/ocultar campos de fecha según el período seleccionado
    if (reportPeriodSelect) {
        reportPeriodSelect.addEventListener('change', () => {
            if (reportPeriodSelect.value === 'custom') {
                if (reportDateRange) reportDateRange.style.display = 'block';
            } else {
                if (reportDateRange) reportDateRange.style.display = 'none';
            }
        });
    }
    
    // Función para obtener fechas según el período seleccionado
    function getDateRange(period) {
        const today = new Date();
        const startDate = new Date();
        const endDate = new Date();
        
        switch (period) {
            case 'today':
                // Ya está configurado para hoy
                break;
            case 'week':
                startDate.setDate(today.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(today.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(today.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(today.getFullYear() - 1);
                break;
            case 'custom':
                // Usar las fechas del formulario
                const startInput = document.getElementById('report-start-date')?.value;
                const endInput = document.getElementById('report-end-date')?.value;
                if (startInput && endInput) {
                    return {
                        start: startInput,
                        end: endInput
                    };
                }
                break;
        }
        
        return { 
            start: startDate.toISOString().split('T')[0], 
            end: endDate.toISOString().split('T')[0] 
        };
    }

    // Manejo del formulario de informes
    if (adminReportForm) {
        adminReportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(adminReportForm);
            const tipo = formData.get('report-type');
            const periodo = formData.get('report-period');
            let fechaInicio = formData.get('report-start-date');
            let fechaFin = formData.get('report-end-date');
            
            // Si las fechas están vacías, calcular según el período
            if (!fechaInicio || !fechaFin) {
                const dateRange = getDateRange(periodo);
                fechaInicio = dateRange.start;
                fechaFin = dateRange.end;
            }
            
            // Determinar si es un informe de inventario
            const inventarioTipos = ['operaciones-admin', 'productos-mas-agregados', 'resumen-inventario', 'stock-actual'];
            const esInformeInventario = inventarioTipos.includes(tipo);
            
            // Obtener el usuario logueado
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            
            const reportData = {
                tipo: tipo,
                periodo: periodo,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                rol: 'admin',
                id_usuario: usuario ? usuario.id_usuario : null
            };
            
            try {
                const endpoint = esInformeInventario ? '/informes-inventario' : '/informes';
                const response = await fetch(`${API_BASE}${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reportData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    const resultDiv = document.getElementById('admin-report-result');
                    if (resultDiv) {
                        let html = `<h4 style="color: #8B0000; margin-bottom: 1rem;">
                            <i class="bi bi-graph-up" style="margin-right: 0.5rem;"></i>
                            Resultados del Informe: ${tipo}
                        </h4>`;
                        
                        if (esInformeInventario) {
                            html += generarHTMLInformeInventario(data, tipo);
                        } else {
                            html += generarHTMLInformeVentas(data, tipo);
                        }
                        
                        resultDiv.innerHTML = html;
                    }
                } else {
                    Toastify({
                        text: data.error || 'Error al generar informe',
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                            borderRadius: "2rem",
                        }
                    }).showToast();
                }
            } catch (error) {
                console.error('Error al generar informe:', error);
                Toastify({
                    text: 'Error de red',
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                        borderRadius: "2rem",
                    }
                }).showToast();
            }
        });
    }
    
    // Función para generar HTML de informes de inventario
    function generarHTMLInformeInventario(data, tipo) {
        const resultados = data.resultados;
        
        switch (tipo) {
            case 'operaciones-admin':
                return `
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h5 style="color: #8B0000; margin-bottom: 1rem;">Operaciones de Administradores</h5>
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                                <thead>
                                    <tr style="background: #f8f9fa;">
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Producto</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Admin</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Operación</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Cant. Anterior</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Cant. Nueva</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Cambio</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${resultados.map(op => `
                                        <tr>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${op.producto}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${op.admin_nombre} ${op.admin_apellido}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd;">
                                                <span style="padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; 
                                                    background: ${op.tipo_operacion === 'agregar' ? '#28a745' : op.tipo_operacion === 'editar' ? '#ffc107' : '#dc3545'}; 
                                                    color: white;">
                                                    ${op.tipo_operacion}
                                                </span>
                                            </td>
                                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${op.cantidad_anterior}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${op.cantidad_nueva}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: ${op.cantidad_cambio > 0 ? '#28a745' : '#dc3545'};">${op.cantidad_cambio > 0 ? '+' : ''}${op.cantidad_cambio}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${new Date(op.fecha_operacion).toLocaleString()}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
                
            case 'productos-mas-agregados':
                return `
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h5 style="color: #8B0000; margin-bottom: 1rem;">Productos con Más Cantidad Agregada</h5>
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                                <thead>
                                    <tr style="background: #f8f9fa;">
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Producto</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Categoría</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Total Agregado</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Veces Modificado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${resultados.map(prod => `
                                        <tr>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${prod.producto}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${prod.categoria}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #28a745;">${prod.total_agregado}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${prod.veces_modificado}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
                
            case 'resumen-inventario':
                const resumen = resultados[0];
                return `
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h5 style="color: #8B0000; margin-bottom: 1rem;">Resumen General del Inventario</h5>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 2rem; font-weight: bold; color: #8B0000;">${resumen.productos_modificados || 0}</div>
                                <div style="color: #666; font-size: 0.9rem;">Productos Modificados</div>
                            </div>
                            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 2rem; font-weight: bold; color: #28a745;">${resumen.productos_nuevos || 0}</div>
                                <div style="color: #666; font-size: 0.9rem;">Productos Nuevos</div>
                            </div>
                            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 2rem; font-weight: bold; color: #ffc107;">${resumen.productos_actualizados || 0}</div>
                                <div style="color: #666; font-size: 0.9rem;">Productos Actualizados</div>
                            </div>
                            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 2rem; font-weight: bold; color: #17a2b8;">${resumen.total_cantidad_agregada || 0}</div>
                                <div style="color: #666; font-size: 0.9rem;">Total Cantidad Agregada</div>
                            </div>
                            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 2rem; font-weight: bold; color: #6f42c1;">${resumen.admins_activos || 0}</div>
                                <div style="color: #666; font-size: 0.9rem;">Admins Activos</div>
                            </div>
                        </div>
                    </div>
                `;
                
            case 'stock-actual':
                return `
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h5 style="color: #8B0000; margin-bottom: 1rem;">Stock Actual de Productos</h5>
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                                <thead>
                                    <tr style="background: #f8f9fa;">
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Producto</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Categoría</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Stock Actual</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Stock Mínimo</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Estado</th>
                                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Última Actualización</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${resultados.map(prod => `
                                        <tr>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${prod.producto}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${prod.categoria}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: ${prod.stock > (prod.stock_minimo || 0) ? '#28a745' : '#dc3545'};">${prod.stock || 0}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${prod.stock_minimo || 0}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                                                <span style="padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; 
                                                    background: ${prod.estado === 'disponible' ? '#28a745' : '#dc3545'}; 
                                                    color: white;">
                                                    ${prod.estado || 'N/A'}
                                                </span>
                                            </td>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${prod.fecha_actualizacion ? new Date(prod.fecha_actualizacion).toLocaleString() : 'N/A'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
                
            default:
                return `<pre style="background: #f8f9fa; padding: 1rem; border-radius: 8px; overflow-x: auto;">${JSON.stringify(resultados, null, 2)}</pre>`;
        }
    }
    
    // Funcionalidad para ver usuarios
    if (adminUsersBtn) {
        adminUsersBtn.addEventListener('click', async () => {
            if (adminUsersFormContainer) {
                adminUsersFormContainer.style.display = 'block';
            }
            
            try {
                const response = await fetch(`${API_BASE}/usuarios?rol=admin`, {
                    method: 'GET'
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    const usersContent = document.getElementById('admin-users-content');
                    if (usersContent) {
                        let html = '<h4>Usuarios Registrados:</h4><div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse;">';
                        html += '<tr style="background: #f5f5f5;"><th style="padding: 10px; border: 1px solid #ddd;">ID</th><th style="padding: 10px; border: 1px solid #ddd;">Nombre</th><th style="padding: 10px; border: 1px solid #ddd;">Correo</th><th style="padding: 10px; border: 1px solid #ddd;">Rol</th><th style="padding: 10px; border: 1px solid #ddd;">Fecha Registro</th></tr>';
                        
                        data.forEach(user => {
                            html += `<tr><td style="padding: 10px; border: 1px solid #ddd;">${user.id_usuario}</td><td style="padding: 10px; border: 1px solid #ddd;">${user.nombre} ${user.apellido}</td><td style="padding: 10px; border: 1px solid #ddd;">${user.correo}</td><td style="padding: 10px; border: 1px solid #ddd;">${user.rol}</td><td style="padding: 10px; border: 1px solid #ddd;">${user.fecha_registro}</td></tr>`;
                        });
                        
                        html += '</table></div>';
                        usersContent.innerHTML = html;
                    }
                } else {
                    Toastify({
                        text: data.error || 'Error al cargar usuarios',
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                            borderRadius: "2rem",
                        }
                    }).showToast();
                }
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
                Toastify({
                    text: 'Error de red',
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                        borderRadius: "2rem",
                    }
                }).showToast();
            }
        });
    }
    
    if (closeAdminUsersBtn) {
        closeAdminUsersBtn.addEventListener('click', () => {
            if (adminUsersFormContainer) {
                adminUsersFormContainer.style.display = 'none';
            }
        });
    }
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === adminViewProductsModal) {
            adminViewProductsModal.style.display = 'none';
        }
        if (e.target === adminEditProductModal) {
            adminEditProductModal.style.display = 'none';
            // Limpiar formulario
            if (adminEditProductForm) adminEditProductForm.reset();
            const msgDiv = document.getElementById('admin-edit-product-form-msg');
            if (msgDiv) {
                msgDiv.innerHTML = '';
                msgDiv.className = '';
            }
        }
    });
    
    // Actualizar colores de los botones de categorías para usar la paleta rojo sangre toro
    if (categoryBtns.length > 0) {
        const categoryColors = [
            'linear-gradient(135deg, #8B0000 0%, #DC143C 100%)',
            'linear-gradient(135deg, #A52A2A 0%, #8B0000 100%)',
            'linear-gradient(135deg, #660000 0%, #B22222 100%)'
        ];
        
        categoryBtns.forEach((btn, index) => {
            btn.style.background = categoryColors[index % categoryColors.length];
            btn.style.boxShadow = '0 4px 15px rgba(139, 0, 0, 0.3)';
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-3px)';
                btn.style.boxShadow = '0 8px 25px rgba(139, 0, 0, 0.4)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '0 4px 15px rgba(139, 0, 0, 0.3)';
            });
        });
    }
    
    if (dashboardAddProduct) {
        dashboardAddProduct.addEventListener('click', () => {
            if (adminProductFormContainer) {
                adminProductFormContainer.style.display = 'block';
                if (adminProductForm) adminProductForm.reset();
                const adminProductFormMsg = document.getElementById('admin-product-form-msg');
                if (adminProductFormMsg) {
                    adminProductFormMsg.innerHTML = '';
                    adminProductFormMsg.className = '';
                }
            }
        });
    }

    if (dashboardLogout) {
        dashboardLogout.addEventListener('click', () => {
            cerrarSesion();
        });
    }

    // Funcionalidad para el modal de editar producto
    // Cerrar modal de editar producto
    if (closeEditProductModal) {
        closeEditProductModal.addEventListener('click', () => {
            if (adminEditProductModal) adminEditProductModal.style.display = 'none';
            // Limpiar formulario
            if (adminEditProductForm) adminEditProductForm.reset();
            const msgDiv = document.getElementById('admin-edit-product-form-msg');
            if (msgDiv) {
                msgDiv.innerHTML = '';
                msgDiv.className = '';
            }
        });
    }

    // Manejo del formulario de editar producto
    if (adminEditProductForm) {
        adminEditProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const idProducto = document.getElementById('edit-product-id')?.value;
            const msgDiv = document.getElementById('admin-edit-product-form-msg');
            
            if (!idProducto) {
                if (msgDiv) {
                    msgDiv.style.color = 'red';
                    msgDiv.textContent = 'Error: ID de producto no encontrado';
                }
                return;
            }
            
            // Crear FormData para enviar archivos
            const formData = new FormData();
            formData.append('nombre', document.getElementById('edit-product-nombre')?.value || '');
            formData.append('precio_venta', document.getElementById('edit-product-precio')?.value || '');
            formData.append('descripcion', document.getElementById('edit-product-descripcion')?.value || '');
            formData.append('cantidad', document.getElementById('edit-product-cantidad')?.value || '');
            formData.append('categoria', document.getElementById('edit-product-categoria')?.value || '');
            formData.append('rol', 'admin');
            
            // Agregar el ID del usuario logueado
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            if (usuario && usuario.id_usuario) {
                formData.append('id_usuario', usuario.id_usuario);
            }
            
            // Agregar la imagen si se seleccionó una nueva
            const imagenInput = document.getElementById('edit-product-imagen');
            if (imagenInput && imagenInput.files.length > 0) {
                formData.append('imagen', imagenInput.files[0]);
            }
            
            try {
                const response = await fetch(`${API_BASE}/productos/${idProducto}`, {
                    method: 'PUT',
                    body: formData
                });
                const data = await response.json();
                
                if (response.ok) {
                    if (msgDiv) {
                        msgDiv.style.color = 'green';
                        msgDiv.textContent = 'Producto actualizado correctamente';
                    }
                    
                    Toastify({
                        text: "Producto actualizado exitosamente",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #8B0000, #DC143C)",
                            borderRadius: "2rem",
                        }
                    }).showToast();
                    
                    // Cerrar modal después de un breve delay
                    setTimeout(() => {
                        if (adminEditProductModal) adminEditProductModal.style.display = 'none';
                        if (adminEditProductForm) adminEditProductForm.reset();
                        if (msgDiv) {
                            msgDiv.innerHTML = '';
                            msgDiv.className = '';
                        }
                        
                        // Recargar productos de la categoría actual
                        const currentCategory = document.querySelector('.category-btn.active')?.getAttribute('data-category');
                        if (currentCategory) {
                            cargarProductosPorCategoria(currentCategory);
                        }
                    }, 2000);
                } else {
                    if (msgDiv) {
                        msgDiv.style.color = 'red';
                        msgDiv.textContent = data.error || 'Error al actualizar producto';
                    }
                    
                    Toastify({
                        text: data.error || 'Error al actualizar producto',
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                            borderRadius: "2rem",
                        }
                    }).showToast();
                }
            } catch (error) {
                console.error('Error al actualizar producto:', error);
                if (msgDiv) {
                    msgDiv.style.color = 'red';
                    msgDiv.textContent = 'Error de red';
                }
                
                Toastify({
                    text: 'Error de red',
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                        borderRadius: "2rem",
                    }
                }).showToast();
            }
        });
    }

    // Funciones auxiliares para mostrar vistas
    function showCategoriesView() {
        if (categoriesView) categoriesView.style.display = 'block';
        if (productsView) productsView.style.display = 'none';
        if (backToCategoriesBtn) backToCategoriesBtn.style.display = 'none';
    }

    function showProductsView(category, categoryName) {
        if (categoriesView) categoriesView.style.display = 'none';
        if (productsView) productsView.style.display = 'block';
        if (backToCategoriesBtn) backToCategoriesBtn.style.display = 'inline-block';
        
        if (selectedCategoryName) selectedCategoryName.textContent = categoryName;
        
        // Cargar productos de la categoría
        cargarProductosPorCategoria(category);
    }

    // Función para generar HTML de informes de ventas
    function generarHTMLInformeVentas(data, tipo) {
        const resultados = data.resultados;
        
        switch (tipo) {
            case 'ventas-por-fecha':
                if (!resultados || resultados.length === 0) {
                    return `
                        <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
                            <i class="bi bi-calendar-x" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                            <h5 style="color: #666; margin-bottom: 0.5rem;">No hay ventas registradas</h5>
                            <p style="color: #999; font-size: 0.9rem;">No se encontraron ventas en el período seleccionado</p>
                        </div>
                    `;
                }

                // Calcular estadísticas generales
                const totalVentas = resultados.reduce((sum, item) => sum + parseFloat(item.total_ventas), 0);
                const totalTransacciones = resultados.reduce((sum, item) => sum + parseInt(item.numero_ventas), 0);
                const promedioVenta = totalVentas / totalTransacciones;
                const totalProductos = resultados.reduce((sum, item) => sum + parseInt(item.total_productos_vendidos), 0);

                return `
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <div style="display: flex; align-items: center; margin-bottom: 1.5rem;">
                            <i class="bi bi-calendar-check-fill" style="font-size: 2rem; color: #8B0000; margin-right: 1rem;"></i>
                            <div>
                                <h5 style="color: #8B0000; margin: 0; font-size: 1.3rem;">Informe de Ventas por Fecha</h5>
                                <p style="color: #666; margin: 0; font-size: 0.9rem;">Análisis detallado de ventas diarias</p>
                            </div>
                        </div>

                        <!-- Estadísticas generales -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                            <div style="background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%); color: white; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 4px 15px rgba(139, 0, 0, 0.3);">
                                <div style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">$${totalVentas.toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
                                <div style="font-size: 0.9rem; opacity: 0.9;">Total Ventas</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);">
                                <div style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">${totalTransacciones}</div>
                                <div style="font-size: 0.9rem; opacity: 0.9;">Total Transacciones</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);">
                                <div style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">$${promedioVenta.toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
                                <div style="font-size: 0.9rem; opacity: 0.9;">Promedio por Venta</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%); color: white; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);">
                                <div style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">${totalProductos}</div>
                                <div style="font-size: 0.9rem; opacity: 0.9;">Productos Vendidos</div>
                            </div>
                        </div>

                        <!-- Tabla de ventas por fecha -->
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <thead>
                                    <tr style="background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%); color: white;">
                                        <th style="padding: 15px; text-align: left; font-weight: 600; border: none;">
                                            <i class="bi bi-calendar-event" style="margin-right: 0.5rem;"></i>Fecha
                                        </th>
                                        <th style="padding: 15px; text-align: center; font-weight: 600; border: none;">
                                            <i class="bi bi-cart-check" style="margin-right: 0.5rem;"></i>Transacciones
                                        </th>
                                        <th style="padding: 15px; text-align: center; font-weight: 600; border: none;">
                                            <i class="bi bi-currency-dollar" style="margin-right: 0.5rem;"></i>Total Ventas
                                        </th>
                                        <th style="padding: 15px; text-align: center; font-weight: 600; border: none;">
                                            <i class="bi bi-graph-up" style="margin-right: 0.5rem;"></i>Promedio
                                        </th>
                                        <th style="padding: 15px; text-align: center; font-weight: 600; border: none;">
                                            <i class="bi bi-box-seam" style="margin-right: 0.5rem;"></i>Productos
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${resultados.map((item, index) => `
                                        <tr style="border-bottom: 1px solid #f0f0f0; transition: background-color 0.3s ease;" 
                                            onmouseover="this.style.backgroundColor='#f8f9fa'" 
                                            onmouseout="this.style.backgroundColor='white'">
                                            <td style="padding: 12px; border: none; font-weight: 600; color: #333;">
                                                <div style="display: flex; align-items: center;">
                                                    <span style="background: #8B0000; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 0.5rem; font-weight: bold;">
                                                        ${index + 1}
                                                    </span>
                                                    ${item.fecha_formateada || new Date(item.fecha).toLocaleDateString('es-CO')}
                                                </div>
                                            </td>
                                            <td style="padding: 12px; border: none; text-align: center;">
                                                <span style="background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                                                    ${item.numero_ventas}
                                                </span>
                                            </td>
                                            <td style="padding: 12px; border: none; text-align: center; font-weight: bold; color: #28a745;">
                                                $${parseFloat(item.total_ventas).toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                                            </td>
                                            <td style="padding: 12px; border: none; text-align: center; color: #666;">
                                                $${parseFloat(item.promedio_venta).toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                                            </td>
                                            <td style="padding: 12px; border: none; text-align: center;">
                                                <span style="background: #fff3e0; color: #f57c00; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                                                    ${item.total_productos_vendidos}
                                                </span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <!-- Pie de página con información adicional -->
                        <div style="margin-top: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #8B0000;">
                            <div style="display: flex; align-items: center; color: #666; font-size: 0.9rem;">
                                <i class="bi bi-info-circle" style="margin-right: 0.5rem; color: #8B0000;"></i>
                                <span>Informe generado el ${new Date().toLocaleString('es-CO')} | Total de días analizados: ${resultados.length}</span>
                            </div>
                        </div>
                    </div>
                `;

            default:
                return `<pre style="background: #f8f9fa; padding: 1rem; border-radius: 8px; overflow-x: auto;">${JSON.stringify(resultados, null, 2)}</pre>`;
        }
    }
}); 