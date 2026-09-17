import { create } from 'zustand';
import { Mission } from '../types';

interface MissionState {
  missions: Mission[];
  activeMission: Mission | null;
  setMissions: (missions: Mission[]) => void;
  setActiveMission: (mission: Mission | null) => void;
  updateMissionStatus: (id: string, status: Mission['status']) => void;
  addMission: (mission: Mission) => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  missions: [
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
      waypoints: [
        { seq: 1, lat: 28.6139, lng: 77.2090, altitude: 20, action: 'TAKEOFF', isReached: true },
        { seq: 2, lat: 28.6145, lng: 77.2105, altitude: 25, action: 'NAVIGATE', isReached: true },
        { seq: 3, lat: 28.6150, lng: 77.2115, altitude: 22, action: 'SEARCH_PATTERN', isReached: true },
        { seq: 4, lat: 28.6155, lng: 77.2125, altitude: 15, action: 'HOVER_SURVIVOR', isReached: false },
        { seq: 5, lat: 28.6160, lng: 77.2140, altitude: 20, action: 'DEPLOY_PAYLOAD', isReached: false },
        { seq: 6, lat: 28.6139, lng: 77.2090, altitude: 20, action: 'RETURN_BASE', isReached: false },
      ],
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
    {
      id: 'm-003',
      code: 'AV-003',
      title: 'Thermal Wildfire Reconnaissance',
      type: 'DISASTER_RECON',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      targetLat: 28.6300,
      targetLng: 77.2300,
      searchRadius: 1000,
      avironUnitId: 'unit-01',
      createdAt: new Date().toISOString(),
    },
  ],
  activeMission: {
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
    waypoints: [
      { seq: 1, lat: 28.6139, lng: 77.2090, altitude: 20, action: 'TAKEOFF', isReached: true },
      { seq: 2, lat: 28.6145, lng: 77.2105, altitude: 25, action: 'NAVIGATE', isReached: true },
      { seq: 3, lat: 28.6150, lng: 77.2115, altitude: 22, action: 'SEARCH_PATTERN', isReached: true },
      { seq: 4, lat: 28.6155, lng: 77.2125, altitude: 15, action: 'HOVER_SURVIVOR', isReached: false },
      { seq: 5, lat: 28.6160, lng: 77.2140, altitude: 20, action: 'DEPLOY_PAYLOAD', isReached: false },
      { seq: 6, lat: 28.6139, lng: 77.2090, altitude: 20, action: 'RETURN_BASE', isReached: false },
    ],
  },

  setMissions: (missions) => set({ missions }),
  setActiveMission: (activeMission) => set({ activeMission }),
  updateMissionStatus: (id, status) =>
    set((state) => ({
      missions: state.missions.map((m) => (m.id === id ? { ...m, status } : m)),
      activeMission: state.activeMission?.id === id ? { ...state.activeMission, status } : state.activeMission,
    })),
  addMission: (mission) =>
    set((state) => ({
      missions: [mission, ...state.missions],
      activeMission: mission,
    })),
}));
