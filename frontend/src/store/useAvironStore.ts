import { create } from 'zustand';
import { AvironUnit, HardwareMode, RaspberryPiConfig } from '../types';

interface AvironState {
  units: AvironUnit[];
  selectedUnitId: string | null;
  mode: HardwareMode;
  raspberryPiConfig: RaspberryPiConfig;

  setUnits: (units: AvironUnit[]) => void;
  updateUnit: (id: string, delta: Partial<AvironUnit>) => void;
  setSelectedUnitId: (id: string | null) => void;
  setMode: (mode: HardwareMode) => void;
  setRaspberryPiConfig: (config: Partial<RaspberryPiConfig>) => void;
}

export const useAvironStore = create<AvironState>((set) => ({
  units: [
    {
      id: 'unit-01',
      code: 'AVIRON-01',
      name: 'Alpha Sentinel',
      model: 'AVIRON Mk-IV Amphibious Recon',
      status: 'ACTIVE',
      battery: 74.0,
      lat: 28.6139,
      lng: 77.2090,
      speed: 4.8,
      heading: 135.0,
      signalStrength: 92,
      ipAddress: '192.168.1.100',
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'unit-02',
      code: 'AVIRON-02',
      name: 'Bravo Vanguard',
      model: 'AVIRON Mk-IV Rapid Drone',
      status: 'STANDBY',
      battery: 91.5,
      lat: 28.6180,
      lng: 77.2150,
      speed: 0.0,
      heading: 0.0,
      signalStrength: 98,
      ipAddress: '192.168.1.101',
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'unit-03',
      code: 'AVIRON-03',
      name: 'Charlie Guardian',
      model: 'AVIRON Mk-III Heavy Payload',
      status: 'CHARGING',
      battery: 42.0,
      lat: 28.6100,
      lng: 77.2020,
      speed: 0.0,
      heading: 270.0,
      signalStrength: 88,
      ipAddress: '192.168.1.102',
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'unit-04',
      code: 'AVIRON-04',
      name: 'Delta Scout',
      model: 'AVIRON Mk-II Micro Drone',
      status: 'OFFLINE',
      battery: 12.0,
      lat: 28.6050,
      lng: 77.1950,
      speed: 0.0,
      heading: 90.0,
      signalStrength: 0,
      ipAddress: '192.168.1.103',
      lastSeen: new Date().toISOString(),
    },
  ],
  selectedUnitId: 'unit-01',
  mode: 'DEMO',
  raspberryPiConfig: {
    host: '192.168.1.100',
    port: 8080,
    protocol: 'WebSocket',
    autoConnect: false,
  },

  setUnits: (units) => set({ units }),
  updateUnit: (id, delta) =>
    set((state) => ({
      units: state.units.map((u) => (u.id === id ? { ...u, ...delta } : u)),
    })),
  setSelectedUnitId: (id) => set({ selectedUnitId: id }),
  setMode: (mode) => set({ mode }),
  setRaspberryPiConfig: (config) =>
    set((state) => ({
      raspberryPiConfig: { ...state.raspberryPiConfig, ...config },
    })),
}));
