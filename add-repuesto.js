const mysql = require('mysql2');

// Configuración de la base de datos
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jona081651480',
    database: 'bikeStore2025'
});

async function agregarRepuesto() {
    console.log('🔧 Agregando producto de repuesto...\n');

    // 1. Agregar el producto
    conexion.query(
        'INSERT INTO productos (nombre, precio_venta, descripcion, categoria) VALUES (?, ?, ?, ?)',
        ['Pastilla de freno Shimano', 35000, 'Pastilla de freno compatible con Shimano, alta durabilidad.', 'repuestos'],
        (err, result) => {
            if (err) {
                console.error('❌ Error al agregar producto:', err);
                conexion.end();
                return;
            }
            
            const idProducto = result.insertId;
            console.log(`✅ Producto agregado con ID: ${idProducto}`);
            
            // 2. Agregar stock para el producto
            conexion.query(
                'INSERT INTO stocks (id_producto, stock, stock_minimo, estado) VALUES (?, ?, ?, ?)',
                [idProducto, 10, 4, 'disponible'],
                (err2, result2) => {
                    if (err2) {
                        console.error('❌ Error al agregar stock:', err2);
                    } else {
                        console.log(`✅ Stock agregado: 10 unidades disponibles`);
                    }
                    
                    // 3. Verificar que todo se agregó correctamente
                    setTimeout(() => {
                        conexion.query(
                            'SELECT p.id_producto, p.nombre, p.categoria, p.precio_venta, s.stock, s.estado FROM productos p LEFT JOIN stocks s ON p.id_producto = s.id_producto WHERE p.id_producto = ?',
                            [idProducto],
                            (err3, results) => {
                                if (err3) {
                                    console.error('❌ Error al verificar:', err3);
                                } else {
                                    console.log('\n📋 Producto agregado correctamente:');
                                    console.table(results);
                                }
                                
                                // 4. Mostrar todos los productos de repuestos
                                setTimeout(() => {
                                    conexion.query(
                                        'SELECT p.id_producto, p.nombre, p.categoria, s.stock FROM productos p LEFT JOIN stocks s ON p.id_producto = s.id_producto WHERE p.categoria = "repuestos"',
                                        (err4, results4) => {
                                            if (err4) {
                                                console.error('❌ Error al consultar repuestos:', err4);
                                            } else {
                                                console.log('\n📈 Todos los productos de repuestos:');
                                                console.table(results4);
                                            }
                                            
                                            console.log('\n✅ ¡Listo! Ahora refresca la página y deberías ver el producto en la categoría "Repuestos".');
                                            conexion.end();
                                        }
                                    );
                                }, 500);
                            }
                        );
                    }, 500);
                }
            );
        }
    );
}

// Ejecutar el script
agregarRepuesto(); 