const mysql = require('mysql2');

// Configuración de la base de datos
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jona081651480',
    database: 'bikeStore2025'
});

async function verificarYCorregirCategorias() {
    console.log('🔍 Verificando categorías de productos...\n');

    // 1. Verificar productos con categorías similares a repuestos
    console.log('📋 Productos con categorías similares a "repuestos":');
    conexion.query(
        'SELECT id_producto, nombre, categoria FROM productos WHERE LOWER(TRIM(categoria)) LIKE "%repuesto%"',
        (err, results) => {
            if (err) {
                console.error('❌ Error al consultar repuestos:', err);
            } else {
                if (results.length > 0) {
                    console.table(results);
                } else {
                    console.log('   No se encontraron productos con categorías similares a "repuestos"');
                }
            }
        }
    );

    // 2. Verificar productos con categorías similares a accesorios
    setTimeout(() => {
        console.log('\n📋 Productos con categorías similares a "accesorios":');
        conexion.query(
            'SELECT id_producto, nombre, categoria FROM productos WHERE LOWER(TRIM(categoria)) LIKE "%accesorio%"',
            (err, results) => {
                if (err) {
                    console.error('❌ Error al consultar accesorios:', err);
                } else {
                    if (results.length > 0) {
                        console.table(results);
                    } else {
                        console.log('   No se encontraron productos con categorías similares a "accesorios"');
                    }
                }
            }
        );
    }, 1000);

    // 3. Corregir categorías después de 2 segundos
    setTimeout(() => {
        console.log('\n🔧 Corrigiendo categorías...\n');

        // Corregir repuestos
        conexion.query(
            'UPDATE productos SET categoria = "repuestos" WHERE LOWER(TRIM(categoria)) LIKE "%repuesto%" AND categoria != "repuestos"',
            (err, result) => {
                if (err) {
                    console.error('❌ Error al corregir repuestos:', err);
                } else {
                    console.log(`✅ Repuestos corregidos: ${result.affectedRows} productos actualizados`);
                }
            }
        );

        // Corregir accesorios
        setTimeout(() => {
            conexion.query(
                'UPDATE productos SET categoria = "accesorios" WHERE LOWER(TRIM(categoria)) LIKE "%accesorio%" AND categoria != "accesorios"',
                (err, result) => {
                    if (err) {
                        console.error('❌ Error al corregir accesorios:', err);
                    } else {
                        console.log(`✅ Accesorios corregidos: ${result.affectedRows} productos actualizados`);
                    }
                }
            );
        }, 500);

        // 4. Verificar resultado final después de 1 segundo
        setTimeout(() => {
            console.log('\n📊 Verificación final de categorías:');
            conexion.query(
                'SELECT categoria, COUNT(*) as cantidad FROM productos GROUP BY categoria ORDER BY categoria',
                (err, results) => {
                    if (err) {
                        console.error('❌ Error en verificación final:', err);
                    } else {
                        console.log('\n📈 Resumen de productos por categoría:');
                        console.table(results);
                    }
                    
                    console.log('\n✅ Proceso completado. Las categorías han sido corregidas.');
                    conexion.end();
                }
            );
        }, 1000);
    }, 2000);
}

// Ejecutar el script
verificarYCorregirCategorias(); 