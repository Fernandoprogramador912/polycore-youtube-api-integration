import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Volume2, 
  Check, 
  X, 
  Star,
  StarOff,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';

const VocabularyPage = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [completedWords, setCompletedWords] = useState(new Set());

  // Vocabulario de ejemplo
  const vocabulary = [
    {
      word: "Hello",
      translation: "Hola",
      phonetic: "/həˈloʊ/",
      example: "Hello, how are you?",
      exampleTranslation: "Hola, ¿cómo estás?",
      difficulty: "beginner"
    },
    {
      word: "Beautiful",
      translation: "Hermoso/a",
      phonetic: "/ˈbjuːtɪfʊl/",
      example: "What a beautiful day!",
      exampleTranslation: "¡Qué día tan hermoso!",
      difficulty: "intermediate"
    },
    {
      word: "Opportunity",
      translation: "Oportunidad",
      phonetic: "/ˌɒpəˈtjuːnɪti/",
      example: "This is a great opportunity for you.",
      exampleTranslation: "Esta es una gran oportunidad para ti.",
      difficulty: "advanced"
    },
    {
      word: "Confidence",
      translation: "Confianza",
      phonetic: "/ˈkɒnfɪdəns/",
      example: "She has confidence in her abilities.",
      exampleTranslation: "Ella tiene confianza en sus habilidades.",
      difficulty: "intermediate"
    },
    {
      word: "Determination",
      translation: "Determinación",
      phonetic: "/dɪˌtɜːmɪˈneɪʃn/",
      example: "His determination led to success.",
      exampleTranslation: "Su determinación llevó al éxito.",
      difficulty: "advanced"
    }
  ];

  const currentWord = vocabulary[currentWordIndex];

  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handlePlayAudio = () => {
    setIsPlaying(true);
    speakWord(currentWord.word);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const toggleFavorite = () => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(currentWord.word)) {
      newFavorites.delete(currentWord.word);
    } else {
      newFavorites.add(currentWord.word);
    }
    setFavorites(newFavorites);
  };

  const markAsCompleted = () => {
    const newCompleted = new Set(completedWords);
    newCompleted.add(currentWord.word);
    setCompletedWords(newCompleted);
  };

  const nextWord = () => {
    if (currentWordIndex < vocabulary.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowTranslation(false);
    }
  };

  const previousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setShowTranslation(false);
    }
  };

  const resetProgress = () => {
    setCompletedWords(new Set());
    setCurrentWordIndex(0);
    setShowTranslation(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-2 mr-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Vocabulario</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {currentWordIndex + 1} de {vocabulary.length}
              </div>
              <button
                onClick={resetProgress}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                title="Reiniciar progreso"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Progreso</h3>
            <span className="text-sm text-gray-600">
              {completedWords.size} de {vocabulary.length} palabras completadas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(completedWords.size / vocabulary.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Word Card */}
        <div className="bg-white rounded-2xl shadow-lg border p-8 mb-8">
          {/* Word Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-4xl font-bold text-gray-900">{currentWord.word}</h2>
                <button
                  onClick={handlePlayAudio}
                  disabled={isPlaying}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isPlaying 
                      ? 'bg-gray-200 text-gray-500' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-lg text-gray-600 font-mono">{currentWord.phonetic}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getDifficultyColor(currentWord.difficulty)}`}>
                {getDifficultyText(currentWord.difficulty)}
              </span>
            </div>
            
            <button
              onClick={toggleFavorite}
              className={`p-3 rounded-full transition-all duration-200 ${
                favorites.has(currentWord.word)
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {favorites.has(currentWord.word) ? <Star className="w-6 h-6" /> : <StarOff className="w-6 h-6" />}
            </button>
          </div>

          {/* Translation Section */}
          <div className="mb-6">
            {!showTranslation ? (
              <button
                onClick={() => setShowTranslation(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Mostrar Traducción
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">Traducción</h4>
                  <p className="text-2xl font-semibold text-purple-900">{currentWord.translation}</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Ejemplo</h4>
                  <p className="text-lg text-blue-900 mb-2">{currentWord.example}</p>
                  <p className="text-gray-700 italic">{currentWord.exampleTranslation}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={previousWord}
              disabled={currentWordIndex === 0}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                currentWordIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Anterior
            </button>
            
            {showTranslation && (
              <button
                onClick={markAsCompleted}
                disabled={completedWords.has(currentWord.word)}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  completedWords.has(currentWord.word)
                    ? 'bg-green-100 text-green-600 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {completedWords.has(currentWord.word) ? (
                  <span className="flex items-center justify-center">
                    <Check className="w-5 h-5 mr-2" />
                    Completada
                  </span>
                ) : (
                  'Marcar como Completada'
                )}
              </button>
            )}
            
            <button
              onClick={nextWord}
              disabled={currentWordIndex === vocabulary.length - 1}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                currentWordIndex === vocabulary.length - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>

        {/* Favorites Section */}
        {favorites.size > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Palabras Favoritas ({favorites.size})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from(favorites).map((word) => {
                const wordData = vocabulary.find(w => w.word === word);
                return (
                  <div key={word} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="font-semibold text-yellow-900">{wordData.word}</div>
                    <div className="text-sm text-yellow-700">{wordData.translation}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Word List */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Lista de Palabras</h3>
          <div className="space-y-3">
            {vocabulary.map((word, index) => (
              <div
                key={word.word}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                  index === currentWordIndex
                    ? 'border-blue-500 bg-blue-50'
                    : completedWords.has(word.word)
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === currentWordIndex
                      ? 'bg-blue-500 text-white'
                      : completedWords.has(word.word)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{word.word}</div>
                    <div className="text-sm text-gray-600">{word.translation}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {favorites.has(word.word) && (
                    <Star className="w-4 h-4 text-yellow-500" />
                  )}
                  {completedWords.has(word.word) && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyPage;
