import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Users, BookOpen, Star, ArrowRight } from 'lucide-react';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/Home'); 
  };

  
  const features = [
    {
      icon: <Play size={32} />,
      title: "Miles de videos",
      description: "Accede a contenido educativo de alta calidad"
    },
    {
      icon: <Users size={32} />,
      title: "Comunidad activa",
      description: "Conecta con otros estudiantes y educadores"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Aprendizaje personalizado",
      description: "Contenido adaptado a tus intereses y necesidades"
    },
    {
      icon: <Star size={32} />,
      title: "Sistema de recomendaciones",
      description: "Descubre contenido relevante basado en tus preferencias"
    }
  ];

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-header">
          <h1 className="welcome-title">Bienvenido a Fertube</h1>
          <p className="welcome-subtitle">La plataforma de videos de tu interés</p>
        </div>
        
        <div className="welcome-features">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <button className="welcome-button" onClick={handleStart}>
          Comenzar a explorar
          <ArrowRight size={20} className="button-icon" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;