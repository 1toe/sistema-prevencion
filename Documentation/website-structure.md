# Estructura del Sitio Web para la Plataforma de la ONG

## Arquitectura del Sistema

### Arquitectura General
La plataforma se desarrollará utilizando una arquitectura de tres capas:

1. **Capa de Presentación (Frontend)**
   - Interfaz de usuario web responsive
   - Componentes de UI para diferentes funcionalidades
   - Sistema de autenticación del lado del cliente

2. **Capa de Lógica de Negocio (Backend)**
   - API RESTful para comunicación con el frontend
   - Servicios para gestión de agendamiento, usuarios, fichas clínicas, etc.
   - Lógica de validación y reglas de negocio

3. **Capa de Datos**
   - Base de datos relacional para almacenamiento persistente
   - Caché para optimización de rendimiento
   - Integración con servicios externos (Google Calendar, Google Sheets)

### Tecnologías Propuestas

**Frontend:**
- React.js para desarrollo de componentes de UI
- Redux para gestión de estado
- Material-UI o Bootstrap para diseño responsive
- FullCalendar para implementación del calendario
- Socket.io (cliente) para chat en tiempo real

**Backend:**
- Node.js con Express para API RESTful
- Passport.js para autenticación
- Sequelize como ORM para acceso a base de datos
- Socket.io (servidor) para comunicación en tiempo real
- Nodemailer para envío de notificaciones por correo

**Base de Datos:**
- PostgreSQL para almacenamiento principal
- Redis para caché y sesiones

## Estructura de Páginas

### Área Pública
1. **Página de Inicio**
   - Información general de la ONG
   - Acceso a agendamiento
   - Botón de emergencia
   - Información de contacto

2. **Agendamiento de Servicios**
   - Selección de servicio
   - Selección de profesional
   - Calendario de disponibilidad
   - Formulario de datos personales
   - Confirmación de reserva

3. **Información de Servicios**
   - Descripción detallada de cada servicio
   - Requisitos y consideraciones

4. **Preguntas Frecuentes**
   - Información sobre procesos de atención
   - Políticas de cancelación

### Área Privada (Requiere Autenticación)

5. **Panel de Usuario (Paciente)**
   - Historial de citas
   - Próximas citas
   - Opción para cancelar o reprogramar

6. **Panel de Profesional**
   - Agenda diaria
   - Acceso a fichas clínicas de pacientes asignados
   - Formulario de registro de atención

7. **Ficha Clínica Electrónica**
   - Datos personales del paciente
   - Historial de atenciones
   - Formulario de registro de nueva atención
   - Sección de evolución y seguimiento

8. **Panel de Administración**
   - Gestión de usuarios y roles
   - Configuración de servicios y horarios
   - Control de stock de tests de VIH
   - Reportes y estadísticas
   - Configuración de sistema

9. **Chat de Emergencia**
   - Interfaz de chat en tiempo real
   - Notificaciones para personal de turno

## Estructura de la Base de Datos

### Entidades Principales

1. **Usuarios**
   - ID
   - Nombre
   - Apellido
   - Email
   - Contraseña (hash)
   - Rol (admin, profesional, paciente)
   - Estado (activo, inactivo)
   - Fecha de creación
   - Última actualización

2. **Roles y Permisos**
   - ID
   - Nombre
   - Descripción
   - Permisos asociados

3. **Profesionales** (extiende de Usuarios)
   - Especialidad
   - Horario de atención
   - Servicios que ofrece
   - Estado (disponible, no disponible)

4. **Pacientes** (extiende de Usuarios)
   - RUT/DNI
   - Fecha de nacimiento
   - Dirección
   - Teléfono
   - Contacto de emergencia

5. **Servicios**
   - ID
   - Nombre
   - Descripción
   - Duración estándar
   - Reglas específicas (JSON)
   - Días disponibles
   - Requiere stock (boolean)

6. **Citas**
   - ID
   - ID Paciente
   - ID Profesional
   - ID Servicio
   - Fecha y hora
   - Estado (agendada, confirmada, completada, cancelada)
   - Notas
   - Fecha de creación
   - Última actualización

7. **Fichas Clínicas**
   - ID
   - ID Paciente
   - Fecha de creación
   - Última actualización

8. **Registros de Atención**
   - ID
   - ID Ficha Clínica
   - ID Profesional
   - ID Cita
   - Fecha de atención
   - Motivo de consulta
   - Anamnesis
   - Intervención realizada
   - Evolución
   - Diagnóstico
   - Próximos pasos

9. **Stock de Tests**
   - ID
   - Cantidad total mensual
   - Cantidad utilizada
   - Mes y año
   - Última actualización

10. **Notificaciones**
    - ID
    - ID Usuario destinatario
    - Tipo (email, sistema)
    - Contenido
    - Estado (enviada, leída)
    - Fecha de creación

11. **Mensajes de Emergencia**
    - ID
    - ID Usuario emisor
    - ID Usuario receptor
    - Contenido
    - Estado (enviado, leído, respondido)
    - Fecha y hora
    - Prioridad

## Flujos de Datos

### Flujo de Agendamiento
1. Usuario selecciona servicio → Sistema consulta disponibilidad
2. Usuario selecciona profesional → Sistema filtra fechas disponibles
3. Usuario selecciona fecha y hora → Sistema verifica stock y reglas
4. Usuario completa datos → Sistema crea cita
5. Sistema envía confirmación → Actualiza Google Calendar y Sheets

### Flujo de Atención
1. Profesional consulta agenda → Sistema muestra citas del día
2. Profesional selecciona paciente → Sistema carga ficha clínica
3. Profesional registra atención → Sistema actualiza ficha
4. Sistema notifica próxima cita si es necesario

### Flujo de Emergencia
1. Usuario activa botón de emergencia → Sistema notifica a personal de turno
2. Personal responde → Sistema establece chat en tiempo real
3. Sistema registra la conversación para seguimiento

## Consideraciones de Seguridad

1. **Autenticación**
   - JWT (JSON Web Tokens) para gestión de sesiones
   - Contraseñas hasheadas con bcrypt
   - Autenticación de dos factores para roles administrativos

2. **Autorización**
   - Control de acceso basado en roles (RBAC)
   - Middleware de verificación de permisos en cada endpoint

3. **Protección de Datos**
   - Cifrado de datos sensibles en la base de datos
   - HTTPS para todas las comunicaciones
   - Sanitización de inputs para prevenir inyecciones SQL y XSS

4. **Auditoría**
   - Registro de acciones críticas (login, acceso a fichas, modificaciones)
   - Trazabilidad de cambios en fichas clínicas

## Integraciones Externas

1. **Google Calendar**
   - Sincronización bidireccional de citas
   - Actualización automática ante cambios

2. **Google Sheets**
   - Registro de citas para reportes y seguimiento
   - Actualización automática

3. **Servicio de Email**
   - Envío de confirmaciones
   - Recordatorios de citas
   - Alertas de sistema

4. **WhatsApp Business API** (opcional)
   - Notificaciones y recordatorios
   - Confirmaciones de citas
