import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { firebaseAuth, isFirebaseWebConfigured } from '../../config/firebase';
import { AuthService, AuthResult } from './AuthService';
import { User, Role } from '../../types';

export class FirebaseAuthService implements AuthService {
  async login(email: string, pass: string): Promise<AuthResult> {
    if (!isFirebaseWebConfigured || !firebaseAuth) {
      return this.demoLogin();
    }

    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, pass);
      const fbUser = credential.user;
      const token = await fbUser.getIdToken();

      const user: User = {
        id: fbUser.uid,
        email: fbUser.email || email,
        name: fbUser.displayName || email.split('@')[0],
        role: 'OPERATOR',
      };

      // Sync user profile with Supabase backend
      await this.syncProfileToSupabase(fbUser.uid, user.email, user.name, user.role);

      return { success: true, user, token };
    } catch (error: any) {
      return { success: false, error: error.message || 'Firebase login failed' };
    }
  }

  async register(email: string, pass: string, name: string, role: Role = 'OPERATOR'): Promise<AuthResult> {
    if (!isFirebaseWebConfigured || !firebaseAuth) {
      return this.demoLogin();
    }

    try {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email, pass);
      const fbUser = credential.user;
      const token = await fbUser.getIdToken();

      const user: User = {
        id: fbUser.uid,
        email: fbUser.email || email,
        name: name || email.split('@')[0],
        role,
      };

      await this.syncProfileToSupabase(fbUser.uid, user.email, user.name, user.role);

      return { success: true, user, token };
    } catch (error: any) {
      return { success: false, error: error.message || 'Firebase registration failed' };
    }
  }

  async logout(): Promise<void> {
    if (firebaseAuth) {
      await signOut(firebaseAuth);
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (!isFirebaseWebConfigured || !firebaseAuth) {
      return { success: true, message: 'Simulated reset link sent to ' + email };
    }

    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      return { success: true, message: 'Password reset link sent to ' + email };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to send reset email' };
    }
  }

  async demoLogin(): Promise<AuthResult> {
    const demoUser: User = {
      id: 'demo-firebase-uid-2026',
      email: 'operator@aviron.io',
      name: 'Sarah Connor (Demo)',
      role: 'OPERATOR',
    };
    return {
      success: true,
      user: demoUser,
      token: 'demo-firebase-id-token-2026',
    };
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    if (!isFirebaseWebConfigured || !firebaseAuth) {
      callback({
        id: 'demo-firebase-uid-2026',
        email: 'operator@aviron.io',
        name: 'Sarah Connor',
        role: 'OPERATOR',
      });
      return () => {};
    }

    return onFirebaseAuthStateChanged(firebaseAuth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        callback({
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || 'Operator',
          role: 'OPERATOR',
        });
      } else {
        callback(null);
      }
    });
  }

  private async syncProfileToSupabase(firebase_uid: string, email: string, full_name: string, role: string) {
    try {
      await fetch('/api/profiles/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebase_uid, email, full_name, role }),
      });
    } catch (err) {
      console.warn('Could not sync profile to Supabase backend:', err);
    }
  }
}
