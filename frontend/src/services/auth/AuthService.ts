import { User, Role } from '../../types';

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface AuthService {
  login(email: string, pass: string): Promise<AuthResult>;
  register(email: string, pass: string, name: string, role?: Role): Promise<AuthResult>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<{ success: boolean; message: string }>;
  demoLogin(): Promise<AuthResult>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
