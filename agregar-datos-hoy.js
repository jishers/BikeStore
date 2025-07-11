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

// Obtener la fecha de hoy en formato YYYY-MM-DD HH:MM:SS
function getFechaHoy() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

conexion.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
    
    // Obtener productos existentes
    conexion.query('SELECT id_producto, nombre FROM productos LIMIT 3', (err, productos) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            conexion.end();
            return;
        }
        if (productos.length === 0) {
            console.log('No hay productos en la base de datos.');
            conexion.end();
            return;
        }
        // Obtener administradores
        conexion.query('SELECT id_usuario, nombre, apellido FROM usuarios WHERE rol = "admin" LIMIT 1', (err, admins) => {
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
            const admin = admins[0];
            const fechaHoy = getFechaHoy();
            // Crear operaciones de ejemplo para hoy
            const datos = productos.map((producto, i) => ([
                producto.id_producto,
                admin.id_usuario,
                i % 2 === 0 ? 'agregar' : 'editar',
                10 * (i + 1),
                10 * (i + 2),
                10,
                `Operación de prueba para hoy sobre ${producto.nombre}`,
                fechaHoy
            ]));
            const sql = 'INSERT INTO inventario_operaciones (id_producto, id_admin, tipo_operacion, cantidad_anterior, cantidad_nueva, cantidad_cambio, descripcion, fecha_operacion) VALUES ?';
            conexion.query(sql, [datos], (err, result) => {
                if (err) {
                    console.error('Error al insertar operaciones de hoy:', err);
                } else {
                    console.log(`✅ ${result.affectedRows} operaciones de inventario insertadas para hoy.`);
                }
                conexion.end();
            });
        });
    });
}); 