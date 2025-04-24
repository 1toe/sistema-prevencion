# Documentación Técnica - Plataforma Web ONG

## Descripción General

Esta documentación describe la arquitectura, componentes y funcionamiento técnico de la plataforma web desarrollada para la ONG, destinada a la gestión de agendamiento de citas y fichas clínicas electrónicas.

## Arquitectura del Sistema

La plataforma está desarrollada siguiendo una arquitectura de tres capas:

1. **Frontend**: Desarrollado con React.js, Redux para gestión de estado y Material-UI para la interfaz de usuario.
2. **Backend**: API RESTful desarrollada con Node.js, Express y Sequelize ORM.
3. **Base de Datos**: PostgreSQL para almacenamiento persistente de datos.

### Diagrama de Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │◄───►│     Backend     │◄───►│   Base de Datos │
│    (React.js)   │     │  (Node.js/Express) │     │   (PostgreSQL)  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Tecnologías Utilizadas

### Frontend
- **React.js**: Biblioteca para construir interfaces de usuario
- **Redux**: Para gestión del estado de la aplicación
- **Material-UI**: Framework de componentes UI
- **React Router**: Para navegación entre páginas
- **Axios**: Cliente HTTP para comunicación con el backend
- **FullCalendar**: Para implementación del calendario de disponibilidad
- **Formik y Yup**: Para manejo y validación de formularios
- **Socket.io-client**: Para comunicación en tiempo real (chat de emergencia)

### Backend
- **Node.js**: Entorno de ejecución para JavaScript
- **Express**: Framework web para Node.js
- **Sequelize**: ORM para interactuar con la base de datos
- **PostgreSQL**: Sistema de gestión de base de datos relacional
- **JWT (jsonwebtoken)**: Para autenticación basada en tokens
- **bcryptjs**: Para cifrado de contraseñas
- **Socket.io**: Para comunicación en tiempo real
- **Nodemailer**: Para envío de notificaciones por correo electrónico

## Estructura de la Base de Datos

La base de datos está compuesta por las siguientes entidades principales:

1. **Users**: Almacena información de todos los usuarios del sistema
2. **Roles**: Define los roles y permisos en el sistema
3. **Professionals**: Información específica de los profesionales
4. **Patients**: Información específica de los pacientes
5. **Services**: Servicios ofrecidos por la ONG
6. **Appointments**: Citas agendadas
7. **ClinicalRecords**: Fichas clínicas de los pacientes
8. **AttentionRecords**: Registros de atención dentro de las fichas clínicas
9. **HIVTestStock**: Control de stock de tests de VIH
10. **Notifications**: Notificaciones del sistema
11. **EmergencyMessages**: Mensajes del chat de emergencia

### Diagrama de Relaciones

Las principales relaciones entre entidades son:

- User tiene un Role
- User puede tener un Professional o un Patient
- Professional puede tener muchos Services
- Patient puede tener muchas Appointments
- Patient tiene una ClinicalRecord
- ClinicalRecord tiene muchos AttentionRecords
- Professional tiene muchas Appointments
- Service tiene muchas Appointments

## API RESTful

El backend expone una API RESTful con los siguientes endpoints principales:

### Autenticación
- `POST /api/auth/register`: Registro de nuevos usuarios
- `POST /api/auth/login`: Inicio de sesión
- `GET /api/auth/verify`: Verificación de token JWT
- `POST /api/auth/forgot-password`: Solicitud de recuperación de contraseña
- `POST /api/auth/reset-password`: Restablecimiento de contraseña

### Citas
- `GET /api/appointments/available-slots`: Obtener franjas horarias disponibles
- `POST /api/appointments`: Crear nueva cita
- `GET /api/appointments/user/:userId`: Obtener citas de un usuario
- `GET /api/appointments/professional/:professionalId`: Obtener citas de un profesional
- `PUT /api/appointments/:appointmentId/cancel`: Cancelar cita
- `PUT /api/appointments/:appointmentId/confirm`: Confirmar asistencia
- `PUT /api/appointments/:appointmentId/reschedule`: Reprogramar cita

### Fichas Clínicas
- `GET /api/clinical-records/patient/:patientId`: Obtener ficha clínica de un paciente
- `POST /api/clinical-records`: Crear ficha clínica
- `GET /api/clinical-records/:clinicalRecordId/attention-records`: Obtener registros de atención
- `POST /api/clinical-records/:clinicalRecordId/attention-records`: Crear registro de atención
- `PUT /api/clinical-records/attention-records/:attentionRecordId`: Actualizar registro de atención

### Stock de Tests
- `GET /api/stock/hiv-tests`: Obtener stock actual
- `PUT /api/stock/hiv-tests`: Actualizar stock
- `POST /api/stock/hiv-tests/usage`: Registrar uso de test
- `GET /api/stock/hiv-tests/history`: Obtener historial de uso
- `GET /api/stock/hiv-tests/availability`: Verificar disponibilidad

## Seguridad

La aplicación implementa las siguientes medidas de seguridad:

1. **Autenticación**: Basada en JWT (JSON Web Tokens)
2. **Autorización**: Control de acceso basado en roles (RBAC)
3. **Protección de datos sensibles**: 
   - Contraseñas hasheadas con bcrypt
   - Datos sensibles cifrados en la base de datos
   - HTTPS para todas las comunicaciones
4. **Validación de entradas**: Para prevenir inyecciones SQL y XSS
5. **Auditoría**: Registro de acciones críticas (login, acceso a fichas, modificaciones)

## Integraciones Externas

La plataforma se integra con los siguientes servicios externos:

1. **Google Calendar**: Para sincronización de citas
2. **Google Sheets**: Para registro y seguimiento de citas
3. **Servicio de Email**: Para envío de notificaciones y recordatorios

## Despliegue

### Requisitos del Sistema
- Node.js v14 o superior
- PostgreSQL 12 o superior
- NPM 6 o superior

### Pasos para el Despliegue

#### Backend
1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno en un archivo `.env`
4. Inicializar la base de datos: `npx sequelize-cli db:migrate`
5. Iniciar el servidor: `npm start`

#### Frontend
1. Navegar al directorio del frontend
2. Instalar dependencias: `npm install`
3. Configurar la URL del backend en `.env`
4. Construir la aplicación: `npm run build`
5. Desplegar los archivos estáticos en un servidor web

## Mantenimiento y Escalabilidad

La arquitectura del sistema está diseñada para facilitar el mantenimiento y permitir la escalabilidad:

1. **Código modular**: Separación clara de responsabilidades
2. **Pruebas automatizadas**: Cobertura de pruebas unitarias para componentes críticos
3. **Documentación**: Código documentado y documentación técnica actualizada
4. **Escalabilidad horizontal**: Posibilidad de escalar horizontalmente el backend
5. **Monitoreo**: Implementación de logs para facilitar la detección y resolución de problemas
