import { AvironDataProvider, CommandResponse } from './AvironDataProvider';
import { AvironUnit, Telemetry, Detection, SystemComponent, HardwareMode } from '../../types';
import { DemoSimulationEngine } from '../simulation/DemoSimulationEngine';

export class DemoProvider implements AvironDataProvider {
  private engine: DemoSimulationEngine;

  constructor() {
    this.engine = DemoSimulationEngine.getInstance();
  }

  getMode(): HardwareMode {
    return 'DEMO';
  }

  async connect(): Promise<boolean> {
    return true;
  }

  async disconnect(): Promise<void> {
    this.engine.pause();
  }

  isConnected(): boolean {
    return true;
  }

  async getUnitStatus(unitId: string): Promise<AvironUnit | null> {
    return this.engine.getState().unit;
  }

  async getTelemetry(unitId: string): Promise<Telemetry | null> {
    return this.engine.getState().telemetry;
  }

  subscribeTelemetry(unitId: string, callback: (telemetry: Telemetry) => void): () => void {
    return this.engine.subscribe((state) => {
      callback(state.telemetry);
    });
  }

  async sendMission(missionData: any): Promise<CommandResponse> {
    this.engine.reset();
    this.engine.start();
    return {
      success: true,
      message: `[DEMO SIMULATION] Mission ${missionData.title || 'AV-001'} loaded into simulation engine.`,
      timestamp: new Date().toISOString(),
    };
  }

  async sendControlCommand(
    unitId: string,
    command: 'START' | 'PAUSED' | 'RESUME' | 'RETURN_BASE' | 'ABORT' | 'EMERGENCY_STOP'
  ): Promise<CommandResponse> {
    if (command === 'START' || command === 'RESUME') {
      this.engine.start();
    } else if (command === 'PAUSED' || command === 'EMERGENCY_STOP') {
      this.engine.pause();
    } else if (command === 'RETURN_BASE' || command === 'ABORT') {
      this.engine.reset();
    }

    return {
      success: true,
      message: `[DEMO SIMULATION] Command ${command} executed.`,
      timestamp: new Date().toISOString(),
    };
  }

  async deployPayload(unitId: string, payloadType: string): Promise<CommandResponse> {
    return {
      success: true,
      message: `[DEMO SIMULATION] ${payloadType} released to survivor platform.`,
      timestamp: new Date().toISOString(),
    };
  }

  async getDetections(): Promise<Detection[]> {
    return this.engine.getState().detections;
  }

  async getSystemHealth(): Promise<SystemComponent[]> {
    return [
      { id: '1', name: 'Simulated Raspberry Pi Gateway', type: 'HARDWARE', status: 'ONLINE', details: 'Demo Mode Active', lastCheck: new Date().toISOString() },
      { id: '2', name: 'Simulated RTK GPS', type: 'NAVIGATION', status: 'ONLINE', details: '14 Satellites Locked', lastCheck: new Date().toISOString() },
      { id: '3', name: 'Simulated RGB Camera', type: 'CAMERA', status: 'ONLINE', details: '1080p Stream (Demo)', lastCheck: new Date().toISOString() },
      { id: '4', name: 'Simulated FLIR Thermal Core', type: 'CAMERA', status: 'ONLINE', details: '36.9°C Radiometric Core', lastCheck: new Date().toISOString() },
    ];
  }
}
