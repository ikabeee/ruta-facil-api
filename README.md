# Ruta fácil API

## Estructura del Proyecto

```
├── src/                    # Código fuente de la aplicación
│   ├── app.ts             # Configuración de la aplicación Express
│   ├── index.ts           # Punto de entrada de la aplicación
│   ├── common/            # Código compartido y utilidades comunes
│   │   ├── config/        # Configuraciones de la aplicación
│   │   ├── constants/     # Constantes globales
│   │   ├── interfaces/    # Interfaces compartidas
│   │   └── middlewares/   # Middlewares de Express
│   │
│   ├── docs/              # Documentación de la API
│   │   └── swagger.ts     # Configuración de Swagger
│   │
│   ├── errors/           # Manejo de errores personalizado
│   │
│   ├── modules/          # Módulos de la aplicación
│   │   ├── auth/         # Módulo de autenticación
│   │   │   ├── controllers/
│   │   │   ├── interfaces/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   │
│   │   └── users/        # Módulo de usuarios
│   │       ├── controllers/
│   │       ├── interfaces/
│   │       ├── repositories/
│   │       ├── routes/
│   │       └── services/
│   │
│   └── utils/            # Utilidades generales
│       └── seeds/        # Scripts para poblar la base de datos
│
├── docker-compose.yaml    # Configuración de Docker
├── package.json          # Dependencias y scripts
├── pnpm-lock.yaml        # Lock file de pnpm
├── tsconfig.json         # Configuración de TypeScript
└── README.md            # Documentación principal
```

## Descripción de la Estructura

- `/src`: Contiene todo el código fuente de la aplicación
  - `/common`: Código compartido entre módulos
    - `/config`: Archivos de configuración
    - `/constants`: Definición de constantes globales
    - `/interfaces`: Interfaces TypeScript compartidas
    - `/middlewares`: Middlewares de Express
  
  - `/docs`: Documentación de la API
    - `swagger.ts`: Configuración y definiciones de Swagger

  - `/errors`: Manejo centralizado de errores

  - `/modules`: Módulos principales de la aplicación, cada uno con su propia estructura:
    - `/controllers`: Controladores que manejan las peticiones HTTP
    - `/interfaces`: Definición de tipos e interfaces
    - `/routes`: Definición de rutas
    - `/services`: Lógica de negocio
    - `/repositories`: Capa de acceso a datos (en módulos que lo requieran)

  - `/utils`: Utilidades y helpers
    - `/seeds`: Scripts para inicialización de datos

- Archivos en la raíz:
  - `docker-compose.yaml`: Configuración de contenedores Docker
  - `package.json`: Gestión de dependencias y scripts
  - `tsconfig.json`: Configuración de TypeScript
  - `README.md`: Documentación general del proyecto
