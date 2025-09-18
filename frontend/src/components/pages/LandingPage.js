import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <h1>{t('landingPage.title')}</h1>
          <p>{t('landingPage.subtitle')}</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              {t('landingPage.getStarted')}
            </Link>
            <Link to="/login" className="btn btn-secondary">
              {t('landingPage.login')}
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>{t('landingPage.features.title')}</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="icon-video-call"></i>
            </div>
            <h3>{t('landingPage.features.videoConsultation.title')}</h3>
            <p>{t('landingPage.features.videoConsultation.description')}</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="icon-chatbot"></i>
            </div>
            <h3>{t('landingPage.features.aiAssistant.title')}</h3>
            <p>{t('landingPage.features.aiAssistant.description')}</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="icon-records"></i>
            </div>
            <h3>{t('landingPage.features.medicalRecords.title')}</h3>
            <p>{t('landingPage.features.medicalRecords.description')}</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>{t('landingPage.howItWorks.title')}</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>{t('landingPage.howItWorks.step1.title')}</h3>
            <p>{t('landingPage.howItWorks.step1.description')}</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>{t('landingPage.howItWorks.step2.title')}</h3>
            <p>{t('landingPage.howItWorks.step2.description')}</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>{t('landingPage.howItWorks.step3.title')}</h3>
            <p>{t('landingPage.howItWorks.step3.description')}</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>{t('landingPage.cta.title')}</h2>
        <p>{t('landingPage.cta.description')}</p>
        <Link to="/register" className="btn btn-large">
          {t('landingPage.cta.button')}
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;