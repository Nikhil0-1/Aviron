import { Mission, Telemetry, Detection, Survivor, Alert, MissionReport } from '../../types';

export interface DatabaseService {
  getMissions(): Promise<Mission[]>;
  createMission(mission: Partial<Mission>): Promise<Mission>;
  updateMissionStatus(id: string, status: Mission['status']): Promise<boolean>;
  getTelemetryHistory(unitId: string): Promise<Telemetry[]>;
  persistTelemetry(telemetry: Telemetry): Promise<void>;
  getDetections(): Promise<Detection[]>;
  getSurvivors(): Promise<Survivor[]>;
  getAlerts(): Promise<Alert[]>;
  getMissionReports(): Promise<MissionReport[]>;
}
