import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Settings,
  RotateCcw,
  Download,
  Share2,
  Bot,
  User
} from 'lucide-react';

const ConversationPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '¡Hola! Soy tu asistente de inglés. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre gramática, vocabulario, o simplemente practicar conversación.',
      timestamp: new Date(),
      audioUrl: null
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationLevel, setConversationLevel] = useState('intermediate');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simular respuesta de IA
  const simulateAIResponse = async (userMessage) => {
    setIsLoading(true);
    
    // Simular delay de respuesta
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const responses = [
      "¡Excelente pregunta! En inglés, eso se dice...",
      "Muy bien, déjame explicarte eso...",
      "Interesante, la forma correcta es...",
      "Perfecto, aquí tienes la respuesta...",
      "¡Buena observación! La regla es...",
      "Déjame ayudarte con eso...",
      "En inglés, la estructura correcta es...",
      "¡Muy bien! Continúa practicando..."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const aiMessage = {
      id: Date.now(),
      type: 'ai',
      content: `${randomResponse} ${generateDetailedResponse(userMessage)}`,
      timestamp: new Date(),
      audioUrl: null
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const generateDetailedResponse = (userMessage) => {
    const responses = {
      'hello': 'Hello se pronuncia /həˈloʊ/ y es la forma más común de saludar en inglés. También puedes usar "Hi" o "Hey" en situaciones informales.',
      'how are you': 'How are you? se traduce como "¿Cómo estás?" y se responde típicamente con "I\'m fine, thank you" o "I\'m good, thanks".',
      'goodbye': 'Goodbye se puede decir de varias formas: "Bye", "See you later", "Take care", o "Have a nice day".',
      'thank you': 'Thank you se puede abreviar como "Thanks" y se responde con "You\'re welcome" o "No problem".',
      'what is your name': 'What is your name? significa "¿Cuál es tu nombre?" y se responde con "My name is [nombre]" o "I\'m [nombre]".'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return 'Continúa practicando y no dudes en hacer más preguntas. ¡Cada pregunta te acerca más a dominar el inglés!';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      audioUrl: null
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Simular respuesta de IA
    await simulateAIResponse(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Aquí iría la lógica de grabación de audio
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Aquí iría la lógica para procesar archivos de audio
      console.log('Archivo subido:', file.name);
    }
  };

  const clearConversation = () => {
    setMessages([{
      id: Date.now(),
      type: 'ai',
      content: '¡Hola! Soy tu asistente de inglés. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre gramática, vocabulario, o simplemente practicar conversación.',
      timestamp: new Date(),
      audioUrl: null
    }]);
  };

  const downloadConversation = () => {
    const conversationText = messages.map(msg => 
      `${msg.type === 'user' ? 'Tú' : 'IA'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversacion-ingles.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareConversation = () => {
    if (navigator.share) {
      const conversationText = messages.map(msg => 
        `${msg.type === 'user' ? 'Tú' : 'IA'}: ${msg.content}`
      ).join('\n\n');
      
      navigator.share({
        title: 'Mi conversación en inglés',
        text: conversationText,
        url: window.location.href
      });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(
        messages.map(msg => 
          `${msg.type === 'user' ? 'Tú' : 'IA'}: ${msg.content}`
        ).join('\n\n')
      );
      alert('Conversación copiada al portapapeles');
    }
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
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
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2 mr-3">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Conversación IA</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                title="Configuración"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuración de Conversación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Conversación
                </label>
                <select
                  value={conversationLevel}
                  onChange={(e) => setConversationLevel(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={clearConversation}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Limpiar Chat</span>
                </button>
                
                <button
                  onClick={downloadConversation}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar</span>
                </button>
                
                <button
                  onClick={shareConversation}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Compartir</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="bg-white rounded-xl shadow-lg border h-96 mb-8 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'ai' && (
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1 mt-1">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className={`flex items-center justify-between mt-2 text-xs ${
                          message.type === 'user' ? 'text-purple-100' : 'text-gray-500'
                        }`}>
                          <span>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.type === 'ai' && (
                            <button
                              onClick={() => speakMessage(message.content)}
                              className="hover:text-purple-600 transition-colors duration-200"
                              title="Escuchar"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      {message.type === 'user' && (
                        <div className="bg-white rounded-full p-1 mt-1">
                          <User className="w-3 h-3 text-purple-600" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje en inglés aquí..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows="3"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  !inputMessage.trim() || isLoading
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                }`}
                title="Enviar mensaje"
              >
                <Send className="w-5 h-5" />
              </button>
              
              <button
                onClick={toggleRecording}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isRecording
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isRecording ? 'Detener grabación' : 'Grabar audio'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                title="Subir archivo de audio"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <div className="mt-4 text-xs text-gray-500">
            <p>💡 <strong>Consejos:</strong> Puedes hacer preguntas sobre gramática, pedir traducciones, o simplemente practicar conversación en inglés.</p>
            <p>🎯 <strong>Nivel actual:</strong> {conversationLevel.charAt(0).toUpperCase() + conversationLevel.slice(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
