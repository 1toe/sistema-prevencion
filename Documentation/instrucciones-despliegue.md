# Instrucciones de Despliegue - Plataforma Web ONG

Este documento proporciona las instrucciones detalladas para desplegar la plataforma web de la ONG en un entorno de producción.

## Requisitos Previos

### Hardware Recomendado
- **Servidor Web**: 2 CPU, 4GB RAM mínimo
- **Servidor de Base de Datos**: 2 CPU, 4GB RAM mínimo
- **Almacenamiento**: 20GB mínimo

### Software Requerido
- **Sistema Operativo**: Ubuntu 20.04 LTS o superior
- **Node.js**: v14.x o superior
- **NPM**: v6.x o superior
- **PostgreSQL**: v12.x o superior
- **Nginx**: v1.18.0 o superior (para servir el frontend)
- **PM2**: Para gestión de procesos Node.js
- **Certbot**: Para certificados SSL

## Despliegue del Backend

### 1. Preparación del Servidor

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install -y curl git build-essential

# Instalar Node.js y NPM
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node -v
npm -v

# Instalar PM2 globalmente
sudo npm install -g pm2
```

### 2. Configuración de PostgreSQL

```bash
# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Iniciar y habilitar el servicio
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Acceder a PostgreSQL
sudo -u postgres psql

# Crear base de datos y usuario (dentro de psql)
CREATE DATABASE ong_platform;
CREATE USER ong_user WITH ENCRYPTED PASSWORD 'password_segura';
GRANT ALL PRIVILEGES ON DATABASE ong_platform TO ong_user;
\q
```

### 3. Despliegue del Código Backend

```bash
# Clonar el repositorio
git clone https://github.com/ong/platform-backend.git
cd platform-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
nano .env
```

Editar el archivo `.env` con la siguiente configuración:

```
# Configuración del servidor
PORT=3000
NODE_ENV=production

# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ong_platform
DB_USER=ong_user
DB_PASSWORD=password_segura

# Configuración JWT
JWT_SECRET=clave_secreta_muy_segura
JWT_EXPIRES_IN=24h

# Configuración de correo electrónico
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=notificaciones@ong.org
MAIL_PASSWORD=password_correo
MAIL_FROM=notificaciones@ong.org

# Configuración de Google Calendar y Sheets
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_REDIRECT_URI=https://api.ong.org/auth/google/callback
```

```bash
# Ejecutar migraciones de la base de datos
npx sequelize-cli db:migrate

# Ejecutar seeders para datos iniciales
npx sequelize-cli db:seed:all

# Iniciar la aplicación con PM2
pm2 start src/server.js --name "ong-backend"
pm2 save
pm2 startup
```

## Despliegue del Frontend

### 1. Preparación del Servidor

Si está utilizando el mismo servidor para frontend y backend, puede omitir los pasos de instalación de dependencias básicas.

```bash
# Instalar Nginx
sudo apt install -y nginx

# Iniciar y habilitar el servicio
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Despliegue del Código Frontend

```bash
# Clonar el repositorio
git clone https://github.com/ong/platform-frontend.git
cd platform-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
nano .env
```

Editar el archivo `.env` con la siguiente configuración:

```
REACT_APP_API_URL=https://api.ong.org
REACT_APP_SOCKET_URL=https://api.ong.org
```

```bash
# Construir la aplicación para producción
npm run build

# Copiar archivos a directorio de Nginx
sudo mkdir -p /var/www/ong-platform
sudo cp -r build/* /var/www/ong-platform/
```

### 3. Configuración de Nginx

```bash
# Crear configuración de Nginx
sudo nano /etc/nginx/sites-available/ong-platform
```

Añadir la siguiente configuración:

```nginx
server {
    listen 80;
    server_name ong.org www.ong.org;
    root /var/www/ong-platform;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

```bash
# Habilitar el sitio
sudo ln -s /etc/nginx/sites-available/ong-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Configuración de SSL con Certbot

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d ong.org -d www.ong.org

# Verificar renovación automática
sudo certbot renew --dry-run
```

## Configuración del Proxy Inverso para el Backend

```bash
# Editar configuración de Nginx
sudo nano /etc/nginx/sites-available/ong-platform-api
```

Añadir la siguiente configuración:

```nginx
server {
    listen 80;
    server_name api.ong.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Habilitar el sitio
sudo ln -s /etc/nginx/sites-available/ong-platform-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Obtener certificado SSL para la API
sudo certbot --nginx -d api.ong.org
```

## Verificación del Despliegue

1. Verificar que el backend está funcionando:
   ```bash
   curl https://api.ong.org/api/health
   ```

2. Acceder al frontend a través del navegador:
   ```
   https://ong.org
   ```

3. Verificar los logs del backend:
   ```bash
   pm2 logs ong-backend
   ```

## Mantenimiento

### Actualización del Backend

```bash
cd /ruta/al/backend
git pull
npm install
pm2 restart ong-backend
```

### Actualización del Frontend

```bash
cd /ruta/al/frontend
git pull
npm install
npm run build
sudo cp -r build/* /var/www/ong-platform/
```

### Backup de la Base de Datos

```bash
# Crear backup
sudo -u postgres pg_dump ong_platform > backup_$(date +%Y%m%d).sql

# Restaurar backup
sudo -u postgres psql ong_platform < backup_20250418.sql
```

## Solución de Problemas

### El Backend no Responde

1. Verificar estado de PM2:
   ```bash
   pm2 status
   ```

2. Revisar logs:
   ```bash
   pm2 logs ong-backend
   ```

3. Reiniciar el servicio:
   ```bash
   pm2 restart ong-backend
   ```

### El Frontend Muestra Error de Conexión

1. Verificar que el backend está funcionando
2. Comprobar la configuración de CORS en el backend
3. Verificar la URL de la API en la configuración del frontend

### Problemas con la Base de Datos

1. Verificar estado del servicio:
   ```bash
   sudo systemctl status postgresql
   ```

2. Revisar logs:
   ```bash
   sudo tail -f /var/log/postgresql/postgresql-12-main.log
   ```

3. Reiniciar el servicio:
   ```bash
   sudo systemctl restart postgresql
   ```

## Contacto de Soporte

Para cualquier problema durante el despliegue, contactar a:
- Email: soporte@ong.org
- Teléfono: +56 9 1234 5678
