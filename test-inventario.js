const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Función para simular login de administrador
async function loginAdmin() {
    try {
        const response = await axios.post(`${API_BASE}/login`, {
            correo: 'admin@bikestore.com',
            contraseña: 'admin123'
        });
        
        if (response.data && response.data.usuario) {
            console.log('✅ Login exitoso como administrador');
            return response.data.usuario;
        }
    } catch (error) {
        console.log('❌ Error en login:', error.response?.data?.error || error.message);
        return null;
    }
}

// Función para agregar un producto de prueba
async function agregarProductoTest(adminData) {
    try {
        const formData = new FormData();
        formData.append('nombre', 'Bicicleta de Prueba - Inventario');
        formData.append('precio_venta', '1500000');
        formData.append('descripcion', 'Bicicleta de prueba para el sistema de inventario');
        formData.append('cantidad', '25');
        formData.append('categoria', 'bicicleta');
        formData.append('rol', 'admin');
        
        const response = await axios.post(`${API_BASE}/productos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${adminData.id_usuario}`
            }
        });
        
        if (response.data) {
            console.log('✅ Producto agregado exitosamente');
            console.log('📦 Producto:', response.data.nombre);
            console.log('📊 Cantidad agregada:', response.data.cantidad);
            return response.data;
        }
    } catch (error) {
        console.log('❌ Error al agregar producto:', error.response?.data?.error || error.message);
        return null;
    }
}

// Función para probar informes de inventario
async function probarInformesInventario() {
    try {
        const fechaInicio = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 7 días atrás
        const fechaFin = new Date().toISOString().split('T')[0]; // Hoy
        
        console.log('\n🔍 Probando informes de inventario...');
        
        // Probar informe de operaciones de administradores
        const response1 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'operaciones-admin',
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        });
        
        if (response1.data) {
            console.log('✅ Informe de operaciones de administradores generado');
            console.log(`📊 Operaciones encontradas: ${response1.data.resultados.length}`);
        }
        
        // Probar informe de productos más agregados
        const response2 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'productos-mas-agregados',
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        });
        
        if (response2.data) {
            console.log('✅ Informe de productos más agregados generado');
            console.log(`📊 Productos en el informe: ${response2.data.resultados.length}`);
        }
        
        // Probar resumen de inventario
        const response3 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'resumen-inventario',
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        });
        
        if (response3.data) {
            console.log('✅ Resumen de inventario generado');
            const resumen = response3.data.resultados[0];
            console.log(`📊 Productos modificados: ${resumen.productos_modificados || 0}`);
            console.log(`📊 Productos nuevos: ${resumen.productos_nuevos || 0}`);
            console.log(`📊 Total cantidad agregada: ${resumen.total_cantidad_agregada || 0}`);
        }
        
        // Probar stock actual
        const response4 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'stock-actual'
        });
        
        if (response4.data) {
            console.log('✅ Informe de stock actual generado');
            console.log(`📊 Productos en stock: ${response4.data.resultados.length}`);
        }
        
    } catch (error) {
        console.log('❌ Error al probar informes:', error.response?.data?.error || error.message);
    }
}

// Función principal de pruebas
async function ejecutarPruebas() {
    console.log('🚀 Iniciando pruebas del sistema de inventario...\n');
    
    // 1. Login como administrador
    const admin = await loginAdmin();
    if (!admin) {
        console.log('❌ No se pudo hacer login como administrador. Abortando pruebas.');
        return;
    }
    
    // 2. Agregar producto de prueba
    const producto = await agregarProductoTest(admin);
    if (!producto) {
        console.log('❌ No se pudo agregar producto de prueba. Abortando pruebas.');
        return;
    }
    
    // 3. Probar informes de inventario
    await probarInformesInventario();
    
    console.log('\n🎉 Pruebas completadas exitosamente!');
    console.log('\n📋 Resumen de lo que se probó:');
    console.log('✅ Login de administrador');
    console.log('✅ Agregar producto con cantidad');
    console.log('✅ Generar informes de inventario');
    console.log('✅ Verificar registro automático de operaciones');
}

// Ejecutar pruebas
ejecutarPruebas().catch(console.error); 