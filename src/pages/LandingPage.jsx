import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, BookOpen, Users, Target, Clock } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-quest-blue to-quest-purple rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">🧠</span>
                </div>
                <span className="text-2xl font-bold gradient-text">PolyCore</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-600 hover:text-quest-blue transition-colors">Características</a>
                <a href="#pricing" className="text-gray-600 hover:text-quest-blue transition-colors">Precios</a>
                <a href="#testimonials" className="text-gray-600 hover:text-quest-blue transition-colors">Testimonios</a>
                <Link to="/login" className="bg-quest-blue text-white px-4 py-2 rounded-lg hover:bg-quest-blue-dark transition-colors">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="bg-quest-purple text-white px-6 py-2 rounded-lg hover:bg-quest-purple-dark transition-all transform hover:scale-105 font-semibold">
                  Prueba Gratis
                </Link>
              </div>
            </div>
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900">
                <span className="text-xl">☰</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl fade-in">
                Aprende Inglés Jugando,
                <span className="gradient-text block">Domina el Idioma Creando</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 sm:max-w-xl sm:mx-auto lg:mx-0 fade-in" style={{animationDelay: '0.2s'}}>
                Transforma tu aprendizaje de inglés en una aventura épica con PolyCore. Gana XP, desbloquea logros y compite con amigos mientras dominas el idioma con IA.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 fade-in" style={{animationDelay: '0.4s'}}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register" className="bg-quest-purple text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-quest-purple-dark transition-all transform hover:scale-105 shadow-lg">
                    🚀 Empezar Aventura
                  </Link>
                  <Link to="/login" className="border-2 border-quest-blue text-quest-blue px-8 py-4 rounded-xl text-lg font-semibold hover:bg-quest-blue hover:text-white transition-all">
                    📺 Ver Demo
                  </Link>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  ✨ 14 días de prueba gratis • Sin tarjeta de crédito
                </p>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-xl shadow-xl lg:max-w-md floating">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                  {/* Mock Gamified Interface */}
                  <div className="bg-gradient-to-r from-quest-blue to-quest-purple px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-quest-orange rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">🏆</span>
                        </div>
                        <span className="text-white font-semibold">Nivel B1</span>
                      </div>
                      <div className="text-white text-sm">1,250 XP</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Aventurero del Inglés</h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-quest-orange">🔥</span>
                        <span className="text-sm text-gray-600">12 días</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progreso al siguiente nivel</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-quest-blue to-quest-purple h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-quest-green/10 border border-quest-green rounded-lg p-3 text-center">
                        <div className="text-quest-green font-semibold">156</div>
                        <div className="text-xs text-gray-600">Palabras</div>
                      </div>
                      <div className="bg-quest-blue/10 border border-quest-blue rounded-lg p-3 text-center">
                        <div className="text-quest-blue font-semibold">8</div>
                        <div className="text-xs text-gray-600">Logros</div>
                      </div>
                    </div>

                    <div className="mt-4 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">🧠</span>
                        <span className="text-sm text-gray-700">¡Excelente progreso! ¿Listo para el siguiente desafío en inglés?</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="fade-in">
              <div className="text-3xl font-bold text-quest-blue">15k+</div>
              <div className="text-gray-600 mt-1">Estudiantes de Inglés</div>
            </div>
            <div className="fade-in" style={{animationDelay: '0.1s'}}>
              <div className="text-3xl font-bold text-quest-purple">2,500+</div>
              <div className="text-gray-600 mt-1">Palabras Disponibles</div>
            </div>
            <div className="fade-in" style={{animationDelay: '0.2s'}}>
              <div className="text-3xl font-bold text-quest-green">96%</div>
              <div className="text-gray-600 mt-1">Tasa de Mejora</div>
            </div>
            <div className="fade-in" style={{animationDelay: '0.3s'}}>
              <div className="text-3xl font-bold text-quest-orange">4.9★</div>
              <div className="text-gray-600 mt-1">Calificación</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Todo lo que necesitas para dominar el inglés
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Aprendizaje gamificado potenciado por IA que se adapta a tu ritmo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow fade-in">
              <div className="w-12 h-12 bg-quest-blue rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🎮</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Gamificación Avanzada</h3>
              <p className="text-gray-600">Sistema de niveles, logros y recompensas que mantiene tu motivación al máximo. Cada palabra aprendida te acerca más a tu próximo nivel.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow fade-in" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-quest-purple rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">IA Personalizada</h3>
              <p className="text-gray-600">Tutor inteligente que adapta el contenido a tu ritmo y estilo de aprendizaje. ChatGPT integrado para responder dudas al instante.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-quest-green rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Analytics Detallados</h3>
              <p className="text-gray-600">Monitorea tu progreso con métricas avanzadas. Identifica fortalezas y áreas de mejora para optimizar tu aprendizaje.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow fade-in" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 bg-quest-orange rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Comunidad Activa</h3>
              <p className="text-gray-600">Compite con amigos, participa en desafíos grupales y colabora en proyectos. El aprendizaje es más divertido en equipo.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow fade-in" style={{animationDelay: '0.4s'}}>
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🗣️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Práctica Conversacional</h3>
              <p className="text-gray-600">Habla con IA como si fuera un profesor de inglés altamente calificado. Practica pronunciación y fluidez en tiempo real.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow fade-in" style={{animationDelay: '0.5s'}}>
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Aprendizaje Acelerado</h3>
              <p className="text-gray-600">Técnicas probadas de microlearning y spaced repetition para maximizar la retención y acelerar el dominio del inglés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-quest-blue to-quest-purple py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6 fade-in">
            ¿Listo para comenzar tu aventura de aprendizaje de inglés?
          </h2>
          <p className="text-xl text-blue-100 mb-8 fade-in" style={{animationDelay: '0.1s'}}>
            Únete a miles de estudiantes que ya están transformando su futuro con PolyCore
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{animationDelay: '0.2s'}}>
            <button className="bg-quest-orange text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-quest-orange transition-all transform hover:scale-105 shadow-lg">
              🧠 Comenzar Aventura Gratis
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-quest-blue transition-all">
              🚀 Hablar con IA Ahora
            </button>
          </div>
          <p className="mt-6 text-sm text-blue-100">
            ✨ 14 días de prueba gratis • Cancela en cualquier momento • Sin tarjeta de crédito
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
