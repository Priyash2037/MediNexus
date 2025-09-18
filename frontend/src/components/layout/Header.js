import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationCenter from '../notifications/NotificationCenter';

const Header = ({ toggleDrawer }) => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <h1>MediNexus</h1>
          </Link>
        </div>

        <div className="language-selector">
          <button 
            className={i18n.language === 'en' ? 'active' : ''} 
            onClick={() => changeLanguage('en')}
          >
            EN
          </button>
          <button 
            className={i18n.language === 'hi' ? 'active' : ''} 
            onClick={() => changeLanguage('hi')}
          >
            हिंदी
          </button>
          <button 
            className={i18n.language === 'pa' ? 'active' : ''} 
            onClick={() => changeLanguage('pa')}
          >
            ਪੰਜਾਬੀ
          </button>
        </div>

        <button className="hamburger" onClick={toggleMenu} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          {isAuthenticated ? (
            <>
              {userRole === 'patient' ? (
                <ul>
                  <li>
                    <Link to="/patient/dashboard" onClick={closeMenu}>
                      {t('dashboard')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/patient/appointments" onClick={closeMenu}>
                      {t('appointments')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/patient/records" onClick={closeMenu}>
                      {t('medicalRecords')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/patient/chatbot" onClick={closeMenu}>
                      {t('chatWithAssistant')}
                    </Link>
                  </li>
                </ul>
              ) : (
                <ul>
                  <li>
                    <Link to="/doctor/dashboard" onClick={closeMenu}>
                      {t('dashboard')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/doctor/appointments" onClick={closeMenu}>
                      {t('appointments')}
                    </Link>
                  </li>
                </ul>
              )}
              <button className="logout-btn" onClick={handleLogout}>
                {t('logout')}
              </button>
            </>
          ) : (
            <ul>
              <li>
                <Link to="/login" onClick={closeMenu}>
                  {t('login')}
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMenu}>
                  {t('register')}
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;