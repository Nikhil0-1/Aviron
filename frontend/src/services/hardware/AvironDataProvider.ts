import { AvironUnit, Telemetry, Detection, SystemComponent, HardwareMode } from '../../types';

export interface CommandResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data?: any;
}

export interface AvironDataProvider {
  getMode(): HardwareMode;
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  
  // Status & Telemetry
  getUnitStatus(unitId: string): Promise<AvironUnit | null>;
  getTelemetry(unitId: string): Promise<Telemetry | null>;
  subscribeTelemetry(unitId: string, callback: (telemetry: Telemetry) => void): () => void;
  
  // Controls
  sendMission(missionData: any): Promise<CommandResponse>;
  sendControlCommand(unitId: string, command: 'START' | 'PAUSED' | 'RESUME' | 'RETURN_BASE' | 'ABORT' | 'EMERGENCY_STOP'): Promise<CommandResponse>;
  deployPayload(unitId: string, payloadType: string): Promise<CommandResponse>;
  
  // Detections & System Health
  getDetections(): Promise<Detection[]>;
  getSystemHealth(): Promise<SystemComponent[]>;
}
