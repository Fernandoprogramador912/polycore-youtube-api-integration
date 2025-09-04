// api/subtitles.js - API segura con variables de entorno

export default async function handler(req, res) {
  // Permitir peticiones desde cualquier origen (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Obtener API key de forma segura desde variables de entorno
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    // Verificar que la API key esté disponible
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'EXAMPLE_API_KEY_REPLACE_WITH_REAL_ONE') {
      console.log('⚠️ Using demo mode - no valid YouTube API key configured');
      // Usar directamente datos de ejemplo mejorados
      const transcript = createEnhancedSampleTranscript(videoId, null);
      return res.status(200).json({
        success: true,
        videoId: videoId,
        videoInfo: null,
        transcript: transcript,
        source: 'demo-mode',
        note: 'Demo mode active. Add a real YouTube API key to .env for real subtitles.',
        availableCaptions: [],
        security: 'Demo mode - no API calls made'
      });
    }

    // Obtener el ID del video desde la URL
    const { videoId } = req.query;

    // Validar que se proporcionó un videoId
    if (!videoId) {
      return res.status(400).json({ success: false, error: 'Se requiere videoId en la URL' });
    }

    console.log(`🎬 Procesando video: ${videoId}`);
    console.log(`🔑 API key available: ${YOUTUBE_API_KEY ? 'Yes' : 'No'}`);

    // Paso 1: Obtener información del video usando YouTube API
    const videoInfo = await getVideoInfo(videoId, YOUTUBE_API_KEY);
    console.log('📊 Video info:', videoInfo);

    // Paso 2: Verificar si tiene subtítulos disponibles
    const availableCaptions = await getAvailableCaptions(videoId, YOUTUBE_API_KEY);
    console.log('📝 Available captions:', availableCaptions);

    // Paso 3: Intentar obtener subtítulos reales
    let transcript = null;
    if (availableCaptions.length > 0) {
      console.log('✅ Video has captions, attempting to fetch...');
      transcript = await fetchTranscriptFromCaptions(videoId, availableCaptions);
    }

    // Paso 4: Si no hay subtítulos reales, intentar métodos alternativos
    if (!transcript || transcript.length === 0) {
      console.log('🔄 No official captions found, trying alternative methods...');
      transcript = await tryAlternativeTranscriptMethods(videoId);
    }

    // Paso 5: Si aún no hay subtítulos, usar datos de ejemplo mejorados
    if (!transcript || transcript.length === 0) {
      console.log(`⚠️ Creating enhanced sample data for video: ${videoId}`);
      transcript = createEnhancedSampleTranscript(videoId, videoInfo);
      return res.status(200).json({
        success: true,
        videoId: videoId,
        videoInfo: videoInfo,
        transcript: transcript,
        source: 'enhanced-sample-data',
        note: `Enhanced sample transcript for ${videoInfo?.title || 'this video'}. Real subtitles not accessible due to YouTube API limitations.`,
        availableCaptions: availableCaptions.map((cap) => cap.language),
        security: 'API key secured via environment variables',
      });
    }

    // Retornar subtítulos reales si se encontraron
    console.log(`✅ Successfully fetched ${transcript.length} real subtitle segments`);
    const transcriptSource = transcript.length > 50 ? 'youtube-transcript-api' : 'youtube-real-subtitles';
    return res.status(200).json({
      success: true,
      videoId: videoId,
      videoInfo: videoInfo,
      transcript: transcript,
      source: transcriptSource,
      availableCaptions: availableCaptions.map((cap) => cap.language),
      note: transcriptSource === 'youtube-transcript-api' 
        ? 'Real subtitles extracted using Python youtube-transcript-api' 
        : 'Real subtitles from YouTube API',
    });
  } catch (error) {
    console.error('❌ Error en la API:', error);
    return res.status(500).json({ success: false, error: 'Error interno del servidor', details: error.message });
  }
}

// Función para obtener información del video usando YouTube API (SEGURA)
async function getVideoInfo(videoId, apiKey) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`;
    console.log(`🔗 Calling YouTube API: ${url.replace(apiKey, 'API_KEY_HIDDEN')}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`YouTube API error ${response.status}:`, errorText);
      throw new Error(`YouTube API error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    
    if (data.error) {
      console.error('YouTube API returned error:', data.error);
      throw new Error(`YouTube API error: ${data.error.message}`);
    }
    
    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      console.log(`✅ Got video info: ${video.snippet.title}`);
      return {
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        duration: video.contentDetails.duration,
        publishedAt: video.snippet.publishedAt,
        description: (video.snippet.description?.substring(0, 200) || '') + '...',
        thumbnails: video.snippet.thumbnails,
      };
    }
    console.log('⚠️ No video found with that ID');
    return null;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('YouTube API request timed out');
    } else {
      console.error('Error fetching video info:', error.message);
    }
    return null;
  }
}

// Función para obtener lista de subtítulos disponibles (SEGURA)
async function getAvailableCaptions(videoId, apiKey) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`;
    console.log(`🔗 Calling Captions API: ${url.replace(apiKey, 'API_KEY_HIDDEN')}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Captions API error ${response.status}:`, errorText);
      throw new Error(`Captions API error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    
    if (data.error) {
      console.error('Captions API returned error:', data.error);
      throw new Error(`Captions API error: ${data.error.message}`);
    }
    
    if (data.items && data.items.length > 0) {
      console.log(`✅ Found ${data.items.length} caption tracks`);
      return data.items.map((item) => ({
        id: item.id,
        language: item.snippet.language,
        name: item.snippet.name,
        trackKind: item.snippet.trackKind,
      }));
    }
    console.log('⚠️ No captions found for this video');
    return [];
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Captions API request timed out');
    } else {
      console.error('Error fetching captions list:', error.message);
    }
    return [];
  }
}

// Función para intentar obtener subtítulos de los captions oficiales
async function fetchTranscriptFromCaptions(videoId, availableCaptions) {
  // Buscar subtítulos en inglés primero
  const englishCaption = availableCaptions.find(
    (cap) => cap.language === 'en' || cap.language === 'en-US' || cap.language === 'en-GB',
  );
  if (!englishCaption) {
    console.log('No English captions found');
    return null;
  }
  try {
    // Nota: La descarga directa de subtítulos requiere OAuth2
    // Por limitaciones de la API pública, esto no funcionará
    // Pero el código está preparado para cuando se implemente
    console.log(`Found English caption: ${englishCaption.id}`);
    return null; // Por ahora devolvemos null hasta implementar OAuth2
  } catch (error) {
    console.error('Error fetching caption content:', error);
    return null;
  }
}

// Función para intentar obtener subtítulos usando python script
async function tryPythonTranscriptExtraction(videoId) {
  try {
    console.log(`🐍 Trying Python youtube-transcript-api for video: ${videoId}`);
    
    const { spawn } = await import('child_process');
    const { promisify } = await import('util');
    
    return new Promise((resolve, reject) => {
      const python = spawn('python3', ['extract_subtitles.py', videoId]);
      let stdout = '';
      let stderr = '';
      
      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      // Timeout de 30 segundos
      const timeout = setTimeout(() => {
        python.kill();
        reject(new Error('Python script timeout'));
      }, 30000);
      
      python.on('close', (code) => {
        clearTimeout(timeout);
        
        if (code === 0) {
          try {
            const result = JSON.parse(stdout);
            if (result.success) {
              console.log(`✅ Python script extracted ${result.transcript.length} transcript items`);
              resolve(result.transcript);
            } else {
              console.log(`⚠️ Python script failed: ${result.error}`);
              resolve(null);
            }
          } catch (parseError) {
            console.log(`❌ Failed to parse Python script output: ${parseError.message}`);
            resolve(null);
          }
        } else {
          console.log(`❌ Python script exited with code ${code}: ${stderr}`);
          resolve(null);
        }
      });
      
      python.on('error', (error) => {
        clearTimeout(timeout);
        console.log(`❌ Python script error: ${error.message}`);
        resolve(null);
      });
    });
    
  } catch (error) {
    console.log(`❌ Failed to execute Python script: ${error.message}`);
    return null;
  }
}

// Función para intentar métodos alternativos de transcripción
async function tryAlternativeTranscriptMethods(videoId) {
  // Primero intentar con nuestro script de Python
  const pythonResult = await tryPythonTranscriptExtraction(videoId);
  if (pythonResult) {
    return pythonResult;
  }
  
  // Si falla, intentar con APIs externas (mantener por compatibilidad)
  const methods = [
    `https://youtubetranscript.com/?server_vid2=${videoId}`,
    `https://youtube-transcript-api.herokuapp.com/transcript?video_id=${videoId}`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`,
  ];

  for (const method of methods) {
    try {
      console.log(`Trying external API method: ${method}`);
      
      // Crear un timeout de 5 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(method, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PolyCore/1.0)'
        }
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        // Procesar diferentes formatos de respuesta
        if (Array.isArray(data) && data.length > 0) {
          console.log(`✅ Found ${data.length} transcript items from external API`);
          return data.map((item) => ({
            start: parseFloat(item.start || item.offset || 0),
            end: parseFloat(item.start || item.offset || 0) + parseFloat(item.duration || item.dur || 3),
            text: item.text || item.content || '',
            translation: '',
            difficulty: calculateDifficulty(item.text || item.content || ''),
          }));
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`External API method timed out: ${method}`);
      } else {
        console.log(`External API method failed: ${error.message}`);
      }
    }
  }
  console.log('❌ All methods failed, using sample data');
  return null;
}

// Función para crear transcript de ejemplo mejorado con info real del video
function createEnhancedSampleTranscript(videoId, videoInfo) {
  const baseTranscript = [
    {
      start: 0,
      end: 4,
      text: 'Hello everyone, and welcome back to our channel.',
      translation: 'Hola a todos, y bienvenidos de vuelta a nuestro canal.',
      difficulty: 'beginner',
    },
    {
      start: 4,
      end: 8,
      text: "Today we're going to be talking about something really interesting.",
      translation: 'Hoy vamos a hablar sobre algo realmente interesante.',
      difficulty: 'intermediate',
    },
    {
      start: 8,
      end: 12,
      text: 'Before we get started, make sure to hit that subscribe button.',
      translation: 'Antes de comenzar, asegúrense de presionar el botón de suscribirse.',
      difficulty: 'intermediate',
    },
    {
      start: 12,
      end: 17,
      text: 'And if you enjoy this video, please give it a thumbs up.',
      translation: 'Y si disfrutan este video, por favor denle un me gusta.',
      difficulty: 'beginner',
    },
  ];

  // Si tenemos info del video, agregar segmentos personalizados
  if (videoInfo) {
    baseTranscript.push({
      start: 17,
      end: 22,
      text: `This content is from the channel ${videoInfo.channelTitle}.`,
      translation: `Este contenido es del canal ${videoInfo.channelTitle}.`,
      difficulty: 'intermediate',
    });

    if (videoInfo.title) {
      baseTranscript.push({
        start: 22,
        end: 27,
        text: `The video title is: "${videoInfo.title.substring(0, 50)}..."`,
        translation: `El título del video es: "${videoInfo.title.substring(0, 50)}..."`,
        difficulty: 'advanced',
      });
    }
  }

  baseTranscript.push({
    start: 27,
    end: 32,
    text: `Video ID: ${videoId}. This transcript uses secure API configuration.`,
    translation: `ID del video: ${videoId}. Esta transcripción usa configuración de API segura.`,
    difficulty: 'advanced',
  });

  return baseTranscript;
}

// Función para calcular dificultad automáticamente
function calculateDifficulty(text) {
  if (!text) return 'beginner';
  const words = text.toLowerCase().split(' ');
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;

  // Palabras complejas (más de 8 letras)
  const complexWords = words.filter((word) => word.length > 8).length;
  const complexityRatio = complexWords / words.length;

  // Palabras académicas/técnicas comunes
  const academicWords = [
    'however',
    'therefore',
    'furthermore',
    'consequently',
    'nevertheless',
    'specifically',
    'particularly',
    'essentially',
    'significantly',
    'approximately',
  ];
  const hasAcademicWords = words.some((word) => academicWords.includes(word));

  // Determinar dificultad basada en múltiples factores
  if (complexityRatio > 0.25 || avgWordLength > 6 || hasAcademicWords) return 'advanced';
  if (complexityRatio > 0.1 || avgWordLength > 4.5) return 'intermediate';
  return 'beginner';
}


