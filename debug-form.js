const mysql = require('mysql2');

// Configuración de la base de datos
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jona081651480',
    database: 'bikeStore2025'
});

async function debugFormulario() {
    console.log('🔍 Depurando valores del formulario...\n');

    // Simular los valores que se envían desde el formulario
    const valoresFormulario = {
        nombre: 'Repuesto Test Frontend',
        precio_venta: '15000',
        descripcion: 'Repuesto de prueba desde frontend',
        cantidad: '8',
        categoria: 'repuestos', // Este es el valor que se envía desde el select
        rol: 'admin',
        id_usuario: '1'
    };

    console.log('📋 Valores que se envían desde el formulario:');
    console.table(valoresFormulario);

    // Verificar si el valor de categoría coincide exactamente
    console.log('\n🔍 Verificando coincidencia exacta de categoría...');
    console.log(`Valor enviado: "${valoresFormulario.categoria}"`);
    console.log(`¿Coincide con "repuestos"? ${valoresFormulario.categoria === 'repuestos'}`);
    console.log(`¿Coincide con "bicicleta"? ${valoresFormulario.categoria === 'bicicleta'}`);

    // Simular la inserción con los valores del formulario
    console.log('\n🔧 Simulando inserción con valores del formulario...');
    
    conexion.query(
        'INSERT INTO productos (nombre, precio_venta, descripcion, categoria) VALUES (?, ?, ?, ?)',
        [valoresFormulario.nombre, valoresFormulario.precio_venta, valoresFormulario.descripcion, valoresFormulario.categoria],
        (err, result) => {
            if (err) {
                console.error('❌ Error al insertar:', err);
            } else {
                const idProducto = result.insertId;
                console.log(`✅ Producto insertado con ID: ${idProducto}`);
                
                // Agregar stock
                conexion.query(
                    'INSERT INTO stocks (id_producto, stock, stock_minimo, estado) VALUES (?, ?, ?, ?)',
                    [idProducto, valoresFormulario.cantidad, 4, 'disponible'],
                    (err2) => {
                        if (err2) {
                            console.error('❌ Error al agregar stock:', err2);
                        } else {
                            console.log(`✅ Stock agregado: ${valoresFormulario.cantidad} unidades`);
                        }
                        
                        // Verificar que se guardó correctamente
                        setTimeout(() => {
                            conexion.query(
                                'SELECT p.id_producto, p.nombre, p.categoria, s.stock FROM productos p LEFT JOIN stocks s ON p.id_producto = s.id_producto WHERE p.id_producto = ?',
                                [idProducto],
                                (err3, results) => {
                                    if (err3) {
                                        console.error('❌ Error al verificar:', err3);
                                    } else {
                                        console.log('\n📋 Producto guardado en la base de datos:');
                                        console.table(results);
                                        
                                        // Verificar si aparece en el filtro
                                        const producto = results[0];
                                        console.log(`\n🔍 Verificando filtro de categoría:`);
                                        console.log(`Categoría del producto: "${producto.categoria}"`);
                                        console.log(`¿Aparece en filtro "repuestos"? ${producto.categoria === 'repuestos'}`);
                                    }
                                    
                                    conexion.end();
                                }
                            );
                        }, 500);
                    }
                );
            }
        }
    );
}

// Ejecutar la depuración
debugFormulario(); 