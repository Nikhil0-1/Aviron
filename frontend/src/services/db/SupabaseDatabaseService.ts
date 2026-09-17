import { supabaseClient, isSupabaseWebConfigured } from '../../config/supabase';
import { DatabaseService } from './DatabaseService';
import { Mission, Telemetry, Detection, Survivor, Alert, MissionReport } from '../../types';
import { DemoDatabaseService } from './DemoDatabaseService';

export class SupabaseDatabaseService implements DatabaseService {
  private fallbackDemo: DemoDatabaseService = new DemoDatabaseService();

  async getMissions(): Promise<Mission[]> {
    if (!isSupabaseWebConfigured || !supabaseClient) {
      return this.fallbackDemo.getMissions();
    }

    try {
      const { data, error } = await supabaseClient.from('missions').select('*').order('created_at', { ascending: false });
      if (error || !data) return this.fallbackDemo.getMissions();

      return data.map((m: any) => ({
        id: m.id,
        code: m.mission_code,
        title: m.name,
        type: m.type,
        priority: m.priority,
        status: m.status,
        targetLat: parseFloat(m.target_latitude),
        targetLng: parseFloat(m.target_longitude),
        searchRadius: 500,
        avironUnitId: m.aviron_unit_id,
        createdAt: m.created_at,
      }));
    } catch {
      return this.fallbackDemo.getMissions();
    }
  }

  async createMission(mission: Partial<Mission>): Promise<Mission> {
    if (!isSupabaseWebConfigured || !supabaseClient) {
      return this.fallbackDemo.createMission(mission);
    }

    try {
      const code = `AV-${Math.floor(Math.random() * 900) + 100}`;
      const { data, error } = await supabaseClient
        .from('missions')
        .insert({
          mission_code: code,
          name: mission.title || 'Rescue Operation',
          type: mission.type || 'FLOOD_RESCUE',
          priority: mission.priority || 'HIGH',
          status: 'PLANNED',
          target_latitude: mission.targetLat || 28.6155,
          target_longitude: mission.targetLng || 77.2125,
        })
        .select()
        .single();

      if (error || !data) return this.fallbackDemo.createMission(mission);

      return {
        id: data.id,
        code: data.mission_code,
        title: data.name,
        type: data.type,
        priority: data.priority,
        status: data.status,
        targetLat: parseFloat(data.target_latitude),
        targetLng: parseFloat(data.target_longitude),
        searchRadius: 500,
        createdAt: data.created_at,
      };
    } catch {
      return this.fallbackDemo.createMission(mission);
    }
  }

  async updateMissionStatus(id: string, status: Mission['status']): Promise<boolean> {
    if (!isSupabaseWebConfigured || !supabaseClient) {
      return this.fallbackDemo.updateMissionStatus(id, status);
    }

    try {
      const { error } = await supabaseClient.from('missions').update({ status }).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  async getTelemetryHistory(unitId: string): Promise<Telemetry[]> {
    if (!isSupabaseWebConfigured || !supabaseClient) {
      return this.fallbackDemo.getTelemetryHistory(unitId);
    }

    try {
      const { data } = await supabaseClient
        .from('telemetry')
        .select('*')
        .eq('aviron_unit_id', unitId)
        .order('timestamp', { ascending: false })
        .limit(30);

      if (!data) return this.fallbackDemo.getTelemetryHistory(unitId);

      return data.map((t: any) => ({
        id: t.id,
        avironUnitId: t.aviron_unit_id,
        battery: parseFloat(t.battery_percentage),
        voltage: parseFloat(t.battery_voltage),
        current: parseFloat(t.current),
        speed: parseFloat(t.speed),
        heading: parseFloat(t.heading),
        lat: parseFloat(t.latitude),
        lng: parseFloat(t.longitude),
        altitude: parseFloat(t.altitude),
        temperature: parseFloat(t.temperature),
        humidity: parseFloat(t.humidity),
        airQuality: parseFloat(t.air_quality),
        gasLevel: parseFloat(t.gas_level),
        signalStrength: t.signal_strength,
        networkLatency: t.latency,
        timestamp: t.timestamp,
      }));
    } catch {
      return this.fallbackDemo.getTelemetryHistory(unitId);
    }
  }

  async persistTelemetry(telemetry: Telemetry): Promise<void> {
    if (!isSupabaseWebConfigured || !supabaseClient) return;

    try {
      await supabaseClient.from('telemetry').insert({
        aviron_unit_id: telemetry.avironUnitId,
        battery_percentage: telemetry.battery,
        battery_voltage: telemetry.voltage,
        current: telemetry.current,
        speed: telemetry.speed,
        heading: telemetry.heading,
        latitude: telemetry.lat,
        longitude: telemetry.lng,
        altitude: telemetry.altitude,
        temperature: telemetry.temperature,
        humidity: telemetry.humidity,
        air_quality: telemetry.airQuality,
        gas_level: telemetry.gasLevel,
        signal_strength: telemetry.signalStrength,
        latency: telemetry.networkLatency,
      });
    } catch (e) {
      console.warn('Telemetry write warning:', e);
    }
  }

  async getDetections(): Promise<Detection[]> {
    return this.fallbackDemo.getDetections();
  }

  async getSurvivors(): Promise<Survivor[]> {
    return this.fallbackDemo.getSurvivors();
  }

  async getAlerts(): Promise<Alert[]> {
    return this.fallbackDemo.getAlerts();
  }

  async getMissionReports(): Promise<MissionReport[]> {
    return this.fallbackDemo.getMissionReports();
  }
}
