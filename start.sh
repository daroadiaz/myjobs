#!/bin/bash

echo "==================================="
echo "MyJobs - Portal de Trabajo"
echo "==================================="
echo ""
echo "Iniciando servicios..."
echo ""

# Construir imágenes
echo "1. Construyendo imágenes Docker..."
docker-compose build

# Iniciar servicios
echo ""
echo "2. Iniciando servicios..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo ""
echo "3. Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
echo ""
echo "4. Estado de los servicios:"
docker-compose ps

echo ""
echo "==================================="
echo "Servicios iniciados correctamente!"
echo "==================================="
echo ""
echo "Accede a la aplicación:"
echo "  - Frontend: http://localhost"
echo "  - Backend API: http://localhost:8080/api"
echo ""
echo "Ver logs:"
echo "  docker-compose logs -f"
echo ""
echo "Detener servicios:"
echo "  docker-compose down"
echo ""
