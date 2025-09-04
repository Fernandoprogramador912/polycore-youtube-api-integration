import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';

// Cargar variables de entorno desde .env
dotenv.config();

// Compat para __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // Puerto diferente al frontend

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del build de React
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/subtitles', async (req, res) => {
  console.log('🎯 Petición recibida en /api/subtitles');
  console.log('📋 Query params:', req.query);
  console.log('📋 Headers:', req.headers);
  console.log('📋 Method:', req.method);
  
  try {
    console.log('📦 Importando módulo de subtítulos...');
    const mod = await import('./api/subtitles.js');
    console.log('✅ Módulo importado correctamente');
    
    const handler = mod.default;
    console.log('🔧 Ejecutando handler...');
    
    return handler(req, res);
  } catch (err) {
    console.error('❌ Error loading API handler:', err);
    console.error('❌ Error stack:', err.stack);
    res.status(500).json({ success: false, error: 'Server error loading API', details: err.message });
  }
});

// API de traducción con OpenAI
app.post('/api/translate', async (req, res) => {
  console.log('🌍 Petición de traducción recibida');
  console.log('📋 Body:', req.body);
  
  try {
    const { text, targetLanguage = 'es' } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Texto requerido para traducción' 
      });
    }

    // Verificar si tenemos la API key de OpenAI
    const openaiApiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    if (!openaiApiKey || openaiApiKey === 'sk-tu_api_key_aqui') {
      console.log('⚠️ OpenAI API key no configurada, usando traducción de ejemplo');
      return res.json({
        success: true,
        translation: `[Traducción de ejemplo: "${text}"]`,
        source: 'example'
      });
    }

    // Importar OpenAI dinámicamente
    const { OpenAI } = await import('openai');
    
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Eres un traductor experto. Traduce el siguiente texto al ${targetLanguage === 'es' ? 'español' : targetLanguage}. 
          Mantén el tono y contexto original. Responde solo con la traducción, sin explicaciones adicionales.`
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    const translation = completion.choices[0]?.message?.content?.trim() || '';
    
    console.log('✅ Traducción exitosa:', text, '->', translation);
    
    res.json({
      success: true,
      translation: translation,
      source: 'openai'
    });

  } catch (error) {
    console.error('❌ Error en traducción:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno en traducción: ' + error.message
    });
  }
});

// API para obtener información del video de YouTube
app.get('/api/video-info/:videoId', async (req, res) => {
  console.log('📺 Petición de información de video recibida');
  console.log('🆔 Video ID:', req.params.videoId);
  
  try {
    const { videoId } = req.params;
    const youtubeApiKey = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;
    
    if (!youtubeApiKey || youtubeApiKey === 'tu_youtube_api_key_aqui') {
      console.log('⚠️ YouTube API key no configurada, usando información de ejemplo');
      return res.json({
        success: true,
        data: {
          title: `Video de ejemplo: ${videoId}`,
          channelTitle: 'Canal de Ejemplo',
          description: 'Esta es una descripción de ejemplo porque no hay API key de YouTube configurada.',
          thumbnails: {
            medium: {
              url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
            }
          },
          duration: 'PT0M0S',
          viewCount: '0'
        },
        source: 'example'
      });
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${youtubeApiKey}&part=snippet,contentDetails,statistics`;
    
    console.log('🌐 Llamando a YouTube API...');
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Video no encontrado');
    }
    
    const videoData = data.items[0];
    console.log('✅ Información del video obtenida exitosamente');
    
    res.json({
      success: true,
      data: {
        title: videoData.snippet.title,
        channelTitle: videoData.snippet.channelTitle,
        description: videoData.snippet.description,
        thumbnails: videoData.snippet.thumbnails,
        duration: videoData.contentDetails.duration,
        viewCount: videoData.statistics.viewCount,
        publishedAt: videoData.snippet.publishedAt
      },
      source: 'youtube-api'
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo información del video:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo información del video',
      details: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PolyCore YouTube API is running' });
});

// Para desarrollo: servir el frontend de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log('🚀 PolyCore YouTube API Server iniciado');
  console.log('🚀 ========================================');
  console.log(`🌐 URL del servidor: http://localhost:${PORT}`);
  console.log(`📱 Frontend debería estar en: http://localhost:5173 (Vite)`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎬 API de subtítulos: http://localhost:${PORT}/api/subtitles`);
  console.log('🚀 ========================================');
  
  // Verificar variables de entorno
  console.log('🔧 Variables de entorno:');
  console.log(`   - PORT: ${process.env.PORT || '3001 (default)'}`);
  console.log(`   - YOUTUBE_API_KEY: ${process.env.YOUTUBE_API_KEY ? 'Configurada' : 'No configurada'}`);
  console.log(`   - VITE_OPENAI_API_KEY: ${process.env.VITE_OPENAI_API_KEY ? 'Configurada' : 'No configurada'}`);
  console.log(`   - OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'Configurada' : 'No configurada'}`);
  console.log('🚀 ========================================');
});
