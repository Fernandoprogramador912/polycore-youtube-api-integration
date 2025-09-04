import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Target, 
  Check, 
  X, 
  RotateCcw,
  Play,
  Volume2,
  Trophy,
  Star,
  TrendingUp
} from 'lucide-react';

const LevelDetectionPage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [finalLevel, setFinalLevel] = useState(null);

  // Preguntas del test de nivel
  const questions = [
    {
      question: "What's your name?",
      options: ["¿Cuál es tu nombre?", "¿Cómo te llamas?", "¿Quién eres?", "¿Dónde vives?"],
      correct: 0,
      explanation: "What's your name? = ¿Cuál es tu nombre? Es la forma más común de preguntar el nombre en inglés.",
      difficulty: "beginner"
    },
    {
      question: "I have been studying English for three years.",
      options: ["He estado estudiando inglés por tres años", "Estoy estudiando inglés por tres años", "Voy a estudiar inglés por tres años", "Estudié inglés por tres años"],
      correct: 0,
      explanation: "Present Perfect Continuous (have been + -ing) se usa para acciones que comenzaron en el pasado y continúan en el presente.",
      difficulty: "intermediate"
    },
    {
      question: "If I had known about the meeting, I would have attended.",
      options: ["Si hubiera sabido sobre la reunión, habría asistido", "Si sé sobre la reunión, asistiré", "Si sabía sobre la reunión, asistía", "Si supe sobre la reunión, asistí"],
      correct: 0,
      explanation: "Third Conditional (If + Past Perfect, would have + Past Participle) se usa para situaciones hipotéticas del pasado.",
      difficulty: "advanced"
    },
    {
      question: "The book that I bought yesterday is very interesting.",
      options: ["El libro que compré ayer es muy interesante", "El libro que compro ayer es muy interesante", "El libro que compraré ayer es muy interesante", "El libro que compraba ayer es muy interesante"],
      correct: 0,
      explanation: "Relative clause 'that I bought yesterday' modifica 'the book' y usa el pasado simple para una acción completada.",
      difficulty: "intermediate"
    },
    {
      question: "She insisted that he attend the ceremony.",
      options: ["Ella insistió en que él asistiera a la ceremonia", "Ella insiste en que él asiste a la ceremonia", "Ella insistirá en que él asista a la ceremonia", "Ella insistía en que él asistía a la ceremonia"],
      correct: 0,
      explanation: "Subjunctive mood after 'insisted that' - el verbo va en forma base sin conjugación.",
      difficulty: "advanced"
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuestion.correct;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      // Test completado
      completeTest();
    }
  };

  const completeTest = () => {
    setTestCompleted(true);
    
    // Determinar nivel basado en el score
    const percentage = (score / questions.length) * 100;
    let level;
    
    if (percentage >= 80) {
      level = "Avanzado";
    } else if (percentage >= 60) {
      level = "Intermedio";
    } else if (percentage >= 40) {
      level = "Principiante-Intermedio";
    } else {
      level = "Principiante";
    }
    
    setFinalLevel(level);
  };

  const restartTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setScore(0);
    setTestCompleted(false);
    setFinalLevel(null);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-2 mr-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Test de Nivel Completado</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Result Card */}
          <div className="bg-white rounded-2xl shadow-lg border p-8 mb-8 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Test Completado!</h2>
              <p className="text-gray-600">Has terminado la evaluación de tu nivel de inglés</p>
            </div>

            {/* Score Display */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
                {score}/{questions.length}
              </div>
              <div className="text-2xl font-semibold text-gray-700 mb-2">
                {Math.round((score / questions.length) * 100)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${(score / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Level Result */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white mb-6">
              <h3 className="text-xl font-semibold mb-2">Tu Nivel de Inglés</h3>
              <div className="text-3xl font-bold mb-2">{finalLevel}</div>
              <p className="text-blue-100">
                {finalLevel === "Avanzado" && "¡Excelente! Tienes un dominio avanzado del inglés."}
                {finalLevel === "Intermedio" && "¡Muy bien! Tienes una base sólida y puedes continuar mejorando."}
                {finalLevel === "Principiante-Intermedio" && "¡Buen progreso! Estás en el camino correcto para dominar el inglés."}
                {finalLevel === "Principiante" && "¡Perfecto para empezar! Comenzaremos desde lo básico para construir una base sólida."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={goToDashboard}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Ir al Dashboard
              </button>
              <button
                onClick={restartTest}
                className="bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
              >
                Repetir Test
              </button>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resultados Detallados</h3>
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < score ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {index < score ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{question.question}</div>
                    <div className="text-sm text-gray-600">Dificultad: {question.difficulty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-2 mr-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Test de Nivel</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </div>
              <button
                onClick={restartTest}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                title="Reiniciar test"
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
            <h3 className="text-lg font-semibold text-gray-800">Progreso del Test</h3>
            <span className="text-sm text-gray-600">
              {currentQuestionIndex + 1} de {questions.length} preguntas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg border p-8 mb-8">
          {/* Question Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                currentQuestion.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.difficulty === 'beginner' ? 'Principiante' :
                 currentQuestion.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
              </span>
              <button
                onClick={() => speakQuestion(currentQuestion.question)}
                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200"
                title="Escuchar pregunta"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentQuestion.question}</h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? showResult
                      ? index === currentQuestion.correct
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${showResult ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? showResult
                        ? index === currentQuestion.correct
                          ? 'border-green-500 bg-green-500'
                          : 'border-red-500 bg-red-500'
                        : 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className={`font-medium ${
                    showResult && index === currentQuestion.correct
                      ? 'text-green-700'
                      : showResult && selectedAnswer === index && index !== currentQuestion.correct
                      ? 'text-red-700'
                      : 'text-gray-700'
                  }`}>
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Result Display */}
          {showResult && (
            <div className={`p-4 rounded-xl mb-6 ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {isCorrect ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-semibold ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                </span>
              </div>
              <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end">
            {!showResult ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  selectedAnswer === null
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                }`}
              >
                Verificar Respuesta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
              </button>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            Consejos para el Test
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p>🎯 <strong>Lee cuidadosamente:</strong> Cada pregunta puede tener trampas sutiles</p>
              <p>⏰ <strong>Tómate tu tiempo:</strong> No hay límite de tiempo para responder</p>
            </div>
            <div>
              <p>🔍 <strong>Analiza las opciones:</strong> Compara todas las respuestas antes de elegir</p>
              <p>💡 <strong>Confía en tu intuición:</strong> Tu primera impresión suele ser correcta</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelDetectionPage;
