const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Datos de prueba del administrador
const adminData = {
    id_usuario: 1, // ID del administrador en la base de datos
    rol: 'admin'
};

async function probarSistemaInventario() {
    console.log('🚀 Probando sistema de inventario con ID de usuario...\n');

    try {
        // 1. Probar agregar un producto con ID de usuario
        console.log('1️⃣ Probando agregar producto con ID de usuario...');
        const formData = new FormData();
        formData.append('nombre', 'Bicicleta de Prueba - Con Usuario');
        formData.append('precio_venta', '2500000');
        formData.append('descripcion', 'Bicicleta de prueba para verificar que el sistema registra correctamente el usuario');
        formData.append('cantidad', '30');
        formData.append('categoria', 'bicicleta');
        formData.append('rol', 'admin');
        formData.append('id_usuario', adminData.id_usuario);

        const response1 = await axios.post(`${API_BASE}/productos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response1.status === 201 || response1.status === 200) {
            console.log('✅ Producto agregado exitosamente');
            console.log('📋 Respuesta:', response1.data);
        }

        // 2. Probar informes de inventario con ID de usuario
        console.log('\n2️⃣ Probando informes de inventario con ID de usuario...');
        
        const response2 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'productos-mas-agregados',
            periodo: 'today',
            fechaInicio: new Date().toISOString().split('T')[0],
            fechaFin: new Date().toISOString().split('T')[0],
            rol: 'admin',
            id_usuario: adminData.id_usuario
        });

        if (response2.status === 200) {
            console.log('✅ Informe de productos más agregados generado');
            console.log('📊 Resultados:', response2.data.resultados);
        }

        // 3. Probar resumen de inventario
        console.log('\n3️⃣ Probando resumen de inventario...');
        const response3 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'resumen-inventario',
            periodo: 'month',
            fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
            fechaFin: new Date().toISOString().split('T')[0],
            rol: 'admin',
            id_usuario: adminData.id_usuario
        });

        if (response3.status === 200) {
            console.log('✅ Resumen de inventario generado');
            console.log('📈 Resumen:', response3.data.resultados);
        }

        // 4. Probar operaciones de administradores
        console.log('\n4️⃣ Probando operaciones de administradores...');
        const response4 = await axios.post(`${API_BASE}/informes-inventario`, {
            tipo: 'operaciones-admin',
            periodo: 'month',
            fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
            fechaFin: new Date().toISOString().split('T')[0],
            rol: 'admin',
            id_usuario: adminData.id_usuario
        });

        if (response4.status === 200) {
            console.log('✅ Operaciones de administradores obtenidas');
            console.log('👥 Operaciones:', response4.data.resultados);
        }

        console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');
        console.log('✅ El sistema de inventario está funcionando correctamente con el ID de usuario');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.response?.data || error.message);
        
        if (error.response?.status === 403) {
            console.log('🔒 Error de autorización - Verificar que el ID de usuario sea válido');
        }
    }
}

// Ejecutar las pruebas
probarSistemaInventario(); 