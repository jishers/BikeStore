// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Jona081651480',
    database: process.env.DB_NAME || 'bikeStore2025',
    port: process.env.DB_PORT || 3306
};

// Configuración del servidor
const serverConfig = {
    port: process.env.PORT || 3001,
    host: process.env.HOST || 'localhost'
};

// Configuración de la API
const apiConfig = {
    baseUrl: process.env.API_BASE_URL || `http://${serverConfig.host}:${serverConfig.port}/api`
};

module.exports = {
    dbConfig,
    serverConfig,
    apiConfig
}; 