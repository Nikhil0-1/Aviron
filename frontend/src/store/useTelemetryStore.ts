import { create } from 'zustand';
import { Telemetry } from '../types';

interface TelemetryState {
  currentTelemetry: Telemetry;
  history: Telemetry[];
  updateTelemetry: (telemetry: Telemetry) => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  currentTelemetry: {
    avironUnitId: 'unit-01',
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
  history: [],

  updateTelemetry: (telemetry) =>
    set((state) => {
      const updatedHistory = [...state.history, telemetry].slice(-40); // Keep last 40 telemetry points
      return { currentTelemetry: telemetry, history: updatedHistory };
    }),
}));
