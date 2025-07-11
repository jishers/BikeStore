// Variables globales necesarias (usar las del main.js)
// const API_BASE = 'http://localhost:3001/api';
// let productos = [];

// Cargar productos al inicializar (solo si no están ya cargados)
if (typeof productos === 'undefined') {
    fetch(`${API_BASE}/productos`)
        .then(response => response.json())
        .then(data => {
            window.productos = data;
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
        });
}

// Selección de elementos del DOM para el panel de administración
const adminBtn = document.getElementById('admin-btn');
const adminModal = document.getElementById('admin-modal');
const closeAdminModal = document.getElementById('close-admin-modal');
const reportForm = document.getElementById('report-form');
const reportResult = document.getElementById('report-result');

// Elementos para el nuevo sistema de informes
const adminReportBtn = document.getElementById('admin-report-btn');
const adminReportBtnContainer = document.getElementById('admin-report-btn-container');
const adminReportFormContainer = document.getElementById('admin-report-form-container');
const closeAdminReportBtn = document.getElementById('close-admin-report-btn');
const adminReportForm = document.getElementById('admin-report-form');
const adminReportFormMsg = document.getElementById('admin-report-form-msg');
const adminReportResult = document.getElementById('admin-report-result');
const reportPeriodSelect = document.getElementById('report-period');
const reportDateRange = document.getElementById('report-date-range');

// Elementos para el sistema de usuarios
const adminUsersBtn = document.getElementById('admin-users-btn');
const adminUsersBtnContainer = document.getElementById('admin-users-btn-container');
const adminUsersFormContainer = document.getElementById('admin-users-form-container');
const closeAdminUsersBtn = document.getElementById('close-admin-users-btn');
const adminUsersContent = document.getElementById('admin-users-content');
const adminUsersFormMsg = document.getElementById('admin-users-form-msg');

// Ejemplo de protección para todos los event listeners
if (adminBtn) {
    // Evento para abrir el modal de administración
    adminBtn.addEventListener('click', () => {
        adminModal.style.display = 'flex';
    });
}

if (closeAdminModal) {
    // Evento para cerrar el modal de administración
    closeAdminModal.addEventListener('click', () => {
        adminModal.style.display = 'none';
        reportResult.classList.add('hidden');
    });
}

if (adminModal) {
    // Evento para cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === adminModal) {
            adminModal.style.display = 'none';
            reportResult.classList.add('hidden');
        }
    });
}

if (reportForm) {
    // Evento para manejar el envío del formulario de reportes
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obtener valores del formulario
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const reportType = document.getElementById('report-type').value;
        
        // Generar el reporte con los datos ingresados
        generateReport(startDate, endDate, reportType);
    });
}

// Función para generar reportes de ventas y productos más vendidos
async function generateReport(startDate, endDate, reportType) {
    // Obtener historial de compras desde localStorage
    let historialCompras = JSON.parse(localStorage.getItem('historial-compras')) || [];
    
    // Filtrar compras por rango de fechas seleccionado
    const comprasFiltradas = historialCompras.filter(compra => {
        const fechaCompra = new Date(compra.fecha);
        return fechaCompra >= startDate && fechaCompra <= endDate;
    });

    // Mostrar el contenedor de resultados
    adminReportResult.innerHTML = '';
    
    if (reportType === 'mas-vendido') {
        // Generar informe de productos más vendidos
        const productosVendidos = {};
        
        // Consolidar y sumar productos de todas las compras
        comprasFiltradas.forEach(compra => {
            compra.productos.forEach(producto => {
                if (productosVendidos[producto.id]) {
                    productosVendidos[producto.id].cantidad += producto.cantidad;
                    productosVendidos[producto.id].total += producto.precio * producto.cantidad;
                } else {
                    productosVendidos[producto.id] = {
                        titulo: producto.titulo,
                        cantidad: producto.cantidad,
                        total: producto.precio * producto.cantidad
                    };
                }
            });
        });

        // Convertir a array y ordenar por cantidad vendida
        const sortedProducts = Object.values(productosVendidos)
            .sort((a, b) => b.cantidad - a.cantidad);
        
        adminReportResult.innerHTML = `
            <h3><i class="bi bi-trophy-fill" style="color: gold; margin-right: 0.5rem;"></i>Productos Más Vendidos</h3>
            <p><strong>Período:</strong> ${formatDate(startDate)} a ${formatDate(endDate)}</p>
            <p><strong>Total de compras analizadas:</strong> ${comprasFiltradas.length}</p>
            ${sortedProducts.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th>Producto</th>
                            <th>Cantidad Vendida</th>
                            <th>Total Ventas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedProducts.map((producto, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${producto.titulo}</td>
                                <td>${producto.cantidad}</td>
                                <td>$${producto.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : '<p style="color: #666; font-style: italic;">No hay ventas registradas en este período.</p>'}
        `;
    } else if (reportType === 'menos-vendido') {
        // Generar informe de productos menos vendidos
        const productosVendidos = {};
        
        comprasFiltradas.forEach(compra => {
            compra.productos.forEach(producto => {
                if (productosVendidos[producto.id]) {
                    productosVendidos[producto.id].cantidad += producto.cantidad;
                    productosVendidos[producto.id].total += producto.precio * producto.cantidad;
                } else {
                    productosVendidos[producto.id] = {
                        titulo: producto.titulo,
                        cantidad: producto.cantidad,
                        total: producto.precio * producto.cantidad
                    };
                }
            });
        });

        const sortedProducts = Object.values(productosVendidos)
            .sort((a, b) => a.cantidad - b.cantidad);
        
        adminReportResult.innerHTML = `
            <h3><i class="bi bi-exclamation-triangle-fill" style="color: orange; margin-right: 0.5rem;"></i>Productos Menos Vendidos</h3>
            <p><strong>Período:</strong> ${formatDate(startDate)} a ${formatDate(endDate)}</p>
            <p><strong>Total de compras analizadas:</strong> ${comprasFiltradas.length}</p>
            ${sortedProducts.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th>Producto</th>
                            <th>Cantidad Vendida</th>
                            <th>Total Ventas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedProducts.map((producto, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${producto.titulo}</td>
                                <td>${producto.cantidad}</td>
                                <td>$${producto.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : '<p style="color: #666; font-style: italic;">No hay ventas registradas en este período.</p>'}
        `;
    } else if (reportType === 'ventas-por-fecha') {
        // Generar informe de ventas por fecha
        const ventasPorFecha = {};
        
        comprasFiltradas.forEach(compra => {
            const fecha = new Date(compra.fecha).toLocaleDateString('es-ES');
            if (ventasPorFecha[fecha]) {
                ventasPorFecha[fecha].total += compra.total;
                ventasPorFecha[fecha].compras += 1;
            } else {
                ventasPorFecha[fecha] = {
                    total: compra.total,
                    compras: 1
                };
            }
        });

        const sortedVentas = Object.entries(ventasPorFecha)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]));
        
        adminReportResult.innerHTML = `
            <h3><i class="bi bi-calendar-check-fill" style="color: #28a745; margin-right: 0.5rem;"></i>Ventas por Fecha</h3>
            <p><strong>Período:</strong> ${formatDate(startDate)} a ${formatDate(endDate)}</p>
            <p><strong>Total de compras:</strong> ${comprasFiltradas.length}</p>
            <p><strong>Total de ventas:</strong> $${comprasFiltradas.reduce((acc, compra) => acc + compra.total, 0).toFixed(2)}</p>
            ${sortedVentas.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Número de Compras</th>
                            <th>Total Ventas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedVentas.map(([fecha, datos]) => `
                            <tr>
                                <td>${fecha}</td>
                                <td>${datos.compras}</td>
                                <td>$${datos.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : '<p style="color: #666; font-style: italic;">No hay ventas registradas en este período.</p>'}
        `;
    } else if (reportType === 'ventas-por-categoria') {
        // Generar informe de ventas por categoría
        const ventasPorCategoria = {};
        
        comprasFiltradas.forEach(compra => {
            compra.productos.forEach(producto => {
                const categoria = producto.categoria || 'Sin categoría';
                if (ventasPorCategoria[categoria]) {
                    ventasPorCategoria[categoria].cantidad += producto.cantidad;
                    ventasPorCategoria[categoria].total += producto.precio * producto.cantidad;
                } else {
                    ventasPorCategoria[categoria] = {
                        cantidad: producto.cantidad,
                        total: producto.precio * producto.cantidad
                    };
                }
            });
        });

        const sortedCategorias = Object.entries(ventasPorCategoria)
            .sort((a, b) => b[1].total - a[1].total);
        
        // Calcular estadísticas generales
        const totalVentas = sortedCategorias.reduce((sum, [, datos]) => sum + datos.total, 0);
        const totalProductos = sortedCategorias.reduce((sum, [, datos]) => sum + datos.cantidad, 0);
        const categoriaTop = sortedCategorias[0];
        const porcentajeTop = categoriaTop ? ((categoriaTop[1].total / totalVentas) * 100).toFixed(1) : 0;

        // Definir colores y iconos para cada categoría
        const categoriaConfig = {
            'bicicleta': { color: '#8B0000', icon: 'bi-bicycle', gradient: 'linear-gradient(135deg, #8B0000 0%, #DC143C 100%)' },
            'accesorios': { color: '#A52A2A', icon: 'bi-tools', gradient: 'linear-gradient(135deg, #A52A2A 0%, #8B0000 100%)' },
            'repuestos': { color: '#660000', icon: 'bi-gear-fill', gradient: 'linear-gradient(135deg, #660000 0%, #B22222 100%)' },
            'Sin categoría': { color: '#6c757d', icon: 'bi-question-circle', gradient: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)' }
        };

        adminReportResult.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(139, 0, 0, 0.1);">
                <!-- Encabezado del informe -->
                <div style="display: flex; align-items: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #f8f9fa;">
                    <div style="background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%); padding: 1rem; border-radius: 12px; margin-right: 1.5rem; box-shadow: 0 4px 15px rgba(139, 0, 0, 0.3);">
                        <i class="bi bi-collection-fill" style="font-size: 2rem; color: white;"></i>
                    </div>
                    <div>
                        <h3 style="color: #8B0000; margin: 0; font-size: 1.8rem; font-weight: 700; text-shadow: 0 2px 4px rgba(139, 0, 0, 0.1);">
                            Informe de Ventas por Categoría
                        </h3>
                        <p style="color: #666; margin: 0.5rem 0 0 0; font-size: 1rem;">
                            <i class="bi bi-calendar-range" style="margin-right: 0.5rem; color: #8B0000;"></i>
                            Período: ${formatDate(startDate)} a ${formatDate(endDate)}
                        </p>
                    </div>
                </div>

                <!-- Estadísticas generales -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
                    <div style="background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%); color: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 8px 25px rgba(139, 0, 0, 0.3); position: relative; overflow: hidden;">
                        <div style="position: absolute; top: -10px; right: -10px; background: rgba(255,255,255,0.1); width: 60px; height: 60px; border-radius: 50%;"></div>
                        <div style="font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                            $${totalVentas.toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                        </div>
                        <div style="font-size: 1rem; opacity: 0.95; font-weight: 600;">Total Ventas</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3); position: relative; overflow: hidden;">
                        <div style="position: absolute; top: -10px; right: -10px; background: rgba(255,255,255,0.1); width: 60px; height: 60px; border-radius: 50%;"></div>
                        <div style="font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                            ${totalProductos.toLocaleString('es-CO')}
                        </div>
                        <div style="font-size: 1rem; opacity: 0.95; font-weight: 600;">Productos Vendidos</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 8px 25px rgba(255, 193, 7, 0.3); position: relative; overflow: hidden;">
                        <div style="position: absolute; top: -10px; right: -10px; background: rgba(255,255,255,0.1); width: 60px; height: 60px; border-radius: 50%;"></div>
                        <div style="font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                            ${sortedCategorias.length}
                        </div>
                        <div style="font-size: 1rem; opacity: 0.95; font-weight: 600;">Categorías Activas</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%); color: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 8px 25px rgba(23, 162, 184, 0.3); position: relative; overflow: hidden;">
                        <div style="position: absolute; top: -10px; right: -10px; background: rgba(255,255,255,0.1); width: 60px; height: 60px; border-radius: 50%;"></div>
                        <div style="font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                            ${comprasFiltradas.length}
                        </div>
                        <div style="font-size: 1rem; opacity: 0.95; font-weight: 600;">Transacciones</div>
                    </div>
                </div>

                ${sortedCategorias.length > 0 ? `
                    <!-- Tabla de ventas por categoría -->
                    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 2rem;">
                        <div style="background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%); padding: 1.5rem; color: white;">
                            <h4 style="margin: 0; font-size: 1.3rem; font-weight: 600; display: flex; align-items: center;">
                                <i class="bi bi-bar-chart-fill" style="margin-right: 0.8rem; font-size: 1.5rem;"></i>
                                Desglose por Categorías
                            </h4>
                        </div>
                        
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                                <thead>
                                    <tr style="background: #f8f9fa; border-bottom: 2px solid #e9ecef;">
                                        <th style="padding: 1.2rem; text-align: left; font-weight: 700; color: #495057; font-size: 1rem;">
                                            <i class="bi bi-trophy" style="margin-right: 0.5rem; color: #8B0000;"></i>Posición
                                        </th>
                                        <th style="padding: 1.2rem; text-align: left; font-weight: 700; color: #495057; font-size: 1rem;">
                                            <i class="bi bi-collection" style="margin-right: 0.5rem; color: #8B0000;"></i>Categoría
                                        </th>
                                        <th style="padding: 1.2rem; text-align: center; font-weight: 700; color: #495057; font-size: 1rem;">
                                            <i class="bi bi-box-seam" style="margin-right: 0.5rem; color: #8B0000;"></i>Cantidad Vendida
                                        </th>
                                        <th style="padding: 1.2rem; text-align: center; font-weight: 700; color: #495057; font-size: 1rem;">
                                            <i class="bi bi-currency-dollar" style="margin-right: 0.5rem; color: #8B0000;"></i>Total Ventas
                                        </th>
                                        <th style="padding: 1.2rem; text-align: center; font-weight: 700; color: #495057; font-size: 1rem;">
                                            <i class="bi bi-percent" style="margin-right: 0.5rem; color: #8B0000;"></i>Porcentaje
                                        </th>
                                        <th style="padding: 1.2rem; text-align: center; font-weight: 700; color: #495057; font-size: 1rem;">
                                            <i class="bi bi-graph-up" style="margin-right: 0.5rem; color: #8B0000;"></i>Rendimiento
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${sortedCategorias.map(([categoria, datos], index) => {
                                        const config = categoriaConfig[categoria] || categoriaConfig['Sin categoría'];
                                        const porcentaje = ((datos.total / totalVentas) * 100).toFixed(1);
                                        const isTop = index === 0;
                                        
                                        return `
                                            <tr style="border-bottom: 1px solid #f1f3f4; transition: all 0.3s ease;" 
                                                onmouseover="this.style.backgroundColor='#f8f9fa'; this.style.transform='translateY(-2px)'" 
                                                onmouseout="this.style.backgroundColor='white'; this.style.transform='translateY(0)'">
                                                <td style="padding: 1.2rem; border: none; text-align: center;">
                                                    ${isTop ? `
                                                        <span style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #8B0000; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 900; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);">
                                                            <i class="bi bi-trophy-fill" style="margin-right: 0.3rem;"></i>1°
                                                        </span>
                                                    ` : `
                                                        <span style="background: ${index === 1 ? 'linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%)' : index === 2 ? 'linear-gradient(135deg, #cd7f32 0%, #daa520 100%)' : 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'}; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 700; font-size: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                                                            ${index + 1}°
                                                        </span>
                                                    `}
                                                </td>
                                                <td style="padding: 1.2rem; border: none;">
                                                    <div style="display: flex; align-items: center;">
                                                        <div style="background: ${config.gradient}; color: white; padding: 0.8rem; border-radius: 10px; margin-right: 1rem; box-shadow: 0 4px 15px rgba(139, 0, 0, 0.2);">
                                                            <i class="bi ${config.icon}" style="font-size: 1.2rem;"></i>
                                                        </div>
                                                        <div>
                                                            <div style="font-weight: 700; color: #333; font-size: 1.1rem; margin-bottom: 0.2rem;">
                                                                ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                                                            </div>
                                                            <div style="color: #666; font-size: 0.9rem;">
                                                                ${datos.cantidad} productos vendidos
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style="padding: 1.2rem; border: none; text-align: center;">
                                                    <span style="background: #e3f2fd; color: #1976d2; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 700; font-size: 1rem; box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);">
                                                        ${datos.cantidad.toLocaleString('es-CO')}
                                                    </span>
                                                </td>
                                                <td style="padding: 1.2rem; border: none; text-align: center;">
                                                    <div style="font-weight: 900; color: #28a745; font-size: 1.2rem; text-shadow: 0 1px 2px rgba(40, 167, 69, 0.2);">
                                                        $${datos.total.toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                                                    </div>
                                                </td>
                                                <td style="padding: 1.2rem; border: none; text-align: center;">
                                                    <div style="display: flex; align-items: center; justify-content: center;">
                                                        <div style="background: #fff3e0; color: #f57c00; padding: 0.6rem 1rem; border-radius: 8px; font-weight: 700; font-size: 1rem; box-shadow: 0 2px 8px rgba(245, 124, 0, 0.2);">
                                                            ${porcentaje}%
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style="padding: 1.2rem; border: none; text-align: center;">
                                                    <div style="display: flex; align-items: center; justify-content: center;">
                                                        <div style="width: 100px; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden; position: relative;">
                                                            <div style="width: ${porcentaje}%; height: 100%; background: ${config.gradient}; border-radius: 4px; transition: width 0.8s ease;"></div>
                                                        </div>
                                                        <span style="margin-left: 0.5rem; font-size: 0.9rem; color: #666; font-weight: 600;">
                                                            ${porcentaje}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Información adicional -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #8B0000; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                                <i class="bi bi-trophy-fill" style="font-size: 1.5rem; color: #ffd700; margin-right: 0.8rem;"></i>
                                <h5 style="margin: 0; color: #8B0000; font-weight: 700;">Categoría Líder</h5>
                            </div>
                            <p style="margin: 0; color: #666; font-size: 1rem;">
                                <strong>${categoriaTop ? categoriaTop[0].charAt(0).toUpperCase() + categoriaTop[0].slice(1) : 'N/A'}</strong> 
                                domina las ventas con el <strong>${porcentajeTop}%</strong> del total de ingresos.
                            </p>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #28a745; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                                <i class="bi bi-graph-up-arrow" style="font-size: 1.5rem; color: #28a745; margin-right: 0.8rem;"></i>
                                <h5 style="margin: 0; color: #28a745; font-weight: 700;">Rendimiento General</h5>
                            </div>
                            <p style="margin: 0; color: #666; font-size: 1rem;">
                                Se analizaron <strong>${comprasFiltradas.length}</strong> transacciones con un promedio de 
                                <strong>$${(totalVentas / comprasFiltradas.length).toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</strong> por venta.
                            </p>
                        </div>
                    </div>
                ` : `
                    <!-- Mensaje cuando no hay datos -->
                    <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 3rem; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <i class="bi bi-inbox" style="font-size: 4rem; color: #ccc; margin-bottom: 1.5rem; display: block;"></i>
                        <h4 style="color: #666; margin: 0 0 1rem 0; font-size: 1.5rem;">No hay ventas registradas</h4>
                        <p style="color: #999; margin: 0; font-size: 1rem;">No se encontraron ventas en el período seleccionado</p>
                    </div>
                `}

                <!-- Pie de página del informe -->
                <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%); color: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(139, 0, 0, 0.3);">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center;">
                            <i class="bi bi-info-circle-fill" style="font-size: 1.2rem; margin-right: 0.8rem;"></i>
                            <span style="font-weight: 600;">Informe generado el ${new Date().toLocaleString('es-CO')}</span>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 0.9rem; opacity: 0.9;">BIKE STORE J,A,J</div>
                            <div style="font-size: 0.8rem; opacity: 0.8;">Panel de Administración</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (reportType === 'mas-popular') {
        // Generar informe de productos más populares (basado en vistas o interacciones)
        // Por ahora, usaremos el mismo enfoque que más vendidos
        const productosVendidos = {};
        
        comprasFiltradas.forEach(compra => {
            compra.productos.forEach(producto => {
                if (productosVendidos[producto.id]) {
                    productosVendidos[producto.id].cantidad += producto.cantidad;
                    productosVendidos[producto.id].total += producto.precio * producto.cantidad;
                } else {
                    productosVendidos[producto.id] = {
                        titulo: producto.titulo,
                        cantidad: producto.cantidad,
                        total: producto.precio * producto.cantidad
                    };
                }
            });
        });

        const sortedProducts = Object.values(productosVendidos)
            .sort((a, b) => b.cantidad - a.cantidad);
        
        adminReportResult.innerHTML = `
            <h3><i class="bi bi-star-fill" style="color: #ffc107; margin-right: 0.5rem;"></i>Productos Más Populares</h3>
            <p><strong>Período:</strong> ${formatDate(startDate)} a ${formatDate(endDate)}</p>
            <p><strong>Total de compras analizadas:</strong> ${comprasFiltradas.length}</p>
            ${sortedProducts.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th>Producto</th>
                            <th>Cantidad Vendida</th>
                            <th>Total Ventas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedProducts.map((producto, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${producto.titulo}</td>
                                <td>${producto.cantidad}</td>
                                <td>$${producto.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : '<p style="color: #666; font-style: italic;">No hay ventas registradas en este período.</p>'}
        `;
    }
}

// Función para recargar productos (disponible globalmente)
function recargarProductos() {
    fetch(`${API_BASE}/productos`)
        .then(response => response.json())
        .then(data => {
            window.productos = data;
            // Si la función cargarProductos está disponible, llamarla
            if (typeof cargarProductos === 'function') {
                cargarProductos(productos);
            }
        })
        .catch(error => {
            console.error('Error al recargar productos:', error);
        });
}

// La función editarProducto ahora está implementada en main.js
// para evitar conflictos y asegurar que esté disponible cuando se necesite

// Manejar el envío del formulario de edición
document.getElementById('admin-edit-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msgDiv = document.getElementById('admin-edit-product-form-msg');
    msgDiv.textContent = '';
    
    const idProducto = document.getElementById('edit-product-id').value;
    
    // Crear FormData para enviar archivos
    const formData = new FormData();
    formData.append('nombre', document.getElementById('edit-product-nombre').value);
    formData.append('precio_venta', document.getElementById('edit-product-precio').value);
    formData.append('descripcion', document.getElementById('edit-product-descripcion').value);
    formData.append('cantidad', document.getElementById('edit-product-cantidad').value);
    formData.append('destacado', document.getElementById('edit-product-destacado').value === 'true');
    formData.append('categoria', document.getElementById('edit-product-categoria').value);
    formData.append('rol', 'admin');
    
    // Agregar la imagen si se seleccionó una nueva
    const imagenInput = document.getElementById('edit-product-imagen');
    if (imagenInput.files.length > 0) {
        formData.append('imagen', imagenInput.files[0]);
    }
    
    try {
        const response = await fetch(`${API_BASE}/productos/${idProducto}`, {
            method: 'PUT',
            body: formData
        });
        const data = await response.json();
        if (response.ok) {
            msgDiv.style.color = 'green';
            msgDiv.textContent = 'Producto actualizado correctamente';
            // Cerrar modal
            document.getElementById('admin-edit-product-modal').style.display = 'none';
            // Recargar productos
            recargarProductos();
        } else {
            msgDiv.style.color = 'red';
            msgDiv.textContent = data.error || 'Error al actualizar producto';
        }
    } catch (error) {
        msgDiv.style.color = 'red';
        msgDiv.textContent = 'Error de red';
    }
});

function eliminarProducto(idProducto) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return;
    }
    
    // Obtener el usuario logueado
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    fetch(`${API_BASE}/productos/${idProducto}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            rol: 'admin',
            id_usuario: usuario ? usuario.id_usuario : null
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje) {
            alert('Producto eliminado correctamente');
            // Recargar productos
            fetch(`${API_BASE}/productos`)
                .then(response => response.json())
                .then(data => {
                    productos = data;
                    cargarProductos(productos);
                });
        } else {
            alert('Error al eliminar producto: ' + (data.error || 'Error desconocido'));
        }
    })
    .catch(error => {
        alert('Error de red al eliminar producto');
    });
}

// Lógica para los recuadros del modal principal de administración

document.addEventListener('DOMContentLoaded', function() {
    // Mostrar el botón de panel solo para admin
    // const adminPanelBtnContainer = document.getElementById('admin-panel-btn-container');
    // const usuario = JSON.parse(localStorage.getItem('usuario'));
    // if (usuario && usuario.rol === 'admin') {
    //     adminPanelBtnContainer.style.display = 'block';
    // } else {
    //     adminPanelBtnContainer.style.display = 'none';
    // }

    // Mostrar el modal automáticamente si el usuario es admin
    // if (usuario && usuario.rol === 'admin' && adminModal) {
    //     adminModal.style.display = 'flex';
    // } else if (adminModal) {
    //     adminModal.style.display = 'none';
    // }
    // if (closeAdminModal && adminModal) {
    //     closeAdminModal.addEventListener('click', () => {
    //         adminModal.style.display = 'none';
    //     });
    //     window.addEventListener('click', (event) => {
    //         if (event.target === adminModal) {
    //             adminModal.style.display = 'none';
    //         }
    //     });
    // }

    const btnInformes = document.getElementById('btn-admin-informes');
    const btnProductos = document.getElementById('btn-admin-productos');
    const btnUsuarios = document.getElementById('btn-admin-usuarios');
    const contentInformes = document.getElementById('admin-informes-content');
    const contentProductos = document.getElementById('admin-productos-content');
    const contentUsuarios = document.getElementById('admin-usuarios-content');

    // Contenido de ejemplo para cada recuadro (puedes reemplazarlo por el real)
    const informesHTML = `
        <form id='admin-report-form'>
            <label>Tipo de informe:</label>
            <select id='report-type' name='report-type' required>
                <option value='mas-vendido'>Producto más vendido</option>
                <option value='menos-vendido'>Producto menos vendido</option>
                <option value='mas-popular'>Producto más popular</option>
                <option value='ventas-por-fecha'>Ventas por fecha</option>
                <option value='ventas-por-categoria'>Ventas por categoría</option>
            </select>
            <button type='submit'>Generar</button>
        </form>
        <div id='admin-report-result'></div>
    `;
    const productosHTML = `
        <div id='admin-productos-lista'>
            <!-- Aquí se mostrarán los productos del admin -->
        </div>
    `;
    const usuariosHTML = `
        <div id='admin-usuarios-lista'>
            <!-- Aquí se mostrarán los usuarios registrados -->
        </div>
    `;

    if (btnInformes) {
        btnInformes.addEventListener('click', () => {
            contentInformes.style.display = 'block';
            contentInformes.innerHTML = informesHTML;
            contentProductos.style.display = 'none';
            contentUsuarios.style.display = 'none';
        });
    }
    if (btnProductos) {
        btnProductos.addEventListener('click', () => {
            contentProductos.style.display = 'block';
            contentInformes.style.display = 'none';
            contentUsuarios.style.display = 'none';
            // Cargar productos reales
            fetch('http://localhost:3001/api/productos')
                .then(res => res.json())
                .then(productos => {
                    let html = `<table style='width:100%;font-size:0.9em;'><tr><th>Nombre</th><th>Precio</th><th>Categoría</th></tr>`;
                    productos.forEach(p => {
                        html += `<tr><td>${p.nombre}</td><td>$${p.precio_venta}</td><td>${p.categoria}</td></tr>`;
                    });
                    html += `</table>`;
                    contentProductos.innerHTML = html;
                })
                .catch(() => {
                    contentProductos.innerHTML = '<p style="color:red;">No se pudieron cargar los productos.</p>';
                });
        });
    }
    if (btnUsuarios) {
        btnUsuarios.addEventListener('click', () => {
            contentUsuarios.style.display = 'block';
            contentInformes.style.display = 'none';
            contentProductos.style.display = 'none';
            // Cargar usuarios reales
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            fetch(`http://localhost:3001/api/usuarios?rol=admin&id_usuario=${usuario ? usuario.id_usuario : ''}`)
                .then(res => res.json())
                .then(usuarios => {
                    let html = `<table style='width:100%;font-size:0.9em;'><tr><th>Nombre</th><th>Correo</th><th>Rol</th></tr>`;
                    usuarios.forEach(u => {
                        html += `<tr><td>${u.nombre}</td><td>${u.correo}</td><td>${u.rol}</td></tr>`;
                    });
                    html += `</table>`;
                    contentUsuarios.innerHTML = html;
                })
                .catch(() => {
                    contentUsuarios.innerHTML = '<p style="color:red;">No se pudieron cargar los usuarios.</p>';
                });
        });
    }

    // Mejorar manejo de error al buscar productos
    window.editarProducto = function(idProducto) {
        const productosDisponibles = typeof productos !== 'undefined' ? productos : (window.productos || []);
        const producto = productosDisponibles.find(p => p.id_producto === idProducto);
        if (!producto) {
            console.warn('Producto no encontrado:', idProducto);
            alert('El producto seleccionado no existe o fue eliminado.');
            return;
        }
        // ... resto de la función ...
    };
});

// Función para mostrar/ocultar el formulario de informes
function toggleReportForm() {
    if (adminReportFormContainer.style.display === 'none' || adminReportFormContainer.style.display === '') {
        adminReportFormContainer.style.display = 'block';
        adminReportBtnContainer.style.display = 'none';
        // Limpiar formulario y mensajes
        adminReportForm.reset();
        adminReportFormMsg.textContent = '';
        adminReportFormMsg.className = '';
        adminReportResult.innerHTML = '';
        reportDateRange.style.display = 'none';
    } else {
        adminReportFormContainer.style.display = 'none';
        adminReportBtnContainer.style.display = 'block';
    }
}

// Función para cerrar el formulario de informes
function closeReportForm() {
    adminReportFormContainer.style.display = 'none';
    adminReportBtnContainer.style.display = 'block';
    // Limpiar formulario y mensajes
    adminReportForm.reset();
    adminReportFormMsg.textContent = '';
    adminReportFormMsg.className = '';
    adminReportResult.innerHTML = '';
    reportDateRange.style.display = 'none';
}

// Función para manejar el cambio de período
function handlePeriodChange() {
    const period = reportPeriodSelect.value;
    if (period === 'custom') {
        reportDateRange.style.display = 'block';
    } else {
        reportDateRange.style.display = 'none';
    }
}

// Recarga automática de informes al abrir la sección
if (adminReportBtn) {
    adminReportBtn.addEventListener('click', () => {
        toggleReportForm();
        // Obtener valores actuales del formulario
        const reportType = document.getElementById('report-type')?.value;
        const reportPeriod = reportPeriodSelect?.value;
        if (reportType) {
            // Obtener rango de fechas
            const dateRange = getDateRange(reportPeriod);
            // Generar el informe automáticamente
            generateReport(dateRange.start, dateRange.end, reportType);
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
            const startInput = document.getElementById('report-start-date').value;
            const endInput = document.getElementById('report-end-date').value;
            if (startInput && endInput) {
                return {
                    start: new Date(startInput),
                    end: new Date(endInput)
                };
            }
            break;
    }
    
    return { start: startDate, end: endDate };
}

// Función para formatear fecha
function formatDate(date) {
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Manejar el envío del formulario de informes
if (adminReportForm) {
    adminReportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const reportType = document.getElementById('report-type').value;
        const reportPeriod = reportPeriodSelect.value;
        
        if (!reportType) {
            adminReportFormMsg.textContent = 'Por favor selecciona un tipo de informe';
            adminReportFormMsg.className = 'error';
            return;
        }
        
        if (reportPeriod === 'custom') {
            const startDate = document.getElementById('report-start-date').value;
            const endDate = document.getElementById('report-end-date').value;
            if (!startDate || !endDate) {
                adminReportFormMsg.textContent = 'Por favor selecciona las fechas de inicio y fin';
                adminReportFormMsg.className = 'error';
                return;
            }
        }
        
        // Limpiar mensajes anteriores
        adminReportFormMsg.textContent = '';
        adminReportFormMsg.className = '';
        adminReportResult.innerHTML = '';
        
        try {
            // Mostrar mensaje de carga
            adminReportFormMsg.textContent = 'Generando informe...';
            adminReportFormMsg.className = '';
            
            // Obtener rango de fechas
            const dateRange = getDateRange(reportPeriod);
            
            // Generar el informe
            await generateReport(dateRange.start, dateRange.end, reportType);
            
            adminReportFormMsg.textContent = 'Informe generado correctamente';
            adminReportFormMsg.className = 'success';
            
        } catch (error) {
            adminReportFormMsg.textContent = 'Error al generar el informe: ' + error.message;
            adminReportFormMsg.className = 'error';
        }
    });
}

// Event listeners para el sistema de usuarios
if (adminUsersBtn) {
    adminUsersBtn.addEventListener('click', toggleUsersForm);
}

if (closeAdminUsersBtn) {
    closeAdminUsersBtn.addEventListener('click', closeUsersForm);
}

// Función para mostrar/ocultar el formulario de usuarios
function toggleUsersForm() {
    if (adminUsersFormContainer.style.display === 'none' || adminUsersFormContainer.style.display === '') {
        adminUsersFormContainer.style.display = 'block';
        adminUsersBtnContainer.style.display = 'none';
        // Cargar usuarios
        loadUsers();
    } else {
        adminUsersFormContainer.style.display = 'none';
        adminUsersBtnContainer.style.display = 'block';
    }
}

// Función para cerrar el formulario de usuarios
function closeUsersForm() {
    adminUsersFormContainer.style.display = 'none';
    adminUsersBtnContainer.style.display = 'block';
    // Limpiar mensajes
    adminUsersFormMsg.textContent = '';
    adminUsersFormMsg.className = '';
}

// Función para cargar usuarios desde el servidor
async function loadUsers() {
    try {
        // Mostrar mensaje de carga
        adminUsersContent.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="bi bi-arrow-clockwise" style="font-size: 2rem; color: #ccc; margin-bottom: 1rem; animation: spin 1s linear infinite;"></i>
                <p style="color: #666; margin: 0;">Cargando usuarios...</p>
            </div>
        `;
        
        const response = await fetch(`${API_BASE}/usuarios?rol=admin`);
        const usuarios = await response.json();
        
        if (response.ok) {
            displayUsers(usuarios);
            adminUsersFormMsg.textContent = `${usuarios.length} usuarios cargados correctamente`;
            adminUsersFormMsg.className = 'success';
        } else {
            throw new Error(usuarios.error || 'Error al cargar usuarios');
        }
    } catch (error) {
        adminUsersContent.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="bi bi-exclamation-triangle-fill" style="font-size: 2rem; color: #dc3545; margin-bottom: 1rem;"></i>
                <p style="color: #dc3545; margin: 0;">Error al cargar usuarios: ${error.message}</p>
            </div>
        `;
        adminUsersFormMsg.textContent = 'Error al cargar usuarios';
        adminUsersFormMsg.className = 'error';
    }
}

// Función para mostrar usuarios en la tabla
function displayUsers(usuarios) {
    // Calcular estadísticas
    const totalUsers = usuarios.length;
    const adminUsers = usuarios.filter(u => u.rol === 'admin').length;
    const clientUsers = usuarios.filter(u => u.rol === 'cliente').length;
    
    // Crear estadísticas
    const statsHTML = `
        <div class="users-stats">
            <div class="stat-card">
                <div class="stat-number">${totalUsers}</div>
                <div class="stat-label">Total Usuarios</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${adminUsers}</div>
                <div class="stat-label">Administradores</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${clientUsers}</div>
                <div class="stat-label">Clientes</div>
            </div>
        </div>
    `;
    
    // Crear filtros
    const filtersHTML = `
        <div class="users-filters">
            <div class="filter-group">
                <label for="role-filter">Filtrar por rol:</label>
                <select id="role-filter" onchange="filterUsers()">
                    <option value="">Todos los roles</option>
                    <option value="admin">Administradores</option>
                    <option value="cliente">Clientes</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="search-users">Buscar:</label>
                <input type="text" id="search-users" placeholder="Buscar por nombre o email..." onkeyup="filterUsers()">
            </div>
        </div>
    `;
    
    // Crear tabla
    const tableHTML = `
        <table class="users-table" id="users-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Rol</th>
                    <th>Fecha Registro</th>
                </tr>
            </thead>
            <tbody>
                ${usuarios.map(usuario => `
                    <tr data-role="${usuario.rol}" data-search="${usuario.nombre.toLowerCase()} ${usuario.correo.toLowerCase()}">
                        <td>${usuario.id_usuario || 'N/A'}</td>
                        <td><strong>${usuario.nombre || 'N/A'}</strong></td>
                        <td>${usuario.correo || 'N/A'}</td>
                        <td>${usuario.telefono || 'N/A'}</td>
                        <td>${usuario.direccion || 'N/A'}</td>
                        <td>
                            <span class="user-role ${usuario.rol}">${usuario.rol}</span>
                        </td>
                        <td>${formatDate(new Date(usuario.fecha_registro || Date.now()))}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    adminUsersContent.innerHTML = statsHTML + filtersHTML + tableHTML;
}

// Función para filtrar usuarios
function filterUsers() {
    const roleFilter = document.getElementById('role-filter').value;
    const searchFilter = document.getElementById('search-users').value.toLowerCase();
    const table = document.getElementById('users-table');
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const role = row.getAttribute('data-role');
        const searchText = row.getAttribute('data-search');
        
        const roleMatch = !roleFilter || role === roleFilter;
        const searchMatch = !searchFilter || searchText.includes(searchFilter);
        
        if (roleMatch && searchMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Agregar animación de spin para el ícono de carga
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Funcionalidad para el botón "Ver Productos Agregados"
document.addEventListener('DOMContentLoaded', function() {
    const viewProductsBtn = document.getElementById('admin-view-products-btn');
    const viewProductsModal = document.getElementById('admin-view-products-modal');
    const closeViewProductsModal = document.getElementById('close-view-products-modal');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const backToCategoriesBtn = document.getElementById('back-to-categories');
    const categoriesView = document.getElementById('categories-view');
    const productsView = document.getElementById('products-view');
    const productsGrid = document.getElementById('products-grid');
    const noProductsMessage = document.getElementById('no-products-message');
    const selectedCategoryName = document.getElementById('selected-category-name');

    // Mostrar modal al hacer clic en el botón
    if (viewProductsBtn) {
        viewProductsBtn.addEventListener('click', function() {
            viewProductsModal.style.display = 'block';
            showCategoriesView();
        });
    }

    // Cerrar modal
    if (closeViewProductsModal) {
        closeViewProductsModal.addEventListener('click', function() {
            viewProductsModal.style.display = 'none';
        });
    }

    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', function(event) {
        if (event.target === viewProductsModal) {
            viewProductsModal.style.display = 'none';
        }
    });

    // Manejar clic en botones de categoría
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const categoryText = this.textContent.trim();
            showProductsView(category, categoryText);
        });
    });

    // Botón para volver a categorías
    if (backToCategoriesBtn) {
        backToCategoriesBtn.addEventListener('click', function() {
            showCategoriesView();
        });
    }

    // Función para mostrar vista de categorías
    function showCategoriesView() {
        categoriesView.style.display = 'block';
        productsView.style.display = 'none';
        backToCategoriesBtn.style.display = 'none';
    }

    // Función para mostrar productos de una categoría
    function showProductsView(category, categoryName) {
        categoriesView.style.display = 'none';
        productsView.style.display = 'block';
        backToCategoriesBtn.style.display = 'inline-block';
        
        selectedCategoryName.textContent = categoryName;
        
        // Obtener productos de la categoría seleccionada
        const productosCategoria = window.productos.filter(producto => 
            producto.categoria === category
        );
        
        displayProductsInModal(productosCategoria);
    }

    // Función para mostrar productos en el modal
    function displayProductsInModal(productos) {
        productsGrid.innerHTML = '';
        
        if (productos.length === 0) {
            noProductsMessage.style.display = 'block';
            productsGrid.style.display = 'none';
        } else {
            noProductsMessage.style.display = 'none';
            productsGrid.style.display = 'grid';
            
            productos.forEach(producto => {
                const productCard = createProductCard(producto);
                productsGrid.appendChild(productCard);
            });
        }
    }

    // Función para crear tarjeta de producto
    function createProductCard(producto) {
        const card = document.createElement('div');
        card.className = 'product-card-modal';
        
        // Determinar la ruta de la imagen
        let imagenSrc = producto.imagen;
        if (imagenSrc && !imagenSrc.startsWith('http')) {
            imagenSrc = 'http://localhost:3001' + imagenSrc;
        }
        
        // Mostrar stock
        const stockActual = producto.stock || producto.cantidad || 0;
        
        card.innerHTML = `
            <img src="${imagenSrc || '../img/bicicleta/BicicletaGiantContend.jpg'}" alt="${producto.nombre}">
            <h4>${producto.nombre}</h4>
            <div class="price">$${producto.precio_venta.toLocaleString()}</div>
            <div class="stock">Stock: ${stockActual}</div>
            <div class="actions">
                <button class="btn-edit" onclick="editarProducto(${producto.id_producto})">
                    <i class="bi bi-pencil-fill"></i> Editar
                </button>
                <button class="btn-delete" onclick="eliminarProducto(${producto.id_producto})">
                    <i class="bi bi-trash-fill"></i> Eliminar
                </button>
            </div>
        `;
        
        return card;
    }
});

// Función para eliminar producto (disponible globalmente)
window.eliminarProducto = function(idProducto) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        // Obtener el usuario logueado
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        
        fetch(`${API_BASE}/productos/${idProducto}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                rol: 'admin',
                id_usuario: usuario ? usuario.id_usuario : null
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje) {
                alert('Producto eliminado correctamente');
                // Recargar productos
                recargarProductos();
                // Cerrar modal si está abierto
                const modal = document.getElementById('admin-view-products-modal');
                if (modal && modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            } else {
                alert('Error al eliminar el producto');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar el producto');
        });
    }
};

// Función para mostrar elementos de administrador
function mostrarElementosAdmin() {
    // Mostrar botones de administrador
    const addBtnContainer = document.getElementById('admin-add-product-btn-container');
    const reportBtnContainer = document.getElementById('admin-report-btn-container');
    const usersBtnContainer = document.getElementById('admin-users-btn-container');
    const viewProductsBtnContainer = document.getElementById('admin-view-products-btn-container');
    
    if (addBtnContainer) addBtnContainer.style.display = 'block';
    if (reportBtnContainer) reportBtnContainer.style.display = 'block';
    if (usersBtnContainer) usersBtnContainer.style.display = 'block';
    if (viewProductsBtnContainer) viewProductsBtnContainer.style.display = 'block';
    
    // Ocultar botón de login
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) loginBtn.style.display = 'none';
    
    // Mostrar nombre de usuario y botón de cerrar sesión
    const userName = document.getElementById('user-name');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (userName && usuario) {
        userName.textContent = `Bienvenido, ${usuario.nombre} ${usuario.apellido}`;
        userName.style.display = 'inline';
    }
    
    // Agregar botón de cerrar sesión si no existe
    if (!document.getElementById('logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.className = 'admin-button boton-menu';
        logoutBtn.innerHTML = '<i class="bi bi-box-arrow-right"></i> Cerrar Sesión';
        logoutBtn.style.cssText = 'background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; font-size: 0.9rem; margin-left: 1rem;';
        
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('usuario');
            location.reload();
        });
        
        const userArea = document.querySelector('.user-area');
        if (userArea) {
            userArea.appendChild(logoutBtn);
        }
    }
}