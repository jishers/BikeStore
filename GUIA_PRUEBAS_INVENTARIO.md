# Guía de Pruebas del Sistema de Inventario

## 🎯 Objetivo

Esta guía te ayudará a probar todas las funcionalidades del sistema de inventario implementado en Bike Store.

## ✅ Estado Actual del Sistema

- ✅ Tabla `inventario_operaciones` creada en la base de datos
- ✅ Servidor corriendo en puerto 3001
- ✅ Usuario administrador de prueba creado
- ✅ Endpoints de inventario funcionando
- ✅ Frontend actualizado con opciones de informes

## 🚀 Cómo Hacer las Pruebas

### 1. Verificar que el Servidor Esté Corriendo

```bash
# Verificar que el servidor esté en el puerto 3001
netstat -ano | findstr :3001
```

Deberías ver algo como:

```
TCP    [::1]:3001             [::]:0                 LISTENING       [PID]
```

### 2. Acceder a la Aplicación Web

1. **Abrir el navegador** y ir a: `http://localhost:3001/src/pages/index.html`
2. **Hacer clic en "Iniciar Sesión"**
3. **Usar las credenciales de prueba**:
   - **Email**: `admin@bikestore.com`
   - **Contraseña**: `admin123`

### 3. Probar el Panel de Administrador

Una vez logueado como administrador:

1. **Ir a la página de administrador**: `http://localhost:3001/src/pages/administrador.html`
2. **Verificar que aparezca tu nombre** en la parte superior

### 4. Probar Agregar Productos con Cantidad

1. **Hacer clic en "Agregar Producto"**
2. **Completar el formulario**:
   - Nombre: "Bicicleta de Prueba - [Tu Nombre]"
   - Precio: 1500000
   - Cantidad en Stock: 25
   - Categoría: Bicicletas
   - Descripción: "Producto de prueba para el sistema de inventario"
   - Imagen: Seleccionar cualquier imagen
3. **Hacer clic en "Agregar Producto"**
4. **Verificar el mensaje de éxito**

### 5. Probar los Informes de Inventario

1. **Hacer clic en "Informes"**
2. **Probar cada tipo de informe**:

#### A. Operaciones de Administradores

- Seleccionar: "Operaciones de administradores"
- Período: "Este mes"
- Hacer clic en "Generar Informe"
- **Resultado esperado**: Tabla con las operaciones realizadas

#### B. Productos con Más Cantidad Agregada

- Seleccionar: "Productos con más cantidad agregada"
- Período: "Este mes"
- Hacer clic en "Generar Informe"
- **Resultado esperado**: Lista de productos ordenados por cantidad agregada

#### C. Resumen General del Inventario

- Seleccionar: "Resumen general del inventario"
- Período: "Este mes"
- Hacer clic en "Generar Informe"
- **Resultado esperado**: Estadísticas generales del inventario

#### D. Stock Actual de Productos

- Seleccionar: "Stock actual de productos"
- Hacer clic en "Generar Informe"
- **Resultado esperado**: Tabla con el stock actual de todos los productos

### 6. Verificar el Registro Automático

1. **Agregar otro producto** con cantidad diferente
2. **Generar el informe "Operaciones de administradores"** nuevamente
3. **Verificar que aparezca la nueva operación** en la lista

## 📊 Información que se Registra Automáticamente

Cada vez que agregues un producto, el sistema registra:

- **ID del producto**
- **ID del administrador** que realizó la operación
- **Tipo de operación** (agregar, editar)
- **Cantidad anterior** (0 para productos nuevos)
- **Cantidad nueva** (la cantidad que especificaste)
- **Cambio en cantidad** (diferencia)
- **Fecha y hora** exacta de la operación
- **Descripción** detallada de la operación

## 🔍 Verificar en la Base de Datos

Si quieres verificar directamente en la base de datos:

```sql
-- Ver todas las operaciones de inventario
SELECT * FROM inventario_operaciones ORDER BY fecha_operacion DESC;

-- Ver operaciones de un administrador específico
SELECT * FROM inventario_operaciones WHERE id_admin = 3;

-- Ver resumen de operaciones por tipo
SELECT tipo_operacion, COUNT(*) as total_operaciones, SUM(cantidad_cambio) as total_cantidad
FROM inventario_operaciones
GROUP BY tipo_operacion;
```

## 🎯 Casos de Prueba Específicos

### Caso 1: Producto Nuevo

1. Agregar un producto que no existe
2. Verificar que se registre como tipo "agregar"
3. Verificar que cantidad_anterior = 0

### Caso 2: Actualizar Producto Existente

1. Agregar un producto con el mismo nombre y categoría
2. Verificar que se registre como tipo "editar"
3. Verificar que cantidad_anterior > 0

### Caso 3: Múltiples Administradores

1. Crear otro usuario administrador
2. Hacer login con el nuevo admin
3. Agregar productos
4. Verificar que se registre el ID del admin correcto

## 🚨 Solución de Problemas

### Error: "Acceso solo para administradores"

- Verificar que estés logueado como administrador
- Verificar que el rol del usuario sea 'admin'

### Error: "No se pueden generar informes"

- Verificar que el servidor esté corriendo
- Verificar que la tabla `inventario_operaciones` exista

### Error: "No se registran las operaciones"

- Verificar que la base de datos esté funcionando
- Revisar los logs del servidor

## 📈 Métricas de Éxito

El sistema está funcionando correctamente si:

1. ✅ Puedes agregar productos con cantidad
2. ✅ Los informes se generan sin errores
3. ✅ Las operaciones aparecen en los informes
4. ✅ Los datos son consistentes entre informes
5. ✅ La información se actualiza en tiempo real

## 🎉 Resultado Esperado

Después de completar todas las pruebas, deberías tener:

- **Productos agregados** con cantidades específicas
- **Operaciones registradas** en la base de datos
- **Informes generados** con datos reales
- **Trazabilidad completa** de todas las operaciones
- **Sistema listo** para uso en producción

## 📞 Soporte

Si encuentras algún problema durante las pruebas:

1. Verificar que todos los archivos estén en su lugar
2. Verificar que la base de datos esté funcionando
3. Revisar los logs del servidor
4. Ejecutar los scripts de configuración nuevamente si es necesario

¡El sistema está listo para usar! 🚀
