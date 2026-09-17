import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, LifeBuoy, Send, Compass } from 'lucide-react';
import { DemoSimulationEngine } from '../../services/simulation/DemoSimulationEngine';

export const MissionTimeline: React.FC = () => {
  const engine = DemoSimulationEngine.getInstance();
  const events = engine.getState().events;

  // Fallback timeline events if empty
  const displayEvents =
    events.length > 0
      ? events
      : [
          { id: '1', missionId: 'AV-001', eventType: 'SURVIVOR DETECTED', description: 'Human presence confirmed via FLIR Radiometric Core.', timestamp: new Date().toISOString() },
          { id: '2', missionId: 'AV-001', eventType: 'ROUTE RECALCULATED', description: 'LIDAR detour path engaged (+45m buffer).', timestamp: new Date(Date.now() - 120000).toISOString() },
          { id: '3', missionId: 'AV-001', eventType: 'OBSTACLE DETECTED', description: 'High-voltage structure identified.', timestamp: new Date(Date.now() - 180000).toISOString() },
          { id: '4', missionId: 'AV-001', eventType: 'MISSION STARTED', description: 'AVIRON-01 launched from Base pad.', timestamp: new Date(Date.now() - 300000).toISOString() },
        ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <h3 className="text-sm font-extrabold text-navy-950 uppercase tracking-wide flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-600" />
          <span>Mission Activity Timeline (AV-001)</span>
        </h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
          Real-Time Log
        </span>
      </div>

      <div className="relative pl-6 space-y-3 max-h-64 overflow-y-auto pr-1">
        {/* Vertical Line */}
        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>

        {displayEvents.map((evt, idx) => {
          const isCritical = evt.eventType.includes('SURVIVOR') || evt.eventType.includes('CRITICAL');
          const isWarning = evt.eventType.includes('OBSTACLE') || evt.eventType.includes('WARNING');
          const isSuccess = evt.eventType.includes('PAYLOAD') || evt.eventType.includes('COMPLETED');

          return (
            <div key={evt.id || idx} className="relative group text-xs">
              {/* Bullet Node */}
              <div
                className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center ${
                  isCritical
                    ? 'border-red-600 bg-red-50 ring-2 ring-red-500/20'
                    : isWarning
                    ? 'border-amber-500 bg-amber-50'
                    : isSuccess
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-cyan-500'
                }`}
              ></div>

              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`font-bold text-xs uppercase tracking-tight ${
                      isCritical
                        ? 'text-red-700 font-extrabold'
                        : isWarning
                        ? 'text-amber-800'
                        : isSuccess
                        ? 'text-teal-800'
                        : 'text-navy-950'
                    }`}
                  >
                    {evt.eventType}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{evt.description}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
