CREATE DATABASE bikeStore2025;
USE bikeStore2025;

-- Tabla: usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    direccion VARCHAR (225),
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: productos
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL CHECK (precio_venta >= 0),
    descripcion VARCHAR(500),
    destacado BOOLEAN DEFAULT FALSE,
    imagen VARCHAR(255),
    categoria VARCHAR(100)
);

-- Tabla: stocks (1:1 con productos)
CREATE TABLE stocks (
    id_stock INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT UNIQUE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    stock INT CHECK (stock >= 0),
    stock_minimo INT DEFAULT 0 CHECK (stock_minimo >= 0),
    estado ENUM('disponible', 'agotado') DEFAULT 'disponible',
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: inventario_operaciones (registra todas las operaciones de inventario)
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

-- Tabla: ventas
CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    cantidad_productos INT NOT NULL CHECK (cantidad_productos > 0),
    precio_productos DECIMAL(10,2) NOT NULL CHECK (precio_productos >= 0),
    metodo_pago ENUM('contra_entrega' ) NOT NULL DEFAULT 'contra_entrega',
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: detalles_venta (relación N:M entre productos y ventas)
CREATE TABLE detalles_venta (
    id_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT,
    id_venta INT,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
    cantidad_producto INT NOT NULL CHECK (cantidad_producto > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0)
); 