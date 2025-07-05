@echo off
echo ========================================
echo    INSTALADOR DE BIKE STORE
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

echo.
echo Verificando MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  ADVERTENCIA: MySQL no esta en el PATH
    echo Asegurate de que MySQL este instalado y corriendo
    echo.
)

echo.
echo ========================================
echo    CONFIGURANDO EL PROYECTO
echo ========================================
echo.

cd /d "%~dp0api"

echo Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas

echo.
echo Configurando variables de entorno...
if not exist .env (
    copy env.example .env
    echo ✅ Archivo .env creado
    echo.
    echo IMPORTANTE: Edita el archivo .env con tus credenciales de MySQL
    echo.
) else (
    echo ✅ Archivo .env ya existe
)

echo.
echo ========================================
echo    CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Para iniciar el servidor:
echo 1. Edita api/.env con tus credenciales de MySQL
echo 2. Ejecuta: cd api && npm start
echo 3. Abre pages/index.html en tu navegador
echo.
echo Para configurar la base de datos automaticamente:
echo cd api && npm run setup-db
echo.
pause 