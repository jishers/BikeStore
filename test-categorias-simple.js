const mysql = require('mysql2');

// Configuración de la base de datos
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jona081651480',
    database: 'bikeStore2025'
});

async function probarCategorias() {
    console.log('🧪 Probando diferencias entre categorías bicicleta vs repuestos...\n');

    // 1. Probar agregar producto de categoría bicicleta
    console.log('🚴 Probando categoría "bicicleta"...');
    try {
        // Agregar producto bicicleta
        conexion.query(
            'INSERT INTO productos (nombre, precio_venta, descripcion, categoria) VALUES (?, ?, ?, ?)',
            ['Bicicleta de Prueba', 500000, 'Bicicleta de prueba para test', 'bicicleta'],
            (err, result) => {
                if (err) {
                    console.error('❌ Error al agregar bicicleta:', err);
                } else {
                    const idBicicleta = result.insertId;
                    console.log(`✅ Bicicleta agregada con ID: ${idBicicleta}`);
                    
                    // Agregar stock para bicicleta
                    conexion.query(
                        'INSERT INTO stocks (id_producto, stock, stock_minimo, estado) VALUES (?, ?, ?, ?)',
                        [idBicicleta, 5, 4, 'disponible'],
                        (err2) => {
                            if (err2) {
                                console.error('❌ Error al agregar stock de bicicleta:', err2);
                            } else {
                                console.log('✅ Stock de bicicleta agregado: 5 unidades');
                            }
                        }
                    );
                }
            }
        );
    } catch (error) {
        console.error('❌ Error:', error);
    }

    // Esperar 1 segundo
    setTimeout(() => {
        // 2. Probar agregar producto de categoría repuestos
        console.log('\n🔧 Probando categoría "repuestos"...');
        try {
            // Agregar producto repuesto
            conexion.query(
                'INSERT INTO productos (nombre, precio_venta, descripcion, categoria) VALUES (?, ?, ?, ?)',
                ['Repuesto de Prueba', 25000, 'Repuesto de prueba para test', 'repuestos'],
                (err, result) => {
                    if (err) {
                        console.error('❌ Error al agregar repuesto:', err);
                    } else {
                        const idRepuesto = result.insertId;
                        console.log(`✅ Repuesto agregado con ID: ${idRepuesto}`);
                        
                        // Agregar stock para repuesto
                        conexion.query(
                            'INSERT INTO stocks (id_producto, stock, stock_minimo, estado) VALUES (?, ?, ?, ?)',
                            [idRepuesto, 10, 4, 'disponible'],
                            (err2) => {
                                if (err2) {
                                    console.error('❌ Error al agregar stock de repuesto:', err2);
                                } else {
                                    console.log('✅ Stock de repuesto agregado: 10 unidades');
                                }
                            }
                        );
                    }
                }
            );
        } catch (error) {
            console.error('❌ Error:', error);
        }
    }, 1000);

    // 3. Verificar productos después de 3 segundos
    setTimeout(() => {
        console.log('\n📊 Verificando productos en la base de datos...');
        conexion.query(
            'SELECT p.id_producto, p.nombre, p.categoria, s.stock, s.estado FROM productos p LEFT JOIN stocks s ON p.id_producto = s.id_producto WHERE p.nombre LIKE "%Prueba%" ORDER BY p.id_producto DESC LIMIT 5',
            (err, results) => {
                if (err) {
                    console.error('❌ Error al consultar productos:', err);
                } else {
                    console.log('📋 Productos de prueba encontrados:');
                    console.table(results);
                }
                
                // 4. Verificar productos por categoría
                setTimeout(() => {
                    console.log('\n📈 Verificando productos por categoría:');
                    conexion.query(
                        'SELECT categoria, COUNT(*) as cantidad FROM productos GROUP BY categoria ORDER BY categoria',
                        (err2, results2) => {
                            if (err2) {
                                console.error('❌ Error al consultar por categoría:', err2);
                            } else {
                                console.log('📊 Resumen por categoría:');
                                console.table(results2);
                            }
                            
                            console.log('\n✅ Prueba completada. Ahora verifica en la tienda si aparecen ambos productos.');
                            conexion.end();
                        }
                    );
                }, 500);
            }
        );
    }, 3000);
}

// Ejecutar la prueba
probarCategorias(); 