export interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
    picture: string;
  } | null;
  error: string | null;
}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface AuthStore {
  getState(): AuthState;
  setState(state: Partial<AuthState>): void;
  subscribe(callback: (state: AuthState) => void): () => void;
}