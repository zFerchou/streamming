import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav className={`navbar ${theme}`}>
      <Link to="/">StreamingApp</Link>
      <div>
        <button onClick={toggleTheme}>
          {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
        {user ? (
          <>
            <Link to="/profile">{user.username}</Link>
            <button onClick={logout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
