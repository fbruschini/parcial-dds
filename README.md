# Trabajo Practico DDS - Seguimiento de tareas

Aplicacion full stack para seguimiento de tareas dentro de proyectos. Implementa backend con Node.js + Express y frontend con React + Vite, cumpliendo el dominio del enunciado: usuarios, proyectos, tareas, historial, filtros, permisos, JWT, resumen administrativo y pruebas de API.

## Estructura

```txt
backend/
  src/
    controllers/     Controladores HTTP
    data/            Persistencia JSON y datos semilla
    middleware/      JWT, roles, validaciones y errores
    routes/          Rutas Express Router
    services/        Reglas de negocio del dominio
  tests/             Pruebas Jest + Supertest
frontend/
  src/
    api/             Servicios Axios
    components/      Componentes reutilizables
    context/         AuthContext con sesion persistida
    pages/           Pantallas React Router
```

## Requisitos

- Node.js 20 o superior recomendado.
- npm.

## Instalacion y ejecucion

Instalar dependencias:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Ejecutar backend:

```bash
cd backend
npm run dev
```

El backend queda disponible en `http://localhost:3001/api`.

Ejecutar frontend:

```bash
cd frontend
npm run dev
```

El frontend queda disponible en `http://localhost:5173`.

Si el backend corre en otra URL, crear `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

## Usuarios de prueba

Todos los usuarios semilla usan la contrasena:

```txt
Password123!
```

| Rol | Email |
| --- | --- |
| admin | admin@dds.com |
| lider | lider@dds.com |
| colaborador | mica@dds.com |
| colaborador | juan@dds.com |
| colaborador | sofia@dds.com |

Las contrasenas se guardan con `bcryptjs`. El JWT no incluye password ni hash.

## Endpoints principales

### Autenticacion

- `POST /api/auth/register`
- `POST /api/auth/login`

### Proyectos y usuarios

- `GET /api/proyectos`
- `GET /api/usuarios`

### Tareas

- `GET /api/tareas?proyectoId=&responsableId=&estado=&prioridad=&page=&limit=&sortBy=&order=`
- `GET /api/tareas/resumen`
- `GET /api/tareas/:id`
- `GET /api/tareas/:id/historial`
- `POST /api/tareas`
- `PUT /api/tareas/:id`
- `PATCH /api/tareas/:id/iniciar`
- `PATCH /api/tareas/:id/bloquear`
- `PATCH /api/tareas/:id/cancelar`
- `PATCH /api/tareas/:id/finalizar`

Las rutas protegidas esperan:

```http
Authorization: Bearer <token>
```

## Rutas frontend

- `/login`: inicio de sesion.
- `/registro`: alta de usuario.
- `/tareas`: listado con filtros, paginacion y ordenamiento.
- `/tareas/nueva`: alta de tarea para admin/lider.
- `/tareas/:id`: detalle e historial.
- `/tareas/:id/editar`: edicion.
- `/resumen`: panel administrativo para admin/lider.
- `*`: pagina no encontrada.

## Reglas de dominio

- Una tarea siempre pertenece a un proyecto existente.
- No se puede crear una tarea en un proyecto `pausado` o `finalizado`.
- Un proyecto `pausado` permite consultar y editar tareas existentes segun permisos.
- Un proyecto `finalizado` no permite modificar tareas.
- El responsable debe estar incluido en `integrantes` del proyecto.
- Prioridades permitidas: `baja`, `media`, `alta`, `critica`.
- Estados permitidos: `pendiente`, `en_progreso`, `bloqueada`, `finalizada`, `cancelada`.
- Transiciones permitidas:
  - `pendiente -> en_progreso`
  - `en_progreso -> bloqueada`
  - `en_progreso -> finalizada`
  - `bloqueada -> en_progreso`
  - cualquier tarea no finalizada/cancelada puede ir a `cancelada`
- No se editan tareas `finalizada` o `cancelada`.
- Una tarea vencida es la que tiene `fechaLimite` anterior a la fecha actual y estado distinto de `finalizada` o `cancelada`.
- Cada creacion, edicion, reasignacion, cambio de prioridad, cambio de estado o cancelacion agrega historial.

## Roles y permisos

- `colaborador`:
  - Puede ver sus tareas asignadas.
  - Puede editar descripcion de sus tareas.
  - Puede pasar sus tareas a `en_progreso` o `bloqueada` si la transicion es valida.
- `lider` y `admin`:
  - Pueden ver todas las tareas.
  - Pueden crear tareas.
  - Pueden reasignar responsables, cambiar prioridad, editar datos, finalizar o cancelar.
  - Pueden acceder al resumen administrativo.

El backend valida permisos aunque el frontend oculte acciones.

## Persistencia y semilla

La persistencia usa archivo JSON local. Al iniciar el backend, si `backend/src/data/database.json` no existe, se crea automaticamente con:

- 5 usuarios.
- 4 proyectos.
- 15 tareas en distintos estados.
- Historial inicial.

El archivo generado esta ignorado por Git para evitar subir cambios de datos locales.

## Pruebas

Ejecutar pruebas del backend:

```bash
cd backend
npm test
```

Las pruebas cubren:

- Login correcto e invalido.
- Listado de tareas con y sin filtros.
- Detalle existente e inexistente.
- Creacion valida.
- Responsable fuera del proyecto.
- Prioridad y estado invalidos.
- Acceso sin JWT.
- Acceso con colaborador a accion solo admin/lider.
- Proyecto pausado o finalizado.
- Transicion de estado no permitida.

## Limitaciones conocidas

- La persistencia JSON es suficiente para el alcance academico, pero no maneja concurrencia real como una base transaccional.
- El registro permite seleccionar rol desde la pantalla para facilitar pruebas del TP; en una aplicacion productiva esa asignacion deberia quedar limitada a administradores.
- No se incluyen tests de frontend porque el requisito minimo exige pruebas del backend.
