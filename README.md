# NOVA LANEY
### Plataforma de gestión y análisis de operaciones de trading

## 1. Descripción del proyecto

NOVA LANEY es una plataforma en desarrollo orientada a la gestión, registro y análisis de operaciones de trading. Su propósito es proporcionar herramientas para llevar un diario de operaciones, calcular resultados, administrar el riesgo y consultar estadísticas del desempeño.

El proyecto contempla una futura integración con el broker Exness y la plataforma MetaTrader 5.

## 2. Objetivo general

Desarrollar una plataforma modular que permita registrar y analizar operaciones de trading, calcular indicadores de rendimiento y apoyar la gestión del riesgo mediante herramientas digitales.

## 3. Objetivos específicos

- Registrar operaciones de compra y venta.
- Gestionar instrumentos financieros como EUR/USD, GBP/USD, USD/JPY y XAU/USD.
- Calcular ganancias, pérdidas y resultados netos.
- Consultar estadísticas e historial de operaciones.
- Incorporar herramientas de gestión del riesgo.
- Preparar una arquitectura que permita futuras integraciones con plataformas externas.

## 4. Funcionalidades implementadas

- Panel principal o Dashboard.
- Diario manual de operaciones.
- Registro de instrumentos financieros.
- Calculadora de riesgo.
- Consulta de estadísticas.
- Historial de operaciones.
- Configuración de cuenta.
- Backend desarrollado con FastAPI.
- API para consultar el estado del sistema y los instrumentos disponibles.
- Comunicación entre frontend y backend.

## 5. Tecnologías utilizadas

| Tecnología | Aplicación |
|---|---|
| TypeScript | Desarrollo del frontend |
| HTML5 | Estructura de la interfaz |
| CSS3 | Diseño visual y estilos |
| Vite | Herramienta de desarrollo y compilación |
| Python | Desarrollo del backend |
| FastAPI | Construcción de servicios API |
| Uvicorn | Servidor de desarrollo |
| Git | Control de versiones |
| GitHub | Almacenamiento y publicación del código |

## 6. Arquitectura del proyecto

El sistema utiliza una arquitectura separada en dos componentes principales:

**Frontend:** desarrollado con TypeScript, HTML y CSS. Gestiona la interfaz, los formularios, los cálculos y la interacción del usuario.

**Backend:** desarrollado con Python y FastAPI. Proporciona servicios para consultar el estado del sistema y los instrumentos disponibles.

## 7. Estructura de carpetas

```text
NOVA-LANEY/
│
├── backend/
│   ├── __init__.py
│   └── main.py
│
├── public/
│
├── src/
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── types.ts
│   ├── main.ts
│   └── style.css
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── .gitignore
```

## 8. Instalación y ejecución

### Requisitos

- Node.js y npm.
- Python 3.
- Git.

### Instalar dependencias del frontend

Desde la carpeta principal del proyecto:

```bash
npm install
```

### Ejecutar el frontend

```bash
npm run dev
```

Abrir en el navegador:

```text
http://localhost:5173/
```

### Preparar el backend

Crear y activar un entorno virtual:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Instalar dependencias:

```powershell
pip install fastapi uvicorn
```

Ejecutar el servidor:

```powershell
python -m uvicorn backend.main:app --reload
```

El backend estará disponible en:

```text
http://127.0.0.1:8000
```

Documentación interactiva de la API:

```text
http://127.0.0.1:8000/docs
```

### Compilar el frontend

```bash
npm run build
```

## 9. Estado actual del proyecto

NOVA LANEY cuenta con una interfaz funcional, un diario manual de operaciones y un backend conectado mediante servicios API.

La conexión actual con el backend permite consultar el estado del sistema y los instrumentos disponibles.

La integración real con Exness y MetaTrader 5, la ejecución automática de operaciones y el funcionamiento continuo mediante VPS son desarrollos futuros y no se consideran funcionalidades terminadas.

## 10. Mejoras futuras

- Integración con MetaTrader 5.
- Conexión con la cuenta de trading de Exness.
- Obtención de datos de mercado en tiempo real.
- Automatización de estrategias.
- Implementación de controles de riesgo antes de ejecutar operaciones.
- Pruebas en cuenta demo.
- Despliegue en un servidor VPS.
- Mejoras en los reportes y análisis estadísticos.

## 11. Control de versiones

El proyecto utiliza Git para el control de versiones y GitHub para alojar el repositorio y registrar los avances del desarrollo.

Repositorio:

https://github.com/Maia1-1/NOVA-LANEY

---

**NOVA LANEY — Proyecto académico de desarrollo de software.**