/**
 * AppCoordinator - Manages application-wide state and navigation flow
 * Follows coordinator pattern for centralized app logic
 */

import { BaseUser, UserRole } from '../types';
import { AuthManager } from '../managers/AuthManager';

export enum AppRoute {
  LOGIN = '/login',
  REGISTER = '/register',
  CREATOR_DASHBOARD = '/creator',
  ADMIN_DASHBOARD = '/admin',
  ROOT = '/'
}

export interface AppState {
  isAuthenticated: boolean;
  currentUser: BaseUser | null;
  currentRoute: AppRoute;
}

export class AppCoordinator {
  private static instance: AppCoordinator;
  private authManager: AuthManager;
  private state: AppState;
  private listeners: Array<(state: AppState) => void> = [];

  private constructor() {
    this.authManager = AuthManager.getInstance();
    this.state = this.initializeState();
    this.setupAuthListener();
  }

  public static getInstance(): AppCoordinator {
    if (!AppCoordinator.instance) {
      AppCoordinator.instance = new AppCoordinator();
    }
    return AppCoordinator.instance;
  }

  public getState(): AppState {
    return { ...this.state };
  }

  public subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public navigateToDefaultRoute(): AppRoute {
    const route = this.determineDefaultRoute();
    this.updateRoute(route);
    return route;
  }

  public handleLogin(user: BaseUser): void {
    this.updateState({
      isAuthenticated: true,
      currentUser: user,
      currentRoute: this.determineDefaultRoute(user)
    });
  }

  public handleLogout(): void {
    this.authManager.logout();
    this.updateState({
      isAuthenticated: false,
      currentUser: null,
      currentRoute: AppRoute.LOGIN
    });
  }

  public canAccessRoute(route: AppRoute, user?: BaseUser): boolean {
    const currentUser = user || this.state.currentUser;
    
    if (!currentUser) {
      return route === AppRoute.LOGIN || route === AppRoute.REGISTER;
    }

    switch (route) {
      case AppRoute.CREATOR_DASHBOARD:
        return currentUser.role === UserRole.CREATOR;
      case AppRoute.ADMIN_DASHBOARD:
        return currentUser.role === UserRole.ADMIN;
      case AppRoute.LOGIN:
      case AppRoute.REGISTER:
        return false; // Authenticated users shouldn't access auth pages
      default:
        return true;
    }
  }

  private initializeState(): AppState {
    const currentUser = this.authManager.getCurrentUser();
    const isAuthenticated = this.authManager.isAuthenticated();
    
    return {
      isAuthenticated,
      currentUser,
      currentRoute: this.determineCurrentRoute(isAuthenticated, currentUser)
    };
  }

  private determineDefaultRoute(user?: BaseUser): AppRoute {
    const currentUser = user || this.state.currentUser;
    
    if (!currentUser) return AppRoute.LOGIN;
    
    return currentUser.role === UserRole.ADMIN 
      ? AppRoute.ADMIN_DASHBOARD 
      : AppRoute.CREATOR_DASHBOARD;
  }

  private determineCurrentRoute(isAuthenticated: boolean, user: BaseUser | null): AppRoute {
    if (!isAuthenticated || !user) return AppRoute.LOGIN;
    
    const path = window.location.pathname;
    
    // Map current path to AppRoute enum
    switch (path) {
      case '/admin':
        return AppRoute.ADMIN_DASHBOARD;
      case '/creator':
        return AppRoute.CREATOR_DASHBOARD;
      case '/login':
        return AppRoute.LOGIN;
      case '/register':
        return AppRoute.REGISTER;
      default:
        return this.determineDefaultRoute(user);
    }
  }

  private updateRoute(route: AppRoute): void {
    this.updateState({
      ...this.state,
      currentRoute: route
    });
  }

  private updateState(newState: Partial<AppState>): void {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  private setupAuthListener(): void {
    // Listen for storage changes (e.g., logout from another tab)
    window.addEventListener('storage', (event) => {
      if (event.key === 'video_dashboard_token' || event.key === 'video_dashboard_user') {
        const isAuthenticated = this.authManager.isAuthenticated();
        const currentUser = this.authManager.getCurrentUser();
        
        this.updateState({
          isAuthenticated,
          currentUser,
          currentRoute: isAuthenticated && currentUser ? this.determineDefaultRoute(currentUser) : AppRoute.LOGIN
        });
      }
    });
  }
}