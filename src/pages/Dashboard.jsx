import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  MessageCircle, 
  Target, 
  Play, 
  Settings, 
  BarChart3, 
  Trophy, 
  Calendar,
  LogOut,
  User,
  Star,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: 'Fernando',
    level: 'Intermedio',
    xp: 1250,
    streak: 7,
    totalLessons: 24,
    completedLessons: 18
  });

  const handleLogout = () => {
    // Aquí iría la lógica de logout
    navigate('/');
  };

  const progressPercentage = (user.completedLessons / user.totalLessons) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-2 mr-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">PolyCore English</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">¡Bienvenido de vuelta, {user.name}! 👋</h2>
              <p className="text-purple-100">Continúa tu viaje de aprendizaje del inglés</p>
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Nivel: {user.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm">{user.xp} XP</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{user.streak}</div>
              <div className="text-sm text-purple-100">Días seguidos 🔥</div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* XP Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Progreso XP</h3>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{user.xp}</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((user.xp % 1000) / 10, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {1000 - (user.xp % 1000)} XP para el siguiente nivel
            </p>
          </div>

          {/* Lesson Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Lecciones</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {user.completedLessons}/{user.totalLessons}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {Math.round(progressPercentage)}% completado
            </p>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Racha</h3>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{user.streak}</div>
            <div className="flex space-x-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < user.streak ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Días seguidos aprendiendo
            </p>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Level Detection */}
          <Link to="/level-detection" className="group">
            <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-3 w-fit mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Detección de Nivel</h3>
              <p className="text-gray-600 text-sm mb-4">
                Descubre tu nivel actual de inglés con nuestro test inteligente
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                Comenzar test
                <Play className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Vocabulary */}
          <Link to="/vocabulary" className="group">
            <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 w-fit mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Vocabulario</h3>
              <p className="text-gray-600 text-sm mb-4">
                Aprende nuevas palabras con ejercicios interactivos
              </p>
              <div className="flex items-center text-green-600 text-sm font-medium group-hover:text-green-700">
                Explorar palabras
                <Play className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* AI Conversation */}
          <Link to="/conversation" className="group">
            <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 w-fit mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Conversación IA</h3>
              <p className="text-gray-600 text-sm mb-4">
                Practica inglés con nuestra IA conversacional
              </p>
              <div className="flex items-center text-purple-600 text-sm font-medium group-hover:text-purple-700">
                Chatear ahora
                <Play className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Daily Exercises */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-3 w-fit mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ejercicios Diarios</h3>
            <p className="text-gray-600 text-sm mb-4">
              Ejercicios personalizados para cada día
            </p>
            <div className="flex items-center text-orange-600 text-sm font-medium">
              Próximamente
              <Clock className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* YouTube Learning */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-3 w-fit mb-4">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">YouTube Learning</h3>
            <p className="text-gray-600 text-sm mb-4">
              Aprende con videos y subtítulos interactivos
            </p>
            <div className="flex items-center text-red-600 text-sm font-medium">
              Próximamente
              <Clock className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-3 w-fit mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Estadísticas</h3>
            <p className="text-gray-600 text-sm mb-4">
              Analiza tu progreso detallado
            </p>
            <div className="flex items-center text-indigo-600 text-sm font-medium">
              Próximamente
              <Clock className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
              <Target className="w-4 h-4" />
              <span>Test de Nivel</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105">
              <BookOpen className="w-4 h-4" />
              <span>Nueva Lección</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105">
              <MessageCircle className="w-4 h-4" />
              <span>Chatear con IA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
