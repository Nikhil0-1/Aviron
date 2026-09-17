import { create } from 'zustand';
import { Alert } from '../types';

interface AlertState {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (id: string) => void;
  clearAlerts: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [
    {
      id: 'al-1',
      avironUnitId: 'unit-01',
      avironUnit: { code: 'AVIRON-01', name: 'Alpha Sentinel' },
      severity: 'HIGH',
      title: 'SURVIVOR DETECTED',
      message: 'AI thermal vision confirmed human presence at 28.6152, 77.2120 with 94.2% confidence.',
      isAcknowledged: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'al-2',
      avironUnitId: 'unit-01',
      avironUnit: { code: 'AVIRON-01', name: 'Alpha Sentinel' },
      severity: 'WARNING',
      title: 'OBSTACLE AVOIDANCE ENGAGED',
      message: 'Debris structure detected in primary flight path. Autonomous recalculation active.',
      isAcknowledged: true,
      createdAt: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: 'al-3',
      avironUnitId: 'unit-04',
      avironUnit: { code: 'AVIRON-04', name: 'Delta Scout' },
      severity: 'CRITICAL',
      title: 'UNIT OFFLINE',
      message: 'AVIRON-04 telemetry signal lost. Battery depleted at 12%. Emergency beacon initiated.',
      isAcknowledged: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
    })),

  acknowledgeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, isAcknowledged: true } : a)),
    })),

  clearAlerts: () => set({ alerts: [] }),
}));
