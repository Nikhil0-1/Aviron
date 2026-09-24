import { create } from 'zustand';
import { User, Role } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  login: (token: string, user: User, isDemo?: boolean) => void;
  switchRole: (role: Role) => void;
  logout: () => void;
}

export const DEMO_USERS: Record<Role, User> = {
  ADMIN: {
    id: 'usr-admin-01',
    name: 'Cmdr. Helena Vance',
    email: 'admin@aviron.io',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  TEAM_LEADER: {
    id: 'usr-team-lead-01',
    name: 'Capt. Rahul Sharma',
    email: 'rahul.sharma@aviron.io',
    role: 'TEAM_LEADER',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  },
  RESCUE_OPERATOR: {
    id: 'usr-operator-01',
    name: 'Sarah Connor',
    email: 'operator@aviron.io',
    role: 'RESCUE_OPERATOR',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  MEDICAL_OPERATOR: {
    id: 'usr-medic-01',
    name: 'Dr. Amit Patel',
    email: 'medic@aviron.io',
    role: 'MEDICAL_OPERATOR',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  },
  VICTIM: {
    id: 'usr-victim-01',
    name: 'Aarav Kumar',
    email: 'aarav.kumar@gmail.com',
    role: 'VICTIM',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  VIEWER: {
    id: 'usr-viewer-01',
    name: 'Observer Tech',
    email: 'viewer@aviron.io',
    role: 'VIEWER',
  },
  OPERATOR: {
    id: 'usr-operator-01',
    name: 'Sarah Connor',
    email: 'operator@aviron.io',
    role: 'RESCUE_OPERATOR',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: DEMO_USERS.ADMIN,
  token: 'demo-jwt-token-2026',
  isAuthenticated: true,
  isDemo: true,

  login: (token, user, isDemo = false) => {
    localStorage.setItem('aviron_token', token);
    set({ token, user, isAuthenticated: true, isDemo });
  },

  switchRole: (role) => {
    const newUser = DEMO_USERS[role] || DEMO_USERS.ADMIN;
    set({ user: newUser });
  },

  logout: () => {
    localStorage.removeItem('aviron_token');
    set({ user: null, token: null, isAuthenticated: false, isDemo: false });
  },
}));
