import { Router } from 'express';

const router = Router();

export interface EmergencyRecord {
  id: string;
  requestCode: string;
  victimId: string;
  victimName: string;
  victimPhone?: string;
  type: string;
  priority: string;
  description: string;
  condition: string;
  lat: number;
  lng: number;
  locationName: string;
  status: string;
  assignedTeamId?: string;
  assignedTeamName?: string;
  assignedAvironId?: string;
  assignedAvironCode?: string;
  createdAt: string;
  updatedAt: string;
}

let emergencyRequests: EmergencyRecord[] = [
  {
    id: 'er-001',
    requestCode: 'ER-2026-001',
    victimId: 'usr-victim-01',
    victimName: 'Aarav Kumar',
    type: 'FLOOD',
    priority: 'CRITICAL',
    description: 'Stranded on rooftop of submerged residential block near Sector 4 Riverbank.',
    condition: 'Cannot move, 2 family members with minor injuries',
    lat: 28.6152,
    lng: 77.2120,
    locationName: 'Sector 4 Flood Plain, Delhi',
    status: 'AVIRON_DEPLOYED',
    assignedTeamId: 'team-alpha',
    assignedTeamName: 'Team Alpha (Rapid Recon)',
    assignedAvironId: 'unit-01',
    assignedAvironCode: 'AVIRON-01',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'er-002',
    requestCode: 'ER-2026-002',
    victimId: 'usr-victim-02',
    victimName: 'Priya Sharma',
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
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET /api/emergencies
router.get('/', (req, res) => {
  res.json({ success: true, count: emergencyRequests.length, data: emergencyRequests });
});

// POST /api/emergencies
router.post('/', (req, res) => {
  const { victimId, victimName, victimPhone, type, priority, description, condition, lat, lng, locationName } = req.body;
  const newReq: EmergencyRecord = {
    id: `er-${Date.now()}`,
    requestCode: `ER-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    victimId: victimId || 'usr-victim-01',
    victimName: victimName || 'Aarav Kumar',
    victimPhone: victimPhone || '+91 98765 43210',
    type: type || 'FLOOD',
    priority: priority || 'CRITICAL',
    description: description || 'Victim assistance request.',
    condition: condition || 'Need immediate rescue.',
    lat: lat || 28.6152,
    lng: lng || 77.2120,
    locationName: locationName || 'Current Location',
    status: 'NEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  emergencyRequests.unshift(newReq);
  res.status(201).json({ success: true, data: newReq });
});

// PATCH /api/emergencies/:id/status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, assignedTeamId, assignedTeamName, assignedAvironId, assignedAvironCode } = req.body;

  const reqIndex = emergencyRequests.findIndex((r) => r.id === id);
  if (reqIndex === -1) {
    return res.status(404).json({ success: false, error: 'Emergency request not found' });
  }

  emergencyRequests[reqIndex] = {
    ...emergencyRequests[reqIndex],
    ...(status && { status }),
    ...(assignedTeamId && { assignedTeamId }),
    ...(assignedTeamName && { assignedTeamName }),
    ...(assignedAvironId && { assignedAvironId }),
    ...(assignedAvironCode && { assignedAvironCode }),
    updatedAt: new Date().toISOString(),
  };

  res.json({ success: true, data: emergencyRequests[reqIndex] });
});

export default router;
