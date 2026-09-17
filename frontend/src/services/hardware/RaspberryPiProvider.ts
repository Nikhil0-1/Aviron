import { AvironDataProvider, CommandResponse } from './AvironDataProvider';
import { AvironUnit, Telemetry, Detection, SystemComponent, HardwareMode, RaspberryPiConfig } from '../../types';

export class RaspberryPiProvider implements AvironDataProvider {
  private config: RaspberryPiConfig;
  private ws: WebSocket | null = null;
  private connected = false;
  private telemetryCallbacks: Set<(telemetry: Telemetry) => void> = new Set();

  constructor(config: RaspberryPiConfig) {
    this.config = config;
  }

  getMode(): HardwareMode {
    return 'LIVE_HARDWARE';
  }

  async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const host = this.config.host || window.location.hostname;
        const port = this.config.port || 5000;
        const wsUrl = `${protocol}://${host}:${port}/ws`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.connected = true;
          console.log(`📡 Connected to Live Raspberry Pi Gateway at ${wsUrl}`);
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.event === 'telemetry_update' && data.data) {
              this.telemetryCallbacks.forEach((cb) => cb(data.data));
            }
          } catch (e) {
            console.error('Failed to parse WebSocket packet from Raspberry Pi gateway:', e);
          }
        };

        this.ws.onerror = (err) => {
          console.error('Raspberry Pi WebSocket error:', err);
          this.connected = false;
          resolve(false);
        };

        this.ws.onclose = () => {
          this.connected = false;
          console.log('Raspberry Pi WebSocket disconnected');
        };
      } catch (e) {
        this.connected = false;
        resolve(false);
      }
    });
  }

  async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async getUnitStatus(unitId: string): Promise<AvironUnit | null> {
    try {
      const res = await fetch(`/api/aviron/${unitId}/status`);
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  }

  async getTelemetry(unitId: string): Promise<Telemetry | null> {
    try {
      const res = await fetch(`/api/aviron/${unitId}/telemetry`);
      const data = await res.json();
      return data.data?.[0] || null;
    } catch {
      return null;
    }
  }

  subscribeTelemetry(unitId: string, callback: (telemetry: Telemetry) => void): () => void {
    this.telemetryCallbacks.add(callback);
    return () => this.telemetryCallbacks.delete(callback);
  }

  async sendMission(missionData: any): Promise<CommandResponse> {
    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(missionData),
      });
      const data = await res.json();
      return {
        success: data.success,
        message: data.message || 'Mission transmitted to Raspberry Pi onboard controller.',
        timestamp: new Date().toISOString(),
        data: data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Command transmission failed: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async sendControlCommand(
    unitId: string,
    command: 'START' | 'PAUSED' | 'RESUME' | 'RETURN_BASE' | 'ABORT' | 'EMERGENCY_STOP'
  ): Promise<CommandResponse> {
    try {
      let endpoint = `/api/missions/${unitId}/${command.toLowerCase()}`;
      if (command === 'RETURN_BASE') endpoint = `/api/aviron/${unitId}/return-home`;
      if (command === 'EMERGENCY_STOP') endpoint = `/api/aviron/${unitId}/emergency-stop`;

      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      return {
        success: data.success,
        message: data.message || `Command ${command} acknowledged by Raspberry Pi gateway`,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Command transmission error: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async deployPayload(unitId: string, payloadType: string): Promise<CommandResponse> {
    try {
      const res = await fetch('/api/payload/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avironUnitId: unitId, payloadType }),
      });
      const data = await res.json();
      return {
        success: data.success,
        message: data.message || 'Payload drop servo signal triggered',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Payload error: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getDetections(): Promise<Detection[]> {
    try {
      const res = await fetch('/api/detections');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  }

  async getSystemHealth(): Promise<SystemComponent[]> {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      return data.data?.components || [];
    } catch {
      return [];
    }
  }
}
