#!/bin/bash
set -e

PROJECT_ID="sinuous-cat-479522-i4"
PROJECT_NUMBER="548610687122"

echo "=== Creando credenciales OAuth 2.0 para MyJobs ==="

# Obtener token de acceso
TOKEN=$(gcloud auth print-access-token)

# 1. Primero verificar/crear la OAuth consent screen (brand)
echo ""
echo "[1/3] Verificando OAuth consent screen..."

# Intentar crear el brand (consent screen)
BRAND_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "https://iap.googleapis.com/v1/projects/${PROJECT_NUMBER}/brands" \
  -d '{
    "applicationTitle": "MyJobs",
    "supportEmail": "da.roadiaz@gmail.com"
  }' 2>/dev/null)

echo "Brand response: $BRAND_RESPONSE"

# 2. Crear OAuth 2.0 Client ID usando gcloud
echo ""
echo "[2/3] Intentando crear OAuth client via gcloud..."

# No se puede crear OAuth client via gcloud directamente para web apps
# Necesitamos usar la consola o una alternativa

echo ""
echo "[3/3] Verificando credenciales existentes..."

# Listar credenciales existentes (solo se puede ver via API de GCP Console)
echo ""
echo "==================================================="
echo "IMPORTANTE: Las credenciales OAuth Web Client deben"
echo "crearse desde Google Cloud Console."
echo ""
echo "Ve a este enlace:"
echo "https://console.cloud.google.com/apis/credentials?project=${PROJECT_ID}"
echo ""
echo "O intenta este enlace directo para crear:"
echo "https://console.cloud.google.com/apis/credentials/oauthclient?project=${PROJECT_ID}"
echo "==================================================="
