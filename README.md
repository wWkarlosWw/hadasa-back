# Contexto del Proyecto: Plataforma Multi-Donaciones Hadassa

### 1. ¿Cuál es el propósito moral/de la aplicación?

- **Propósito Moral:** Fundamentado en principios cristianos (amor, fe, compasión y justicia), busca la restauración espiritual e integral de poblaciones en alto estado de vulnerabilidad, enfocándose en sanar y transformar las vidas de mujeres y niños para que florezcan en propósito e identidad.
- **Propósito de la Aplicación:** Ser un ecosistema digital que centraliza la solidaridad. Actúa como una plataforma multi-donaciones que no solo facilita el aporte de recursos, sino que incentiva y fideliza la participación ciudadana a través de un sistema gamificado (obtención de puntos canjeables por descuentos o premios al donar y participar en actividades).

### 2. ¿A quién está dirigida?

La plataforma conecta a tres sectores fundamentales:

- **Usuarios (Donantes y Voluntarios):** Personas con vocación de servicio que desean aportar financieramente o participar en actividades, obteniendo a cambio beneficios tangibles por su generosidad.
- **Organizaciones y Colaboradores:** La Fundación Hadassa (como gestora de proyectos como "Casa de Fruto" y organizadora de eventos) y las empresas aliadas que proporcionan los descuentos y premios.
- **Beneficiarios Finales:** Mujeres y niños en situación de vulnerabilidad (ej. hijos de mujeres recluidas en el Centro de Orientación Femenina de Obrajes en La Paz) que reciben apoyo escolar, médico, dental y desarrollo integral.

### 3. ¿Qué problema resuelve?

- **Falta de retención y recurrencia en donantes:** Resuelve la caída de interés en la ayuda social al ofrecer un sistema de puntos y recompensas que estimula a los usuarios a donar y participar en eventos de manera continua.
- **Descentralización de la gestión social:** Unifica en un solo entorno digital la recaudación de fondos, la inscripción a actividades, la publicación de noticias y la cartelera de eventos, optimizando la administración de la fundación.
- **Sostenibilidad de los programas de ayuda:** Garantiza un flujo más constante de recursos e interacción para sostener proyectos vitales (educación, salud y apoyo espiritual), generando un impacto positivo a largo plazo en la sociedad.

# Hadassa Backend

API REST desarrollada con NestJS y Prisma para gestionar una plataforma de apoyo social.

## Tecnologías

- **NestJS** - Framework backend
- **Prisma** - ORM para MongoDB
- **MongoDB** - Base de datos

<!-- mas adelante multi db -->

## Requisitos

- Node.js 18+
- MongoDB (local o Atlas)
- npm

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar base de datos

Editar `.env` con la URI de MongoDB:

```
DATABASE_URL="mongodb://localhost:27017/hadassa"
```

### 3. Generar cliente Prisma

```bash
npx prisma generate
```

### 4. Sincronizar base de datos

```bash
npx prisma db push
```

## Ejecutar

### Desarrollo

```bash
npm run start:dev
```

### Producción

```bash
npm run build
npm run start:prod
```

## Modelos de Datos

### User

| Campo     | Tipo     | Descripción             |
| --------- | -------- | ----------------------- |
| id        | String   | ID único (ObjectId)     |
| ci        | String   | Carnet de identidad     |
| name      | String   | Nombre completo         |
| email     | String   | Correo electrónico      |
| password  | String   | Contraseña              |
| role      | Enum     | USER, ADMIN, SUPERVISOR |
| phone     | String   | Teléfono                |
| address   | String   | Dirección               |
| isActive  | Boolean  | Estado activo           |
| createdAt | DateTime | Fecha de creación       |

### Organization

| Campo     | Tipo     | Descripción                |
| --------- | -------- | -------------------------- |
| id        | String   | ID único (ObjectId)        |
| name      | String   | Nombre                     |
| email     | String   | Correo electrónico         |
| password  | String   | Contraseña                 |
| type      | Enum     | CHARITY, NGO, COLLABORATOR |
| address   | String   | Dirección                  |
| isActive  | Boolean  | Estado activo              |
| createdAt | DateTime | Fecha de creación          |

### Event

| Campo          | Tipo     | Descripción               |
| -------------- | -------- | ------------------------- |
| id             | String   | ID único (ObjectId)       |
| name           | String   | Nombre del evento         |
| description    | String   | Descripción               |
| date           | DateTime | Fecha del evento          |
| isActive       | Boolean  | Estado activo             |
| organizationId | String   | Referencia a Organization |

### Discounts

| Campo          | Tipo   | Descripción               |
| -------------- | ------ | ------------------------- |
| id             | String | ID único (ObjectId)       |
| code           | String | Código de descuento       |
| discount       | Float  | Porcentaje de descuento   |
| organizationId | String | Referencia a Organization |

## Estructura del Proyecto

```
src/
├── main.ts              # Punto de entrada
├── app.module.ts       # Módulo principal
├── app.controller.ts   # Controlador raíz
├── app.service.ts      # Servicio raíz
└── user/
    ├── user.module.ts
    ├── user.controller.ts
    ├── user.service.ts
    ├── user.controller.spec.ts
    ├── user.service.spec.ts
    ├── dto/
    │   ├── create-user.dto.ts
    │   └── update-user.dto.ts
    └── entities/
        └── user.entity.ts
```

## Scripts Disponibles

| Comando             | Descripción                |
| ------------------- | -------------------------- |
| `npm run start`     | Iniciar servidor           |
| `npm run start:dev` | Iniciar en modo desarrollo |
| `npm run build`     | Compilar para producción   |
| `npm run lint`      | Verificar código           |
| `npm run test`      | Ejecutar pruebas           |

## Puerto

El servidor corre en el puerto `3000` por defecto. Para cambiar:

```bash
PORT=4000 npm run start
```
