/**
 * Main App component
 * Orchestrates the entire application flow following clean architecture
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { FirebaseAuthManager } from './firebase/FirebaseAuthManager';
import { FirebaseOnboardingManager } from './firebase/FirebaseOnboardingManager';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm'; 
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { CreatorDashboard } from './components/creator/CreatorDashboardModern';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { InviteLanding } from './components/invite/InviteLanding';
import { LoginCredentials, RegisterData, UserRole, CreatorUser, AdminUser, CreatorOnboardingData, AdminOnboardingData, CorporationOnboarding } from './types';

type AppUser = CreatorUser | AdminUser;

// Wrapper component for invite route to properly extract params
const InviteRoute: React.FC<{ onJoinSuccess: () => void }> = ({ onJoinSuccess }) => {
  const { inviteCode } = useParams<{ inviteCode: string }>();

  // Debug logging for mobile issues
  console.log('🔍 InviteRoute: Raw inviteCode from params:', inviteCode);
  console.log('🔍 InviteRoute: inviteCode length:', inviteCode?.length);
  console.log('🔍 InviteRoute: Current URL:', window.location.href);

  if (!inviteCode) {
    console.log('❌ InviteRoute: No invite code found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Trim whitespace and decode URI component (mobile browsers might encode differently)
  const cleanInviteCode = decodeURIComponent(inviteCode.trim());
  console.log('🔍 InviteRoute: Cleaned inviteCode:', cleanInviteCode);

  return (
    <InviteLanding
      inviteCode={cleanInviteCode}
      onJoinSuccess={onJoinSuccess}
    />
  );
};

interface AppState {
  isLoading: boolean;
  isAuthenticated: boolean;
  currentUser: AppUser | null;
  showRegister: boolean;
  needsOnboarding: boolean;
  error: string | null;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isLoading: true,
    isAuthenticated: false,
    currentUser: null,
    showRegister: false,
    needsOnboarding: false,
    error: null
  });

  const authManager = FirebaseAuthManager.getInstance();
  const onboardingManager = FirebaseOnboardingManager.getInstance();

  useEffect(() => {
    // Initialize app state and wait for Firebase auth
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing app - waiting for Firebase auth...');
        
        // Wait for Firebase auth to fully initialize (including user profile loading)
        await authManager.waitForAuthInit();
        
        const isAuthenticated = authManager.isAuthenticated();
        const currentUser = authManager.getCurrentUser();
        
        // Check if user needs onboarding
        let needsOnboarding = false;
        if (isAuthenticated && currentUser) {
          needsOnboarding = await onboardingManager.needsOnboarding(currentUser);
        }
        
        console.log('✅ Firebase auth initialized:', { 
          isAuthenticated, 
          userRole: currentUser?.role,
          userEmail: currentUser?.email,
          needsOnboarding
        });

        setState({
          isLoading: false,
          isAuthenticated,
          currentUser: currentUser as AppUser,
          showRegister: false,
          needsOnboarding,
          error: null
        });
      } catch (error) {
        console.error('❌ App initialization error:', error);
        setState({
          isLoading: false,
          isAuthenticated: false,
          currentUser: null,
          showRegister: false,
          needsOnboarding: false,
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
      
      // Check if user needs onboarding
      const needsOnboarding = await onboardingManager.needsOnboarding(response.user);
      
      setState({
        isLoading: false,
        isAuthenticated: true,
        currentUser: response.user as AppUser,
        showRegister: false,
        needsOnboarding,
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
      
      // New users always need onboarding
      const needsOnboarding = true;
      
      setState({
        isLoading: false,
        isAuthenticated: true,
        currentUser: response.user as AppUser,
        showRegister: false,
        needsOnboarding,
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

  const handleGoogleSignIn = async (role: UserRole): Promise<void> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const response = await authManager.signInWithGoogle(role);
      
      // Check if user needs onboarding (could be existing or new Google user)
      const needsOnboarding = await onboardingManager.needsOnboarding(response.user);
      
      setState({
        isLoading: false,
        isAuthenticated: true,
        currentUser: response.user as AppUser,
        showRegister: false,
        needsOnboarding,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google sign-in failed';
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
      needsOnboarding: false,
      error: null
    });
  };

  const switchToRegister = (): void => {
    setState(prev => ({ ...prev, showRegister: true, error: null }));
  };

  const switchToLogin = (): void => {
    setState(prev => ({ ...prev, showRegister: false, error: null }));
  };

  // Handle onboarding completion
  const handleOnboardingComplete = async (data: CreatorOnboardingData | (AdminOnboardingData & { corporationData: CorporationOnboarding })): Promise<void> => {
    if (!state.currentUser) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let updatedUser: AppUser;
      
      if (state.currentUser.role === UserRole.CREATOR) {
        updatedUser = await onboardingManager.completeCreatorOnboarding(
          state.currentUser.id,
          data as CreatorOnboardingData
        );
      } else {
        updatedUser = await onboardingManager.completeAdminOnboarding(
          state.currentUser.id,
          data as AdminOnboardingData & { corporationData: CorporationOnboarding }
        );
      }
      
      setState({
        isLoading: false,
        isAuthenticated: true,
        currentUser: updatedUser,
        showRegister: false,
        needsOnboarding: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Onboarding failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  };

  // Handle onboarding skip
  const handleOnboardingSkip = async (): Promise<void> => {
    if (!state.currentUser) return;
    
    try {
      await onboardingManager.skipOnboarding(state.currentUser.id, state.currentUser.role);
      setState(prev => ({
        ...prev,
        needsOnboarding: false
      }));
    } catch (error) {
      console.error('Failed to skip onboarding:', error);
    }
  };

  // Helper function to determine redirect path
  const getDefaultRoute = (): string => {
    if (!state.isAuthenticated || !state.currentUser) return '/login';
    if (state.needsOnboarding) return '/onboarding';
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
                  onGoogleSignIn={handleGoogleSignIn}
                  onSwitchToLogin={switchToLogin}
                  isLoading={state.isLoading}
                  error={state.error}
                />
              ) : (
                <LoginForm
                  onLogin={handleLogin}
                  onGoogleSignIn={handleGoogleSignIn}
                  onSwitchToRegister={switchToRegister}
                  isLoading={state.isLoading}
                  error={state.error}
                />
              )
            }
          />
          
          <Route
            path="/onboarding"
            element={
              state.isAuthenticated && state.currentUser && state.needsOnboarding ? (
                <OnboardingWizard
                  userRole={state.currentUser.role}
                  onComplete={handleOnboardingComplete}
                  onSkip={handleOnboardingSkip}
                />
              ) : (
                <Navigate to={getDefaultRoute()} replace />
              )
            }
          />
          
          <Route
            path="/invite/:inviteCode"
            element={
              <InviteRoute
                onJoinSuccess={async () => {
                  // Refresh user profile to get updated corporation info
                  const updatedUser = await authManager.refreshUserProfile();
                  if (updatedUser) {
                    setState(prev => ({
                      ...prev,
                      currentUser: updatedUser as AppUser
                    }));
                    
                    // Navigate to appropriate dashboard based on user role
                    const targetRoute = updatedUser.role === UserRole.ADMIN ? '/admin' : '/creator';
                    window.location.href = targetRoute;
                  } else {
                    // Fallback to reload if profile refresh fails
                    window.location.reload();
                  }
                }}
              />
            }
          />
          
          <Route
            path="/creator"
            element={
              state.isAuthenticated && state.currentUser?.role === UserRole.CREATOR && !state.needsOnboarding ? (
                <CreatorDashboard
                  user={state.currentUser as CreatorUser}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to={getDefaultRoute()} replace />
              )
            }
          />
          
          <Route
            path="/admin"
            element={
              state.isAuthenticated && state.currentUser && state.currentUser.role === UserRole.ADMIN && !state.needsOnboarding ? (
                <AdminDashboard
                  user={state.currentUser as AdminUser}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to={getDefaultRoute()} replace />
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