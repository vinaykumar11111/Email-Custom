import { AuthState, AuthStore } from './types';

class AuthStateStore implements AuthStore {
  private state: AuthState = {
    isAuthenticated: false,
    user: null,
    error: null
  };
  private listeners: ((state: AuthState) => void)[] = [];

  getState(): AuthState {
    return this.state;
  }

  setState(newState: Partial<AuthState>): void {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  subscribe(callback: (state: AuthState) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const authStore = new AuthStateStore();