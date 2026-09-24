import { Router } from 'express';

const router = Router();

let teams = [
  {
    id: 'team-alpha',
    code: 'ALPHA-01',
    name: 'Team Alpha (Rapid Recon & Rescue)',
    leaderId: 'usr-team-lead-01',
    leaderName: 'Capt. Rahul Sharma',
    status: 'ON_MISSION',
    memberCount: 5,
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'team-bravo',
    code: 'BRAVO-02',
    name: 'Team Bravo (Medical Special Support)',
    leaderId: 'usr-medic-01',
    leaderName: 'Dr. Amit Patel',
    status: 'ACTIVE',
    memberCount: 4,
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
  },
];

// GET /api/teams
router.get('/', (req, res) => {
  res.json({ success: true, count: teams.length, data: teams });
});

// POST /api/teams
router.post('/', (req, res) => {
  const { name, leaderName } = req.body;
  const newTeam = {
    id: `team-${Date.now()}`,
    code: `TEAM-0${teams.length + 1}`,
    name: name || 'New Rescue Team',
    leaderId: `usr-lead-${Date.now()}`,
    leaderName: leaderName || 'Team Leader',
    status: 'STANDBY',
    memberCount: 3,
    createdAt: new Date().toISOString(),
  };
  teams.push(newTeam);
  res.status(201).json({ success: true, data: newTeam });
});

export default router;
