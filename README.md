# MyJobs - Portal de Trabajo

Portal de trabajo completo donde las personas pueden publicar servicios profesionales y ofertas laborales.

## Características

### Perfiles de Usuario
- **Trabajador**: Puede publicar servicios profesionales y aplicar a ofertas laborales
- **Empleador**: Puede publicar ofertas laborales y revisar aplicaciones
- **Moderador**: Puede aprobar/rechazar ofertas y servicios publicados

### Funcionalidades Principales
- Sistema de autenticación con JWT
- Publicación de ofertas laborales
- Publicación de servicios profesionales
- Sistema de aplicaciones a ofertas laborales
- Sistema de reseñas y calificaciones
- Panel de moderación
- Búsqueda y filtros
- Dashboard personalizado por rol

## Stack Tecnológico

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security con JWT
- Spring Data JPA
- MySQL 8.0
- Maven

### Frontend
- Angular 17
- Angular Material
- RxJS
- TypeScript

### DevOps
- Docker
- Docker Compose
- Nginx

## Requisitos Previos

- Docker Desktop instalado
- Docker Compose instalado
- Al menos 4GB de RAM disponible
- Puertos 80, 3306 y 8080 disponibles

## Estructura del Proyecto

```
myjobs/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/myjobs/
│   │       │   ├── config/          # Configuraciones
│   │       │   ├── controller/      # Controladores REST
│   │       │   ├── dto/             # DTOs
│   │       │   ├── entity/          # Entidades JPA
│   │       │   ├── enums/           # Enumeraciones
│   │       │   ├── exception/       # Manejo de excepciones
│   │       │   ├── repository/      # Repositorios
│   │       │   ├── security/        # Seguridad JWT
│   │       │   ├── service/         # Servicios de negocio
│   │       │   └── MyJobsApplication.java
│   │       └── resources/
│   │           └── application.properties
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── models/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── environments/
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
└── docker-compose.yml       # Orquestación de servicios
```

## Instalación y Despliegue

### Opción 1: Despliegue con Docker Compose (Recomendado)

1. Clonar o descargar el proyecto

2. Abrir una terminal en la raíz del proyecto

3. Construir las imágenes Docker:
```bash
docker-compose build
```

4. Iniciar los servicios:
```bash
docker-compose up -d
```

5. Verificar que los servicios estén corriendo:
```bash
docker-compose ps
```

6. Acceder a la aplicación:
   - **Frontend**: http://localhost
   - **Backend API**: http://localhost:8080/api
   - **MySQL**: localhost:3306

### Verificación del Despliegue

Verificar logs de los servicios:
```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs del backend
docker-compose logs backend

# Ver logs del frontend
docker-compose logs frontend

# Ver logs de MySQL
docker-compose logs mysql

# Seguir logs en tiempo real
docker-compose logs -f
```

### Detener los Servicios

```bash
# Detener servicios
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener, eliminar contenedores y volúmenes (CUIDADO: Elimina la BD)
docker-compose down -v
```

## Base de Datos

### Inicialización Automática

El backend está configurado con `spring.jpa.hibernate.ddl-auto=update`, lo que significa que:
- Al iniciar por primera vez, creará automáticamente todas las tablas
- En inicios posteriores, actualizará el esquema según los cambios en las entidades
- **NO** elimina datos existentes

### Acceso Directo a MySQL

Si necesitas acceder directamente a MySQL:

```bash
docker exec -it myjobs-mysql mysql -u myjobs_user -p
# Contraseña: myjobs_password_2024
```

Luego ejecutar:
```sql
USE myjobs_db;
SHOW TABLES;
```

### Credenciales de Base de Datos

- **Base de datos**: myjobs_db
- **Usuario**: myjobs_user
- **Contraseña**: myjobs_password_2024
- **Root Password**: root_password_2024

## Uso de la Aplicación

### 1. Registro de Usuarios

1. Ir a http://localhost
2. Clic en "Registrarse"
3. Completar el formulario seleccionando el tipo de usuario:
   - **Trabajador**: Para ofrecer servicios y aplicar a ofertas
   - **Empleador**: Para publicar ofertas laborales

### 2. Crear un Moderador

El primer moderador debe crearse manualmente en la base de datos o a través de la API:

```bash
# Opción A: Modificar un usuario existente a MODERADOR
docker exec -it myjobs-mysql mysql -u myjobs_user -p
USE myjobs_db;
UPDATE users SET role = 'MODERADOR' WHERE email = 'tu-email@ejemplo.com';
```

### 3. Flujo de Trabajo Típico

#### Para Empleadores:
1. Iniciar sesión
2. Ir a Dashboard
3. Crear nueva oferta laboral
4. Esperar aprobación del moderador
5. Revisar aplicaciones recibidas
6. Aceptar/Rechazar aplicantes

#### Para Trabajadores:
1. Iniciar sesión
2. Publicar servicios profesionales
3. Buscar ofertas laborales
4. Aplicar a ofertas de interés
5. Ver estado de aplicaciones en Dashboard

#### Para Moderadores:
1. Iniciar sesión
2. Ir a Panel de Moderación
3. Revisar ofertas y servicios pendientes
4. Aprobar o rechazar contenido

## Endpoints de API Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión

### Ofertas Laborales
- `GET /api/job-offers` - Listar ofertas aprobadas
- `POST /api/job-offers` - Crear oferta (EMPLEADOR)
- `GET /api/job-offers/{id}` - Ver detalle
- `GET /api/job-offers/search?q=texto` - Buscar ofertas

### Servicios de Trabajadores
- `GET /api/worker-services` - Listar servicios aprobados
- `POST /api/worker-services` - Crear servicio (TRABAJADOR)
- `GET /api/worker-services/{id}` - Ver detalle
- `GET /api/worker-services/search?q=texto` - Buscar servicios

### Aplicaciones
- `POST /api/job-applications` - Aplicar a oferta
- `GET /api/job-applications/my-applications` - Mis aplicaciones
- `GET /api/job-applications/employer` - Aplicaciones recibidas

### Moderación
- `GET /api/job-offers/pending` - Ofertas pendientes (MODERADOR)
- `PATCH /api/job-offers/{id}/moderate` - Moderar oferta (MODERADOR)
- `GET /api/worker-services/pending` - Servicios pendientes (MODERADOR)
- `PATCH /api/worker-services/{id}/moderate` - Moderar servicio (MODERADOR)

## Solución de Problemas

### El backend no inicia
```bash
# Ver logs del backend
docker-compose logs backend

# Verificar que MySQL esté corriendo
docker-compose ps mysql

# Reiniciar backend
docker-compose restart backend
```

### El frontend no carga
```bash
# Ver logs del frontend
docker-compose logs frontend

# Verificar que nginx esté corriendo
docker-compose ps frontend

# Reconstruir frontend
docker-compose build frontend
docker-compose up -d frontend
```

### Error de conexión a la base de datos
```bash
# Verificar salud de MySQL
docker-compose exec mysql mysqladmin ping -h localhost -u root -p

# Recrear contenedor de MySQL (CUIDADO: Elimina datos)
docker-compose down
docker-compose up -d
```

### Puertos en uso
Si los puertos 80, 3306 o 8080 están en uso:

1. Modificar `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "8081:80"  # Cambiar puerto del frontend
  backend:
    ports:
      - "8082:8080"  # Cambiar puerto del backend
  mysql:
    ports:
      - "3307:3306"  # Cambiar puerto de MySQL
```

2. Si cambias el puerto del backend, actualizar `frontend/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8082/api'  // Nuevo puerto
};
```

## Desarrollo Local (Sin Docker)

### Backend
```bash
cd backend
./mvnw spring-boot:run
```
Requisitos: Java 17, MySQL corriendo en localhost:3306

### Frontend
```bash
cd frontend
npm install
npm start
```
Requisitos: Node.js 20+

## Mejoras Futuras

- Sistema de mensajería entre usuarios
- Notificaciones en tiempo real
- Sistema de pagos
- Carga de imágenes y archivos
- Filtros avanzados
- Geolocalización
- Sistema de reputación mejorado
- Dashboard con estadísticas

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Contacto y Soporte

Para reportar problemas o sugerencias, crear un issue en el repositorio del proyecto.
