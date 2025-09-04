# 🎬 Configuración de YouTube Learning en PolyCore

## 📋 Requisitos Previos

1. **Node.js** (versión 16 o superior)
2. **npm** o **yarn**
3. **API Key de YouTube Data API** (opcional, para funcionalidad completa)

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# YouTube Data API Key (opcional)
YOUTUBE_API_KEY=tu_api_key_aqui

# Puerto del servidor backend
PORT=3001
```

**Nota:** Si no tienes una API key de YouTube, el sistema funcionará en modo demo con datos de ejemplo.

### 3. Obtener API Key de YouTube (Opcional)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **YouTube Data API v3**
4. Crea credenciales (API Key)
5. Copia la API key al archivo `.env`

## 🎯 Cómo Usar

### Desarrollo

Para ejecutar tanto el frontend como el backend:

```bash
npm run dev:full
```

Esto iniciará:
- **Frontend React**: http://localhost:5173
- **Backend API**: http://localhost:3001

### Solo Frontend

```bash
npm run dev
```

### Solo Backend

```bash
npm run server
```

## 🌐 Acceso a la Funcionalidad

Una vez que ambos servicios estén ejecutándose, puedes acceder a:

- **Página principal**: http://localhost:5173
- **Página de YouTube**: http://localhost:5173/youtube
- **API de subtítulos**: http://localhost:3001/api/subtitles

## 🎬 Funcionalidades de YouTube Learning

### Características Principales

1. **Carga de Videos**: Pega cualquier URL de YouTube
2. **Reproductor Integrado**: Reproductor nativo de YouTube
3. **Subtítulos Interactivos**: Transcripción sincronizada con el video
4. **Aprendizaje de Palabras**: Haz clic en palabras para marcarlas como aprendidas
5. **Sistema de XP**: Gana puntos por completar oraciones y aprender palabras
6. **Seguimiento de Progreso**: Estadísticas de aprendizaje en tiempo real

### Modo Demo

Si no tienes API key de YouTube, el sistema:
- Funciona con videos de ejemplo
- Genera subtítulos basados en el título del video
- Proporciona experiencia completa de aprendizaje

### Modo API Completo

Con API key válida:
- Obtiene información real del video
- Verifica subtítulos disponibles
- Intenta extraer subtítulos reales
- Fallback a datos de ejemplo si es necesario

## 🔧 Estructura del Proyecto

```
polycore-english/
├── src/
│   ├── pages/
│   │   └── YouTubePage.jsx          # Página principal de YouTube
│   ├── App.jsx                      # Rutas de la aplicación
│   └── App.css                      # Estilos de YouTube
├── api/
│   └── subtitles.js                 # API de extracción de subtítulos
├── server.js                        # Servidor backend Express
├── package.json                     # Dependencias actualizadas
└── .env                             # Variables de entorno
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to API"

1. Verifica que el backend esté ejecutándose en el puerto 3001
2. Revisa la consola del navegador para errores de CORS
3. Asegúrate de que ambos servicios estén activos

### Error: "YouTube API not available"

1. Verifica que la API key esté configurada en `.env`
2. Asegúrate de que la YouTube Data API esté habilitada
3. El sistema funcionará en modo demo si no hay API key

### Problemas de Reproducción

1. Verifica que la URL de YouTube sea válida
2. Algunos videos pueden tener restricciones de reproducción
3. El reproductor requiere conexión a internet

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. El frontend se desplegará automáticamente

### Otros Servicios

- **Netlify**: Similar a Vercel
- **Heroku**: Para el backend
- **Railway**: Alternativa a Heroku

## 📚 Recursos Adicionales

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

¡Disfruta aprendiendo idiomas con YouTube en PolyCore! 🎉
