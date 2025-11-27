@echo off
echo ===================================
echo MyJobs - Portal de Trabajo
echo ===================================
echo.
echo Iniciando servicios...
echo.

echo 1. Construyendo imagenes Docker...
docker-compose build

echo.
echo 2. Iniciando servicios...
docker-compose up -d

echo.
echo 3. Esperando a que los servicios esten listos...
timeout /t 10 /nobreak >nul

echo.
echo 4. Estado de los servicios:
docker-compose ps

echo.
echo ===================================
echo Servicios iniciados correctamente!
echo ===================================
echo.
echo Accede a la aplicacion:
echo   - Frontend: http://localhost
echo   - Backend API: http://localhost:8080/api
echo.
echo Ver logs:
echo   docker-compose logs -f
echo.
echo Detener servicios:
echo   docker-compose down
echo.
pause
