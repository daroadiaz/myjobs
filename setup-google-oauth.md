# Guía Rápida: Crear OAuth 2.0 Client ID para MyJobs

## Tiempo estimado: 3-5 minutos

### Paso 1: Configurar Pantalla de Consentimiento (OAuth Consent Screen)

1. Abre este enlace:
   **https://console.cloud.google.com/apis/credentials/consent?project=sinuous-cat-479522-i4**

2. Si pregunta "User Type", selecciona **"Externo"** y click "Crear"

3. Completa el formulario:
   - **Nombre de la aplicación**: `MyJobs`
   - **Correo electrónico de asistencia del usuario**: `da.roadiaz@gmail.com`
   - **Logotipo de la aplicación**: (opcional, déjalo vacío)

4. En "Dominios autorizados", click "AGREGAR DOMINIO" y escribe:
   - `run.app`

5. **Información de contacto del desarrollador**: `da.roadiaz@gmail.com`

6. Click **"GUARDAR Y CONTINUAR"**

7. En la pantalla de "Alcances" (Scopes):
   - Click "AGREGAR O QUITAR ALCANCES"
   - Busca y selecciona:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`
   - Click "ACTUALIZAR"
   - Click "GUARDAR Y CONTINUAR"

8. En "Usuarios de prueba": Click "GUARDAR Y CONTINUAR"

9. Revisa el resumen y click "VOLVER AL PANEL"

---

### Paso 2: Crear Credenciales OAuth 2.0

1. Abre este enlace:
   **https://console.cloud.google.com/apis/credentials?project=sinuous-cat-479522-i4**

2. Click en **"+ CREAR CREDENCIALES"** (botón azul arriba)

3. Selecciona **"ID de cliente de OAuth"**

4. En "Tipo de aplicación": selecciona **"Aplicación web"**

5. **Nombre**: `MyJobs Web Client`

6. En **"Orígenes de JavaScript autorizados"**, click "AGREGAR URI" y agrega:
   ```
   https://frontend-548610687122.us-central1.run.app
   ```
   Click "AGREGAR URI" otra vez y agrega:
   ```
   http://localhost:4200
   ```
   Y otra vez:
   ```
   http://localhost
   ```

7. En **"URIs de redireccionamiento autorizados"**, click "AGREGAR URI" y agrega:
   ```
   https://frontend-548610687122.us-central1.run.app
   ```
   Click "AGREGAR URI" otra vez y agrega:
   ```
   http://localhost:4200
   ```
   Y otra vez:
   ```
   http://localhost
   ```

8. Click **"CREAR"**

9. **¡IMPORTANTE!** Aparecerá una ventana con:
   - **Tu ID de cliente** (se ve así: `123456789-abcdef.apps.googleusercontent.com`)
   - Tu secreto de cliente (no lo necesitas para este caso)

10. **COPIA EL ID DE CLIENTE** y ejecútalo así:
    ```bash
    GOOGLE_CLIENT_ID=TU_ID_AQUI ./deploy-google-auth.sh
    ```

---

## URLs Rápidas de Referencia

- Consent Screen: https://console.cloud.google.com/apis/credentials/consent?project=sinuous-cat-479522-i4
- Credenciales: https://console.cloud.google.com/apis/credentials?project=sinuous-cat-479522-i4
- Crear OAuth Client: https://console.cloud.google.com/apis/credentials/oauthclient?project=sinuous-cat-479522-i4
