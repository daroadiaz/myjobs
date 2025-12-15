#!/bin/bash
set -e

# ==============================================
# SCRIPT DE DESPLIEGUE - GOOGLE OAUTH 2.0
# Solo despliega auth-service y frontend
# ==============================================

# Variables
PROJECT_ID="sinuous-cat-479522-i4"
REGION="us-central1"
REPO="myjobs-repo"
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
echo -e "${YELLOW}   DESPLIEGUE DE GOOGLE OAUTH 2.0 EN MYJOBS    ${NC}"
echo -e "${YELLOW}================================================${NC}"

# Verificar GOOGLE_CLIENT_ID
if [ -z "$GOOGLE_CLIENT_ID" ] || [ "$GOOGLE_CLIENT_ID" == "YOUR_GOOGLE_CLIENT_ID_HERE" ]; then
    echo -e "${RED}ERROR: Debes configurar GOOGLE_CLIENT_ID${NC}"
    echo -e "${YELLOW}Uso: GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com ./deploy-google-auth.sh${NC}"
    echo ""
    echo -e "Para obtener tu Client ID:"
    echo -e "1. Ve a: https://console.cloud.google.com/apis/credentials?project=${PROJECT_ID}"
    echo -e "2. Crea un 'ID de cliente OAuth' de tipo 'Aplicación web'"
    echo -e "3. Agrega los orígenes autorizados:"
    echo -e "   - https://frontend-548610687122.us-central1.run.app"
    echo -e "   - http://localhost:4200 (para desarrollo)"
    exit 1
fi

echo -e "${GREEN}Google Client ID configurado correctamente${NC}"

# Configurar proyecto
gcloud config set project $PROJECT_ID 2>/dev/null

# Registry URL
REGISTRY="us-central1-docker.pkg.dev/${PROJECT_ID}/${REPO}"

# JWT Secret
JWT_SECRET="MyJobsSecretKeyForJWTTokenGenerationAndValidation2024SuperSecure"

# URL de datasource
DATASOURCE_URL="jdbc:mysql://${CLOUD_SQL_IP}:3306/${DB_NAME}?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"

# ========== ACTUALIZAR FRONTEND ENVIRONMENTS ==========
echo -e "\n${BLUE}[0/2] Actualizando Google Client ID en frontend...${NC}"

# Update environment.ts
sed -i "s/googleClientId: '.*'/googleClientId: '${GOOGLE_CLIENT_ID}'/" /home/da_roadiaz/myjobs/frontend/src/environments/environment.ts

# Update environment.prod.ts
sed -i "s/googleClientId: '.*'/googleClientId: '${GOOGLE_CLIENT_ID}'/" /home/da_roadiaz/myjobs/frontend/src/environments/environment.prod.ts

echo -e "${GREEN}  ✓ Environments actualizados${NC}"

# ========== AUTH SERVICE ==========
echo -e "\n${GREEN}[1/2] AUTH-SERVICE (con Google OAuth)${NC}"
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
    --set-env-vars "GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}" \
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

# ========== FRONTEND ==========
echo -e "\n${GREEN}[2/2] FRONTEND (con Google Sign-In)${NC}"

# Obtener URL del API Gateway
API_GATEWAY_URL=$(gcloud run services describe api-gateway --region ${REGION} --format='value(status.url)' 2>/dev/null)

# Crear nginx.conf para Cloud Run con proxy al API Gateway
cat > /home/da_roadiaz/myjobs/frontend/nginx-cloudrun.conf << NGINXEOF
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
        proxy_pass ${API_GATEWAY_URL}/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
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
echo -e "${YELLOW}    GOOGLE OAUTH 2.0 DESPLEGADO EXITOSAMENTE!   ${NC}"
echo -e "${YELLOW}================================================${NC}"
echo -e "\n${GREEN}URLs:${NC}"
echo -e "  ${BLUE}Frontend:${NC} ${FRONTEND_URL}"
echo -e "  ${BLUE}Auth Service:${NC} ${AUTH_URL}"
echo -e "\n${GREEN}Configuración OAuth:${NC}"
echo -e "  ${BLUE}Google Client ID:${NC} ${GOOGLE_CLIENT_ID}"
echo -e "\n${YELLOW}IMPORTANTE:${NC}"
echo -e "  Asegúrate de que en Google Cloud Console:"
echo -e "  1. Orígenes JS autorizados incluyan: ${FRONTEND_URL}"
echo -e "  2. URIs de redirección incluyan: ${FRONTEND_URL}"
echo -e "\n${GREEN}Prueba la autenticación:${NC}"
echo -e "  1. Ve a ${FRONTEND_URL}/login"
echo -e "  2. Click en 'Iniciar sesión con Google'"
echo -e "  3. Para nuevos usuarios, selecciona el tipo de usuario"
