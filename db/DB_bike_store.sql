CREATE DATABASE DB_bike_store;
use DB_bike_store;
show tables;

CREATE TABLE usuarios(
   id INT PRIMARY KEY AUTO_INCREMENT,
    nombre TEXT (225),
    cedula INT (20),
    telefono BIGINT (20),
    correo VARCHAR (225),
    contrasena VARCHAR (255),
    direccion VARCHAR (225),
    fecha_registro DATE,
    rol VARCHAR (30) DEFAULT 'cliente',
    CONSTRAINT chk_rol CHECK (rol IN ('cliente', 'administrador'))
);

CREATE TABLE productos(
id_producto INT PRIMARY KEY AUTO_INCREMENT,
id_categoria INT,
FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria),
marca VARCHAR(200),
imagen VARCHAR(500),
nombre VARCHAR(100),
precio DECIMAL(20,5),
descripcion TEXT(700),
fecha_agregado DATE
);

CREATE TABLE categorias(
id_categoria INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(100)
);

CREATE TABLE compras(
id_compra INT PRIMARY KEY AUTO_INCREMENT,
id_usuario INT,
FOREIGN KEY(id_usuario) REFERENCES usuarios(id),
estado VARCHAR(100),
fecha_compra DATE
);

CREATE TABLE detalle_compras(
id_detalle_compra INT PRIMARY KEY AUTO_INCREMENT,
id_producto INT,
id_compra INT,
FOREIGN KEY(id_producto) REFERENCES productos(id_producto),
FOREIGN KEY(id_compra) REFERENCES compras(id_compra),
cantidad INT,
precio_unitario DECIMAL(23,5),
subtotal DECIMAL(23,5),
total DECIMAL(23,5)
);