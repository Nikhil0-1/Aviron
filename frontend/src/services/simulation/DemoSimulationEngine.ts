import { AvironUnit, Telemetry, Detection, Survivor, Alert, MissionEvent } from '../../types';
import { useEmergencyStore } from '../../store/useEmergencyStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useAvironStore } from '../../store/useAvironStore';

export interface ScenarioEvent {
  id: string;
  stepIndex: number;
  timeOffsetSec: number;
  title: string;
  description: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  unitStatus?: 'ACTIVE' | 'STANDBY';
  telemetryDelta?: Partial<Telemetry>;
  detection?: Partial<Detection>;
  survivor?: Partial<Survivor>;
  alert?: Partial<Alert>;
  emergencyStatusSync?: 'NEW' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'AVIRON_DEPLOYED' | 'EN_ROUTE' | 'ARRIVED' | 'ASSISTANCE_IN_PROGRESS' | 'RESOLVED';
}

export type SimulationListener = (state: {
  currentStep: number;
  isPlaying: boolean;
  unit: AvironUnit;
  telemetry: Telemetry;
  events: MissionEvent[];
  survivors: Survivor[];
  detections: Detection[];
  alerts: Alert[];
  latestEvent?: ScenarioEvent;
}) => void;

export class DemoSimulationEngine {
  private static instance: DemoSimulationEngine;

  private isPlaying = false;
  private currentStepIndex = 0;
  private timer: any = null;
  private speedMultiplier = 1;
  private listeners: Set<SimulationListener> = new Set();

  // Unit State
  private unit: AvironUnit = {
    id: 'unit-01',
    code: 'AVIRON-01',
    name: 'Alpha Sentinel (Demo)',
    model: 'AVIRON Mk-IV Amphibious Recon',
    status: 'ACTIVE',
    battery: 74.0,
    lat: 28.6139,
    lng: 77.2090,
    speed: 0.0,
    heading: 45.0,
    signalStrength: 94,
    lastSeen: new Date().toISOString(),
  };

  // Telemetry State
  private telemetry: Telemetry = {
    avironUnitId: 'unit-01',
    battery: 74.0,
    voltage: 22.8,
    current: 14.5,
    speed: 0.0,
    heading: 45.0,
    lat: 28.6139,
    lng: 77.2090,
    altitude: 18.5,
    temperature: 28.4,
    humidity: 78.0,
    airQuality: 92.0,
    gasLevel: 0.02,
    signalStrength: 94,
    networkLatency: 16,
    timestamp: new Date().toISOString(),
  };

  // Scenario Waypoints
  private waypoints = [
    { lat: 28.6139, lng: 77.2090 }, // Base Takeoff
    { lat: 28.6145, lng: 77.2105 }, // En route waypoint 1
    { lat: 28.6148, lng: 77.2112 }, // Obstacle detour
    { lat: 28.6152, lng: 77.2120 }, // Victim Location (Sector 4)
    { lat: 28.6158, lng: 77.2132 }, // Search boundary
    { lat: 28.6139, lng: 77.2090 }, // Return Base
  ];

  // Demo Events Sequence
  public scenarioEvents: ScenarioEvent[] = [
    {
      id: 'evt-0',
      stepIndex: 0,
      timeOffsetSec: 0,
      title: 'EMERGENCY REQUEST RECEIVED & UNIT ASSIGNED',
      description: 'AVIRON-01 assigned to Flood Emergency #ER-2026-001 for Aarav Kumar. System initialized.',
      type: 'INFO',
      emergencyStatusSync: 'ASSIGNED',
    },
    {
      id: 'evt-1',
      stepIndex: 1,
      timeOffsetSec: 3,
      title: 'GPS LOCK & DUAL RTK FIX ESTABLISHED',
      description: 'Dual RTK GPS locked with 16 satellites. Target coordinates fixed at Sector 4 rooftop.',
      type: 'INFO',
      emergencyStatusSync: 'AVIRON_DEPLOYED',
    },
    {
      id: 'evt-2',
      stepIndex: 2,
      timeOffsetSec: 8,
      title: 'AUTONOMOUS NAVIGATION STARTED',
      description: 'AVIRON-01 launched from Base Station. Navigating along flood corridor at 4.8 m/s.',
      type: 'INFO',
      emergencyStatusSync: 'EN_ROUTE',
    },
    {
      id: 'evt-3',
      stepIndex: 3,
      timeOffsetSec: 15,
      title: 'SUBMERGED OBSTACLE DETECTED',
      description: 'Submerged high-voltage cable structure identified in direct flight corridor.',
      type: 'WARNING',
      alert: {
        severity: 'WARNING',
        title: 'LIDAR Obstacle Avoidance Engaged',
        message: 'Submerged high-voltage structure identified. Dynamic detour path computed.',
      },
    },
    {
      id: 'evt-4',
      stepIndex: 4,
      timeOffsetSec: 22,
      title: 'DYNAMIC ROUTE RECALCULATED',
      description: 'Autonomous planner detour applied (+45m altitude buffer). Resuming search trajectory.',
      type: 'INFO',
    },
    {
      id: 'evt-5',
      stepIndex: 5,
      timeOffsetSec: 30,
      title: 'VICTIM LOCATED BY AI SENSORS',
      description: 'Human figure detected on rooftop. AI confidence: 94.2%. Victim notified via app.',
      type: 'CRITICAL',
      emergencyStatusSync: 'ARRIVED',
      detection: {
        type: 'HUMAN',
        confidence: 94.2,
        lat: 28.6152,
        lng: 77.2120,
        isConfirmed: true,
      },
      survivor: {
        code: 'SURVIVOR #001 (Aarav Kumar)',
        status: 'ASSISTANCE_REQUESTED',
        heartRate: 88,
        spO2: 96,
        temperature: 36.9,
        lat: 28.6152,
        lng: 77.2120,
        notes: 'Stranded individual waving for help on elevated rooftop.',
      },
      alert: {
        severity: 'HIGH',
        title: 'VICTIM LOCATED - AARAV KUMAR',
        message: 'Visual and radiometric FLIR match confirmed victim location at rooftop.',
      },
    },
    {
      id: 'evt-6',
      stepIndex: 6,
      timeOffsetSec: 38,
      title: 'THERMAL SIGNATURE & TRIAGE CONFIRMED',
      description: 'FLIR Radiometric Core confirmed 36.9°C body heat signature. Triage level: STABLE.',
      type: 'INFO',
    },
    {
      id: 'evt-7',
      stepIndex: 7,
      timeOffsetSec: 45,
      title: 'EMERGENCY COMMUNICATOR ACTIVE',
      description: 'VHF & 5G mesh link active. Audio beacon transmitting safety instructions to victim.',
      type: 'INFO',
    },
    {
      id: 'evt-8',
      stepIndex: 8,
      timeOffsetSec: 52,
      title: 'MEDICAL PAYLOAD DEPLOYED',
      description: 'REAK-1 Emergency Medical Kit dropped via precision winch release onto rooftop.',
      type: 'SUCCESS',
      emergencyStatusSync: 'ASSISTANCE_IN_PROGRESS',
      alert: {
        severity: 'INFO',
        title: 'MEDICAL PAYLOAD DELIVERED',
        message: 'REAK-1 Emergency Medical Kit delivered successfully to victim rooftop.',
      },
    },
    {
      id: 'evt-9',
      stepIndex: 9,
      timeOffsetSec: 60,
      title: 'MISSION COMPLETED - RESOLVED',
      description: 'Rescue team on-site. Objectives fulfilled. AVIRON-01 executing Return to Base.',
      type: 'SUCCESS',
      emergencyStatusSync: 'RESOLVED',
      alert: {
        severity: 'INFO',
        title: 'EMERGENCY RESOLVED',
        message: 'Incident ER-2026-001 marked RESOLVED. Mission report generated.',
      },
    },
  ];

  private eventsHistory: MissionEvent[] = [];
  private survivorsList: Survivor[] = [];
  private detectionsList: Detection[] = [];
  private alertsList: Alert[] = [];

  private constructor() {
    this.reset();
  }

  public static getInstance(): DemoSimulationEngine {
    if (!DemoSimulationEngine.instance) {
      DemoSimulationEngine.instance = new DemoSimulationEngine();
    }
    return DemoSimulationEngine.instance;
  }

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    this.timer = setInterval(() => {
      this.tick();
    }, 1500 / this.speedMultiplier);

    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  public reset() {
    this.pause();
    this.currentStepIndex = 0;

    this.unit = {
      id: 'unit-01',
      code: 'AVIRON-01',
      name: 'Alpha Sentinel (Demo)',
      model: 'AVIRON Mk-IV Amphibious Recon',
      status: 'ACTIVE',
      battery: 74.0,
      lat: 28.6139,
      lng: 77.2090,
      speed: 0.0,
      heading: 45.0,
      signalStrength: 95,
      lastSeen: new Date().toISOString(),
    };

    this.telemetry = {
      avironUnitId: 'unit-01',
      battery: 74.0,
      voltage: 22.8,
      current: 14.2,
      speed: 0.0,
      heading: 45.0,
      lat: 28.6139,
      lng: 77.2090,
      altitude: 18.5,
      temperature: 28.4,
      humidity: 78.0,
      airQuality: 92.0,
      gasLevel: 0.02,
      signalStrength: 95,
      networkLatency: 15,
      timestamp: new Date().toISOString(),
    };

    this.eventsHistory = [];
    this.survivorsList = [];
    this.detectionsList = [];
    this.alertsList = [];

    // Apply initial event
    this.applyScenarioEvent(this.scenarioEvents[0]);
    this.notify();
  }

  public goToStep(stepIndex: number) {
    if (stepIndex >= 0 && stepIndex < this.scenarioEvents.length) {
      this.currentStepIndex = stepIndex;
      this.applyScenarioEvent(this.scenarioEvents[this.currentStepIndex]);
      this.notify();
    }
  }

  public nextStep() {
    if (this.currentStepIndex < this.scenarioEvents.length - 1) {
      this.currentStepIndex++;
      this.applyScenarioEvent(this.scenarioEvents[this.currentStepIndex]);
      this.notify();
    }
  }

  public setSpeed(multiplier: number) {
    this.speedMultiplier = multiplier;
    if (this.isPlaying) {
      this.pause();
      this.start();
    }
  }

  public subscribe(listener: SimulationListener): () => void {
    this.listeners.add(listener);
    this.notify();
    return () => this.listeners.delete(listener);
  }

  private tick() {
    // 1. Move Unit along Waypoint Path based on current step
    const targetWpIndex = Math.min(Math.floor((this.currentStepIndex * (this.waypoints.length - 1)) / (this.scenarioEvents.length - 1)), this.waypoints.length - 1);
    const targetWp = this.waypoints[targetWpIndex];

    const stepSize = 0.0002;
    const dLat = targetWp.lat - this.unit.lat;
    const dLng = targetWp.lng - this.unit.lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);

    if (dist > 0.00005) {
      this.unit.lat += (dLat / dist) * stepSize;
      this.unit.lng += (dLng / dist) * stepSize;
      this.unit.heading = (Math.atan2(dLng, dLat) * 180) / Math.PI;
      this.unit.speed = 4.8 + (Math.random() * 0.4 - 0.2);
    } else {
      this.unit.speed = 0.5;
    }

    // 2. Battery drain & Telemetry variation
    this.unit.battery = Math.max(10, parseFloat((this.unit.battery - 0.05).toFixed(1)));
    this.unit.signalStrength = Math.min(99, Math.max(85, Math.floor(92 + (Math.random() * 6 - 3))));
    this.unit.lastSeen = new Date().toISOString();

    this.telemetry = {
      ...this.telemetry,
      battery: this.unit.battery,
      lat: this.unit.lat,
      lng: this.unit.lng,
      speed: parseFloat(this.unit.speed.toFixed(1)),
      heading: parseFloat(this.unit.heading.toFixed(1)),
      signalStrength: this.unit.signalStrength,
      temperature: parseFloat((28.4 + (Math.random() * 0.4 - 0.2)).toFixed(1)),
      timestamp: new Date().toISOString(),
    };

    // Sync unit location into AvironStore
    useAvironStore.getState().updateUnit('unit-01', {
      lat: this.unit.lat,
      lng: this.unit.lng,
      speed: this.unit.speed,
      heading: this.unit.heading,
      battery: this.unit.battery,
      signalStrength: this.unit.signalStrength,
    });

    // Advance event progression periodically when playing
    if (this.isPlaying && this.currentStepIndex < this.scenarioEvents.length - 1) {
      if (Math.random() > 0.6) {
        this.currentStepIndex++;
        this.applyScenarioEvent(this.scenarioEvents[this.currentStepIndex]);
      }
    }

    this.notify();
  }

  private applyScenarioEvent(evt: ScenarioEvent) {
    const timestamp = new Date().toISOString();

    this.eventsHistory.unshift({
      id: `m-evt-${Date.now()}`,
      missionId: 'AV-001',
      eventType: evt.title,
      description: evt.description,
      timestamp,
    });

    if (evt.emergencyStatusSync) {
      useEmergencyStore.getState().updateRequestStatus('er-001', evt.emergencyStatusSync);
    }

    if (evt.detection) {
      const det: Detection = {
        id: `det-${Date.now()}`,
        avironUnitId: this.unit.id,
        avironUnit: { code: this.unit.code, name: this.unit.name },
        missionId: 'AV-001',
        type: (evt.detection.type as any) || 'HUMAN',
        confidence: evt.detection.confidence || 94.2,
        lat: evt.detection.lat || this.unit.lat,
        lng: evt.detection.lng || this.unit.lng,
        isConfirmed: true,
        createdAt: timestamp,
      };
      this.detectionsList.unshift(det);
    }

    if (evt.survivor) {
      const surv: Survivor = {
        id: `surv-${Date.now()}`,
        code: evt.survivor.code || 'SURVIVOR #001',
        missionId: 'AV-001',
        status: (evt.survivor.status as any) || 'ASSISTANCE_REQUESTED',
        heartRate: evt.survivor.heartRate || 88,
        spO2: evt.survivor.spO2 || 96,
        temperature: evt.survivor.temperature || 36.9,
        lat: evt.survivor.lat || this.unit.lat,
        lng: evt.survivor.lng || this.unit.lng,
        notes: evt.survivor.notes,
        createdAt: timestamp,
      };
      this.survivorsList.unshift(surv);
    }

    if (evt.alert) {
      const alertItem: Alert = {
        id: `alert-${Date.now()}`,
        avironUnitId: this.unit.id,
        avironUnit: { code: this.unit.code, name: this.unit.name },
        missionId: 'AV-001',
        mission: { code: 'AV-001', title: 'Flood Rescue Operation' },
        severity: evt.alert.severity || 'INFO',
        title: evt.alert.title || evt.title,
        message: evt.alert.message || evt.description,
        isAcknowledged: false,
        createdAt: timestamp,
      };
      this.alertsList.unshift(alertItem);

      useNotificationStore.getState().addNotification({
        type: 'EMERGENCY',
        title: evt.alert.title || evt.title,
        message: evt.alert.message || evt.description,
      });
    }
  }

  private notify() {
    const state = {
      currentStep: this.currentStepIndex,
      isPlaying: this.isPlaying,
      unit: { ...this.unit },
      telemetry: { ...this.telemetry },
      events: [...this.eventsHistory],
      survivors: [...this.survivorsList],
      detections: [...this.detectionsList],
      alerts: [...this.alertsList],
      latestEvent: this.scenarioEvents[this.currentStepIndex],
    };

    this.listeners.forEach((listener) => listener(state));
  }

  public getState() {
    return {
      currentStep: this.currentStepIndex,
      isPlaying: this.isPlaying,
      unit: { ...this.unit },
      telemetry: { ...this.telemetry },
      events: [...this.eventsHistory],
      survivors: [...this.survivorsList],
      detections: [...this.detectionsList],
      alerts: [...this.alertsList],
      latestEvent: this.scenarioEvents[this.currentStepIndex],
    };
  }
}
