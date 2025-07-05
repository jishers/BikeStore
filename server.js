require('dotenv').config();
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { dbConfig, serverConfig } = require('./config')
const app = express()

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Si no hay archivo, permitir que continúe (para campos de texto)
        if (!file) {
            return cb(null, true);
        }
        
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máximo
    }
}).single('imagen');

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static('uploads'))

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..')))

// Ruta para servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/index.html'))
})

// Ruta para servir la página del carrito
app.get('/carrito', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/carrito.html'))
})

// Ruta para servir la página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/login-registro.html'))
})

// Ruta para servir la página de administrador
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/administrador.html'))
})

// Ruta para servir la página de contactos
app.get('/contactos', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/contactos.html'))
})

// Ruta para servir la página de factura
app.get('/factura', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/factura.html'))
})

// Ruta para servir la página de prueba de factura
app.get('/factura-test', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/factura-test.html'))
})

const conexion = mysql.createConnection(dbConfig)

// Función para la conexión y la reconexión

function conectarBD(){
    conexion.connect((error)=>{
        if(error){
            console.log('[db error]', error)
            setTimeout(conectarBD, 200)
        } else {
            console.log("¡Conexión exitosa a la base de datos!")
        }
    })

    conexion.on('error', error =>{
        if(error.code === 'PROTOCOL_CONNECTION_LOST'){
            conectarBD()
        } else {
            throw error
        }
    })
}

conectarBD()

// Función genérica para obtener todos los registros de una tabla específica
// SELECT * FROM Clientes

function obtenerTodos(tabla){
    return new Promise((resolve, reject)=>{
        conexion.query(`SELECT * FROM ${tabla}`, (error, resultados) =>{
            if (error){
                reject(error);
            } else {
                resolve(resultados);
            }
        })
    })
}

function obtenerUno (tabla, id){
    return new Promise((resolve, reject)=>{
        conexion.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id], (error, resultado)=>{
            if(error) reject(error)
                else resolve(resultado)
        })
    })
}

function crear (tabla, data){
    return new Promise((resolve, reject)=>{
        conexion.query(`INSERT INTO ${tabla} SET ?`, data, (error, resultado)=>{
            if(error) reject(error)
                else {
            Object.assign(data, {id: resultado.insertId})
            resolve(data)
            }
        })
    })
}

// Middleware simple para verificar si es admin (en producción usar JWT)
function esAdmin(req, res, next) {
    try {
        console.log('Middleware esAdmin - req.body:', req.body);
        console.log('Middleware esAdmin - req.query:', req.query);
        
        // Para FormData, el rol puede estar en req.body
        // Para GET requests, el rol puede estar en req.query
        const rol = req.body && req.body.rol || req.query && req.query.rol;
        const id_usuario = req.body && req.body.id_usuario || req.query && req.query.id_usuario;
        
        console.log('Rol detectado:', rol);
        console.log('ID Usuario detectado:', id_usuario);
        
        if (rol === 'admin' && id_usuario) {
            // Asignar el usuario al request para que esté disponible en los endpoints
            req.usuario = { 
                id_usuario: parseInt(id_usuario), 
                rol: rol 
            };
            console.log('Usuario asignado a req.usuario:', req.usuario);
            console.log('Acceso admin autorizado');
            next();
        } else {
            console.log('Acceso denegado - rol no válido o ID de usuario faltante:', { rol, id_usuario });
            res.status(403).json({ error: 'Acceso solo para administradores con ID de usuario válido' });
        }
    } catch (error) {
        console.error('Error en middleware esAdmin:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Endpoint para agregar productos (solo admin) con subida de imagen
app.post('/api/productos', upload, esAdmin, (req, res) => {
    const { nombre, precio_venta, descripcion, cantidad, categoria } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;
    const cantidadInt = Number(cantidad) || 0;
    const idAdmin = req.usuario.id_usuario; // Obtener ID del admin desde el middleware
    
    // Buscar si ya existe un producto con el mismo nombre y categoría
    conexion.query('SELECT * FROM productos WHERE nombre = ? AND categoria = ?', [nombre, categoria], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            // Ya existe, actualizar producto (sin cantidad) y actualizar stock
            const prod = results[0];
            
            // Actualizar producto (sin la columna cantidad)
            const sqlProducto = 'UPDATE productos SET precio_venta = ?, descripcion = ?, imagen = ? WHERE id_producto = ?';
            conexion.query(sqlProducto, [precio_venta, descripcion, imagen || prod.imagen, prod.id_producto], (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });
                
                // Obtener stock actual
                conexion.query('SELECT stock FROM stocks WHERE id_producto = ?', [prod.id_producto], (errStock, stockResults) => {
                    if (errStock) return res.status(500).json({ error: errStock.message });
                    
                    const stockActual = stockResults.length > 0 ? stockResults[0].stock : 0;
                    const nuevaCantidad = stockActual + cantidadInt;
                    
                    // Actualizar o crear registro en stocks
                    const sqlStock = 'INSERT INTO stocks (id_producto, stock, stock_minimo, estado) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE stock = ?, estado = ?';
                    const estado = nuevaCantidad > 0 ? 'disponible' : 'agotado';
                    conexion.query(sqlStock, [prod.id_producto, nuevaCantidad, 4, estado, nuevaCantidad, estado], (err3) => {
                        if (err3) return res.status(500).json({ error: err3.message });
                        
                        // Registrar la operación de inventario
                        const sqlOperacion = 'INSERT INTO inventario_operaciones (id_producto, id_admin, tipo_operacion, cantidad_anterior, cantidad_nueva, cantidad_cambio, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)';
                        const descripcion = `Producto actualizado: ${nombre} - Cantidad agregada: ${cantidadInt}`;
                        conexion.query(sqlOperacion, [prod.id_producto, idAdmin, 'editar', stockActual, nuevaCantidad, cantidadInt, descripcion], (err4) => {
                            if (err4) {
                                console.error('Error al registrar operación de inventario:', err4);
                                // No fallar la operación principal por este error
                            }
                            
                            res.status(200).json({ 
                                id_producto: prod.id_producto, 
                                nombre, 
                                precio_venta, 
                                descripcion, 
                                cantidad: nuevaCantidad, 
                                imagen: imagen || prod.imagen, 
                                categoria,
                                stock: nuevaCantidad,
                                stock_minimo: 4
                            });
                        });
                    });
                });
            });
        } else {
            // No existe, crear nuevo producto (sin cantidad)
            const sqlProducto = 'INSERT INTO productos (nombre, precio_venta, descripcion, imagen, categoria) VALUES (?, ?, ?, ?, ?)';
            conexion.query(sqlProducto, [nombre, precio_venta, descripcion, imagen, categoria], (err3, result) => {
                if (err3) return res.status(500).json({ error: err3.message });
                
                const idProducto = result.insertId;
                const estado = cantidadInt > 0 ? 'disponible' : 'agotado';
                
                // Crear registro en stocks
                const sqlStock = 'INSERT INTO stocks (id_producto, stock, stock_minimo, estado) VALUES (?, ?, ?, ?)';
                conexion.query(sqlStock, [idProducto, cantidadInt, 4, estado], (err4) => {
                    if (err4) return res.status(500).json({ error: err4.message });
                    
                    // Registrar la operación de inventario
                    const sqlOperacion = 'INSERT INTO inventario_operaciones (id_producto, id_admin, tipo_operacion, cantidad_anterior, cantidad_nueva, cantidad_cambio, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)';
                    const descripcion = `Nuevo producto agregado: ${nombre} - Cantidad inicial: ${cantidadInt}`;
                    conexion.query(sqlOperacion, [idProducto, idAdmin, 'agregar', 0, cantidadInt, cantidadInt, descripcion], (err5) => {
                        if (err5) {
                            console.error('Error al registrar operación de inventario:', err5);
                            // No fallar la operación principal por este error
                        }
                        
                        res.status(201).json({ 
                            id_producto: idProducto, 
                            nombre, 
                            precio_venta, 
                            descripcion, 
                            cantidad: cantidadInt, 
                            imagen, 
                            categoria,
                            stock: cantidadInt,
                            stock_minimo: 4
                        });
                    });
                });
            });
        }
    });
});

// Endpoint para eliminar productos (solo admin)
app.delete('/api/productos/:id', esAdmin, (req, res) => {
    const { id } = req.params;
    
    // Primero obtener la información del producto para eliminar la imagen
    conexion.query('SELECT imagen FROM productos WHERE id_producto = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        const producto = result[0];
        
        // Eliminar el producto de la base de datos
        conexion.query('DELETE FROM productos WHERE id_producto = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            
            // Si el producto tenía una imagen local, eliminarla del servidor
            if (producto.imagen && producto.imagen.startsWith('/uploads/')) {
                const imagePath = path.join(__dirname, producto.imagen);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            
            res.json({ mensaje: 'Producto eliminado correctamente' });
        });
    });
});

// Endpoint para editar productos (solo admin) con subida de imagen
app.put('/api/productos/:id', upload, esAdmin, (req, res) => {
    const { id } = req.params;
    const { nombre, precio_venta, descripcion, cantidad, categoria } = req.body;
    
    // Si se subió una nueva imagen, usar esa; si no, mantener la existente
    let imagen = null;
    if (req.file) {
        imagen = `/uploads/${req.file.filename}`;
    }
    // Validar y convertir precio_venta
    const precioVentaNum = Number(precio_venta);
    if (isNaN(precioVentaNum) || precioVentaNum < 0) {
        return res.status(400).json({ error: 'El precio debe ser un número válido y positivo' });
    }
    // Convertir cantidad a número
    const cantidadInt = Number(cantidad) || 0;
    
    let sql, params;
    if (imagen) {
        sql = 'UPDATE productos SET nombre = ?, precio_venta = ?, descripcion = ?, imagen = ?, categoria = ? WHERE id_producto = ?';
        params = [nombre, precioVentaNum, descripcion, imagen, categoria, id];
    } else {
        sql = 'UPDATE productos SET nombre = ?, precio_venta = ?, descripcion = ?, categoria = ? WHERE id_producto = ?';
        params = [nombre, precioVentaNum, descripcion, categoria, id];
    }
    
    conexion.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        // Actualizar o crear registro en stocks
        const estado = cantidadInt > 0 ? 'disponible' : 'agotado';
        const sqlStock = 'INSERT INTO stocks (id_producto, stock, stock_minimo, estado) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE stock = ?, estado = ?';
        conexion.query(sqlStock, [id, cantidadInt, 4, estado, cantidadInt, estado], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ 
                id_producto: id, 
                nombre, 
                precio_venta: precioVentaNum, 
                descripcion, 
                cantidad: cantidadInt, 
                imagen, 
                categoria,
                stock: cantidadInt,
                stock_minimo: 4
            });
        });
    });
});

// Middleware para manejar errores de multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB.' });
        }
        return res.status(400).json({ error: 'Error al subir archivo: ' + error.message });
    } else if (error) {
        return res.status(400).json({ error: error.message });
    }
    next();
});

// RUTAS Y LÓGICA ADAPTADAS A LA NUEVA BASE DE DATOS

// REGISTRO DE USUARIO
app.post('/api/usuarios', (req, res) => {
    const { nombre, apellido, cedula, telefono, correo, contraseña, direccion, rol } = req.body;
    const sql = 'INSERT INTO usuarios (nombre, apellido, cedula, telefono, correo, contraseña, direccion, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    conexion.query(sql, [nombre, apellido, cedula, telefono, correo, contraseña, direccion, rol || 'cliente'], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id_usuario: result.insertId, nombre, apellido, correo, rol: rol || 'cliente' });
    });
});

// LOGIN DE USUARIO
app.post('/api/login', (req, res) => {
    const { correo, contraseña } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?';
    conexion.query(sql, [correo, contraseña], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: 'Credenciales incorrectas' });
        res.json({ usuario: results[0] });
    });
});

// OBTENER TODOS LOS USUARIOS (solo admin)
app.get('/api/usuarios', esAdmin, (req, res) => {
    const sql = 'SELECT id_usuario, nombre, apellido, cedula, telefono, correo, direccion, rol, fecha_registro FROM usuarios ORDER BY fecha_registro DESC';
    conexion.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// LISTADO DE PRODUCTOS
app.get('/api/productos', (req, res) => {
    const sql = `SELECT p.*, COALESCE(s.stock, 0) as stock, COALESCE(s.stock_minimo, 4) as stock_minimo, COALESCE(s.estado, 'disponible') as estado_stock 
                 FROM productos p 
                 LEFT JOIN stocks s ON p.id_producto = s.id_producto`;
    conexion.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// OBTENER PRODUCTO POR ID
app.get('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT p.*, COALESCE(s.stock, 0) as stock, COALESCE(s.stock_minimo, 4) as stock_minimo, COALESCE(s.estado, 'disponible') as estado_stock 
                 FROM productos p 
                 LEFT JOIN stocks s ON p.id_producto = s.id_producto 
                 WHERE p.id_producto = ?`;
    conexion.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results[0]);
    });
});

// LISTADO DE STOCKS
app.get('/api/stocks', (req, res) => {
    const sql = 'SELECT s.*, p.nombre, p.imagen, p.categoria FROM stocks s JOIN productos p ON s.id_producto = p.id_producto';
    conexion.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ENDPOINT DE PRUEBA
app.get('/api/test', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando correctamente', timestamp: new Date().toISOString() });
});

// VERIFICAR STOCK ANTES DE VENTA
app.post('/api/verificar-stock', (req, res) => {
    console.log('=== ENDPOINT VERIFICAR STOCK LLAMADO ===');
    console.log('Body recibido:', req.body);
    
    const { detalles } = req.body;
    
    if (!Array.isArray(detalles) || detalles.length === 0) {
        console.log('Error: Detalles no válidos');
        return res.status(400).json({ error: 'Detalles de productos requeridos' });
    }
    
    console.log('Detalles a verificar:', detalles);
    
    const verificaciones = [];
    let hayErrores = false;
    
    detalles.forEach(detalle => {
        conexion.query('SELECT s.stock, p.nombre FROM stocks s JOIN productos p ON s.id_producto = p.id_producto WHERE s.id_producto = ?', [detalle.id_producto], (err, results) => {
            if (err) {
                hayErrores = true;
                verificaciones.push({ id_producto: detalle.id_producto, error: err.message });
            } else if (results.length === 0) {
                hayErrores = true;
                verificaciones.push({ id_producto: detalle.id_producto, error: 'Producto no encontrado en stock' });
            } else {
                const stock = results[0].stock;
                const nombre = results[0].nombre;
                
                if (stock < detalle.cantidad_producto) {
                    hayErrores = true;
                    verificaciones.push({ 
                        id_producto: detalle.id_producto, 
                        nombre: nombre,
                        stock_disponible: stock,
                        cantidad_solicitada: detalle.cantidad_producto,
                        error: 'Stock insuficiente' 
                    });
                } else {
                    verificaciones.push({ 
                        id_producto: detalle.id_producto, 
                        nombre: nombre,
                        stock_disponible: stock,
                        cantidad_solicitada: detalle.cantidad_producto,
                        disponible: true 
                    });
                }
            }
            
            // Si es el último detalle, enviar respuesta
            if (verificaciones.length === detalles.length) {
                console.log('Verificaciones completadas:', verificaciones);
                if (hayErrores) {
                    console.log('Enviando respuesta de error');
                    res.status(400).json({ 
                        error: 'Stock insuficiente para algunos productos',
                        verificaciones: verificaciones 
                    });
                } else {
                    console.log('Enviando respuesta de éxito');
                    res.json({ 
                        mensaje: 'Stock disponible para todos los productos',
                        verificaciones: verificaciones 
                    });
                }
            }
        });
    });
});

// REGISTRAR VENTA
app.post('/api/ventas', (req, res) => {
    const { id_usuario, cantidad_productos, precio_productos, metodo_pago, detalles } = req.body;
    
    console.log('=== ENDPOINT VENTAS LLAMADO ===');
    console.log('Datos recibidos:', { id_usuario, cantidad_productos, precio_productos, metodo_pago, detalles });
    
    // Verificar stock antes de procesar la venta
    if (Array.isArray(detalles) && detalles.length > 0) {
        // Crear un array de promesas para verificar stock
        const verificacionesPromesas = detalles.map(detalle => {
            return new Promise((resolve) => {
                conexion.query('SELECT stock FROM stocks WHERE id_producto = ?', [detalle.id_producto], (err, results) => {
                    if (err) {
                        resolve({ 
                            id_producto: detalle.id_producto, 
                            error: err.message,
                            disponible: false 
                        });
                    } else if (results.length === 0 || results[0].stock < detalle.cantidad_producto) {
                        resolve({ 
                            id_producto: detalle.id_producto, 
                            stock_disponible: results.length > 0 ? results[0].stock : 0,
                            cantidad_solicitada: detalle.cantidad_producto,
                            error: 'Stock insuficiente',
                            disponible: false 
                        });
                    } else {
                        resolve({ 
                            id_producto: detalle.id_producto, 
                            stock_disponible: results[0].stock,
                            cantidad_solicitada: detalle.cantidad_producto,
                            disponible: true 
                        });
                    }
                });
            });
        });
        
        // Esperar todas las verificaciones
        Promise.all(verificacionesPromesas).then(verificaciones => {
            console.log('Verificaciones completadas:', verificaciones);
            
            const hayErrores = verificaciones.some(v => !v.disponible);
            
            if (hayErrores) {
                console.log('Enviando respuesta de error por stock insuficiente');
                return res.status(400).json({ 
                    error: 'Stock insuficiente para algunos productos',
                    verificaciones: verificaciones 
                });
            } else {
                console.log('Stock disponible, procediendo con la venta');
                // Proceder con la venta
                procesarVenta();
            }
        });
    } else {
        console.log('No hay detalles para verificar, procediendo con la venta');
        procesarVenta();
    }
    
    function procesarVenta() {
        console.log('Procesando venta...');
        const sqlVenta = 'INSERT INTO ventas (id_usuario, cantidad_productos, precio_productos) VALUES (?, ?, ?)';
        conexion.query(sqlVenta, [id_usuario, cantidad_productos, precio_productos], (err, result) => {
            if (err) {
                console.error('Error al insertar venta:', err);
                return res.status(500).json({ error: err.message });
            }
            const id_venta = result.insertId;
            console.log('Venta insertada con ID:', id_venta);
            
            // Insertar detalles de venta y actualizar stock
            if (Array.isArray(detalles)) {
                const sqlDetalle = 'INSERT INTO detalles_venta (id_producto, id_venta, cantidad_producto, precio_unitario) VALUES ?';
                const values = detalles.map(d => [d.id_producto, id_venta, d.cantidad_producto, d.precio_unitario]);
                conexion.query(sqlDetalle, [values], (err2) => {
                    if (err2) {
                        console.error('Error al insertar detalles:', err2);
                        return res.status(500).json({ error: err2.message });
                    }
                    console.log('Detalles de venta insertados correctamente');
                    
                    // Disminuir cantidad de cada producto solo en stocks
                    detalles.forEach(d => {
                        // Actualizar tabla stocks
                        conexion.query('UPDATE stocks SET stock = GREATEST(stock - ?, 0), estado = CASE WHEN GREATEST(stock - ?, 0) > 0 THEN "disponible" ELSE "agotado" END WHERE id_producto = ?', [d.cantidad_producto, d.cantidad_producto, d.id_producto]);
                    });
                    console.log('Stock actualizado, enviando respuesta de éxito');
                    res.status(201).json({ 
                        mensaje: 'Venta procesada exitosamente',
                        id_venta: id_venta 
                    });
                });
            } else {
                console.log('No hay detalles, enviando respuesta de éxito');
                res.status(201).json({ 
                    mensaje: 'Venta procesada exitosamente',
                    id_venta: id_venta 
                });
            }
        });
    }
});

// LISTAR VENTAS
app.get('/api/ventas', (req, res) => {
    const sql = 'SELECT * FROM ventas';
    conexion.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// LISTAR DETALLES DE VENTA
app.get('/api/detalles_venta', (req, res) => {
    const sql = 'SELECT * FROM detalles_venta';
    conexion.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Endpoint para generar informes (solo admin)
app.post('/api/informes', esAdmin, (req, res) => {
    const { tipo, fechaInicio, fechaFin } = req.body;
    let sql = '';
    let params = [];
    if (tipo === 'mas-vendido') {
        sql = `SELECT p.nombre, SUM(dv.cantidad_producto) as total_vendido
               FROM detalles_venta dv
               JOIN productos p ON dv.id_producto = p.id_producto
               JOIN ventas v ON dv.id_venta = v.id_venta
               WHERE v.fecha_venta BETWEEN ? AND ?
               GROUP BY p.id_producto
               ORDER BY total_vendido DESC
               LIMIT 1`;
        params = [fechaInicio, fechaFin];
    } else if (tipo === 'menos-vendido') {
        sql = `SELECT p.nombre, IFNULL(SUM(dv.cantidad_producto),0) as total_vendido
               FROM productos p
               LEFT JOIN detalles_venta dv ON p.id_producto = dv.id_producto
               GROUP BY p.id_producto
               ORDER BY total_vendido ASC
               LIMIT 1`;
    } else if (tipo === 'mas-popular') {
        sql = `SELECT p.nombre, COUNT(dv.id_venta) as veces_vendido
               FROM detalles_venta dv
               JOIN productos p ON dv.id_producto = p.id_producto
               GROUP BY p.id_producto
               ORDER BY veces_vendido DESC
               LIMIT 1`;
    } else if (tipo === 'ventas-por-fecha') {
        sql = `SELECT 
                    DATE(v.fecha_venta) as fecha,
                    COUNT(v.id_venta) as numero_ventas,
                    SUM(v.precio_productos) as total_ventas,
                    AVG(v.precio_productos) as promedio_venta,
                    SUM(v.cantidad_productos) as total_productos_vendidos
               FROM ventas v
               GROUP BY DATE(v.fecha_venta)
               ORDER BY fecha DESC`;
    } else if (tipo === 'ventas-por-categoria') {
        sql = `SELECT p.categoria, SUM(dv.cantidad_producto) as total_vendidos
               FROM detalles_venta dv
               JOIN productos p ON dv.id_producto = p.id_producto
               GROUP BY p.categoria
               ORDER BY total_vendidos DESC`;
    } else {
        return res.status(400).json({ error: 'Tipo de informe no válido' });
    }
    conexion.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ resultados: results });
    });
});

// Endpoint para generar informes de inventario (solo admin)
app.post('/api/informes-inventario', esAdmin, (req, res) => {
    const { tipo, fechaInicio, fechaFin, idAdmin } = req.body;
    let sql = '';
    let params = [];
    
    if (tipo === 'operaciones-admin') {
        // Operaciones realizadas por un administrador específico
        sql = `SELECT 
                    io.id_operacion,
                    p.nombre as producto,
                    u.nombre as admin_nombre,
                    u.apellido as admin_apellido,
                    io.tipo_operacion,
                    io.cantidad_anterior,
                    io.cantidad_nueva,
                    io.cantidad_cambio,
                    io.fecha_operacion,
                    io.descripcion
                FROM inventario_operaciones io
                JOIN productos p ON io.id_producto = p.id_producto
                JOIN usuarios u ON io.id_admin = u.id_usuario
                WHERE DATE(io.fecha_operacion) = ?
                ${idAdmin ? 'AND io.id_admin = ?' : ''}
                ORDER BY io.fecha_operacion DESC`;
        params = [fechaInicio];
        if (idAdmin) params.push(idAdmin);
    } else if (tipo === 'productos-mas-agregados') {
        // Productos con más cantidad agregada
        sql = `SELECT 
                    p.nombre as producto,
                    p.categoria,
                    SUM(io.cantidad_cambio) as total_agregado,
                    COUNT(io.id_operacion) as veces_modificado
                FROM inventario_operaciones io
                JOIN productos p ON io.id_producto = p.id_producto
                WHERE io.tipo_operacion IN ('agregar', 'editar')
                AND DATE(io.fecha_operacion) = ?
                GROUP BY p.id_producto
                ORDER BY total_agregado DESC`;
        params = [fechaInicio];
    } else if (tipo === 'resumen-inventario') {
        // Resumen general del inventario
        sql = `SELECT 
                    COUNT(DISTINCT io.id_producto) as productos_modificados,
                    SUM(CASE WHEN io.tipo_operacion = 'agregar' THEN 1 ELSE 0 END) as productos_nuevos,
                    SUM(CASE WHEN io.tipo_operacion = 'editar' THEN 1 ELSE 0 END) as productos_actualizados,
                    SUM(io.cantidad_cambio) as total_cantidad_agregada,
                    COUNT(DISTINCT io.id_admin) as admins_activos
                FROM inventario_operaciones io
                WHERE DATE(io.fecha_operacion) = ?`;
        params = [fechaInicio];
    } else if (tipo === 'stock-actual') {
        // Stock actual de todos los productos
        sql = `SELECT 
                    p.nombre as producto,
                    p.categoria,
                    s.stock,
                    s.stock_minimo,
                    s.estado,
                    s.fecha_actualizacion
                FROM productos p
                LEFT JOIN stocks s ON p.id_producto = s.id_producto
                ORDER BY s.stock ASC`;
    } else {
        return res.status(400).json({ error: 'Tipo de informe de inventario no válido' });
    }
    
    conexion.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ 
            tipo: tipo,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            resultados: results 
        });
    });
});

// Endpoint para obtener una imagen específica
app.get('/api/imagen/:filename', (req, res) => {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, 'uploads', filename);
    
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ error: 'Imagen no encontrada' });
    }
});

// Configurar el puerto y iniciar el servidor
const PORT = serverConfig.port;
const HOST = serverConfig.host;
app.listen(PORT, HOST, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`API disponible en http://${HOST}:${PORT}/api`);
});