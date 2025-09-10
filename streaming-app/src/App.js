import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import './styles/global.css';
import '@coreui/coreui/dist/css/coreui.min.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Navbar />
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 