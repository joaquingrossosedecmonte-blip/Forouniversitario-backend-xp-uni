# Foro Universitario - Backend XP

Backend del **Foro Universitario** desarrollado como trabajo práctico para aplicar prácticas de **Programación Extrema (XP)**.

El proyecto implementa una **API REST con TypeScript y Express**, incorporando **BDD con Cucumber**, desarrollo guiado por pruebas, refactorización, diseño simple e integración continua mediante GitHub Actions.

## Tecnologías

- Node.js
- TypeScript
- Express
- Cucumber
- Supertest
- bcrypt
- JSON Web Token (JWT)
- Prisma
- ESLint
- GitHub Actions

## Arquitectura

El proyecto utiliza una separación por responsabilidades entre rutas, controladores, servicios y repositorios.

```text
src/
├── controllers/
├── errors/
├── repositories/
│   ├── interfaces/
│   └── memory/
├── routes/
│   └── v1/
├── services/
├── app.ts
└── server.ts

features/
└── *.feature

tests/
└── step_definitions/
    └── *.steps.ts
```

Actualmente, las funcionalidades implementadas utilizan repositorios en memoria. Prisma forma parte de la configuración del proyecto y queda preparado para trabajar con persistencia mediante base de datos.

## Historias de Usuario

El proyecto implementa las siguientes historias funcionales:

- **HU-01:** Registro de usuario.
- **HU-02:** Inicio de sesión.
- **HU-03:** Crear publicación.
- **HU-04:** Comentar una publicación.
- **HU-05:** Votar una publicación.
- **HU-06:** Reportar una publicación.
- **HU-07:** Eliminar una publicación reportada como administrador.

También se implementaron historias técnicas:

- **HT-01:** Almacenamiento seguro de contraseñas mediante hashing.
- **HT-02:** Integración continua para automatizar las validaciones del proyecto.

## Prácticas de Programación Extrema

Durante el desarrollo se aplicaron diferentes prácticas y principios de XP.

### BDD

Cada funcionalidad se describe mediante archivos `.feature` utilizando Cucumber.

Los escenarios incluyen casos exitosos y casos de error para verificar el comportamiento esperado de cada funcionalidad.

### TDD

El desarrollo sigue el ciclo:

```text
RED → GREEN → REFACTOR
```

Primero se define el comportamiento esperado mediante las pruebas. Luego se implementa la funcionalidad mínima necesaria para hacerlas pasar y finalmente se refactoriza el código manteniendo el comportamiento esperado.

### Diseño simple

Se implementa solamente la lógica necesaria para cumplir las historias de usuario, evitando agregar funcionalidades que todavía no son requeridas.

### Refactorización

Después de obtener pruebas exitosas se realizan mejoras en la estructura y organización del código sin modificar el comportamiento esperado.

### Integración continua

GitHub Actions ejecuta automáticamente las principales validaciones del proyecto:

```text
npm ci
   ↓
npm run lint
   ↓
npm run build
   ↓
npm run test:e2e
```

El workflow se ejecuta ante cambios en la rama `main` y ante Pull Requests dirigidos hacia `main`.

## Requisitos

Para ejecutar el proyecto se necesita tener instalado:

- Node.js 22 o superior.
- npm.

## Instalación

Clonar el repositorio y acceder a la carpeta del proyecto:

```bash
git clone <URL_DEL_REPOSITORIO>
cd Forouniversitario-backend-xp-uni
```

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Las variables utilizadas incluyen la configuración del puerto y el secreto utilizado para generar los tokens JWT.

Ejemplo:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=secreto-desarrollo
```

> El archivo `.env` no debe subirse al repositorio.

## Ejecutar el servidor

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor utiliza el puerto `3000` por defecto.

## Pruebas BDD

Para ejecutar los escenarios de Cucumber:

```bash
npm run test:e2e
```

Las pruebas BDD verifican las funcionalidades implementadas mediante los escenarios definidos en la carpeta `features/`.

Resultado actual:

```text
21 scenarios (21 passed)
84 steps (84 passed)
```

## Verificar TypeScript

Para comprobar los tipos sin generar los archivos compilados:

```bash
npm run typecheck
```

## Compilar el proyecto

Para realizar la compilación de TypeScript:

```bash
npm run build
```

## Ejecutar ESLint

Para comprobar la calidad y las reglas de estilo del código:

```bash
npm run lint
```

## Estado actual del proyecto

Actualmente, las pruebas BDD se encuentran en estado satisfactorio:

```text
21 scenarios (21 passed)
84 steps (84 passed)
```

Además, el proyecto pasa correctamente las siguientes validaciones:

```bash
npm run lint
npm run build
npm run test:e2e
```

## Integración continua

El proyecto cuenta con un workflow de GitHub Actions ubicado en:

```text
.github/workflows/main.yml
```

El pipeline instala las dependencias y ejecuta automáticamente:

1. ESLint para verificar el código.
2. Compilación de TypeScript.
3. Pruebas BDD con Cucumber.

De esta manera, cada cambio enviado al repositorio puede ser validado automáticamente.

## Decisiones de diseño

Durante el desarrollo se buscó mantener una estructura simple y separada por responsabilidades.

Las principales decisiones fueron:

- Separar **rutas, controladores, servicios y repositorios**.
- Utilizar repositorios en memoria para mantener una implementación sencilla durante las primeras iteraciones.
- Utilizar **bcrypt** para almacenar las contraseñas mediante hashing.
- Utilizar **JWT** para la autenticación.
- Implementar las funcionalidades de forma incremental a partir de las historias de usuario.
- Utilizar Cucumber para describir y validar el comportamiento mediante BDD.
- Aplicar el ciclo **RED → GREEN → REFACTOR** durante el desarrollo.
- Incorporar GitHub Actions para automatizar las validaciones del proyecto.