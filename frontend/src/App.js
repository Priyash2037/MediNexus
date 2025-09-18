import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Page Components
import LandingPage from './components/pages/LandingPage';
import PatientDashboard from './components/dashboard/PatientDashboard';
import DoctorDashboard from './components/dashboard/DoctorDashboard';
import Appointments from './components/appointments/Appointments';
import VideoCall from './components/video/VideoCall';
import Chatbot from './components/chatbot/Chatbot';
import MedicalRecords from './components/records/MedicalRecords';
import NotFound from './components/pages/NotFound';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function AppContent() {
  const { t } = useTranslation();
  const { isAuthenticated, userRole } = useAuth();

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes - Patient */}
          <Route 
            path="/patient/dashboard" 
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/appointments" 
            element={
              <ProtectedRoute requiredRole="patient">
                <Appointments userType="patient" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/records" 
            element={
              <ProtectedRoute requiredRole="patient">
                <MedicalRecords />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/chatbot" 
            element={
              <ProtectedRoute requiredRole="patient">
                <Chatbot />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Doctor */}
          <Route 
            path="/doctor/dashboard" 
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/appointments" 
            element={
              <ProtectedRoute requiredRole="doctor">
                <Appointments userType="doctor" />
              </ProtectedRoute>
            } 
          />
          
          {/* Common Protected Routes */}
          <Route 
            path="/video/:appointmentId" 
            element={
              <ProtectedRoute>
                <VideoCall />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;