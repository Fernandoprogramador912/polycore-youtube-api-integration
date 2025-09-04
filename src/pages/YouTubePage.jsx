import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ExternalLink, Trophy, Zap, Target, Star, Play, Pause, SkipBack, SkipForward, Volume2, Settings } from 'lucide-react';

// Componente para manejar la traducción de subtítulos
const SubtitleTranslation = ({ text, isActive, videoId }) => {
  const [translation, setTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [hasTranslated, setHasTranslated] = useState(false);
  const [lastVideoId, setLastVideoId] = useState(null);

  // Resetear traducciones cuando cambia el video
  useEffect(() => {
    if (videoId && videoId !== lastVideoId) {
      setTranslation('');
      setHasTranslated(false);
      setLastVideoId(videoId);
    }
  }, [videoId, lastVideoId]);

  useEffect(() => {
    if (text && !hasTranslated) {
      translateText(text);
    }
  }, [text, hasTranslated]);

  const translateText = async (textToTranslate) => {
    if (!textToTranslate || !textToTranslate.trim()) return;
    
    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToTranslate,
          targetLanguage: 'es'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTranslation(data.translation || '');
        setHasTranslated(true);
      }
    } catch (error) {
      console.error('Error en traducción:', error);
      setTranslation('');
    } finally {
      setIsTranslating(false);
    }
  };

  if (isTranslating) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-xs text-gray-500">Traduciendo...</span>
      </div>
    );
  }

  if (!translation) {
    return (
      <span className="text-xs text-gray-400">
        {isActive ? 'Traducción no disponible' : ''}
      </span>
    );
  }

  return (
    <span className="text-sm">
      {translation}
    </span>
  );
};

const YouTubePage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1);
  const [subtitles, setSubtitles] = useState([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(7);
  const [wordsLearned, setWordsLearned] = useState(89);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('');
  const [youtubeApiStatus, setYoutubeApiStatus] = useState('checking');
  const [playerReady, setPlayerReady] = useState(false);
  const [translations, setTranslations] = useState({}); // Cache de traducciones
  const [translating, setTranslating] = useState(false);

  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const timeMapRef = useRef({}); // MAPA MANUAL: { "1": 0, "2": 0, "3": 1, ... }

  // FUNCIÓN MANUAL: Pre-procesar subtítulos en mapa de tiempo (MEJORADO)
  const createTimeMap = (subtitlesData) => {
    console.log('🗺️ Creando mapa de tiempo PRECISO...');
    const map = {};
    
    // Para cada segundo del video con anticipación
    const maxTime = Math.ceil(Math.max(...subtitlesData.map(s => s.end))) + 2;
    console.log('⏱️ Duración total del video:', maxTime, 'segundos');
    
    for (let second = 0; second <= maxTime; second++) {
      // Buscar qué subtítulo está activo en este segundo O va a empezar pronto
      let activeSubtitleIndex = -1;
      
      for (let i = 0; i < subtitlesData.length; i++) {
        const subtitle = subtitlesData[i];
        
        // ANTICIPACIÓN: Si el subtítulo empieza en los próximos 0.5 segundos
        const anticipation = 0.3; // 300ms de anticipación
        
        if ((second >= (subtitle.start - anticipation) && second <= subtitle.end) ||
            (second >= subtitle.start && second <= subtitle.end)) {
          activeSubtitleIndex = i;
          break;
        }
      }
      
      map[second] = activeSubtitleIndex;
      
      if (activeSubtitleIndex >= 0 && second % 5 === 0) { // Log cada 5 segundos para no saturar
        console.log(`📍 Segundo ${second}: Subtítulo ${activeSubtitleIndex} - "${subtitlesData[activeSubtitleIndex].text.substring(0, 30)}..."`);
      }
    }
    
    timeMapRef.current = map;
    console.log('✅ Mapa de tiempo PRECISO creado:', Object.keys(map).length, 'segundos mapeados');
    return map;
  };

  // Función para traducir códigos de error de YouTube
  const getYouTubeErrorMessage = (errorCode) => {
    const errorMessages = {
      2: 'URL inválida del video',
      5: 'HTML5 player error',
      100: 'Video no encontrado o privado',
      101: 'Video no disponible para reproducción',
      150: 'Video no disponible para reproducción'
    };
    return errorMessages[errorCode] || `Error desconocido (código: ${errorCode})`;
  };
  
  // Extraer ID del video de la URL de YouTube
  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Cargar video
  const loadVideo = async () => {
    try {
      if (!videoUrl.trim()) {
        setError('Por favor ingresa una URL de YouTube válida');
        return;
      }

      const extractedId = extractVideoId(videoUrl);
      if (!extractedId) {
        setError('URL de YouTube inválida');
        return;
      }

      setVideoId(extractedId);
      setError('');
      setIsLoading(true);
      setTranscript([]);
      setVideoInfo(null);

      // Obtener subtítulos primero
      await fetchSubtitles(extractedId);
      
      // Luego cargar el reproductor
      if (window.YT && window.YT.Player) {
        setYoutubeApiStatus('ready');
        loadYouTubePlayer(extractedId);
      } else {
        // Configurar callback para cuando la API esté lista
        window.onYouTubeIframeAPIReady = () => {
          setYoutubeApiStatus('ready');
          loadYouTubePlayer(extractedId);
        };
      }
    } catch (err) {
      console.error('❌ Error en loadVideo:', err);
      setError('Error al cargar el video: ' + err.message);
      setIsLoading(false);
    }
  };

  // Cargar reproductor de YouTube
  const loadYouTubePlayer = (id) => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    const player = new window.YT.Player('youtube-player', {
      height: '360',
      width: '640',
      videoId: id,
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: (event) => {
          console.log('✅ YouTube player ready');
          setIsLoading(false);
          setPlayerReady(true);
          setError('');
        },
        onStateChange: (event) => {
          console.log('🎬 Player state change:', event.data, 'PLAYING =', window.YT.PlayerState.PLAYING);
          if (event.data === window.YT.PlayerState.PLAYING) {
            console.log('▶️ Video empezó a reproducir');
            setIsPlaying(true);
            // Solo iniciar tracking si ya tenemos el mapa de tiempo
            setTimeout(() => {
              if (Object.keys(timeMapRef.current).length > 0) {
                console.log('🚀 Player reproduciendo + Mapa de tiempo listo = Iniciando tracking');
                startTracking();
              } else {
                console.log('⏳ Player reproduciendo pero esperando mapa de tiempo...');
              }
            }, 100);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            console.log('⏸️ Video pausado - deteniendo tracking');
            setIsPlaying(false);
            stopTracking();
          } else if (event.data === window.YT.PlayerState.ENDED) {
            console.log('⏹️ Video terminado - deteniendo tracking');
            setIsPlaying(false);
            stopTracking();
          }
        },
        onError: (event) => {
          console.error('❌ YouTube player error:', event.data);
          setError(`Error en el reproductor de YouTube: ${getYouTubeErrorMessage(event.data)}`);
          setIsLoading(false);
          setPlayerReady(false);
        }
      }
    });

    playerRef.current = player;
  };

  // Obtener información del video
  const fetchVideoInfo = async (id) => {
    try {
      console.log('📺 Obteniendo información del video...');
      const response = await fetch(`http://localhost:3001/api/video-info/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ Información del video obtenida:', data.data.title);
          return data.data;
        }
      }
    } catch (error) {
      console.log('⚠️ Error obteniendo información del video, usando fallback');
    }
    
    // Fallback si no se puede obtener información
    return {
      title: `Video ID: ${id}`,
      channelTitle: 'Canal Desconocido',
      description: '',
      thumbnails: {
        medium: { url: `https://img.youtube.com/vi/${id}/mqdefault.jpg` }
      }
    };
  };

  // Obtener subtítulos
  const fetchSubtitles = async (id) => {
    try {
      console.log('🔍 Intentando conectar a la API...');
      
      // Obtener información del video e subtítulos en paralelo
      const [subtitlesResponse, videoInfo] = await Promise.all([
        fetch(`http://localhost:3001/api/subtitles?videoId=${id}`),
        fetchVideoInfo(id)
      ]);
      
      if (!subtitlesResponse.ok) {
        throw new Error(`HTTP error! status: ${subtitlesResponse.status}`);
      }
      
      const data = await subtitlesResponse.json();
      console.log('✅ Subtítulos recibidos:', data);

      if (data.success) {
        const subtitlesData = data.subtitles || data.transcript || [];
        console.log('📝 Subtítulos procesados:', subtitlesData.length, 'elementos');
        
        // CREAR MAPA DE TIEMPO INMEDIATAMENTE
        createTimeMap(subtitlesData);
        
        setSubtitles(subtitlesData);
        setTranscript(subtitlesData);
        setVideoInfo({
          title: videoInfo.title,
          channelTitle: videoInfo.channelTitle,
          description: videoInfo.description,
          thumbnail: videoInfo.thumbnails?.medium?.url,
          duration: subtitlesData.length > 0 ? Math.max(...subtitlesData.map(s => s.end)) : 0
        });
        setApiStatus(data.source);
        
        // Si el player ya está listo y reproduciendo, iniciar tracking ahora
        if (playerRef.current && isPlaying) {
          console.log('🚀 Subtítulos + Mapa listos + Player reproduciendo = Iniciando tracking');
          startTracking();
        }
      } else {
        setError('Error al obtener subtítulos: ' + data.error);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('❌ Error obteniendo subtítulos:', err);
      setError(`Error de conexión con la API: ${err.message}`);
      setIsLoading(false);
    }
  };

  // Control de reproducción
  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const seekTo = (time) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time);
    }
  };

  // Ir a un subtítulo específico
  const goToSubtitle = (subtitle) => {
    if (playerRef.current) {
      playerRef.current.seekTo(subtitle.start);
      setCurrentSubtitleIndex(subtitle.index);
      setCurrentTime(subtitle.start);
    }
  };

  // TRACKING MANUAL Y SIMPLE
  const startTracking = () => {
    console.log('🚀 Iniciando tracking MANUAL...');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (playerRef.current && Object.keys(timeMapRef.current).length > 0) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          
          // BUSCAR CON DECIMALES para mayor precisión
          let bestMatch = -1;
          let currentSecond = Math.floor(currentTime);
          
          // Primero buscar en el segundo actual
          if (timeMapRef.current[currentSecond] >= 0) {
            bestMatch = timeMapRef.current[currentSecond];
          }
          // Si no hay match, buscar en el siguiente segundo (anticipación)
          else if (timeMapRef.current[currentSecond + 1] >= 0) {
            bestMatch = timeMapRef.current[currentSecond + 1];
          }
          
          console.log(`⏰ Tiempo ${currentTime.toFixed(1)}s (segundo ${currentSecond}) → Subtítulo ${bestMatch}`);
          
          if (bestMatch >= 0 && bestMatch !== currentSubtitleIndex) {
            console.log('🎯 Cambio de subtítulo:', bestMatch);
            highlightSubtitleManual(bestMatch);
          }
          
          setCurrentTime(currentTime);
        } catch (error) {
          console.error('❌ Error en tracking:', error);
        }
      }
    }, 200); // Más rápido: cada 200ms
    
    console.log('✅ Tracking MANUAL iniciado');
  };

  const stopTracking = () => {
    console.log('⏹️ Deteniendo tracking...');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // FUNCIÓN MANUAL SIMPLE PARA RESALTAR
  const highlightSubtitleManual = (subtitleIndex) => {
    console.log('🎨 Resaltando subtítulo MANUAL:', subtitleIndex);
    
    // Quitar resaltados previos
    document.querySelectorAll('.current-sentence').forEach(el => {
      el.classList.remove('current-sentence');
    });
    
    // Agregar resaltado al nuevo
    const element = document.getElementById(`subtitle-${subtitleIndex}`);
    if (element) {
      element.classList.add('current-sentence');
      console.log('✅ Resaltado aplicado a:', element.id);
      
      // Scroll suave
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Actualizar estado React
      setCurrentSubtitleIndex(subtitleIndex);
    } else {
      console.error('❌ No se encontró elemento:', `subtitle-${subtitleIndex}`);
    }
  };

  // LÓGICA COPIADA DE LA VERSIÓN QUE FUNCIONABA + DEBUG
  const syncTranscriptWithVideo = (currentTime) => {
    console.log('🔄 syncTranscriptWithVideo llamada con tiempo:', currentTime, 'subtitles:', subtitles.length);
    
    // Encuentra la oración actual basada en tiempo
    let currentSentenceIndex = -1;
    let currentWordData = null;
    
    for (let i = 0; i < subtitles.length; i++) {
      const sentence = subtitles[i];
      if (currentTime >= sentence.start && currentTime <= sentence.end) {
        currentSentenceIndex = i;
        
        // Calcula la posición aproximada de la palabra dentro de la oración
        const sentenceProgress = (currentTime - sentence.start) / (sentence.end - sentence.start);
        const words = sentence.text.split(' ');
        const wordIndex = Math.floor(sentenceProgress * words.length);
        
        currentWordData = {
          sentenceIndex: i,
          wordIndex: Math.min(wordIndex, words.length - 1),
          word: words[Math.min(wordIndex, words.length - 1)]
        };
        
        console.log('🎯 Encontrada oración activa:', {
          index: i,
          text: sentence.text.substring(0, 50) + '...',
          start: sentence.start,
          end: sentence.end,
          progress: sentenceProgress,
          wordIndex: wordIndex,
          word: currentWordData.word
        });
        break;
      }
    }
    
    if (currentSentenceIndex === -1) {
      console.log('⚠️ No se encontró oración activa para tiempo:', currentTime);
    }
    
    // Actualizar UI
    updateTranscriptHighlight(currentSentenceIndex, currentWordData);
  };

  // FUNCIÓN COPIADA DE LA VERSIÓN QUE FUNCIONABA + DEBUG
  const updateTranscriptHighlight = (sentenceIndex, wordData) => {
    console.log('🎨 updateTranscriptHighlight llamada:', { sentenceIndex, wordData });
    
    // Verificar que el contenedor existe
    const container = document.getElementById('transcript-container');
    console.log('📦 Container encontrado:', !!container);
    
    // Remover resaltados previos
    const currentSentences = document.querySelectorAll('#transcript-container .current-sentence');
    const currentWords = document.querySelectorAll('#transcript-container .current-word');
    console.log('🔄 Removiendo clases:', { sentences: currentSentences.length, words: currentWords.length });
    
    currentSentences.forEach(el => {
      el.classList.remove('current-sentence');
      console.log('🗑️ Removed current-sentence from:', el.id);
    });
    currentWords.forEach(el => {
      el.classList.remove('current-word');
      console.log('🗑️ Removed current-word from:', el);
    });
    
    if (sentenceIndex >= 0) {
      // Resaltar oración actual
      const sentenceElement = document.getElementById(`subtitle-${sentenceIndex}`);
      console.log('🎯 Sentence element encontrado:', !!sentenceElement, sentenceElement?.id);
      
      if (sentenceElement) {
        sentenceElement.classList.add('current-sentence');
        console.log('✅ Added current-sentence to:', sentenceElement.id);
        console.log('📝 Element classes after:', sentenceElement.className);
        
        // Actualizar estado React
        setCurrentSubtitleIndex(sentenceIndex);
        
        // Auto-scroll a la oración actual
        sentenceElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        
        // Resaltar palabra actual
        if (wordData) {
          const wordElements = sentenceElement.querySelectorAll('.word-hover');
          console.log('🔤 Word elements encontrados:', wordElements.length, 'buscando índice:', wordData.wordIndex);
          
          if (wordElements[wordData.wordIndex]) {
            wordElements[wordData.wordIndex].classList.add('current-word');
            console.log('✅ Added current-word to word:', wordData.word);
            console.log('📝 Word element classes:', wordElements[wordData.wordIndex].className);
          } else {
            console.warn('⚠️ Word element no encontrado en índice:', wordData.wordIndex);
          }
        }
      } else {
        console.error('❌ Sentence element no encontrado para índice:', sentenceIndex);
      }
    }
  };

  // Marcar palabra como aprendida
  const markWordAsLearned = (word) => {
    setWordsLearned(prev => prev + 1);
    setXp(prev => prev + 5);
  };

  // Resaltar palabras en el subtítulo actual
  const highlightWords = (text) => {
    if (!text) return '';
    
    return text.split(' ').map((word, index) => (
      <span
        key={index}
        className="word-hover cursor-pointer hover:bg-yellow-200 transition-colors duration-200 px-1 rounded"
        onClick={(e) => {
          e.stopPropagation();
          markWordAsLearned(word);
        }}
        title={`Haz clic para marcar "${word}" como aprendida`}
      >
        {word}
      </span>
    ));
  };

  // Función para traducir texto usando OpenAI
  const translateText = async (text) => {
    if (!text || !text.trim()) return '';
    
    // Verificar si ya tenemos la traducción en caché
    const cacheKey = text.trim().toLowerCase();
    if (translations[cacheKey]) {
      return translations[cacheKey];
    }

    try {
      setTranslating(true);
      console.log('🌍 Traduciendo:', text);
      
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          targetLanguage: 'es'
        })
      });

      if (!response.ok) {
        throw new Error(`Error de traducción: ${response.status}`);
      }

      const data = await response.json();
      const translation = data.translation || '';
      
      // Guardar en caché
      setTranslations(prev => ({
        ...prev,
        [cacheKey]: translation
      }));
      
      console.log('✅ Traducido:', text, '->', translation);
      return translation;
      
    } catch (error) {
      console.error('❌ Error en traducción:', error);
      return ''; // Retornar string vacío si falla la traducción
    } finally {
      setTranslating(false);
    }
  };

  // Verificar API de YouTube al cargar la página
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setYoutubeApiStatus('ready');
    } else {
      window.onYouTubeIframeAPIReady = () => {
        setYoutubeApiStatus('ready');
      };
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-900">PolyCore</h1>
              </div>
              <div className="hidden md:flex text-sm text-slate-600">
                YouTube Language Learning Platform
              </div>
              <div className="text-xs text-slate-500">
                Powered by Real YouTube Subtitles
              </div>
            </div>
            
            {/* User Stats */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-slate-700">XP: <span>{xp.toFixed(2)}</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium text-slate-700">{streak} days</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-slate-700">{wordsLearned} words</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-slate-700">Intermediate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* YouTube URL Input */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <ExternalLink className="h-5 w-5 mr-2 text-blue-600" />
              🚀 Load Any YouTube Video
            </h2>
            <div className="flex space-x-3">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste YouTube URL here..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && loadVideo()}
              />
              <button
                onClick={loadVideo}
                disabled={isLoading || youtubeApiStatus === 'checking' || playerReady}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isLoading || youtubeApiStatus === 'checking' || playerReady
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Loading...' : 
                 youtubeApiStatus === 'checking' ? 'Esperando API...' : 
                 playerReady ? 'Video Cargado' :
                 'Load Video'}
              </button>
            </div>
            {error && (
              <div className="mt-3 text-red-600 text-sm">{error}</div>
            )}
            {apiStatus && (
              <div className="mt-2 text-sm text-slate-600">
                API Status: <span className="font-medium">{apiStatus}</span>
              </div>
            )}
            
            {/* YouTube API Status */}
            <div className="mt-2 text-sm">
              <span className="text-slate-600">YouTube API: </span>
              {youtubeApiStatus === 'checking' && (
                <span className="text-yellow-600 font-medium flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-1"></div>
                  Cargando...
                </span>
              )}
              {youtubeApiStatus === 'ready' && (
                <span className="text-green-600 font-medium flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Lista
                </span>
              )}
              {youtubeApiStatus === 'error' && (
                <span className="text-red-600 font-medium flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  Error
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Video Player and Transcript */}
        {videoId && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Player */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Video Player</h3>
              <div 
                id="youtube-player" 
                className="w-full aspect-video bg-black rounded-lg"
                style={{ minHeight: '300px' }}
              />
              
              {/* Current Subtitle Display */}
              {currentSubtitleIndex >= 0 && subtitles[currentSubtitleIndex] && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium mb-1">Subtítulo Actual</div>
                  <div className="text-lg text-slate-900 font-medium">
                    {subtitles[currentSubtitleIndex].text}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {Math.floor(subtitles[currentSubtitleIndex].start)}s - {Math.floor(subtitles[currentSubtitleIndex].end)}s
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progreso del video</span>
                      <span>{Math.floor(currentTime)}s / {Math.floor(videoInfo?.duration || 0)}s</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${videoInfo?.duration ? (currentTime / videoInfo.duration) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Video Controls */}
              <div className="mt-4 flex items-center justify-center space-x-4">
                <button
                  onClick={() => seekTo(Math.max(0, currentTime - 10))}
                  className="p-2 rounded-full hover:bg-slate-100"
                >
                  <SkipBack className="h-5 w-5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>
                <button
                  onClick={() => seekTo(currentTime + 10)}
                  className="p-2 rounded-full hover:bg-slate-100"
                >
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>

              {/* Video Info */}
              {videoInfo && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start space-x-4">
                    {videoInfo.thumbnail && (
                      <img 
                        src={videoInfo.thumbnail} 
                        alt="Video thumbnail"
                        className="w-20 h-15 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 line-clamp-2">{videoInfo.title}</h4>
                      {videoInfo.channelTitle && (
                        <p className="text-sm text-slate-600 mt-1">{videoInfo.channelTitle}</p>
                      )}
                      {videoInfo.viewCount && (
                        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                          <span>{parseInt(videoInfo.viewCount).toLocaleString()} views</span>
                          <span>{new Date(videoInfo.publishedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {videoInfo.description && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-600 line-clamp-3">{videoInfo.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Transcript */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Interactive Transcript
                  {subtitles.length > 0 && (
                    <span className="ml-2 text-sm text-slate-500">
                      ({subtitles.length} subtítulos)
                    </span>
                  )}
                </div>
                {isPlaying && currentSubtitleIndex >= 0 && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Reproduciendo: {Math.floor(currentTime)}s</span>
                  </div>
                )}
              </h3>
              
              {subtitles.length > 0 ? (
                <div id="transcript-container" className="space-y-2 max-h-96 overflow-y-auto">
                  {subtitles.map((subtitle, index) => (
                    <div
                      key={index}
                      id={`subtitle-${index}`}
                      className={`p-3 rounded-lg transition-all duration-300 cursor-pointer border-l-4 ${
                        index === currentSubtitleIndex
                          ? 'bg-yellow-200 text-gray-900 shadow-lg scale-105 ring-2 ring-yellow-300 border-yellow-400'
                          : 'bg-slate-50 hover:bg-slate-100 border-transparent'
                      }`}
                      onClick={() => goToSubtitle(subtitle)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`text-xs font-mono ${
                          index === currentSubtitleIndex ? 'text-gray-700' : 'text-slate-500'
                        }`}>
                          {Math.floor(subtitle.start)}s - {Math.floor(subtitle.end)}s
                        </div>
                        {index === currentSubtitleIndex && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-800 font-medium">▶️ Playing</span>
                          </div>
                        )}
                      </div>
                      <div className={`leading-relaxed ${
                        index === currentSubtitleIndex ? 'text-gray-900' : 'text-slate-900'
                      }`}>
                        {highlightWords(subtitle.text)}
                      </div>
                      
                      {/* Traducción al español */}
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="text-sm text-gray-600 italic">
                          <SubtitleTranslation 
                            text={subtitle.text} 
                            isActive={index === currentSubtitleIndex}
                            videoId={videoId}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  {isLoading ? 'Loading transcript...' : 'No transcript available'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!videoId && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Welcome to PolyCore YouTube Learning
            </h3>
            <p className="text-slate-600 mb-6">
              Paste any YouTube URL above to start learning English with real video content.
              <br />
              Our AI-powered system will extract subtitles and help you practice your language skills.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-900 mb-1">🎯 Interactive Learning</div>
                <div className="text-blue-700">Click on words to mark them as learned</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-900 mb-1">📝 Real Subtitles</div>
                <div className="text-green-700">Learn from actual video content</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="font-semibold text-purple-900 mb-1">🏆 Track Progress</div>
                <div className="text-purple-700">Earn XP and track your learning journey</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubePage;
