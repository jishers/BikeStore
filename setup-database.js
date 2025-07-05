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
    
    // Crear la tabla inventario_operaciones si no existe
    const crearTablaInventario = `
        CREATE TABLE IF NOT EXISTS inventario_operaciones (
            id_operacion INT AUTO_INCREMENT PRIMARY KEY,
            id_producto INT,
            id_admin INT,
            tipo_operacion ENUM('agregar', 'editar', 'eliminar') NOT NULL,
            cantidad_anterior INT DEFAULT 0,
            cantidad_nueva INT DEFAULT 0,
            cantidad_cambio INT NOT NULL,
            fecha_operacion DATETIME DEFAULT CURRENT_TIMESTAMP,
            descripcion VARCHAR(500),
            FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
            FOREIGN KEY (id_admin) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
        )
    `;
    
    conexion.query(crearTablaInventario, (err, result) => {
        if (err) {
            console.error('Error al crear la tabla inventario_operaciones:', err);
        } else {
            console.log('Tabla inventario_operaciones creada o ya existente');
        }
        
        // Cerrar conexión
        conexion.end((err) => {
            if (err) {
                console.error('Error al cerrar la conexión:', err);
            } else {
                console.log('Conexión cerrada');
            }
        });
    });
}); 