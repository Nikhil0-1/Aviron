import { AvironUnit, Telemetry, Detection, Survivor, Alert, MissionEvent } from '../../types';

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
    id: 'unit-01-demo',
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
    avironUnitId: 'unit-01-demo',
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
    { lat: 28.6152, lng: 77.2120 }, // Survivor Location
    { lat: 28.6158, lng: 77.2132 }, // Search boundary
    { lat: 28.6139, lng: 77.2090 }, // Return Base
  ];

  // Demo Events Sequence
  private scenarioEvents: ScenarioEvent[] = [
    {
      id: 'evt-0',
      stepIndex: 0,
      timeOffsetSec: 0,
      title: 'MISSION RECEIVED & UNIT ASSIGNED',
      description: 'AVIRON-01 assigned to Flood Rescue Mission AV-001. System online.',
      type: 'INFO',
    },
    {
      id: 'evt-1',
      stepIndex: 1,
      timeOffsetSec: 3,
      title: 'GPS LOCK ESTABLISHED',
      description: 'Dual RTK GPS locked with 14 satellites. Precision position fix ±0.03m.',
      type: 'INFO',
    },
    {
      id: 'evt-2',
      stepIndex: 2,
      timeOffsetSec: 8,
      title: 'AUTONOMOUS NAVIGATION STARTED',
      description: 'AVIRON-01 launched from Base. Navigating along flood corridor at 4.8 m/s.',
      type: 'INFO',
    },
    {
      id: 'evt-3',
      stepIndex: 3,
      timeOffsetSec: 15,
      title: 'OBSTACLE DETECTED',
      description: 'Submerged high-voltage cable structure identified in direct path.',
      type: 'WARNING',
      alert: {
        severity: 'WARNING',
        title: 'LIDAR Obstacle Avoidance Engaged',
        message: 'High-voltage structure identified. Dynamic detour path computed.',
      },
    },
    {
      id: 'evt-4',
      stepIndex: 4,
      timeOffsetSec: 22,
      title: 'ROUTE RECALCULATED',
      description: 'Autonomous planner detour applied (+45m buffer). Resuming search trajectory.',
      type: 'INFO',
    },
    {
      id: 'evt-5',
      stepIndex: 5,
      timeOffsetSec: 30,
      title: 'SURVIVOR DETECTED',
      description: 'Human figure detected on submerged structure. AI confidence: 94.2%.',
      type: 'CRITICAL',
      detection: {
        type: 'HUMAN',
        confidence: 94.2,
        lat: 28.6152,
        lng: 77.2120,
        isConfirmed: true,
      },
      survivor: {
        code: 'SURVIVOR #001',
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
        title: 'HUMAN DETECTED - SURVIVOR #001',
        message: 'Visual and radiometric FLIR match confirmed survivor location.',
      },
    },
    {
      id: 'evt-6',
      stepIndex: 6,
      timeOffsetSec: 38,
      title: 'THERMAL CONFIRMATION',
      description: 'FLIR Radiometric Core confirmed 36.9°C body heat signature.',
      type: 'INFO',
    },
    {
      id: 'evt-7',
      stepIndex: 7,
      timeOffsetSec: 45,
      title: 'COMMUNICATION ESTABLISHED',
      description: 'VHF Emergency link active. Audio beacon beaconing instructions to survivor.',
      type: 'INFO',
    },
    {
      id: 'evt-8',
      stepIndex: 8,
      timeOffsetSec: 52,
      title: 'MEDICAL PAYLOAD DEPLOYED',
      description: 'REAK-1 Emergency Medical Kit dropped via precision winch release.',
      type: 'SUCCESS',
      alert: {
        severity: 'INFO',
        title: 'PAYLOAD DELIVERED',
        message: 'REAK-1 Medical kit delivered to survivor platform.',
      },
    },
    {
      id: 'evt-9',
      stepIndex: 9,
      timeOffsetSec: 60,
      title: 'MISSION COMPLETED - RETURNING HOME',
      description: 'Rescue objectives fulfilled. AVIRON-01 executing Return to Base trajectory.',
      type: 'SUCCESS',
      alert: {
        severity: 'INFO',
        title: 'MISSION ACCOMPLISHED',
        message: 'AVIRON-01 returning to base station. Report generated.',
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
    }, 1000 / this.speedMultiplier);

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
      id: 'unit-01-demo',
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
      avironUnitId: 'unit-01-demo',
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

    // Trigger initial event
    this.applyScenarioEvent(this.scenarioEvents[0]);
    this.notify();
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
    const targetWpIndex = Math.min(Math.floor(this.currentStepIndex / 2), this.waypoints.length - 1);
    const targetWp = this.waypoints[targetWpIndex];

    // Smooth movement interpolation
    const stepSize = 0.00015;
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
    this.unit.battery = Math.max(10, parseFloat((this.unit.battery - 0.08).toFixed(1)));
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

    // 3. Check scenario step progression based on time/ticks
    const nextEvent = this.scenarioEvents[this.currentStepIndex + 1];
    if (nextEvent && this.isPlaying) {
      // Advance step every ~6 ticks
      if (Math.random() > 0.75) {
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
