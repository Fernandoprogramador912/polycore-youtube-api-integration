import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import VocabularyPage from './pages/VocabularyPage';
import ConversationPage from './pages/ConversationPage';
import LevelDetectionPage from './pages/LevelDetectionPage';
import YouTubePage from './pages/YouTubePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rutas protegidas (requieren autenticación) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/conversation" element={<ConversationPage />} />
          <Route path="/level-detection" element={<LevelDetectionPage />} />
          <Route path="/youtube" element={<YouTubePage />} />
          
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
