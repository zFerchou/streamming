import React, { useContext, useState, useEffect } from 'react';
import {
  CButton,
  CCloseButton,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownDivider,
  CDropdownMenu,
  CDropdownToggle,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CNavItem,
  CNavLink,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
  CBadge
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  Home, 
  Video, 
  User, 
  LogIn, 
  UserPlus, 
  Settings, 
  Sun, 
  Moon, 
  LogOut,
  Menu
} from 'lucide-react';
import '../styles/navbar.css'; // Asegúrate de importar el CSS

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setVisible(false);
  };

  return (
    <CNavbar className={`custom-navbar ${scrolled ? 'scrolled' : ''}`} colorScheme="light">
      <CContainer fluid>
        <CNavbarBrand as={Link} to="/" className="navbar-brand">
          <span className="brand-text">Fertube</span>
          {user && <CBadge color="success" className="login-badge">Logueado</CBadge>}
        </CNavbarBrand>
        
        <CNavbarToggler
          aria-controls="offcanvasNavbar"
          onClick={() => setVisible(!visible)}
          className="navbar-toggler"
        >
          <Menu size={24} />
        </CNavbarToggler>
        
        <COffcanvas
          id="offcanvasNavbar"
          placement="end"
          visible={visible}
          onHide={() => setVisible(false)}
          className="offcanvas-menu"
        >
          <COffcanvasHeader className="offcanvas-header">
            <COffcanvasTitle className="offcanvas-title">
              Menú Principal
            </COffcanvasTitle>
            <CCloseButton 
              onClick={() => setVisible(false)} 
              className="close-button"
            />
          </COffcanvasHeader>
          
          <COffcanvasBody className="offcanvas-body">
            <CNavbarNav className="navbar-nav">
              <CNavItem className="nav-item">
                <CNavLink 
                  as={Link} 
                  to="/" 
                  onClick={() => setVisible(false)}
                  className="nav-link"
                >
                  <Home size={18} className="nav-icon" />
                  Inicio
                </CNavLink>
              </CNavItem>
              
              {/* Opciones para usuarios autenticados */}
              {user ? (
                <>
                  
                  
                  <CNavItem className="nav-item">
                    <CNavLink 
                      as={Link} 
                      to="/profile" 
                      onClick={() => setVisible(false)}
                      className="nav-link"
                    >
                      <User size={18} className="nav-icon" />
                      Mi Perfil ({user.username})
                    </CNavLink>
                  </CNavItem>
                </>
              ) : (
                <>
                  <CNavItem className="nav-item">
                    <CNavLink 
                      as={Link} 
                      to="/login" 
                      onClick={() => setVisible(false)}
                      className="nav-link"
                    >
                      <LogIn size={18} className="nav-icon" />
                      Iniciar Sesión
                    </CNavLink>
                  </CNavItem>
                  
                  <CNavItem className="nav-item">
                    <CNavLink 
                      as={Link} 
                      to="/register" 
                      onClick={() => setVisible(false)}
                      className="nav-link"
                    >
                      <UserPlus size={18} className="nav-icon" />
                      Registrarse
                    </CNavLink>
                  </CNavItem>
                </>
              )}

              {user && (
                <CNavItem className="nav-item logout-item">
                  <CButton 
                    color="danger" 
                    onClick={logout} 
                    className="logout-button"
                  >
                    <LogOut size={18} className="logout-icon" />
                    Cerrar Sesión
                  </CButton>
                </CNavItem>
              )}
            </CNavbarNav>
          </COffcanvasBody>
        </COffcanvas>
      </CContainer>
    </CNavbar>
  );
};

export default Navbar;