# PrepApp — Frontend

Interfaz de usuario desarrollada con React para la aplicación PrepApp, una plataforma de organización de apuntes con inteligencia artificial.

## Tecnologías

- React 18
- Vite
- React Router DOM
- Axios

## Funcionalidades

- Inicio de sesión y registro de usuarios
- Dashboard con sidebar de carpetas
- Crear, visualizar y eliminar carpetas
- Crear, visualizar y eliminar bloques de apuntes
- Autenticación con JWT — token guardado en localStorage
- Comunicación con el backend via API REST

## Estructura del proyecto
src/
├── pages/          # Vistas principales (Login, Register, Dashboard)
├── components/     # Componentes reutilizables
└── services/       # Comunicación con la API (auth, folders, blocks)

## Configuración

1. Clona el repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Asegúrate de que el backend esté corriendo en `http://localhost:8080`
4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

5. Abre el navegador en `http://localhost:5173`

## Backend

El backend de esta aplicación está disponible en [prepapp](https://github.com/ApontexX/prepapp)