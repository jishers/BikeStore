const mysql = require('mysql2');

// Configuración de la base de datos
const config = {
    host: 'localhost',
    user: 'root',
    password: 'Jona081651480',
    database: 'bikeStore2025'
};

// Crear conexión
const conexion = mysql.createConnection(config);

// Conectar a la base de datos
conexion.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
    
    // Primero verificar si ya hay datos en inventario_operaciones
    conexion.query('SELECT COUNT(*) as count FROM inventario_operaciones', (err, result) => {
        if (err) {
            console.error('Error al verificar datos existentes:', err);
            conexion.end();
            return;
        }
        
        if (result[0].count > 0) {
            console.log(`Ya existen ${result[0].count} registros en inventario_operaciones`);
            console.log('Los informes deberían funcionar correctamente');
            conexion.end();
            return;
        }
        
        console.log('No hay datos en inventario_operaciones. Agregando datos de prueba...');
        
        // Obtener productos existentes
        conexion.query('SELECT id_producto, nombre FROM productos LIMIT 10', (err, productos) => {
            if (err) {
                console.error('Error al obtener productos:', err);
                conexion.end();
                return;
            }
            
            if (productos.length === 0) {
                console.log('No hay productos en la base de datos. Primero agrega algunos productos.');
                conexion.end();
                return;
            }
            
            // Obtener administradores
            conexion.query('SELECT id_usuario, nombre, apellido FROM usuarios WHERE rol = "admin" LIMIT 3', (err, admins) => {
                if (err) {
                    console.error('Error al obtener administradores:', err);
                    conexion.end();
                    return;
                }
                
                if (admins.length === 0) {
                    console.log('No hay administradores en la base de datos.');
                    conexion.end();
                    return;
                }
                
                console.log(`Encontrados ${productos.length} productos y ${admins.length} administradores`);
                
                // Crear datos de prueba variados
                const datosPrueba = [];
                const fechas = [
                    new Date('2025-01-15'),
                    new Date('2025-01-16'),
                    new Date('2025-01-17'),
                    new Date('2025-01-18'),
                    new Date('2025-01-19')
                ];
                
                productos.forEach((producto, index) => {
                    const admin = admins[index % admins.length];
                    const fecha = fechas[index % fechas.length];
                    
                    // Agregar operación de "agregar" producto
                    datosPrueba.push({
                        id_producto: producto.id_producto,
                        id_admin: admin.id_usuario,
                        tipo_operacion: 'agregar',
                        cantidad_anterior: 0,
                        cantidad_nueva: 50 + (index * 10),
                        cantidad_cambio: 50 + (index * 10),
                        descripcion: `Nuevo producto agregado: ${producto.nombre} - Cantidad inicial: ${50 + (index * 10)}`,
                        fecha_operacion: fecha
                    });
                    
                    // Agregar operación de "editar" producto (si no es el último)
                    if (index < productos.length - 1) {
                        datosPrueba.push({
                            id_producto: producto.id_producto,
                            id_admin: admin.id_usuario,
                            tipo_operacion: 'editar',
                            cantidad_anterior: 50 + (index * 10),
                            cantidad_nueva: 75 + (index * 15),
                            cantidad_cambio: 25 + (index * 5),
                            descripcion: `Producto actualizado: ${producto.nombre} - Cantidad agregada: ${25 + (index * 5)}`,
                            fecha_operacion: new Date(fecha.getTime() + 24 * 60 * 60 * 1000) // +1 día
                        });
                    }
                });
                
                // Insertar datos de prueba
                const sql = 'INSERT INTO inventario_operaciones (id_producto, id_admin, tipo_operacion, cantidad_anterior, cantidad_nueva, cantidad_cambio, descripcion, fecha_operacion) VALUES ?';
                const values = datosPrueba.map(d => [
                    d.id_producto,
                    d.id_admin,
                    d.tipo_operacion,
                    d.cantidad_anterior,
                    d.cantidad_nueva,
                    d.cantidad_cambio,
                    d.descripcion,
                    d.fecha_operacion
                ]);
                
                conexion.query(sql, [values], (err, result) => {
                    if (err) {
                        console.error('Error al insertar datos de prueba:', err);
                    } else {
                        console.log(`✅ ${result.affectedRows} operaciones de inventario creadas exitosamente`);
                        console.log('📊 Datos de prueba insertados:');
                        datosPrueba.forEach((dato, index) => {
                            console.log(`   ${index + 1}. ${dato.tipo_operacion} - ${dato.cantidad_cambio} unidades de ${dato.descripcion.split(':')[1].split('-')[0].trim()}`);
                        });
                        console.log('\n🎉 Ahora puedes generar informes con datos reales!');
                        console.log('💡 Prueba los siguientes informes:');
                        console.log('   - Operaciones de administradores');
                        console.log('   - Productos con más cantidad agregada');
                        console.log('   - Resumen general del inventario');
                    }
                    
                    conexion.end();
                });
            });
        });
    });
}); 