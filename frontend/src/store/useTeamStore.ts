import { create } from 'zustand';
import { RescueTeam, TeamMember, TeamChatMessage, Role } from '../types';

interface TeamState {
  teams: RescueTeam[];
  members: TeamMember[];
  chatMessages: TeamChatMessage[];

  setTeams: (teams: RescueTeam[]) => void;
  setMembers: (members: TeamMember[]) => void;
  addChatMessage: (msg: Omit<TeamChatMessage, 'id' | 'timestamp'>) => void;
  updateMemberStatus: (id: string, status: 'ONLINE' | 'OFFLINE' | 'BUSY') => void;
  addTeam: (team: Omit<RescueTeam, 'id' | 'createdAt'>) => void;
}

const INITIAL_TEAMS: RescueTeam[] = [
  {
    id: 'team-alpha',
    code: 'ALPHA-01',
    name: 'Team Alpha (Rapid Recon & Rescue)',
    leaderId: 'usr-team-lead-01',
    leaderName: 'Capt. Rahul Sharma',
    status: 'ON_MISSION',
    memberCount: 5,
    currentMissionId: 'm-001',
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
  {
    id: 'team-charlie',
    code: 'CHARLIE-03',
    name: 'Team Charlie (Heavy Disaster Recon)',
    leaderId: 'usr-lead-03',
    leaderName: 'Arjun Nair',
    status: 'STANDBY',
    memberCount: 6,
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'tm-01',
    teamId: 'team-alpha',
    userId: 'usr-team-lead-01',
    name: 'Capt. Rahul Sharma',
    email: 'rahul.sharma@aviron.io',
    role: 'LEADER',
    status: 'ONLINE',
    currentMissionId: 'm-001',
    lat: 28.6140,
    lng: 77.2100,
  },
  {
    id: 'tm-02',
    teamId: 'team-alpha',
    userId: 'usr-operator-01',
    name: 'Sarah Connor',
    email: 'operator@aviron.io',
    role: 'RESCUE_OPERATOR',
    status: 'ONLINE',
    currentMissionId: 'm-001',
    lat: 28.6142,
    lng: 77.2105,
  },
  {
    id: 'tm-03',
    teamId: 'team-alpha',
    userId: 'usr-medic-01',
    name: 'Dr. Amit Patel',
    email: 'medic@aviron.io',
    role: 'MEDICAL_OPERATOR',
    status: 'ONLINE',
    currentMissionId: 'm-001',
    lat: 28.6138,
    lng: 77.2098,
  },
  {
    id: 'tm-04',
    teamId: 'team-alpha',
    userId: 'usr-operator-02',
    name: 'Amit Verma',
    email: 'amit.verma@aviron.io',
    role: 'RESCUE_OPERATOR',
    status: 'ONLINE',
    lat: 28.6145,
    lng: 77.2110,
  },
  {
    id: 'tm-05',
    teamId: 'team-alpha',
    userId: 'usr-operator-03',
    name: 'Priya Das',
    email: 'priya.das@aviron.io',
    role: 'RESCUE_OPERATOR',
    status: 'OFFLINE',
  },
];

const INITIAL_MESSAGES: TeamChatMessage[] = [
  {
    id: 'msg-01',
    teamId: 'team-alpha',
    missionId: 'er-001',
    channel: 'EMERGENCY',
    senderId: 'usr-victim-01',
    senderName: 'Aarav Kumar (Victim)',
    senderRole: 'VICTIM',
    message: 'I am near the damaged building rooftop. Water is rising fast!',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-02',
    teamId: 'team-alpha',
    missionId: 'er-001',
    channel: 'EMERGENCY',
    senderId: 'usr-team-lead-01',
    senderName: 'Capt. Rahul (Team Leader)',
    senderRole: 'TEAM_LEADER',
    message: 'We have received your GPS coordinates. Team Alpha has accepted the mission.',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-03',
    teamId: 'team-alpha',
    missionId: 'er-001',
    channel: 'EMERGENCY',
    senderId: 'usr-operator-01',
    senderName: 'Sarah (AVIRON Operator)',
    senderRole: 'RESCUE_OPERATOR',
    message: 'AVIRON-01 is deployed and approaching your location. ETA 4 minutes.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-04',
    teamId: 'team-alpha',
    missionId: 'er-001',
    channel: 'EMERGENCY',
    senderId: 'usr-victim-01',
    senderName: 'Aarav Kumar (Victim)',
    senderRole: 'VICTIM',
    message: 'I can see the vehicle approaching! Waving visual strobe now.',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
];

export const useTeamStore = create<TeamState>((set) => ({
  teams: INITIAL_TEAMS,
  members: INITIAL_MEMBERS,
  chatMessages: INITIAL_MESSAGES,

  setTeams: (teams) => set({ teams }),
  setMembers: (members) => set({ members }),

  addChatMessage: (msg) => {
    const newMsg: TeamChatMessage = {
      ...msg,
      id: `chat-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ chatMessages: [...state.chatMessages, newMsg] }));
  },

  updateMemberStatus: (id, status) => {
    set((state) => ({
      members: state.members.map((m) => (m.id === id ? { ...m, status } : m)),
    }));
  },

  addTeam: (team) => {
    const newTeam: RescueTeam = {
      ...team,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ teams: [...state.teams, newTeam] }));
  },
}));
