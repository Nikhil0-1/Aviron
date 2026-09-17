import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  login: (token: string, user: User, isDemo?: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'demo-operator-id',
    name: 'Sarah Connor',
    email: 'operator@aviron.io',
    role: 'OPERATOR',
  },
  token: 'demo-jwt-token-2026',
  isAuthenticated: true,
  isDemo: true,

  login: (token, user, isDemo = false) => {
    localStorage.setItem('aviron_token', token);
    set({ token, user, isAuthenticated: true, isDemo });
  },

  logout: () => {
    localStorage.removeItem('aviron_token');
    set({ user: null, token: null, isAuthenticated: false, isDemo: false });
  },
}));
