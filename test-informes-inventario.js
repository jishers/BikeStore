const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Función para probar los informes de inventario
async function probarInformesInventario() {
    console.log('🧪 Probando informes de inventario...\n');
    
    const fechaHoy = new Date().toISOString().split('T')[0];
    
    // Primero obtener un ID de administrador válido
    let adminId = null;
    try {
        const adminResponse = await axios.get(`${API_BASE}/usuarios?rol=admin`);
        if (adminResponse.data && adminResponse.data.length > 0) {
            adminId = adminResponse.data[0].id_usuario;
            console.log(`👤 Usando administrador ID: ${adminId} (${adminResponse.data[0].nombre} ${adminResponse.data[0].apellido})`);
        } else {
            console.log('❌ No se encontraron administradores en la base de datos');
            return;
        }
    } catch (error) {
        console.error('❌ Error al obtener administradores:', error.response?.data || error.message);
        return;
    }
    
    try {
        // 1. Probar informe de operaciones de administradores
        console.log('\n1️⃣ Probando: Operaciones de administradores');
        const response1 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'operaciones-admin',
            fechaInicio: fechaHoy,
            fechaFin: fechaHoy,
            rol: 'admin',
            id_usuario: adminId
        });
        
        if (response1.data.resultados && response1.data.resultados.length > 0) {
            console.log(`✅ Operaciones de administradores: ${response1.data.resultados.length} operaciones encontradas`);
            console.log(`   Primera operación: ${response1.data.resultados[0].producto} - ${response1.data.resultados[0].tipo_operacion}`);
        } else {
            console.log('⚠️  Operaciones de administradores: No hay datos para hoy');
        }
        
        // 2. Probar informe de productos con más cantidad agregada
        console.log('\n2️⃣ Probando: Productos con más cantidad agregada');
        const response2 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'productos-mas-agregados',
            fechaInicio: fechaHoy,
            fechaFin: fechaHoy,
            rol: 'admin',
            id_usuario: adminId
        });
        
        if (response2.data.resultados && response2.data.resultados.length > 0) {
            console.log(`✅ Productos con más cantidad agregada: ${response2.data.resultados.length} productos encontrados`);
            console.log(`   Producto con más agregado: ${response2.data.resultados[0].producto} - ${response2.data.resultados[0].total_agregado} unidades`);
        } else {
            console.log('⚠️  Productos con más cantidad agregada: No hay datos para hoy');
        }
        
        // 3. Probar informe de resumen general del inventario
        console.log('\n3️⃣ Probando: Resumen general del inventario');
        const response3 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'resumen-inventario',
            fechaInicio: fechaHoy,
            fechaFin: fechaHoy,
            rol: 'admin',
            id_usuario: adminId
        });
        
        if (response3.data.resultados && response3.data.resultados.length > 0) {
            const resumen = response3.data.resultados[0];
            console.log(`✅ Resumen general del inventario:`);
            console.log(`   - Productos modificados: ${resumen.productos_modificados || 0}`);
            console.log(`   - Productos nuevos: ${resumen.productos_nuevos || 0}`);
            console.log(`   - Productos actualizados: ${resumen.productos_actualizados || 0}`);
            console.log(`   - Total cantidad agregada: ${resumen.total_cantidad_agregada || 0}`);
            console.log(`   - Admins activos: ${resumen.admins_activos || 0}`);
        } else {
            console.log('⚠️  Resumen general del inventario: No hay datos para hoy');
        }
        
        // 4. Probar con fechas más amplias para ver si hay datos históricos
        console.log('\n4️⃣ Probando con fechas más amplias (últimos 30 días)...');
        const fechaInicio = new Date();
        fechaInicio.setDate(fechaInicio.getDate() - 30);
        const fechaInicioStr = fechaInicio.toISOString().split('T')[0];
        
        const response4 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'operaciones-admin',
            fechaInicio: fechaInicioStr,
            fechaFin: fechaHoy,
            rol: 'admin',
            id_usuario: adminId
        });
        
        if (response4.data.resultados && response4.data.resultados.length > 0) {
            console.log(`✅ Datos históricos encontrados: ${response4.data.resultados.length} operaciones en los últimos 30 días`);
        } else {
            console.log('⚠️  No hay datos históricos en los últimos 30 días');
        }
        
        console.log('\n🎉 Pruebas completadas!');
        console.log('\n💡 Si los informes muestran datos, entonces funcionan correctamente.');
        console.log('💡 Si no muestran datos para "hoy", prueba con fechas más amplias o agrega más productos.');
        
    } catch (error) {
        console.error('❌ Error al probar informes:', error.response?.data || error.message);
    }
}

// Ejecutar las pruebas
probarInformesInventario(); 