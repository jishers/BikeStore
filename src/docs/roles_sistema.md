# Roles del Sistema - Bike Store

## 1. Cliente

### Descripción

Usuario final que interactúa con la tienda para realizar compras de bicicletas y accesorios.

### Responsabilidades y Permisos

#### Puede Hacer:

1. **Gestión de Cuenta**

   - Registrarse en la plataforma
   - Iniciar y cerrar sesión
   - Actualizar información personal
   - Ver historial de compras

2. **Navegación y Compras**

   - Explorar el catálogo de productos
   - Ver detalles de productos
   - Filtrar productos por categorías
   - Buscar productos específicos

3. **Carrito de Compras**

   - Agregar productos al carrito
   - Modificar cantidades
   - Eliminar productos del carrito
   - Guardar carrito para después

4. **Proceso de Compra**

   - Realizar checkout
   - Seleccionar método de pago
   - Ver estado de pedidos
   - Recibir confirmaciones

5. **Comunicación**
   - Contactar al soporte
   - Ver información de la tienda
   - Acceder a redes sociales
   - Recibir notificaciones

#### NO Puede Hacer:

1. **Gestión de Productos**

   - Agregar nuevos productos
   - Modificar precios
   - Eliminar productos
   - Gestionar inventario

2. **Administración**

   - Acceder al panel administrativo
   - Ver información de otros usuarios
   - Modificar estados de pedidos
   - Gestionar categorías

3. **Reportes**
   - Ver estadísticas de ventas
   - Acceder a datos sensibles
   - Ver reportes financieros
   - Modificar configuraciones del sistema

## 2. Administrador

### Descripción

Usuario con privilegios máximos encargado de la gestión y mantenimiento de la tienda en línea.

### Responsabilidades y Permisos

#### Puede Hacer:

1. **Gestión de Productos**

   - Crear nuevos productos
   - Actualizar información y precios
   - Eliminar productos
   - Gestionar inventario
   - Asignar categorías

2. **Gestión de Categorías**

   - Crear nuevas categorías
   - Modificar categorías existentes
   - Eliminar categorías
   - Organizar productos en categorías

3. **Gestión de Pedidos**

   - Ver todos los pedidos
   - Actualizar estados de pedidos
   - Procesar devoluciones
   - Gestionar envíos
   - Ver detalles de transacciones

4. **Gestión de Usuarios**

   - Ver lista de usuarios
   - Gestionar permisos
   - Desactivar cuentas
   - Ver historial de usuarios
   - Atender solicitudes de soporte

5. **Reportes y Estadísticas**

   - Generar reportes de ventas
   - Ver estadísticas
   - Analizar métricas
   - Exportar datos
   - Monitorear inventario

6. **Configuración del Sistema**
   - Gestionar parámetros
   - Configurar métodos de pago
   - Ajustar opciones de envío
   - Mantener información de contacto

#### NO Puede Hacer:

1. **Limitaciones Técnicas**

   - Modificar código fuente
   - Acceder a la base de datos directamente
   - Modificar estructura del sistema
   - Cambiar configuraciones del servidor

2. **Restricciones de Seguridad**
   - Ver contraseñas de usuarios
   - Acceder a datos de pago
   - Modificar logs del sistema
   - Eliminar registros de auditoría

## 3. Matriz de Responsabilidades

### Cliente

```plaintext
+-------------------------+----------+
| Funcionalidad          | Acceso   |
+-------------------------+----------+
| Ver Productos          |    ✓     |
| Realizar Compras       |    ✓     |
| Gestionar Carrito      |    ✓     |
| Ver Pedidos Propios    |    ✓     |
| Editar Perfil          |    ✓     |
| Gestionar Productos    |    ✗     |
| Acceso Admin           |    ✗     |
| Ver Reportes           |    ✗     |
+-------------------------+----------+
```

### Administrador

```plaintext
+-------------------------+----------+
| Funcionalidad          | Acceso   |
+-------------------------+----------+
| Gestionar Productos    |    ✓     |
| Gestionar Usuarios     |    ✓     |
| Gestionar Pedidos      |    ✓     |
| Ver Reportes           |    ✓     |
| Configurar Sistema     |    ✓     |
| Acceso Base Datos      |    ✗     |
| Modificar Código       |    ✗     |
| Ver Datos Sensibles    |    ✗     |
+-------------------------+----------+
```
