const mysql = require('mysql2');

// Configuración de la base de datos
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jona081651480',
    database: 'bikeStore2025'
});

async function verificarYAgregarStock() {
    console.log('🔍 Verificando stock de productos de repuestos...\n');

    // 1. Verificar productos de repuestos y su stock
    conexion.query(
        'SELECT p.id_producto, p.nombre, p.categoria, COALESCE(s.stock, 0) as stock FROM productos p LEFT JOIN stocks s ON p.id_producto = s.id_producto WHERE p.categoria = "repuestos"',
        (err, results) => {
            if (err) {
                console.error('❌ Error al consultar productos:', err);
            } else {
                console.log('📋 Productos de repuestos y su stock actual:');
                console.table(results);
                
                // 2. Agregar stock a productos que no lo tienen
                let productosSinStock = results.filter(p => p.stock === 0);
                
                if (productosSinStock.length > 0) {
                    console.log(`\n🔧 Agregando stock a ${productosSinStock.length} productos...`);
                    
                    productosSinStock.forEach(producto => {
                        conexion.query(
                            'INSERT INTO stocks (id_producto, stock, stock_minimo, estado) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE stock = ?, estado = ?',
                            [producto.id_producto, 10, 4, 'disponible', 10, 'disponible'],
                            (err, result) => {
                                if (err) {
                                    console.error(`❌ Error al agregar stock al producto ${producto.id_producto}:`, err);
                                } else {
                                    console.log(`✅ Stock agregado al producto: ${producto.nombre}`);
                                }
                            }
                        );
                    });
                } else {
                    console.log('\n✅ Todos los productos de repuestos ya tienen stock.');
                }
            }
        }
    );

    // 3. Verificar resultado final después de 2 segundos
    setTimeout(() => {
        console.log('\n📊 Verificación final de stock:');
        conexion.query(
            'SELECT p.id_producto, p.nombre, p.categoria, s.stock, s.estado FROM productos p LEFT JOIN stocks s ON p.id_producto = s.id_producto WHERE p.categoria = "repuestos"',
            (err, results) => {
                if (err) {
                    console.error('❌ Error en verificación final:', err);
                } else {
                    console.log('\n📈 Stock final de productos de repuestos:');
                    console.table(results);
                }
                
                console.log('\n✅ Proceso completado. Los productos de repuestos ahora deberían aparecer en la tienda.');
                conexion.end();
            }
        );
    }, 2000);
}

// Ejecutar el script
verificarYAgregarStock(); 