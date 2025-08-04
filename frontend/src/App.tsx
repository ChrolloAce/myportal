/**
 * Main App component
 * Orchestrates the entire application flow following clean architecture
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { FirebaseAuthManager } from './firebase/FirebaseAuthManager';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm'; 
import { CreatorDashboard } from './components/creator/CreatorDashboard';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { LoginCredentials, RegisterData, UserRole, CreatorUser, AdminUser } from './types';

type AppUser = CreatorUser | AdminUser;

interface AppState {
  isLoading: boolean;
  isAuthenticated: boolean;
  currentUser: AppUser | null;
  showRegister: boolean;
  error: string | null;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isLoading: true,
    isAuthenticated: false,
    currentUser: null,
    showRegister: false,
    error: null
  });

  const authManager = FirebaseAuthManager.getInstance();

  useEffect(() => {
    // Initialize app state and wait for Firebase auth
    const initializeApp = async () => {
      try {
        // Wait for Firebase auth to initialize
        await authManager.waitForAuthInit();
        
        const isAuthenticated = authManager.isAuthenticated();
        const currentUser = authManager.getCurrentUser();

        setState({
          isLoading: false,
          isAuthenticated,
          currentUser: currentUser as AppUser,
          showRegister: false,
          error: null
        });
      } catch (error) {
        console.error('App initialization error:', error);
        setState({
          isLoading: false,
          isAuthenticated: false,
          currentUser: null,
          showRegister: false,
          error: 'Failed to initialize application'
        });
      }
    };

    initializeApp();
  }, []); // Empty dependency array - only run once

  const handleLogin = async (credentials: LoginCredentials): Promise<void> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const response = await authManager.login(credentials);
      
      setState({
        isLoading: false,
        isAuthenticated: true,
        currentUser: response.user as AppUser,
        showRegister: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));
      throw error;
    }
  };

  const handleRegister = async (data: RegisterData): Promise<void> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const response = await authManager.register(data);
      
      setState({
        isLoading: false,
        isAuthenticated: true,
        currentUser: response.user as AppUser,
        showRegister: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));
      throw error;
    }
  };

  const handleLogout = (): void => {
    authManager.logout();
    setState({
      isLoading: false,
      isAuthenticated: false,
      currentUser: null,
      showRegister: false,
      error: null
    });
  };

  const switchToRegister = (): void => {
    setState(prev => ({ ...prev, showRegister: true, error: null }));
  };

  const switchToLogin = (): void => {
    setState(prev => ({ ...prev, showRegister: false, error: null }));
  };

  // Helper function to determine redirect path
  const getDefaultRoute = (): string => {
    if (!state.isAuthenticated || !state.currentUser) return '/login';
    if (state.currentUser.role === UserRole.ADMIN) return '/admin';
    return '/creator';
  };

  if (state.isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <LoadingSpinner size="lg" />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router key={state.isAuthenticated ? 'authenticated' : 'unauthenticated'}>
        <Routes>
          <Route
            path="/login"
            element={
              state.isAuthenticated ? (
                <Navigate to={getDefaultRoute()} replace />
              ) : state.showRegister ? (
                <RegisterForm
                  onRegister={handleRegister}
                  onSwitchToLogin={switchToLogin}
                  isLoading={state.isLoading}
                  error={state.error}
                />
              ) : (
                <LoginForm
                  onLogin={handleLogin}
                  onSwitchToRegister={switchToRegister}
                  isLoading={state.isLoading}
                  error={state.error}
                />
              )
            }
          />
          
          <Route
            path="/creator"
            element={
              state.isAuthenticated && state.currentUser?.role === UserRole.CREATOR ? (
                <CreatorDashboard
                  user={state.currentUser as CreatorUser}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          <Route
            path="/admin"
            element={
              state.isAuthenticated && state.currentUser && state.currentUser.role === UserRole.ADMIN ? (
                <div>Admin Dashboard - Coming Soon</div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          <Route
            path="/"
            element={<Navigate to={getDefaultRoute()} replace />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;