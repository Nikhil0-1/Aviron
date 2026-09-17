export type Role = 'ADMIN' | 'OPERATOR' | 'MEDICAL_OPERATOR' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export type UnitStatus = 'ACTIVE' | 'STANDBY' | 'CHARGING' | 'OFFLINE';

export interface AvironUnit {
  id: string;
  code: string;
  name: string;
  model: string;
  status: UnitStatus;
  battery: number;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  signalStrength: number;
  ipAddress?: string;
  lastSeen: string;
}

export type MissionType =
  | 'FLOOD_RESCUE'
  | 'SEARCH_AND_RESCUE'
  | 'MEDICAL_EMERGENCY'
  | 'DISASTER_RECON'
  | 'SURVIVOR_DETECTION'
  | 'MEDICAL_SUPPLY_DELIVERY'
  | 'ENVIRONMENTAL_MONITORING';

export type MissionPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type MissionStatus = 'DRAFT' | 'READY' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'ABORTED';

export interface Waypoint {
  id?: string;
  seq: number;
  lat: number;
  lng: number;
  altitude: number;
  action: 'NAVIGATE' | 'SEARCH_PATTERN' | 'HOVER' | 'HOVER_SURVIVOR' | 'DEPLOY_PAYLOAD' | 'RETURN_BASE' | 'TAKEOFF';
  isReached: boolean;
}

export interface Mission {
  id: string;
  code: string;
  title: string;
  type: MissionType;
  priority: MissionPriority;
  status: MissionStatus;
  targetLat: number;
  targetLng: number;
  searchRadius: number;
  avironUnitId?: string;
  avironUnit?: AvironUnit;
  waypoints?: Waypoint[];
  survivors?: Survivor[];
  createdAt: string;
  updatedAt?: string;
}

export interface Telemetry {
  id?: string;
  avironUnitId: string;
  battery: number;
  voltage: number;
  current: number;
  speed: number;
  heading: number;
  lat: number;
  lng: number;
  altitude: number;
  temperature: number;
  humidity: number;
  airQuality: number;
  gasLevel: number;
  signalStrength: number;
  networkLatency: number;
  timestamp: string;
}

export interface Detection {
  id: string;
  avironUnitId: string;
  avironUnit?: { code: string; name: string };
  missionId?: string;
  type: 'HUMAN' | 'THERMAL_HOTSPOT' | 'OBSTACLE' | 'HAZARD';
  confidence: number;
  lat: number;
  lng: number;
  imageFrameUrl?: string;
  isConfirmed: boolean;
  createdAt: string;
}

export type SurvivorStatus =
  | 'DETECTED'
  | 'ASSISTANCE_REQUESTED'
  | 'PAYLOAD_SENT'
  | 'ASSISTED'
  | 'RESOLVED';

export interface MedicalAssessment {
  id: string;
  survivorId: string;
  triageLevel: 'RED' | 'YELLOW' | 'GREEN' | 'BLACK';
  heartRate: number;
  spO2: number;
  temperature: number;
  notes: string;
  assessedAt: string;
}

export interface Survivor {
  id: string;
  code: string;
  detectionId?: string;
  missionId: string;
  status: SurvivorStatus;
  heartRate: number;
  spO2: number;
  temperature: number;
  lat: number;
  lng: number;
  notes?: string;
  assessments?: MedicalAssessment[];
  createdAt: string;
}

export type PayloadStatus = 'READY' | 'LOADED' | 'DEPLOYING' | 'DELIVERED';

export interface Payload {
  id: string;
  avironUnitId?: string;
  missionId?: string;
  name: string;
  type: 'MEDICAL_KIT' | 'FIRST_AID' | 'EMERGENCY_SUPPLIES' | 'COMM_DEVICE';
  status: PayloadStatus;
  deployedAt?: string;
}

export type AlertSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export interface Alert {
  id: string;
  avironUnitId?: string;
  avironUnit?: { code: string; name: string };
  missionId?: string;
  mission?: { code: string; title: string };
  severity: AlertSeverity;
  title: string;
  message: string;
  isAcknowledged: boolean;
  createdAt: string;
}

export interface CommunicationMessage {
  id: string;
  avironUnitId?: string;
  sender: 'OPERATOR' | 'AVIRON' | 'SYSTEM';
  message: string;
  channel: string;
  timestamp: string;
}

export interface MissionEvent {
  id: string;
  missionId: string;
  eventType: string;
  description: string;
  payload?: string;
  timestamp: string;
}

export interface MissionReport {
  id: string;
  missionId: string;
  mission?: Mission;
  title: string;
  operatorName: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  distanceKm: number;
  survivorsFound: number;
  batteryUsed: number;
  summary: string;
  createdAt: string;
}

export interface SystemComponent {
  id: string;
  name: string;
  type: 'HARDWARE' | 'SENSOR' | 'NETWORK' | 'CAMERA' | 'NAVIGATION';
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  details?: string;
  lastCheck: string;
}

export type HardwareMode = 'DEMO' | 'LIVE_HARDWARE';

export interface RaspberryPiConfig {
  host: string;
  port: number;
  protocol: 'WebSocket' | 'REST' | 'MQTT';
  token?: string;
  autoConnect: boolean;
}
