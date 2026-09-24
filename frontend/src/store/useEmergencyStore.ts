import { create } from 'zustand';
import { EmergencyRequest, EmergencyStatus, IncidentMedia } from '../types';

interface EmergencyState {
  requests: EmergencyRequest[];
  activeRequestId: string | null;

  setRequests: (requests: EmergencyRequest[]) => void;
  addRequest: (request: Partial<EmergencyRequest>) => EmergencyRequest;
  updateRequestStatus: (id: string, status: EmergencyStatus) => void;
  assignTeamAndAviron: (id: string, teamId: string, teamName: string, avironId: string, avironCode: string) => void;
  addMediaToRequest: (requestId: string, media: IncidentMedia) => void;
  setActiveRequestId: (id: string | null) => void;
}

const INITIAL_EMERGENCY_REQUESTS: EmergencyRequest[] = [
  {
    id: 'er-001',
    requestCode: 'ER-2026-001',
    victimId: 'usr-victim-01',
    victimName: 'Aarav Kumar',
    victimPhone: '+91 98765 43210',
    type: 'FLOOD',
    priority: 'CRITICAL',
    description: 'Stranded on rooftop of submerged residential block near Sector 4 Riverbank. Water rising rapidly.',
    condition: 'Cannot move, 2 family members with minor injuries, need immediate evacuation and medical kit.',
    lat: 28.6152,
    lng: 77.2120,
    locationName: 'Sector 4 Flood Plain, Delhi',
    status: 'AVIRON_DEPLOYED',
    assignedTeamId: 'team-alpha',
    assignedTeamName: 'Team Alpha (Rapid Recon)',
    assignedAvironId: 'unit-01',
    assignedAvironCode: 'AVIRON-01',
    etaMinutes: 4,
    distanceKm: 1.2,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    media: [
      {
        id: 'med-01',
        incidentId: 'er-001',
        uploadedBy: 'usr-victim-01',
        fileName: 'flooded_building_rooftop.jpg',
        fileType: 'IMAGE',
        r2Key: 'aviron/incidents/er-001/flooded_building_rooftop.jpg',
        url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
        fileSize: 2450000,
        createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'er-002',
    requestCode: 'ER-2026-002',
    victimId: 'usr-victim-02',
    victimName: 'Priya Sharma',
    victimPhone: '+91 98111 22233',
    type: 'MEDICAL',
    priority: 'HIGH',
    description: 'Elderly citizen experiencing severe respiratory distress during storm outage.',
    condition: 'Need emergency oxygen & pulse monitor.',
    lat: 28.6220,
    lng: 77.2190,
    locationName: 'East Avenue Block C',
    status: 'ASSIGNED',
    assignedTeamId: 'team-bravo',
    assignedTeamName: 'Team Bravo (Medical Unit)',
    assignedAvironId: 'unit-02',
    assignedAvironCode: 'AVIRON-02',
    etaMinutes: 8,
    distanceKm: 3.4,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'er-003',
    requestCode: 'ER-2026-003',
    victimId: 'usr-victim-03',
    victimName: 'Rohan Verma',
    victimPhone: '+91 99887 76655',
    type: 'TRAPPED',
    priority: 'MEDIUM',
    description: 'Vehicle stalled in flooded underpass, door jammed by water pressure.',
    condition: 'Trapped inside, safe for now but water creeping into floor.',
    lat: 28.6080,
    lng: 77.2010,
    locationName: 'Mayur Vihar Flyover Loop',
    status: 'NEW',
    etaMinutes: 12,
    distanceKm: 5.1,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useEmergencyStore = create<EmergencyState>((set, get) => ({
  requests: INITIAL_EMERGENCY_REQUESTS,
  activeRequestId: 'er-001',

  setRequests: (requests) => set({ requests }),

  addRequest: (partial) => {
    const newReq: EmergencyRequest = {
      id: `er-${Date.now()}`,
      requestCode: `ER-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      victimId: partial.victimId || 'usr-victim-01',
      victimName: partial.victimName || 'Aarav Kumar',
      victimPhone: partial.victimPhone || '+91 98765 43210',
      type: partial.type || 'FLOOD',
      priority: partial.priority || 'CRITICAL',
      description: partial.description || 'Emergency assistance requested by victim.',
      condition: partial.condition || 'Need immediate rescue assistance.',
      lat: partial.lat || 28.6152,
      lng: partial.lng || 77.2120,
      locationName: partial.locationName || 'Current GPS Location',
      status: 'NEW',
      etaMinutes: 5,
      distanceKm: 1.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      media: [],
    };

    set((state) => ({
      requests: [newReq, ...state.requests],
      activeRequestId: newReq.id,
    }));

    return newReq;
  },

  updateRequestStatus: (id, status) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              updatedAt: new Date().toISOString(),
              resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : r.resolvedAt,
            }
          : r
      ),
    }));
  },

  assignTeamAndAviron: (id, teamId, teamName, avironId, avironCode) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              assignedTeamId: teamId,
              assignedTeamName: teamName,
              assignedAvironId: avironId,
              assignedAvironCode: avironCode,
              status: 'ASSIGNED',
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }));
  },

  addMediaToRequest: (requestId, media) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              media: [...(r.media || []), media],
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }));
  },

  setActiveRequestId: (id) => set({ activeRequestId: id }),
}));
