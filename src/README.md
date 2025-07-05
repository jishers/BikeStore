# 🚴 Bike Store - Tienda de Bicicletas Online

Una aplicación web completa para la gestión de una tienda de bicicletas con panel de administración, carrito de compras y sistema de usuarios.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 14 o superior)
- **MySQL** (versión 5.7 o superior)
- **Git** (opcional, para clonar el repositorio)

### Verificar instalaciones:

```bash
node --version
npm --version
mysql --version
```

## 🚀 Instalación Rápida

### Paso 1: Clonar o descargar el proyecto

```bash
git clone <url-del-repositorio>
cd Bike_Store_Entrega_Final
```

### Paso 2: Configurar la base de datos

1. Abre MySQL Workbench o phpMyAdmin
2. Crea una nueva base de datos llamada `bikeStore2025`
3. Importa el archivo `api/db/db_bikeStore2025.sql`

### Paso 3: Configurar variables de entorno

1. Copia el archivo de ejemplo:
   ```bash
   cd api
   copy env.example .env
   ```
2. Edita el archivo `.env` con tus credenciales:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña_aqui
   DB_NAME=bikeStore2025
   DB_PORT=3306
   PORT=3000
   HOST=localhost
   ```

### Paso 4: Instalar dependencias

```bash
cd api
npm install
```

### Paso 5: Configurar base de datos automáticamente (opcional)

```bash
npm run setup-db
```

### Paso 6: Iniciar el servidor

```bash
npm start
```

### Paso 7: Abrir la aplicación

Abre `pages/index.html` en tu navegador

## 🔧 Configuración Detallada

### Configuración de MySQL

1. **Instalar MySQL:**

   - Windows: Descargar desde [mysql.com](https://dev.mysql.com/downloads/installer/)
   - macOS: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`

2. **Iniciar MySQL:**

   - Windows: Servicio automático
   - macOS: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`

3. **Crear usuario y base de datos:**
   ```sql
   CREATE DATABASE bikeStore2025;
   CREATE USER 'bikestore'@'localhost' IDENTIFIED BY 'tu_contraseña';
   GRANT ALL PRIVILEGES ON bikeStore2025.* TO 'bikestore'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Configuración del Frontend

El frontend está configurado para conectarse a `http://localhost:3000/api`. Si cambias el puerto del backend, actualiza la variable `API_BASE` en `js/main.js`:

```javascript
const API_BASE = "http://localhost:3000/api";
```

## 📁 Estructura del Proyecto

```
Bike_Store_Entrega_Final/
├── api/                    # Backend (Node.js + Express)
│   ├── db/                # Archivos de base de datos
│   ├── uploads/           # Imágenes subidas
│   ├── config.js          # Configuración
│   ├── server.js          # Servidor principal
│   └── package.json       # Dependencias del backend
├── css/                   # Estilos CSS
├── js/                    # JavaScript del frontend
├── img/                   # Imágenes estáticas
├── pages/                 # Páginas HTML
└── README.md             # Este archivo
```

## 🌐 Endpoints de la API

- `GET /api/productos` - Obtener todos los productos
- `POST /api/productos` - Agregar producto (admin)
- `DELETE /api/productos/:id` - Eliminar producto (admin)
- `POST /api/login` - Iniciar sesión
- `POST /api/registro` - Registrar usuario
- `GET /api/clientes` - Obtener clientes

## 👤 Usuarios de Prueba

### Administrador:

- Usuario: `admin`
- Contraseña: `admin123`
- Rol: `admin`

### Cliente:

- Usuario: `cliente`
- Contraseña: `cliente123`
- Rol: `cliente`

## 🛠️ Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar servidor en modo desarrollo
npm run dev

# Configurar base de datos
npm run setup-db

# Iniciar servidor en producción
npm start
```

## 🔍 Solución de Problemas

### Error: "Cannot find module"

```bash
cd api
npm install
```

### Error: "ECONNREFUSED"

1. Verifica que MySQL esté corriendo
2. Verifica las credenciales en `.env`
3. Verifica que el puerto 3000 esté libre

### Error: "Access denied for user"

1. Verifica las credenciales de MySQL
2. Asegúrate de que el usuario tenga permisos

### Error: "Port already in use"

```bash
# Cambia el puerto en .env
PORT=3000
```

## 📱 Características

- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ Sistema de usuarios
- ✅ Panel de administración
- ✅ Subida de imágenes
- ✅ Búsqueda de productos
- ✅ Filtros por categoría
- ✅ Responsive design

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 📞 Soporte

Si tienes problemas, revisa:

1. Los logs del servidor
2. La consola del navegador
3. La conexión a la base de datos

---

**¡Disfruta tu tienda de bicicletas! 🚴‍♂️**
