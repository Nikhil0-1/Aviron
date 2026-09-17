import { AuthService } from './auth/AuthService';
import { FirebaseAuthService } from './auth/FirebaseAuthService';
import { DemoAuthService } from './auth/DemoAuthService';
import { DatabaseService } from './db/DatabaseService';
import { SupabaseDatabaseService } from './db/SupabaseDatabaseService';
import { DemoDatabaseService } from './db/DemoDatabaseService';
import { StorageService } from './storage/StorageService';
import { R2StorageService } from './storage/R2StorageService';
import { DemoStorageService } from './storage/DemoStorageService';
import { isFirebaseWebConfigured } from '../config/firebase';
import { isSupabaseWebConfigured } from '../config/supabase';

export class ServiceFactory {
  private static authInstance: AuthService | null = null;
  private static dbInstance: DatabaseService | null = null;
  private static storageInstance: StorageService | null = null;

  public static getAuthService(isDemo: boolean = false): AuthService {
    if (isDemo || !isFirebaseWebConfigured) {
      return new DemoAuthService();
    }
    if (!this.authInstance) {
      this.authInstance = new FirebaseAuthService();
    }
    return this.authInstance;
  }

  public static getDatabaseService(isDemo: boolean = false): DatabaseService {
    if (isDemo || !isSupabaseWebConfigured) {
      return new DemoDatabaseService();
    }
    if (!this.dbInstance) {
      this.dbInstance = new SupabaseDatabaseService();
    }
    return this.dbInstance;
  }

  public static getStorageService(isDemo: boolean = false): StorageService {
    if (isDemo) {
      return new DemoStorageService();
    }
    if (!this.storageInstance) {
      this.storageInstance = new R2StorageService();
    }
    return this.storageInstance;
  }
}
