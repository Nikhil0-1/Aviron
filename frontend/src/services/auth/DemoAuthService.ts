import { AuthService, AuthResult } from './AuthService';
import { User, Role } from '../../types';

export class DemoAuthService implements AuthService {
  private currentUser: User = {
    id: 'demo-operator-id',
    email: 'operator@aviron.io',
    name: 'Sarah Connor (Demo)',
    role: 'OPERATOR',
  };

  async login(email: string, pass: string): Promise<AuthResult> {
    return this.demoLogin();
  }

  async register(email: string, pass: string, name: string, role: Role = 'OPERATOR'): Promise<AuthResult> {
    return {
      success: true,
      user: {
        id: `demo-${Date.now()}`,
        email,
        name: name || 'Demo Operator',
        role,
      },
      token: 'demo-registered-token-2026',
    };
  }

  async logout(): Promise<void> {}

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: `[DEMO] Reset password email simulated for ${email}` };
  }

  async demoLogin(): Promise<AuthResult> {
    return {
      success: true,
      user: this.currentUser,
      token: 'demo-jwt-token-2026',
    };
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    callback(this.currentUser);
    return () => {};
  }
}
