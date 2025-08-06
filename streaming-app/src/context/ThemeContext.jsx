import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Estado para tema: 'light' o 'dark'
  const [theme, setTheme] = useState(() => {
    // Intenta leer el tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    // Si no hay, usar preferencia del sistema
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Cada vez que cambia theme, se actualiza el body y localStorage
  useEffect(() => {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Función para alternar tema
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
