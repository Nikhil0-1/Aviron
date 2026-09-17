import { DatabaseService } from './DatabaseService';
import { Mission, Telemetry, Detection, Survivor, Alert, MissionReport } from '../../types';

export class DemoDatabaseService implements DatabaseService {
  private missions: Mission[] = [
    {
      id: 'm-001',
      code: 'AV-001',
      title: 'Flood Rescue & Survivor Extraction',
      type: 'FLOOD_RESCUE',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      targetLat: 28.6155,
      targetLng: 77.2125,
      searchRadius: 600,
      avironUnitId: 'unit-01',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'm-002',
      code: 'AV-002',
      title: 'Medical Supply Drop to Sector 4',
      type: 'MEDICAL_SUPPLY_DELIVERY',
      priority: 'HIGH',
      status: 'READY',
      targetLat: 28.6220,
      targetLng: 77.2210,
      searchRadius: 400,
      avironUnitId: 'unit-02',
      createdAt: new Date().toISOString(),
    },
  ];

  async getMissions(): Promise<Mission[]> {
    return this.missions;
  }

  async createMission(mission: Partial<Mission>): Promise<Mission> {
    const code = `AV-${Math.floor(Math.random() * 900) + 100}`;
    const newM: Mission = {
      id: `m-demo-${Date.now()}`,
      code,
      title: mission.title || 'Rescue Operation',
      type: mission.type || 'FLOOD_RESCUE',
      priority: mission.priority || 'HIGH',
      status: 'READY',
      targetLat: mission.targetLat || 28.6155,
      targetLng: mission.targetLng || 77.2125,
      searchRadius: 500,
      createdAt: new Date().toISOString(),
    };
    this.missions.unshift(newM);
    return newM;
  }

  async updateMissionStatus(id: string, status: Mission['status']): Promise<boolean> {
    const m = this.missions.find((x) => x.id === id);
    if (m) m.status = status;
    return true;
  }

  async getTelemetryHistory(unitId: string): Promise<Telemetry[]> {
    return [
      {
        avironUnitId: unitId,
        battery: 74.0,
        voltage: 22.8,
        current: 14.5,
        speed: 4.8,
        heading: 135.0,
        lat: 28.6139,
        lng: 77.2090,
        altitude: 18.5,
        temperature: 28.4,
        humidity: 78.0,
        airQuality: 92.0,
        gasLevel: 0.02,
        signalStrength: 92,
        networkLatency: 16,
        timestamp: new Date().toISOString(),
      },
    ];
  }

  async persistTelemetry(telemetry: Telemetry): Promise<void> {}

  async getDetections(): Promise<Detection[]> {
    return [
      {
        id: 'det-01',
        avironUnitId: 'unit-01',
        type: 'HUMAN',
        confidence: 94.2,
        lat: 28.6152,
        lng: 77.2120,
        isConfirmed: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async getSurvivors(): Promise<Survivor[]> {
    return [
      {
        id: 'surv-01',
        code: 'SURVIVOR #001',
        missionId: 'm-001',
        status: 'ASSISTANCE_REQUESTED',
        heartRate: 88,
        spO2: 96,
        temperature: 36.9,
        lat: 28.6152,
        lng: 77.2120,
        notes: 'Stranded individual on rooftop in flood sector.',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async getAlerts(): Promise<Alert[]> {
    return [
      {
        id: 'alert-01',
        severity: 'HIGH',
        title: 'SURVIVOR DETECTED',
        message: 'AI thermal vision confirmed human presence at 28.6152, 77.2120 with 94.2% confidence.',
        isAcknowledged: false,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async getMissionReports(): Promise<MissionReport[]> {
    return [
      {
        id: 'rpt-01',
        missionId: 'm-001',
        title: 'Official Rescue Report: AV-001 - Flood Rescue',
        operatorName: 'Sarah Connor',
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date().toISOString(),
        durationMinutes: 34,
        distanceKm: 6.8,
        survivorsFound: 1,
        batteryUsed: 26.0,
        summary: 'AVIRON-01 completed autonomous search and survivor localization in flood zone.',
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
