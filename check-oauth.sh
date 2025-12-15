#!/bin/bash
TOKEN=$(gcloud auth print-access-token)
echo "Verificando OAuth consent screen..."
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://oauth2.googleapis.com/v2/tokeninfo?access_token=$TOKEN"
