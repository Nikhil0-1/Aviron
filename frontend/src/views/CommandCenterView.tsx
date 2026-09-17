import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';
import { DemoControllerBar } from '../components/dashboard/DemoControllerBar';
import { KPICards } from '../components/dashboard/KPICards';
import { LiveMap } from '../components/map/LiveMap';
import { LiveVideoFeed } from '../components/dashboard/LiveVideoFeed';
import { TelemetryPanel } from '../components/dashboard/TelemetryPanel';
import { MissionTimeline } from '../components/dashboard/MissionTimeline';
import { QuickControls } from '../components/dashboard/QuickControls';
import { AIDetectionCenter } from '../components/detection/AIDetectionCenter';
import { MedicalPanel } from '../components/medical/MedicalPanel';
import { CommCenter } from '../components/comms/CommCenter';
import { FleetManager } from '../components/fleet/FleetManager';
import { MissionWizard } from '../components/missions/MissionWizard';
import { MissionReportView } from '../components/reports/MissionReportView';
import { SystemHealth } from '../components/health/SystemHealth';
import { SystemSettings } from '../components/settings/SystemSettings';
import { useAvironStore } from '../store/useAvironStore';
import { useMissionStore } from '../store/useMissionStore';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { DemoSimulationEngine } from '../services/simulation/DemoSimulationEngine';
import { Plus, Send } from 'lucide-react';

export const CommandCenterView: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  const { mode, selectedUnitId, units } = useAvironStore();
  const { activeMission, missions } = useMissionStore();
  const { updateTelemetry } = useTelemetryStore();

  const activeUnit = units.find((u) => u.id === selectedUnitId) || units[0];
  const engine = DemoSimulationEngine.getInstance();

  // Subscribe Demo Simulation updates
  useEffect(() => {
    if (mode === 'DEMO') {
      const unsub = engine.subscribe((state) => {
        updateTelemetry(state.telemetry);
      });
      return () => {
        unsub();
      };
    }
    return () => {};
  }, [mode, updateTelemetry]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation Header */}
      <Header />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Center Content View Area */}
        <main className="flex-1 p-3 sm:p-5 overflow-y-auto pb-24 md:pb-8 max-w-[1920px] mx-auto w-full">
          {/* Demo Controller Bar */}
          {mode === 'DEMO' && <DemoControllerBar />}

          {/* TAB 1: OVERVIEW / LIVE OPERATIONS */}
          {(currentTab === 'overview' || currentTab === 'live') && (
            <div className="space-y-4">
              {/* Top Dashboard KPIs & New Mission Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1 w-full">
                  <KPICards />
                </div>
              </div>

              {/* Quick Action Bar for Launching Wizard */}
              <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-subtle">
                <div className="flex items-center space-x-2">
                  <Send className="w-5 h-5 text-cyan-600" />
                  <div>
                    <h3 className="text-xs font-extrabold text-navy-950 uppercase tracking-wide">
                      Active Mission: {activeMission?.code || 'AV-001'} — {activeMission?.title || 'Flood Rescue'}
                    </h3>
                    <p className="text-[11px] text-slate-500">Target Coords: 28.6155N, 77.2125E | Search Radius: 600m</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowWizard(true)}
                  className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-950 text-cyan-400 font-extrabold text-xs shadow-sm flex items-center space-x-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Mission</span>
                </button>
              </div>

              {/* Core Multi-Panel Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Panel: Live Tactical Map (Spans 7 cols on large screens) */}
                <div className="lg:col-span-7 h-[420px] lg:h-[520px]">
                  <LiveMap
                    unit={activeUnit}
                    mission={activeMission}
                    survivors={engine.getState().survivors}
                  />
                </div>

                {/* Right Panel: Live Dual Camera Stream (Spans 5 cols) */}
                <div className="lg:col-span-5 h-[420px] lg:h-[520px]">
                  <LiveVideoFeed />
                </div>
              </div>

              {/* Middle Row Grid: Telemetry & Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-7">
                  <TelemetryPanel />
                </div>
                <div className="lg:col-span-5 space-y-4">
                  <QuickControls />
                  <MissionTimeline />
                </div>
              </div>
            </div>
          )}

          {/* TAB: MISSIONS */}
          {currentTab === 'missions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <h2 className="text-base font-extrabold text-navy-950">Mission Management Console</h2>
                  <p className="text-xs text-slate-500">Autonomous Mission Dispatch & Search Zones</p>
                </div>
                <button
                  onClick={() => setShowWizard(true)}
                  className="px-4 py-2 rounded-xl bg-navy-900 text-cyan-400 font-bold text-xs"
                >
                  + New Mission
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {missions.map((m) => (
                  <div key={m.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-card space-y-2 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-navy-950">{m.code}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-900 text-[10px]">{m.status}</span>
                    </div>
                    <div className="font-extrabold text-navy-900">{m.title}</div>
                    <div className="text-[11px] text-slate-500">Target: {m.targetLat}, {m.targetLng}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FLEET */}
          {currentTab === 'fleet' && <FleetManager />}

          {/* TAB: AI DETECTION */}
          {currentTab === 'detection' && <AIDetectionCenter />}

          {/* TAB: MEDICAL */}
          {currentTab === 'medical' && <MedicalPanel />}

          {/* TAB: COMMS */}
          {currentTab === 'comms' && <CommCenter />}

          {/* TAB: TELEMETRY */}
          {currentTab === 'telemetry' && <TelemetryPanel />}

          {/* TAB: ALERTS */}
          {currentTab === 'alerts' && <MissionTimeline />}

          {/* TAB: REPORTS */}
          {currentTab === 'reports' && <MissionReportView />}

          {/* TAB: HEALTH */}
          {currentTab === 'health' && <SystemHealth />}

          {/* TAB: SETTINGS */}
          {currentTab === 'settings' && <SystemSettings />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onPause={() => engine.pause()}
        onReturnBase={() => engine.reset()}
        onEmergencyStop={() => alert('Emergency Stop Engaged!')}
      />

      {/* Mission Creation Wizard Modal */}
      {showWizard && <MissionWizard onClose={() => setShowWizard(false)} />}
    </div>
  );
};
