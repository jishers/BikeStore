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
    
    // Verificar si el usuario admin de prueba ya existe
    const sqlCheck = 'SELECT * FROM usuarios WHERE correo = ?';
    conexion.query(sqlCheck, ['admin@bikestore.com'], (err, results) => {
        if (err) {
            console.error('Error al verificar usuario:', err);
            conexion.end();
            return;
        }
        
        if (results.length > 0) {
            console.log('✅ Usuario administrador de prueba ya existe');
            console.log('📧 Email: admin@bikestore.com');
            console.log('🔑 Contraseña: admin123');
            conexion.end();
            return;
        }
        
        // Crear usuario administrador de prueba
        const sqlInsert = 'INSERT INTO usuarios (nombre, apellido, cedula, telefono, correo, contraseña, direccion, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const userData = [
            'Admin',
            'Test',
            '12345678',
            '3001234567',
            'admin@bikestore.com',
            'admin123',
            'Dirección de prueba',
            'admin'
        ];
        
        conexion.query(sqlInsert, userData, (err, result) => {
            if (err) {
                console.error('Error al crear usuario:', err);
            } else {
                console.log('✅ Usuario administrador de prueba creado exitosamente');
                console.log('📧 Email: admin@bikestore.com');
                console.log('🔑 Contraseña: admin123');
                console.log('🆔 ID del usuario:', result.insertId);
            }
            
            conexion.end();
        });
    });
}); 