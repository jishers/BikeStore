# Historias de Usuario - Bike Store

## Criterios INVEST de Calidad

Cada historia de usuario ha sido evaluada según los criterios INVEST:

- **I**ndependiente: Puede implementarse sin depender de otras historias
- **N**egociable: Flexible para ajustarse según necesidades del cliente
- **V**aliosa: Aporta valor claro al negocio o usuario
- **E**stimable: Se puede estimar el esfuerzo requerido
- **S**mall (Pequeña): Implementable en un sprint o menos
- **T**esteable: Verificable mediante criterios de aceptación

## Actor: Cliente

### Historia 1: Registro de Usuario

**Como** cliente  
**Quiero** poder registrarme en la plataforma  
**Para** tener una cuenta personal y acceder a las funcionalidades de la tienda

**Criterios de Aceptación:**

- Debe poder ingresar: nombres, cédula, teléfono, correo, dirección y contraseña
- El correo y la cédula deben ser únicos en el sistema
- Debe recibir confirmación exitosa del registro
- La contraseña debe ser almacenada de forma segura

**Criterios INVEST:**

- **Independiente**: No requiere otras funcionalidades para su implementación, es el punto de entrada al sistema
- **Negociable**: Los campos requeridos pueden ajustarse según necesidades del negocio
- **Valiosa**: Permite captar nuevos usuarios y crear base de datos de clientes
- **Estimable**: Tiempo estimado: 3-4 días (formulario, validaciones, base de datos)
- **Pequeña**: Alcance acotado a proceso de registro básico
- **Testeable**: Verificable mediante pruebas de registro exitoso y validaciones

### Historia 2: Inicio de Sesión

**Como** cliente registrado  
**Quiero** poder iniciar sesión en mi cuenta  
**Para** acceder a mis datos y realizar compras

**Criterios de Aceptación:**

- Debe poder ingresar con correo y contraseña
- Debe mostrar mensajes de error claros si las credenciales son incorrectas
- Debe mantener la sesión activa hasta que el usuario cierre sesión

**Criterios INVEST:**

- **Independiente**: Solo depende del registro de usuario previo
- **Negociable**: El método de autenticación puede ajustarse (email/teléfono)
- **Valiosa**: Permite acceso seguro a funcionalidades personalizadas
- **Estimable**: Tiempo estimado: 2-3 días (autenticación, manejo de sesiones)
- **Pequeña**: Funcionalidad específica y acotada
- **Testeable**: Verificable con pruebas de login exitoso y fallido

### Historia 3: Visualización de Productos

**Como** cliente  
**Quiero** ver todos los productos disponibles  
**Para** conocer las opciones de compra

**Criterios de Aceptación:**

- Debe mostrar imágenes, nombres y precios de los productos
- Debe poder ver los productos por categorías
- Debe mostrar la descripción detallada al seleccionar un producto
- Debe indicar si el producto está disponible

**Criterios INVEST:**

- **Independiente**: No requiere autenticación para visualizar productos
- **Negociable**: La forma de presentación y filtros puede ajustarse
- **Valiosa**: Permite a los usuarios explorar el catálogo completo
- **Estimable**: Tiempo estimado: 4-5 días (catálogo, filtros, detalles)
- **Pequeña**: Enfocada solo en la visualización de productos
- **Testeable**: Verificable mediante navegación y filtrado del catálogo

### Historia 4: Gestión del Carrito

**Como** cliente  
**Quiero** poder agregar productos al carrito  
**Para** realizar mis compras

**Criterios de Aceptación:**

- Debe poder agregar múltiples productos
- Debe poder modificar las cantidades
- Debe poder eliminar productos del carrito
- Debe mostrar el subtotal y total de la compra
- Debe mantener el carrito aunque cierre la página

**Criterios INVEST:**

- **Independiente**: Funciona con el catálogo de productos existente
- **Negociable**: Las funcionalidades del carrito pueden ajustarse
- **Valiosa**: Facilita el proceso de compra y mejora experiencia
- **Estimable**: Tiempo estimado: 4-5 días (CRUD carrito, persistencia)
- **Pequeña**: Funcionalidad específica del carrito
- **Testeable**: Verificable mediante operaciones CRUD en el carrito

### Historia 5: Proceso de Compra

**Como** cliente  
**Quiero** poder finalizar mi compra  
**Para** recibir los productos seleccionados

**Criterios de Aceptación:**

- Debe mostrar un resumen de la compra antes de confirmar
- Debe poder confirmar los datos de envío
- Debe recibir una confirmación de la compra
- Debe poder ver el estado de su compra

**Criterios INVEST:**

- **Independiente**: Requiere carrito con productos y usuario autenticado
- **Negociable**: El proceso de checkout puede ajustarse
- **Valiosa**: Permite completar el ciclo de venta
- **Estimable**: Tiempo estimado: 5-6 días (checkout, confirmaciones)
- **Pequeña**: Proceso específico de finalización de compra
- **Testeable**: Verificable mediante flujo completo de compra

### Historia 6: Contacto con la Tienda

**Como** cliente  
**Quiero** poder contactar con la tienda  
**Para** resolver dudas o problemas

**Criterios de Aceptación:**

- Debe mostrar información de contacto (teléfono, correo, dirección)
- Debe tener acceso a redes sociales de la tienda
- Debe mostrar horarios de atención

**Criterios INVEST:**

- **Independiente**: No requiere otras funcionalidades
- **Negociable**: Los canales de contacto pueden ajustarse
- **Valiosa**: Mejora la comunicación con clientes
- **Estimable**: Tiempo estimado: 1-2 días
- **Pequeña**: Implementación simple de información de contacto
- **Testeable**: Verificable mediante visualización y enlaces

## Actor: Administrador

### Historia 7: Gestión de Productos

**Como** administrador  
**Quiero** poder gestionar los productos  
**Para** mantener actualizado el catálogo

**Criterios de Aceptación:**

- Debe poder agregar nuevos productos
- Debe poder editar productos existentes
- Debe poder eliminar productos
- Debe poder asignar categorías a los productos
- Debe poder gestionar el stock

**Criterios INVEST:**

- **Independiente**: Solo requiere autenticación de administrador
- **Negociable**: Los campos y opciones pueden ajustarse
- **Valiosa**: Permite mantener catálogo actualizado
- **Estimable**: Tiempo estimado: 5-6 días (CRUD completo)
- **Pequeña**: Funcionalidad específica de gestión
- **Testeable**: Verificable mediante operaciones CRUD

### Historia 8: Gestión de Categorías

**Como** administrador  
**Quiero** poder gestionar las categorías de productos  
**Para** organizar mejor el catálogo

**Criterios de Aceptación:**

- Debe poder crear nuevas categorías
- Debe poder editar categorías existentes
- Debe poder eliminar categorías
- No debe poder eliminar categorías con productos asociados

**Criterios INVEST:**

- **Independiente**: Funcionalidad básica de organización
- **Negociable**: La estructura de categorías puede ajustarse
- **Valiosa**: Mejora la organización del catálogo
- **Estimable**: Tiempo estimado: 2-3 días
- **Pequeña**: CRUD simple de categorías
- **Testeable**: Verificable mediante gestión de categorías

### Historia 9: Gestión de Pedidos

**Como** administrador  
**Quiero** poder gestionar los pedidos  
**Para** procesar las compras de los clientes

**Criterios de Aceptación:**

- Debe poder ver todos los pedidos
- Debe poder actualizar el estado de los pedidos
- Debe poder ver el detalle de cada pedido
- Debe poder filtrar pedidos por estado y fecha

**Criterios INVEST:**

- **Independiente**: Requiere sistema de pedidos existente
- **Negociable**: Los estados y filtros pueden ajustarse
- **Valiosa**: Permite control de operaciones de venta
- **Estimable**: Tiempo estimado: 4-5 días
- **Pequeña**: Gestión específica de pedidos
- **Testeable**: Verificable mediante flujo de pedidos

### Historia 10: Gestión de Usuarios

**Como** administrador  
**Quiero** poder gestionar los usuarios  
**Para** mantener control sobre las cuentas

**Criterios de Aceptación:**

- Debe poder ver lista de usuarios registrados
- Debe poder buscar usuarios por nombre o correo
- Debe poder desactivar cuentas si es necesario
- Debe poder ver el historial de compras de cada usuario

**Criterios INVEST:**

- **Independiente**: Solo requiere sistema de usuarios
- **Negociable**: Las opciones de gestión pueden ajustarse
- **Valiosa**: Permite control de usuarios del sistema
- **Estimable**: Tiempo estimado: 3-4 días
- **Pequeña**: Funcionalidad específica de usuarios
- **Testeable**: Verificable mediante gestión de usuarios

### Historia 11: Reportes y Estadísticas

**Como** administrador  
**Quiero** poder ver reportes de ventas  
**Para** analizar el rendimiento de la tienda

**Criterios de Aceptación:**

- Debe mostrar ventas totales por período
- Debe mostrar productos más vendidos
- Debe mostrar categorías más populares
- Debe poder exportar reportes
- Debe mostrar gráficos de tendencias

**Criterios INVEST:**

- **Independiente**: Requiere datos de ventas existentes
- **Negociable**: Los tipos de reportes pueden ajustarse
- **Valiosa**: Permite análisis del negocio
- **Estimable**: Tiempo estimado: 5-6 días
- **Pequeña**: Reportes específicos y acotados
- **Testeable**: Verificable mediante generación de reportes

### Historia 12: Gestión de Inventario

**Como** administrador  
**Quiero** poder gestionar el inventario  
**Para** mantener control del stock

**Criterios de Aceptación:**

- Debe poder actualizar cantidades de productos
- Debe recibir alertas de stock bajo
- Debe poder ver historial de cambios en inventario
- Debe poder realizar ajustes de inventario

**Criterios INVEST:**

- **Independiente**: Relacionado con gestión de productos
- **Negociable**: Los límites y alertas pueden ajustarse
- **Valiosa**: Permite control de stock
- **Estimable**: Tiempo estimado: 4-5 días
- **Pequeña**: Gestión específica de inventario
- **Testeable**: Verificable mediante operaciones de inventario
