import React, { useContext, useState } from 'react';
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

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setVisible(false);
  };

  return (
    <CNavbar className={`bg-body-tertiary ${theme === 'dark' ? 'bg-dark' : ''}`} colorScheme="dark">
      <CContainer fluid>
        <CNavbarBrand as={Link} to="/" className="d-flex align-items-center">
          <span className="me-2">Jajajalolxd</span>
          {user && <CBadge color="success">logueado</CBadge>}
        </CNavbarBrand>
        
        <CNavbarToggler
          aria-controls="offcanvasNavbar"
          onClick={() => setVisible(!visible)}
        />
        
        <COffcanvas
          id="offcanvasNavbar"
          placement="end"
          visible={visible}
          onHide={() => setVisible(false)}
          className={theme === 'dark' ? 'bg-dark text-white' : ''}
        >
          <COffcanvasHeader>
            <COffcanvasTitle>Menú Principal</COffcanvasTitle>
            <CCloseButton onClick={() => setVisible(false)} />
          </COffcanvasHeader>
          
          <COffcanvasBody>
            <CNavbarNav className="justify-content-end flex-grow-1 pe-3">
              <CNavItem>
                <CNavLink as={Link} to="/" onClick={() => setVisible(false)}>
                  Inicio
                </CNavLink>
              </CNavItem>
              
              {/* Opciones para usuarios autenticados */}
              {user ? (
                <>
                  <CNavItem>
                    <CNavLink as={Link} to="/upload" onClick={() => setVisible(false)}>
                      Subir Video
                    </CNavLink>
                  </CNavItem>
                  
                  <CNavItem>
                    <CNavLink as={Link} to="/live" onClick={() => setVisible(false)}>
                      Transmisión en Vivo
                    </CNavLink>
                  </CNavItem>
                  
                  <CNavItem>
                    <CNavLink as={Link} to="/profile" onClick={() => setVisible(false)}>
                      Mi Perfil ({user.username})
                    </CNavLink>
                  </CNavItem>
                  
                  
                </>
              ) : (
                <>
                  <CNavItem>
                    <CNavLink as={Link} to="/login" onClick={() => setVisible(false)}>
                      Iniciar Sesión
                    </CNavLink>
                  </CNavItem>
                  
                  <CNavItem>
                    <CNavLink as={Link} to="/register" onClick={() => setVisible(false)}>
                      Registrarse
                    </CNavLink>
                  </CNavItem>
                </>
              )}

              
              
              {/* Menú desplegable para configuración */}
              <CDropdown variant="nav-item" popper={false}>
                <CDropdownToggle color="secondary">
                  Configuración
                </CDropdownToggle>
                <CDropdownMenu className={theme === 'dark' ? 'bg-dark' : ''}>
                  <CDropdownItem onClick={() => { toggleTheme(); setVisible(false); }}>
                    {theme === 'dark' ? 'Modo Claro ☀️' : 'Modo Oscuro 🌙'}
                  </CDropdownItem>
                  {user && (
                    <>
                      <CDropdownDivider />
                      <CDropdownItem as={Link} to="/profile/settings" onClick={() => setVisible(false)}>
                        Configuración de Perfil
                      </CDropdownItem>
                    </>

                    
                  )}
                </CDropdownMenu>
              </CDropdown>
              <CNavItem className="mt-2">
                    <CButton color="danger" onClick={logout} className="w-100">
                      Cerrar Sesión
                    </CButton>
                  </CNavItem>
            </CNavbarNav>
          </COffcanvasBody>
        </COffcanvas>
      </CContainer>
    </CNavbar>
  );
};

export default Navbar;