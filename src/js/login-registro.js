// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en una página que tiene el modal de login/registro
    const modal = document.getElementById('modal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginBtn = document.getElementById('login-btn');
    const loginContainer = document.querySelector('.login-container');

    const API_BASE = 'http://localhost:3001/api';

    // Función para mostrar el formulario de registro
    function mostrarRegistro(e) {
        if (e) e.preventDefault();
        if (modal) {
            modal.style.display = 'block';
        }
        if (loginForm) {
            loginForm.classList.add('hidden');
        }
        if (registerForm) {
            registerForm.classList.remove('hidden');
        }
    }

    // Función para mostrar el formulario de login
    function mostrarLogin(e) {
        if (e) e.preventDefault();
        if (modal) {
            modal.style.display = 'block';
        }
        if (registerForm) {
            registerForm.classList.add('hidden');
        }
        if (loginForm) {
            loginForm.classList.remove('hidden');
        }
    }

    // Función para ocultar el modal
    function ocultarModal() {
        if (modal) {
            modal.style.display = 'none';
            // Al cerrar el modal, asegurarse de que el formulario de registro esté oculto
            if (registerForm) {
                registerForm.classList.add('hidden');
            }
            // Y mostrar el formulario de login por defecto
            if (loginForm) {
                loginForm.classList.remove('hidden');
            }
        }
    }

    // Asegurarse de que el formulario de registro esté oculto por defecto
    if (registerForm) {
        registerForm.classList.add('hidden');
    }
    // Y que el formulario de login esté visible por defecto
    if (loginForm) {
        loginForm.classList.remove('hidden');
    }

    // Evento para cerrar el modal
    if (closeModalBtn && loginContainer) {
        closeModalBtn.addEventListener('click', function() {
            loginContainer.style.display = 'none';
        });
    }

    // Evento para cerrar el modal al hacer clic fuera
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                ocultarModal();
            }
        });
    }

    // Evento para mostrar el formulario de registro
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', mostrarRegistro);
    }

    // Evento para mostrar el formulario de login
    if (showLoginLink) {
        showLoginLink.addEventListener('click', mostrarLogin);
    }

    // Evento para mostrar el modal de login/registro
    if (loginBtn) {
        loginBtn.addEventListener('click', mostrarLogin);
    }

    // Evento para el formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const correo = document.getElementById('username').value;
            const contraseña = document.getElementById('password').value;
            try {
                const response = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo, contraseña })
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));
                    ocultarModal();
                    
                    // Actualizar la interfaz para mostrar el usuario autenticado
                    if (typeof verificarUsuarioAutenticado === 'function') {
                        verificarUsuarioAutenticado();
                    }
                    
                    // Si el usuario es administrador, redirigir al panel de administración
                    if (data.usuario.rol === 'admin') {
                        // Redirigir al panel de administración
                        window.location.href = 'administrador.html';
                        return;
                    }
                    
                    // Si no es admin, mostrar elementos de admin (para compatibilidad)
                    if (data.usuario.rol === 'admin' && typeof mostrarElementosAdmin === 'function') {
                        mostrarElementosAdmin();
                    }
                    
                    Toastify({
                        text: "¡Bienvenido!",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                            borderRadius: "2rem",
                        }
                    }).showToast();
                } else {
                    Toastify({
                        text: data.error || 'Error de autenticación',
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                            borderRadius: "2rem",
                        }
                    }).showToast();
                }
            } catch (error) {
                Toastify({
                    text: 'Error de red',
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                        borderRadius: "2rem",
                    }
                }).showToast();
            }
        });
    }

    // Evento para el formulario de registro
    if (registerForm) {
        // Agregar validaciones en tiempo real
        const nuipInput = document.getElementById('nuip');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('reg-password');
        const phoneInput = document.getElementById('phone');

        // Función para mostrar mensajes de error
        function mostrarError(input, mensaje) {
            const formGroup = input.parentElement;
            const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = mensaje;
            if (!formGroup.querySelector('.error-message')) {
                formGroup.appendChild(errorElement);
            }
            input.classList.add('error');
        }

        // Función para remover mensajes de error
        function removerError(input) {
            const formGroup = input.parentElement;
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
            input.classList.remove('error');
        }

        // Validación de cédula en tiempo real
        if (nuipInput) {
            nuipInput.addEventListener('input', (e) => {
                const valor = e.target.value;
                // Eliminar cualquier carácter que no sea número
                const soloNumeros = valor.replace(/\D/g, '');
                // Actualizar el valor del input solo con números
                e.target.value = soloNumeros;
                
                if (soloNumeros.length === 0) {
                    removerError(nuipInput);
                } else {
                    removerError(nuipInput);
                }
            });
        }

        // Validación de teléfono en tiempo real
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                const valor = e.target.value;
                // Eliminar cualquier carácter que no sea número
                const soloNumeros = valor.replace(/\D/g, '');
                // Actualizar el valor del input solo con números
                e.target.value = soloNumeros;
                
                if (soloNumeros.length === 0) {
                    removerError(phoneInput);
                } else {
                    removerError(phoneInput);
                }
            });
        }

        // Validación de email en tiempo real
        if (emailInput) {
            emailInput.addEventListener('input', (e) => {
                const valor = e.target.value;
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                    mostrarError(emailInput, 'El correo electrónico debe contener @ y un dominio válido');
                } else {
                    removerError(emailInput);
                }
            });
        }

        // Validación de contraseña en tiempo real
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                const valor = e.target.value;
                const errores = [];
                
                if (valor.length < 8) {
                    errores.push('La contraseña debe tener al menos 8 caracteres');
                }
                if (!/[A-Za-z]/.test(valor) || !/\d/.test(valor)) {
                    errores.push('La contraseña debe contener letras y números');
                }

                if (errores.length > 0) {
                    mostrarError(passwordInput, errores.join('\n'));
                } else {
                    removerError(passwordInput);
                }
            });
        }

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Obtener los valores del formulario
            const userData = {
                nombre: document.getElementById('first-name').value,
                apellido: document.getElementById('last-name') ? document.getElementById('last-name').value : '',
                cedula: document.getElementById('nuip').value,
                telefono: document.getElementById('phone').value,
                correo: document.getElementById('email').value,
                direccion: document.getElementById('direccion').value,
                contraseña: document.getElementById('reg-password').value
            };

            // Validaciones
            const errores = [];

            // Validación de cédula (solo números)
            if (!/^\d+$/.test(userData.cedula)) {
                errores.push('La cédula debe contener solo números');
                mostrarError(nuipInput, 'La cédula debe contener solo números');
            }

            // Validación de email (debe contener @ y .)
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.correo)) {
                errores.push('El correo electrónico debe contener @ y un dominio válido');
                mostrarError(emailInput, 'El correo electrónico debe contener @ y un dominio válido');
            }

            // Validación de contraseña (mínimo 8 caracteres, letras y números)
            if (userData.contraseña.length < 8) {
                errores.push('La contraseña debe tener al menos 8 caracteres');
            }
            if (!/[A-Za-z]/.test(userData.contraseña) || !/\d/.test(userData.contraseña)) {
                errores.push('La contraseña debe contener letras y números');
            }
            if (errores.length > 0) {
                mostrarError(passwordInput, errores.filter(e => e.includes('contraseña')).join('\n'));
            }

            // Si hay errores, mostrarlos y no continuar
            if (errores.length > 0) {
                Toastify({
                    text: errores.join('\n'),
                    duration: 5000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                        borderRadius: "2rem",
                    }
                }).showToast();
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE}/usuarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('usuario', JSON.stringify(data));
                    ocultarModal();
                    
                    // Si el usuario es administrador, mostrar elementos de admin
                    if (data.rol === 'admin' && typeof mostrarElementosAdmin === 'function') {
                        mostrarElementosAdmin();
                    }
                    
                    Toastify({
                        text: "¡Registro exitoso!",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                            borderRadius: "2rem",
                        }
                    }).showToast();
                } else {
                    Toastify({
                        text: data.error || 'Error en el registro',
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                            borderRadius: "2rem",
                        }
                    }).showToast();
                }
            } catch (error) {
                Toastify({
                    text: 'Error de red',
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                        borderRadius: "2rem",
                    }
                }).showToast();
            }
        });
    }

    // Exponer la función mostrarLogin globalmente
    window.mostrarLogin = mostrarLogin;

    // Si hay un usuario intentando comprar, mostrar el modal de login
    const comprarBtn = document.querySelector('.carrito-acciones-comprar');
    if (comprarBtn) {
        comprarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarLogin();
        });
    }
}); 