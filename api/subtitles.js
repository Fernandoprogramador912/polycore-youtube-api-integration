import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función principal del handler
async function handler(req, res) {
  console.log('🎬 ========================================');
  console.log('🎬 Handler de subtítulos iniciado');
  console.log('🎬 ========================================');
  
  const videoId = req.query && req.query.videoId;
  console.log('🎬 Procesando video:', videoId);
  
  if (!videoId) {
    return res.status(400).json({
      success: false,
      error: 'Video ID requerido'
    });
  }

  try {
    // Intentar obtener subtítulos reales usando Python
    console.log('🐍 Intentando obtener subtítulos reales con Python...');
    const pythonResult = await getSubtitlesWithPython(videoId);
    
    if (pythonResult.success) {
      console.log('✅ Subtítulos obtenidos exitosamente con Python');
      return res.status(200).json({
        success: true,
        transcript: pythonResult.subtitles,
        source: 'youtube-transcript-api',
        language: pythonResult.language,
        count: pythonResult.count
      });
    } else {
      console.log('⚠️ Python falló, usando datos de ejemplo:', pythonResult.error);
    }
    
    // Si Python falla, usar datos de ejemplo
    console.log('🔄 Creando datos de ejemplo...');
    const sampleData = createEnhancedSampleData(videoId);
    
    return res.status(200).json({
      success: true,
      transcript: sampleData.transcript,
      videoInfo: sampleData.videoInfo,
      source: 'enhanced-sample-data',
      note: 'Usando datos de ejemplo porque Python falló: ' + (pythonResult.error || 'Error desconocido')
    });
    
  } catch (error) {
    console.error('❌ Error en handler:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor: ' + error.message
    });
  }
}

// Función para obtener subtítulos usando Python
async function getSubtitlesWithPython(videoId) {
  return new Promise((resolve) => {
    console.log('🐍 Ejecutando script de Python...');
    
    const pythonScript = path.join(__dirname, '..', 'get_subtitles.py');
    console.log('🐍 Python script path:', pythonScript);
    console.log('🐍 Current working directory:', process.cwd());
    
    // Usar la ruta absoluta del script
    const pythonProcess = spawn('python', [pythonScript, videoId], {
      cwd: path.join(__dirname, '..'), // Cambiar al directorio raíz del proyecto
      env: process.env
    });
    
    let output = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      console.log('🐍 Python stdout:', chunk);
      output += chunk;
    });
    
    pythonProcess.stderr.on('data', (data) => {
      const chunk = data.toString();
      console.log('🐍 Python stderr:', chunk);
      errorOutput += chunk;
    });
    
    pythonProcess.on('close', (code) => {
      console.log('🐍 Python process exited with code:', code);
      console.log('🐍 Full stdout output:', output);
      console.log('🐍 Full stderr output:', errorOutput);
      
      if (code === 0 && output.trim()) {
        try {
          // Buscar el JSON en la salida
          const jsonMatch = output.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            console.log('✅ Python result:', result);
            resolve(result);
          } else {
            console.log('⚠️ No JSON found in Python output');
            resolve({ success: false, error: 'No JSON output from Python' });
          }
        } catch (parseError) {
          console.error('❌ Error parsing Python output:', parseError);
          resolve({ success: false, error: 'Error parsing Python output: ' + parseError.message });
        }
      } else {
        console.error('❌ Python process failed with output:', output);
        console.error('❌ Python process failed with error:', errorOutput);
        resolve({ success: false, error: `Python failed (code ${code}): ${errorOutput || 'No error output'}` });
      }
    });
    
    pythonProcess.on('error', (error) => {
      console.error('❌ Python process error:', error);
      resolve({ success: false, error: 'Failed to start Python process: ' + error.message });
    });
    
    // Timeout de seguridad
    setTimeout(() => {
      console.log('⏰ Python timeout, killing process');
      pythonProcess.kill();
      resolve({ success: false, error: 'Python timeout' });
    }, 30000); // 30 segundos
  });
}

// Función para crear datos de ejemplo mejorados
function createEnhancedSampleData(videoId) {
  const sampleTranscript = [
    { start: 0, end: 3, text: "Welcome to PolyCore" },
    { start: 3, end: 6, text: "Your language learning platform" },
    { start: 6, end: 9, text: "Practice with real YouTube videos" },
    { start: 9, end: 12, text: "Improve your English skills" },
    { start: 12, end: 15, text: "Learn new vocabulary every day" }
  ];

  const sampleVideoInfo = {
    title: "Sample Video Title",
    description: "This is a sample video for testing purposes",
    channelTitle: "Sample Channel",
    publishedAt: new Date().toISOString(),
    viewCount: "1000",
    likeCount: "100",
    duration: "PT15S",
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  };

  return {
    transcript: sampleTranscript,
    videoInfo: sampleVideoInfo
  };
}

// Export default para compatibilidad con el servidor
export default handler;
