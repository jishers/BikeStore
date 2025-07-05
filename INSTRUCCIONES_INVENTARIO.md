# Sistema de Inventario para Bike Store

## Descripción

Se ha implementado un sistema completo de registro de inventario que permite a los administradores agregar productos con cantidades específicas y generar informes detallados sobre las operaciones de inventario.

## Funcionalidades Implementadas

### 1. Registro Automático de Operaciones

- **Tabla nueva**: `inventario_operaciones`
- **Registro automático** de cada operación cuando un administrador:
  - Agrega un nuevo producto
  - Actualiza un producto existente
  - Modifica cantidades de stock

### 2. Informes de Inventario Disponibles

- **Operaciones de administradores**: Lista todas las operaciones realizadas por administradores
- **Productos con más cantidad agregada**: Muestra qué productos han recibido más stock
- **Resumen general del inventario**: Estadísticas generales del inventario
- **Stock actual de productos**: Estado actual del stock de todos los productos

### 3. Campos Registrados por Operación

- ID del producto
- ID del administrador que realizó la operación
- Tipo de operación (agregar, editar, eliminar)
- Cantidad anterior
- Cantidad nueva
- Cambio en cantidad
- Fecha y hora de la operación
- Descripción de la operación

## Instalación y Configuración

### 1. Actualizar la Base de Datos

```bash
# Ejecutar el script de configuración
node setup-database.js
```

### 2. Verificar la Tabla Creada

La tabla `inventario_operaciones` se creará automáticamente con la siguiente estructura:

```sql
CREATE TABLE inventario_operaciones (
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
);
```

### 3. Reiniciar el Servidor

```bash
# Detener el servidor actual (Ctrl+C)
# Reiniciar el servidor
node server.js
```

## Uso del Sistema

### Para Administradores

1. **Acceder al Panel de Administración**

   - Iniciar sesión como administrador
   - Ir a la página de administrador

2. **Agregar Productos con Cantidad**

   - Hacer clic en "Agregar Producto"
   - Completar el formulario incluyendo la cantidad
   - La operación se registrará automáticamente

3. **Generar Informes de Inventario**
   - Hacer clic en "Informes"
   - Seleccionar un tipo de informe de inventario:
     - Operaciones de administradores
     - Productos con más cantidad agregada
     - Resumen general del inventario
     - Stock actual de productos
   - Seleccionar el período de tiempo
   - Hacer clic en "Generar Informe"

### Tipos de Informes Disponibles

#### 1. Operaciones de Administradores

- Muestra todas las operaciones realizadas por administradores
- Incluye: producto, administrador, tipo de operación, cantidades, fecha
- Filtrable por rango de fechas

#### 2. Productos con Más Cantidad Agregada

- Lista productos ordenados por cantidad total agregada
- Incluye: producto, categoría, total agregado, veces modificado
- Útil para identificar productos con mayor movimiento

#### 3. Resumen General del Inventario

- Estadísticas generales del inventario
- Incluye: productos modificados, nuevos, actualizados, cantidad total agregada, admins activos
- Vista de alto nivel del estado del inventario

#### 4. Stock Actual de Productos

- Estado actual del stock de todos los productos
- Incluye: producto, categoría, stock actual, stock mínimo, estado, última actualización
- Útil para identificar productos con bajo stock

## Archivos Modificados

### Backend

- `server.js`: Agregado endpoint `/api/informes-inventario` y registro automático de operaciones
- `db_bikeStore2025.sql`: Agregada tabla `inventario_operaciones`
- `setup-database.js`: Script para crear la nueva tabla

### Frontend

- `administrador.html`: Agregadas opciones de informes de inventario
- `administrador-panel.js`: Agregada lógica para manejar informes de inventario

## Beneficios del Sistema

1. **Trazabilidad Completa**: Registro de todas las operaciones de inventario
2. **Responsabilidad**: Identificación del administrador que realizó cada operación
3. **Análisis de Tendencias**: Informes para identificar patrones de movimiento de inventario
4. **Control de Stock**: Monitoreo del estado actual del inventario
5. **Auditoría**: Historial completo de cambios para auditorías

## Notas Importantes

- El sistema registra automáticamente todas las operaciones sin intervención manual
- Los informes son generados en tiempo real desde la base de datos
- El sistema es compatible con la funcionalidad existente
- No se requieren cambios en el flujo de trabajo actual de los administradores

## Solución de Problemas

### Error al crear la tabla

- Verificar que la base de datos `bikeStore2025` existe
- Verificar permisos de MySQL
- Ejecutar manualmente el SQL de creación de tabla

### Informes no se generan

- Verificar que el servidor esté corriendo
- Verificar que el usuario esté autenticado como administrador
- Revisar la consola del navegador para errores JavaScript

### Operaciones no se registran

- Verificar que la tabla `inventario_operaciones` existe
- Revisar logs del servidor para errores de base de datos
- Verificar que el middleware de autenticación esté funcionando
