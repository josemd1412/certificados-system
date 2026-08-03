# Frontend - Sistema de Gestión de Certificados

Frontend desarrollado con React + TypeScript + Vite para el sistema de gestión de certificados.

## Características

- 🔍 **Búsqueda Avanzada**: Buscar certificados por código, DNI, curso o rango de fechas
- 📄 **Visualización**: Vista previa de certificados en formato PDF
- 📥 **Descarga Múltiple**: Seleccionar y descargar múltiples certificados a la vez
- 📱 **Responsive**: Diseño adaptable a dispositivos móviles y tablets
- 🎨 **UI Moderna**: Interfaz limpia y profesional

## Tecnologías

- React 19
- TypeScript 6
- Vite 8
- Axios (para peticiones HTTP)

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── FiltrosBusqueda.tsx
│   ├── TarjetaCertificado.tsx
│   ├── VisorPDF.tsx
│   └── DescargaMasiva.tsx
├── services/           # Servicios API
│   └── certificadoApi.ts
├── hooks/              # Custom Hooks
│   └── useCertificados.ts
├── types/              # Tipos TypeScript
│   └── certificado.ts
├── App.tsx             # Componente principal
├── App.css             # Estilos principales
└── main.tsx            # Punto de entrada
```

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Editar `.env` y configurar la URL del backend:
```env
VITE_API_URL=http://localhost:3001/api
```

## Comandos Disponibles

### Modo Desarrollo
```bash
npm run dev
```
Inicia el servidor de desarrollo en `http://localhost:5173`

### Build para Producción
```bash
npm run build
```
Genera los archivos optimizados en la carpeta `dist/`

### Vista Previa de Producción
```bash
npm run preview
```
Previsualiza el build de producción localmente

### Linting
```bash
npm run lint
```
Ejecuta ESLint para verificar el código

## Componentes Principales

### FiltrosBusqueda
Componente de formulario para buscar certificados con múltiples filtros:
- Código de certificado
- DNI del alumno
- Nombre del curso
- Rango de fechas

### TarjetaCertificado
Tarjeta que muestra la información de un certificado:
- Nombre del curso
- Información del alumno
- Fecha de emisión
- Botón de descarga
- Checkbox para selección múltiple

### VisorPDF
Modal que permite previsualizar certificados en formato PDF directamente desde Google Drive.

### DescargaMasiva
Componente que gestiona la selección y descarga de múltiples certificados:
- Selección individual
- Seleccionar/deseleccionar todos
- Descarga múltiple

## Servicios API

El archivo `certificadoApi.ts` proporciona las siguientes funciones:

- `buscarCertificados(filtros)`: Buscar certificados con filtros
- `obtenerPorCodigo(codigo)`: Obtener un certificado específico
- `obtenerPorRangoFechas(inicio, fin)`: Obtener certificados por rango de fechas

## Estilos

Los estilos están organizados en:
- `index.css`: Estilos base globales
- `App.css`: Estilos de componentes y layout

Se utilizan variables CSS para mantener consistencia en:
- Colores
- Espaciado
- Bordes
- Sombras
- Transiciones

## Responsive Design

La aplicación es completamente responsive con breakpoints en:
- 768px (tablets)
- 480px (móviles)

## Conectar con el Backend

Asegúrate de que el backend esté corriendo en `http://localhost:3001` (o la URL configurada en `.env`).

El backend debe tener los siguientes endpoints:
- `GET /api/certificados/buscar?params`
- `GET /api/certificados/:codigo`
- `GET /api/certificados/masivo?fechaInicio&fechaFin`

## Despliegue

Para desplegar en producción:

1. Construir el proyecto:
```bash
npm run build
```

2. Los archivos en `dist/` pueden ser desplegados en:
   - Vercel
   - Netlify
   - GitHub Pages
   - Cualquier servidor web estático

3. Asegúrate de configurar `VITE_API_URL` con la URL de producción del backend.

## Notas de Desarrollo

- Los certificados se abren en nuevas pestañas para descargar
- La descarga masiva tiene un delay de 500ms entre cada archivo para evitar bloqueos del navegador
- Las URLs de Google Drive se convierten automáticamente al formato de vista previa

## Mejoras Futuras

- [ ] Paginación de resultados
- [ ] Exportar listado a CSV/Excel
- [ ] Impresión de certificados
- [ ] Modo oscuro
- [ ] Caché de búsquedas recientes
- [ ] Historial de descargas
