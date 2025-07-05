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
    
    // Primero obtener algunos productos existentes
    conexion.query('SELECT id_producto, nombre FROM productos LIMIT 5', (err, productos) => {
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
        
        console.log(`Encontrados ${productos.length} productos para crear datos de prueba`);
        
        // Obtener el ID del administrador de prueba
        conexion.query('SELECT id_usuario FROM usuarios WHERE correo = ?', ['admin@bikestore.com'], (err, admins) => {
            if (err) {
                console.error('Error al obtener administrador:', err);
                conexion.end();
                return;
            }
            
            if (admins.length === 0) {
                console.log('No se encontró el administrador de prueba');
                conexion.end();
                return;
            }
            
            const adminId = admins[0].id_usuario;
            console.log(`Usando administrador ID: ${adminId}`);
            
            // Crear datos de prueba
            const datosPrueba = [
                // Producto 1 - Agregado nuevo
                {
                    id_producto: productos[0].id_producto,
                    id_admin: adminId,
                    tipo_operacion: 'agregar',
                    cantidad_anterior: 0,
                    cantidad_nueva: 50,
                    cantidad_cambio: 50,
                    descripcion: `Nuevo producto agregado: ${productos[0].nombre} - Cantidad inicial: 50`
                },
                // Producto 1 - Actualizado
                {
                    id_producto: productos[0].id_producto,
                    id_admin: adminId,
                    tipo_operacion: 'editar',
                    cantidad_anterior: 50,
                    cantidad_nueva: 75,
                    cantidad_cambio: 25,
                    descripcion: `Producto actualizado: ${productos[0].nombre} - Cantidad agregada: 25`
                }
            ];
            
            // Agregar más datos si hay más productos
            if (productos.length > 1) {
                datosPrueba.push({
                    id_producto: productos[1].id_producto,
                    id_admin: adminId,
                    tipo_operacion: 'agregar',
                    cantidad_anterior: 0,
                    cantidad_nueva: 30,
                    cantidad_cambio: 30,
                    descripcion: `Nuevo producto agregado: ${productos[1].nombre} - Cantidad inicial: 30`
                });
            }
            
            if (productos.length > 2) {
                datosPrueba.push({
                    id_producto: productos[2].id_producto,
                    id_admin: adminId,
                    tipo_operacion: 'agregar',
                    cantidad_anterior: 0,
                    cantidad_nueva: 100,
                    cantidad_cambio: 100,
                    descripcion: `Nuevo producto agregado: ${productos[2].nombre} - Cantidad inicial: 100`
                });
            }
            
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
                new Date() // Fecha actual
            ]);
            
            conexion.query(sql, [values], (err, result) => {
                if (err) {
                    console.error('Error al insertar datos de prueba:', err);
                } else {
                    console.log(`✅ ${result.affectedRows} operaciones de inventario creadas exitosamente`);
                    console.log('📊 Datos de prueba insertados:');
                    datosPrueba.forEach((dato, index) => {
                        console.log(`   ${index + 1}. ${dato.tipo_operacion} - ${dato.cantidad_cambio} unidades`);
                    });
                    console.log('\n🎉 Ahora puedes generar informes con datos reales!');
                }
                
                conexion.end();
            });
        });
    });
}); 