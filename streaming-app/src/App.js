import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar'; // Importa el Navbar
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Navbar /> {/* Agrega el Navbar aquí */}
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;