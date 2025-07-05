#!/bin/bash

echo "========================================"
echo "    INSTALADOR DE BIKE STORE"
echo "========================================"
echo

# Verificar Node.js
echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado"
    echo "Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js encontrado"

# Verificar npm
echo "Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm no está instalado"
    exit 1
fi
echo "✅ npm encontrado"

# Verificar MySQL
echo "Verificando MySQL..."
if ! command -v mysql &> /dev/null; then
    echo "⚠️  ADVERTENCIA: MySQL no está en el PATH"
    echo "Asegúrate de que MySQL esté instalado y corriendo"
    echo
fi

echo
echo "========================================"
echo "    CONFIGURANDO EL PROYECTO"
echo "========================================"
echo

# Navegar al directorio del proyecto
cd "$(dirname "$0")/api"

# Instalar dependencias
echo "Instalando dependencias..."
if npm install; then
    echo "✅ Dependencias instaladas"
else
    echo "ERROR: No se pudieron instalar las dependencias"
    exit 1
fi

echo
echo "Configurando variables de entorno..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Archivo .env creado"
    echo
    echo "IMPORTANTE: Edita el archivo .env con tus credenciales de MySQL"
    echo
else
    echo "✅ Archivo .env ya existe"
fi

echo
echo "========================================"
echo "    CONFIGURACIÓN COMPLETADA"
echo "========================================"
echo
echo "Para iniciar el servidor:"
echo "1. Edita api/.env con tus credenciales de MySQL"
echo "2. Ejecuta: cd api && npm start"
echo "3. Abre pages/index.html en tu navegador"
echo
echo "Para configurar la base de datos automáticamente:"
echo "cd api && npm run setup-db" 