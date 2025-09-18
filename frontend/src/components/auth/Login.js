import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const { t } = useTranslation();
  const { login, error } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Simple validation
    if (!formData.email || !formData.password) {
      setFormError(t('auth.errors.allFieldsRequired'));
      return;
    }
    
    try {
      setLoading(true);
      const { data } = await login(formData.email, formData.password);
      
      if (!data || !data.user) {
        throw new Error('Login failed');
      }
      
      // Redirect based on user role from metadata
      const userType = data.user.user_metadata?.user_type || 'patient';
      
      if (userType === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setFormError(error.message || t('auth.errors.loginFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{t('auth.login.title')}</h2>
        
        {(formError || error) && (
          <div className="auth-error">
            {formError || error}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('auth.fields.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('auth.placeholders.email')}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('auth.fields.password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('auth.placeholders.password')}
              disabled={loading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? t('auth.loading') : t('auth.login.button')}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            {t('auth.login.noAccount')} <Link to="/register">{t('auth.login.registerLink')}</Link>
          </p>
          <p>
            <Link to="/forgot-password">{t('auth.login.forgotPassword')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;