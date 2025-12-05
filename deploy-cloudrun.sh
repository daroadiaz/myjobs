#!/bin/bash
set -e

# Variables
PROJECT_ID="sinuous-cat-479522-i4"
REGION="us-central1"
REPO="myjobs-repo"
CLOUD_SQL_CONNECTION="sinuous-cat-479522-i4:us-central1:myjobs-mysql"
CLOUD_SQL_IP="34.67.111.133"
DB_NAME="myjobs"
DB_USER="root"
DB_PASS="root"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}================================================${NC}"
echo -e "${YELLOW}     DESPLEGANDO MYJOBS EN GOOGLE CLOUD RUN     ${NC}"
echo -e "${YELLOW}================================================${NC}"

# Configurar proyecto
gcloud config set project $PROJECT_ID 2>/dev/null

# Registry URL
REGISTRY="us-central1-docker.pkg.dev/${PROJECT_ID}/${REPO}"

# JWT Secret
JWT_SECRET="MyJobsSecretKeyForJWTTokenGenerationAndValidation2024SuperSecure"

# URL de datasource para Cloud SQL con IP pública
DATASOURCE_URL="jdbc:mysql://${CLOUD_SQL_IP}:3306/${DB_NAME}?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"

echo -e "\n${BLUE}[INFO] Habilitando APIs necesarias...${NC}"
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com sqladmin.googleapis.com --quiet 2>/dev/null

# ========== AUTH SERVICE ==========
echo -e "\n${GREEN}[1/7] AUTH-SERVICE${NC}"
echo -e "${BLUE}  Construyendo imagen...${NC}"
gcloud builds submit /home/da_roadiaz/myjobs/backend/auth-service \
    --tag ${REGISTRY}/auth-service:latest \
    --quiet 2>&1 | tail -5

echo -e "${BLUE}  Desplegando en Cloud Run...${NC}"
gcloud run deploy auth-service \
    --image ${REGISTRY}/auth-service:latest \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --set-env-vars "SPRING_DATASOURCE_URL=${DATASOURCE_URL}" \
    --set-env-vars "SPRING_DATASOURCE_USERNAME=${DB_USER}" \
    --set-env-vars "SPRING_DATASOURCE_PASSWORD=${DB_PASS}" \
    --set-env-vars "JWT_SECRET=${JWT_SECRET}" \
    --set-env-vars "JWT_EXPIRATION=86400000" \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 2 \
    --timeout 300 \
    --concurrency 80 \
    --cpu-boost \
    --quiet 2>&1 | tail -3

AUTH_URL=$(gcloud run services describe auth-service --region ${REGION} --format='value(status.url)' 2>/dev/null)
echo -e "${GREEN}  ✓ Auth Service: ${AUTH_URL}${NC}"

# ========== USER SERVICE ==========
echo -e "\n${GREEN}[2/7] USER-SERVICE${NC}"
echo -e "${BLUE}  Construyendo imagen...${NC}"
gcloud builds submit /home/da_roadiaz/myjobs/backend/user-service \
    --tag ${REGISTRY}/user-service:latest \
    --quiet 2>&1 | tail -5

echo -e "${BLUE}  Desplegando en Cloud Run...${NC}"
gcloud run deploy user-service \
    --image ${REGISTRY}/user-service:latest \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --set-env-vars "SPRING_DATASOURCE_URL=${DATASOURCE_URL}" \
    --set-env-vars "SPRING_DATASOURCE_USERNAME=${DB_USER}" \
    --set-env-vars "SPRING_DATASOURCE_PASSWORD=${DB_PASS}" \
    --set-env-vars "JWT_SECRET=${JWT_SECRET}" \
    --set-env-vars "JWT_EXPIRATION=86400000" \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 2 \
    --timeout 300 \
    --concurrency 80 \
    --cpu-boost \
    --quiet 2>&1 | tail -3

USER_URL=$(gcloud run services describe user-service --region ${REGION} --format='value(status.url)' 2>/dev/null)
echo -e "${GREEN}  ✓ User Service: ${USER_URL}${NC}"

# ========== JOB SERVICE ==========
echo -e "\n${GREEN}[3/7] JOB-SERVICE${NC}"
echo -e "${BLUE}  Construyendo imagen...${NC}"
gcloud builds submit /home/da_roadiaz/myjobs/backend/job-service \
    --tag ${REGISTRY}/job-service:latest \
    --quiet 2>&1 | tail -5

echo -e "${BLUE}  Desplegando en Cloud Run...${NC}"
gcloud run deploy job-service \
    --image ${REGISTRY}/job-service:latest \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --set-env-vars "SPRING_DATASOURCE_URL=${DATASOURCE_URL}" \
    --set-env-vars "SPRING_DATASOURCE_USERNAME=${DB_USER}" \
    --set-env-vars "SPRING_DATASOURCE_PASSWORD=${DB_PASS}" \
    --set-env-vars "JWT_SECRET=${JWT_SECRET}" \
    --set-env-vars "JWT_EXPIRATION=86400000" \
    --set-env-vars "USER_SERVICE_URL=${USER_URL}" \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 2 \
    --timeout 300 \
    --concurrency 80 \
    --cpu-boost \
    --quiet 2>&1 | tail -3

JOB_URL=$(gcloud run services describe job-service --region ${REGION} --format='value(status.url)' 2>/dev/null)
echo -e "${GREEN}  ✓ Job Service: ${JOB_URL}${NC}"

# ========== REVIEW SERVICE ==========
echo -e "\n${GREEN}[4/7] REVIEW-SERVICE${NC}"
echo -e "${BLUE}  Construyendo imagen...${NC}"
gcloud builds submit /home/da_roadiaz/myjobs/backend/review-service \
    --tag ${REGISTRY}/review-service:latest \
    --quiet 2>&1 | tail -5

echo -e "${BLUE}  Desplegando en Cloud Run...${NC}"
gcloud run deploy review-service \
    --image ${REGISTRY}/review-service:latest \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --set-env-vars "SPRING_DATASOURCE_URL=${DATASOURCE_URL}" \
    --set-env-vars "SPRING_DATASOURCE_USERNAME=${DB_USER}" \
    --set-env-vars "SPRING_DATASOURCE_PASSWORD=${DB_PASS}" \
    --set-env-vars "JWT_SECRET=${JWT_SECRET}" \
    --set-env-vars "JWT_EXPIRATION=86400000" \
    --set-env-vars "USER_SERVICE_URL=${USER_URL}" \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 2 \
    --timeout 300 \
    --concurrency 80 \
    --cpu-boost \
    --quiet 2>&1 | tail -3

REVIEW_URL=$(gcloud run services describe review-service --region ${REGION} --format='value(status.url)' 2>/dev/null)
echo -e "${GREEN}  ✓ Review Service: ${REVIEW_URL}${NC}"

# ========== WORKER SERVICE ==========
echo -e "\n${GREEN}[5/7] WORKER-SERVICE${NC}"
echo -e "${BLUE}  Construyendo imagen...${NC}"
gcloud builds submit /home/da_roadiaz/myjobs/backend/worker-service \
    --tag ${REGISTRY}/worker-service:latest \
    --quiet 2>&1 | tail -5

echo -e "${BLUE}  Desplegando en Cloud Run...${NC}"
gcloud run deploy worker-service \
    --image ${REGISTRY}/worker-service:latest \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --set-env-vars "SPRING_DATASOURCE_URL=${DATASOURCE_URL}" \
    --set-env-vars "SPRING_DATASOURCE_USERNAME=${DB_USER}" \
    --set-env-vars "SPRING_DATASOURCE_PASSWORD=${DB_PASS}" \
    --set-env-vars "JWT_SECRET=${JWT_SECRET}" \
    --set-env-vars "JWT_EXPIRATION=86400000" \
    --set-env-vars "USER_SERVICE_URL=${USER_URL}" \
    --set-env-vars "REVIEW_SERVICE_URL=${REVIEW_URL}" \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 2 \
    --timeout 300 \
    --concurrency 80 \
    --cpu-boost \
    --quiet 2>&1 | tail -3

WORKER_URL=$(gcloud run services describe worker-service --region ${REGION} --format='value(status.url)' 2>/dev/null)
echo -e "${GREEN}  ✓ Worker Service: ${WORKER_URL}${NC}"

# ========== API GATEWAY ==========
echo -e "\n${GREEN}[6/7] API-GATEWAY${NC}"

# Crear configuración para Cloud Run
cat > /home/da_roadiaz/myjobs/backend/api-gateway/src/main/resources/application-cloudrun.yml << EOF
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: "*"
            allowedMethods:
              - GET
              - POST
              - PUT
              - PATCH
              - DELETE
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: false
            maxAge: 3600
      routes:
        - id: auth-service
          uri: ${AUTH_URL}
          predicates:
            - Path=/api/auth/**
          filters:
            - StripPrefix=1
        - id: user-service
          uri: ${USER_URL}
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
        - id: job-offers-service
          uri: ${JOB_URL}
          predicates:
            - Path=/api/job-offers/**
          filters:
            - StripPrefix=1
        - id: job-applications-service
          uri: ${JOB_URL}
          predicates:
            - Path=/api/job-applications/**
          filters:
            - StripPrefix=1
        - id: worker-service
          uri: ${WORKER_URL}
          predicates:
            - Path=/api/worker-services/**
          filters:
            - StripPrefix=1
        - id: review-service
          uri: ${REVIEW_URL}
          predicates:
            - Path=/api/reviews/**
          filters:
            - StripPrefix=1

management:
  endpoints:
    web:
      exposure:
        include: health,info

logging:
  level:
    org.springframework.cloud.gateway: INFO
EOF

echo -e "${BLUE}  Construyendo imagen...${NC}"
gcloud builds submit /home/da_roadiaz/myjobs/backend/api-gateway \
    --tag ${REGISTRY}/api-gateway:latest \
    --quiet 2>&1 | tail -5

echo -e "${BLUE}  Desplegando en Cloud Run...${NC}"
gcloud run deploy api-gateway \
    --image ${REGISTRY}/api-gateway:latest \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --set-env-vars "SPRING_PROFILES_ACTIVE=cloudrun" \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 2 \
    --timeout 300 \
    --concurrency 80 \
    --cpu-boost \
    --quiet 2>&1 | tail -3

API_GATEWAY_URL=$(gcloud run services describe api-gateway --region ${REGION} --format='value(status.url)' 2>/dev/null)
echo -e "${GREEN}  ✓ API Gateway: ${API_GATEWAY_URL}${NC}"

# ========== FRONTEND ==========
echo -e "\n${GREEN}[7/7] FRONTEND${NC}"

# Crear nginx.conf para Cloud Run con proxy al API Gateway
cat > /home/da_roadiaz/myjobs/frontend/nginx-cloudrun.conf << 'NGINXEOF'
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location /api/ {
        proxy_pass API_GATEWAY_PLACEHOLDER/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /index.html {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        expires 0;
    }
}
NGINXEOF

# Reemplazar placeholder con URL real
sed -i "s|API_GATEWAY_PLACEHOLDER|${API_GATEWAY_URL}|g" /home/da_roadiaz/myjobs/frontend/nginx-cloudrun.conf

# Crear Dockerfile para Cloud Run
cat > /home/da_roadiaz/myjobs/frontend/Dockerfile.cloudrun << 'DOCKEREOF'
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist/myjobs-frontend/browser .
COPY nginx-cloudrun.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
DOCKEREOF

echo -e "${BLUE}  Construyendo imagen...${NC}"
gcloud builds submit /home/da_roadiaz/myjobs/frontend \
    --tag ${REGISTRY}/frontend:latest \
    -f /home/da_roadiaz/myjobs/frontend/Dockerfile.cloudrun \
    --quiet 2>&1 | tail -5

echo -e "${BLUE}  Desplegando en Cloud Run...${NC}"
gcloud run deploy frontend \
    --image ${REGISTRY}/frontend:latest \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --memory 256Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 2 \
    --timeout 60 \
    --concurrency 100 \
    --cpu-boost \
    --quiet 2>&1 | tail -3

FRONTEND_URL=$(gcloud run services describe frontend --region ${REGION} --format='value(status.url)' 2>/dev/null)
echo -e "${GREEN}  ✓ Frontend: ${FRONTEND_URL}${NC}"

# ========== RESUMEN FINAL ==========
echo -e "\n${YELLOW}================================================${NC}"
echo -e "${YELLOW}         DESPLIEGUE COMPLETADO!                 ${NC}"
echo -e "${YELLOW}================================================${NC}"
echo -e "\n${GREEN}URLs PÚBLICAS DISPONIBLES:${NC}"
echo -e "  ${BLUE}Frontend (Aplicación Web):${NC}"
echo -e "    ${FRONTEND_URL}"
echo -e "\n  ${BLUE}API Gateway (Backend API):${NC}"
echo -e "    ${API_GATEWAY_URL}"
echo -e "\n${GREEN}Servicios Backend Internos:${NC}"
echo -e "  Auth:    ${AUTH_URL}"
echo -e "  User:    ${USER_URL}"
echo -e "  Job:     ${JOB_URL}"
echo -e "  Worker:  ${WORKER_URL}"
echo -e "  Review:  ${REVIEW_URL}"
echo -e "\n${YELLOW}CONFIGURACIÓN ECONÓMICA:${NC}"
echo -e "  • min-instances=0 (scale to zero cuando no hay tráfico)"
echo -e "  • cpu-boost habilitado (arranque rápido sin costo extra)"
echo -e "  • Memoria optimizada: 512Mi backend, 256Mi frontend"
echo -e "\n${YELLOW}NOTA: El primer request puede tardar 10-30s (cold start)${NC}"
