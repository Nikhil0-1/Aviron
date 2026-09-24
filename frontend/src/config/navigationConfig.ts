import { Home, ShieldAlert, Cpu, AlertTriangle, Navigation, Users, MapPin, Settings, HeartHandshake, MessageSquare, Upload, FileText, Activity, Radio, ShieldCheck, Flame } from 'lucide-react';
import { Role } from '../types';

export const AVIRON_FULL_NAME = "Autonomous Virtual Innovative Rescue for Operations in Natural-disasters";
export const AVIRON_TAGLINE = "Autonomous Intelligence. Rapid Response. Human Assistance.";

export interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  icon: any;
  roles: Role[];
  mobilePriority: number; // 1 = Main bottom nav, 2 = More drawer
  category?: string;
}

export const ADMIN_NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: Cpu, roles: ['ADMIN', 'VIEWER'], mobilePriority: 1 },
  { id: 'map', label: 'Live Map', path: '/admin/map', icon: MapPin, roles: ['ADMIN', 'VIEWER'], mobilePriority: 1 },
  { id: 'emergencies', label: 'Emergencies', path: '/admin/emergencies', icon: AlertTriangle, roles: ['ADMIN', 'VIEWER'], mobilePriority: 1 },
  { id: 'fleet', label: 'Fleet', path: '/admin/fleet', icon: Navigation, roles: ['ADMIN', 'VIEWER'], mobilePriority: 1 },
  { id: 'users', label: 'Users', path: '/admin/users', icon: Users, roles: ['ADMIN'], mobilePriority: 2, category: 'Management' },
  { id: 'teams', label: 'Teams', path: '/admin/teams', icon: ShieldCheck, roles: ['ADMIN'], mobilePriority: 2, category: 'Management' },
  { id: 'alerts', label: 'Alerts', path: '/admin/alerts', icon: Activity, roles: ['ADMIN', 'VIEWER'], mobilePriority: 2, category: 'Monitoring' },
  { id: 'reports', label: 'Reports', path: '/admin/reports', icon: FileText, roles: ['ADMIN', 'VIEWER'], mobilePriority: 2, category: 'Analytics' },
  { id: 'settings', label: 'Settings', path: '/admin/settings', icon: Settings, roles: ['ADMIN'], mobilePriority: 2, category: 'System' },
];

export const TEAM_NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/team', icon: ShieldAlert, roles: ['TEAM_LEADER', 'RESCUE_OPERATOR', 'MEDICAL_OPERATOR', 'ADMIN'], mobilePriority: 1 },
  { id: 'missions', label: 'Missions', path: '/team/missions', icon: AlertTriangle, roles: ['TEAM_LEADER', 'RESCUE_OPERATOR', 'MEDICAL_OPERATOR', 'ADMIN'], mobilePriority: 1 },
  { id: 'live', label: 'Live Ops', path: '/team/live', icon: Navigation, roles: ['TEAM_LEADER', 'RESCUE_OPERATOR', 'MEDICAL_OPERATOR', 'ADMIN'], mobilePriority: 1 },
  { id: 'fleet', label: 'Fleet', path: '/team/fleet', icon: Radio, roles: ['TEAM_LEADER', 'RESCUE_OPERATOR', 'ADMIN'], mobilePriority: 1 },
  { id: 'members', label: 'Members', path: '/team/members', icon: Users, roles: ['TEAM_LEADER', 'ADMIN'], mobilePriority: 2, category: 'Roster' },
  { id: 'chat', label: 'Comms', path: '/team/chat', icon: MessageSquare, roles: ['TEAM_LEADER', 'RESCUE_OPERATOR', 'MEDICAL_OPERATOR', 'ADMIN'], mobilePriority: 2, category: 'Communication' },
  { id: 'alerts', label: 'Alerts', path: '/team/alerts', icon: Activity, roles: ['TEAM_LEADER', 'RESCUE_OPERATOR', 'MEDICAL_OPERATOR', 'ADMIN'], mobilePriority: 2, category: 'Monitoring' },
  { id: 'settings', label: 'Settings', path: '/team/settings', icon: Settings, roles: ['TEAM_LEADER', 'ADMIN'], mobilePriority: 2, category: 'System' },
];

export const VICTIM_NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', label: 'Home', path: '/victim', icon: Home, roles: ['VICTIM', 'ADMIN'], mobilePriority: 1 },
  { id: 'status', label: 'Status', path: '/victim/status', icon: Activity, roles: ['VICTIM', 'ADMIN'], mobilePriority: 1 },
  { id: 'map', label: 'Map', path: '/victim/map', icon: MapPin, roles: ['VICTIM', 'ADMIN'], mobilePriority: 1 },
  { id: 'chat', label: 'Chat', path: '/victim/chat', icon: MessageSquare, roles: ['VICTIM', 'ADMIN'], mobilePriority: 1 },
  { id: 'uploads', label: 'Uploads', path: '/victim/uploads', icon: Upload, roles: ['VICTIM', 'ADMIN'], mobilePriority: 2, category: 'Evidence' },
  { id: 'more', label: 'Profile', path: '/victim/more', icon: HeartHandshake, roles: ['VICTIM', 'ADMIN'], mobilePriority: 2, category: 'Account' },
];

export const getNavItemsForRoleAndPanel = (panel: 'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN', role: Role): NavItemConfig[] => {
  if (panel === 'ADMIN') {
    return ADMIN_NAV_ITEMS.filter((item) => item.roles.includes(role) || role === 'ADMIN');
  } else if (panel === 'TEAM') {
    return TEAM_NAV_ITEMS.filter((item) => item.roles.includes(role) || role === 'ADMIN');
  } else if (panel === 'VICTIM') {
    return VICTIM_NAV_ITEMS.filter((item) => item.roles.includes(role) || role === 'ADMIN');
  }
  return [];
};
