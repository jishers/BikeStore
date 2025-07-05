const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { dbConfig } = require('./config');

// Crear conexión sin especificar base de datos
const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    port: dbConfig.port
});

async function setupDatabase() {
    try {
        console.log('🔧 Configurando base de datos...');
        
        // Conectar a MySQL
        await new Promise((resolve, reject) => {
            connection.connect((err) => {
                if (err) {
                    console.error('❌ Error conectando a MySQL:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Conectado a MySQL exitosamente');
                    resolve();
                }
            });
        });

        // Crear base de datos si no existe
        await new Promise((resolve, reject) => {
            connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`, (err) => {
                if (err) {
                    console.error('❌ Error creando base de datos:', err.message);
                    reject(err);
                } else {
                    console.log(`✅ Base de datos '${dbConfig.database}' creada/verificada`);
                    resolve();
                }
            });
        });

        // Usar la base de datos
        await new Promise((resolve, reject) => {
            connection.query(`USE ${dbConfig.database}`, (err) => {
                if (err) {
                    console.error('❌ Error seleccionando base de datos:', err.message);
                    reject(err);
                } else {
                    console.log(`✅ Usando base de datos '${dbConfig.database}'`);
                    resolve();
                }
            });
        });

        // Leer y ejecutar el archivo SQL
        const sqlFilePath = path.join(__dirname, 'db', 'db_bikeStore2025.sql');
        
        if (fs.existsSync(sqlFilePath)) {
            const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
            const statements = sqlContent.split(';').filter(stmt => stmt.trim());
            
            for (let statement of statements) {
                if (statement.trim()) {
                    await new Promise((resolve, reject) => {
                        connection.query(statement, (err) => {
                            if (err) {
                                console.error('❌ Error ejecutando SQL:', err.message);
                                console.error('Statement:', statement.substring(0, 100) + '...');
                            } else {
                                console.log('✅ SQL ejecutado correctamente');
                            }
                            resolve();
                        });
                    });
                }
            }
            console.log('✅ Base de datos configurada exitosamente');
        } else {
            console.log('⚠️  Archivo SQL no encontrado, saltando importación de datos');
        }

    } catch (error) {
        console.error('❌ Error durante la configuración:', error);
    } finally {
        connection.end();
        console.log('🔚 Conexión cerrada');
    }
}

setupDatabase(); 