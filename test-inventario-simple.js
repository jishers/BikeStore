const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Función para probar los endpoints directamente
async function probarEndpoints() {
    console.log('🚀 Probando endpoints del sistema de inventario...\n');
    
    try {
        // 1. Probar obtener productos
        console.log('1️⃣ Probando obtener productos...');
        const response1 = await axios.get(`${API_BASE}/productos`);
        console.log(`✅ Productos obtenidos: ${response1.data.length}`);
        
        // 2. Probar informe de stock actual (no requiere autenticación)
        console.log('\n2️⃣ Probando informe de stock actual...');
        const response2 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'stock-actual'
        });
        console.log(`✅ Stock actual obtenido: ${response2.data.resultados.length} productos`);
        
        // 3. Probar resumen de inventario
        console.log('\n3️⃣ Probando resumen de inventario...');
        const fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 días atrás
        const fechaFin = new Date().toISOString().split('T')[0]; // Hoy
        
        const response3 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'resumen-inventario',
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        });
        
        if (response3.data.resultados.length > 0) {
            const resumen = response3.data.resultados[0];
            console.log('✅ Resumen de inventario obtenido:');
            console.log(`   📊 Productos modificados: ${resumen.productos_modificados || 0}`);
            console.log(`   📊 Productos nuevos: ${resumen.productos_nuevos || 0}`);
            console.log(`   📊 Productos actualizados: ${resumen.productos_actualizados || 0}`);
            console.log(`   📊 Total cantidad agregada: ${resumen.total_cantidad_agregada || 0}`);
            console.log(`   📊 Admins activos: ${resumen.admins_activos || 0}`);
        } else {
            console.log('ℹ️ No hay datos de inventario para mostrar en el resumen');
        }
        
        // 4. Probar operaciones de administradores
        console.log('\n4️⃣ Probando operaciones de administradores...');
        const response4 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'operaciones-admin',
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        });
        console.log(`✅ Operaciones de administradores: ${response4.data.resultados.length} operaciones`);
        
        // 5. Probar productos más agregados
        console.log('\n5️⃣ Probando productos más agregados...');
        const response5 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'productos-mas-agregados',
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        });
        console.log(`✅ Productos más agregados: ${response5.data.resultados.length} productos`);
        
        console.log('\n🎉 Todas las pruebas completadas exitosamente!');
        console.log('\n📋 Resumen de funcionalidades probadas:');
        console.log('✅ Endpoint de productos funcionando');
        console.log('✅ Informe de stock actual funcionando');
        console.log('✅ Resumen de inventario funcionando');
        console.log('✅ Operaciones de administradores funcionando');
        console.log('✅ Productos más agregados funcionando');
        
    } catch (error) {
        console.log('❌ Error en las pruebas:', error.response?.data?.error || error.message);
        if (error.response?.status === 401) {
            console.log('💡 Nota: Algunos endpoints requieren autenticación de administrador');
        }
    }
}

// Ejecutar pruebas
probarEndpoints().catch(console.error); 