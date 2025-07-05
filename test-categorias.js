const mysql = require('mysql2');
const axios = require('axios');

// Configuración
const API_BASE = 'http://localhost:3001/api';

// Simular usuario admin
const usuarioAdmin = {
    id_usuario: 1,
    rol: 'admin'
};

async function probarCategorias() {
    console.log('🧪 Probando diferencias entre categorías bicicleta vs repuestos...\n');

    // 1. Probar agregar producto de categoría bicicleta
    console.log('🚴 Probando categoría "bicicleta"...');
    try {
        const formDataBicicleta = new FormData();
        formDataBicicleta.append('nombre', 'Bicicleta de Prueba');
        formDataBicicleta.append('precio_venta', '500000');
        formDataBicicleta.append('descripcion', 'Bicicleta de prueba para test');
        formDataBicicleta.append('cantidad', '5');
        formDataBicicleta.append('categoria', 'bicicleta');
        formDataBicicleta.append('rol', 'admin');
        formDataBicicleta.append('id_usuario', usuarioAdmin.id_usuario);

        const responseBicicleta = await axios.post(`${API_BASE}/productos`, formDataBicicleta, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('✅ Bicicleta agregada exitosamente:', responseBicicleta.data);
    } catch (error) {
        console.error('❌ Error al agregar bicicleta:', error.response?.data || error.message);
    }

    // Esperar 1 segundo
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Probar agregar producto de categoría repuestos
    console.log('\n🔧 Probando categoría "repuestos"...');
    try {
        const formDataRepuestos = new FormData();
        formDataRepuestos.append('nombre', 'Repuesto de Prueba');
        formDataRepuestos.append('precio_venta', '25000');
        formDataRepuestos.append('descripcion', 'Repuesto de prueba para test');
        formDataRepuestos.append('cantidad', '10');
        formDataRepuestos.append('categoria', 'repuestos');
        formDataRepuestos.append('rol', 'admin');
        formDataRepuestos.append('id_usuario', usuarioAdmin.id_usuario);

        const responseRepuestos = await axios.post(`${API_BASE}/productos`, formDataRepuestos, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('✅ Repuesto agregado exitosamente:', responseRepuestos.data);
    } catch (error) {
        console.error('❌ Error al agregar repuesto:', error.response?.data || error.message);
    }

    // 3. Verificar productos en la base de datos
    console.log('\n📊 Verificando productos en la base de datos...');
    try {
        const conexion = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Jona081651480',
            database: 'bikeStore2025'
        });

        conexion.query(
            'SELECT p.id_producto, p.nombre, p.categoria, s.stock, s.estado FROM productos p LEFT JOIN stocks s ON p.id_producto = s.id_producto WHERE p.nombre LIKE "%Prueba%" ORDER BY p.id_producto DESC LIMIT 5',
            (err, results) => {
                if (err) {
                    console.error('❌ Error al consultar productos:', err);
                } else {
                    console.log('📋 Productos de prueba encontrados:');
                    console.table(results);
                }
                conexion.end();
            }
        );
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
    }
}

// Ejecutar la prueba
probarCategorias(); 