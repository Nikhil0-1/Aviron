import React from 'react';
import { Battery, Gauge, Compass, Zap, Thermometer, Wind, Wifi, Signal } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const TelemetryPanel: React.FC = () => {
  const { currentTelemetry, history } = useTelemetryStore();

  const chartData = history.map((t, idx) => ({
    time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    battery: t.battery,
    speed: t.speed,
    temp: t.temperature,
  }));

  // Fallback mock history for clean display if history is empty
  const displayChartData =
    chartData.length > 5
      ? chartData
      : [
          { time: '10:00', battery: 78, speed: 4.2, temp: 28.1 },
          { time: '10:02', battery: 77, speed: 4.8, temp: 28.3 },
          { time: '10:04', battery: 76, speed: 5.0, temp: 28.4 },
          { time: '10:06', battery: 75, speed: 4.6, temp: 28.5 },
          { time: '10:08', battery: 74, speed: 4.8, temp: 28.4 },
        ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-extrabold text-navy-950 uppercase tracking-wide flex items-center space-x-2">
          <Zap className="w-4 h-4 text-cyan-600" />
          <span>Real-Time Telemetry HUD</span>
        </h3>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
          50 Hz Telemetry Stream
        </span>
      </div>

      {/* Grid Metrics Display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
        {/* Battery */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">Battery</span>
            <Battery className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-xl font-black text-navy-950 font-mono">
            {currentTelemetry.battery.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500">{currentTelemetry.voltage}V | {currentTelemetry.current}A</div>
        </div>

        {/* Speed */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">Speed</span>
            <Gauge className="w-3.5 h-3.5 text-cyan-600" />
          </div>
          <div className="text-xl font-black text-navy-950 font-mono">
            {currentTelemetry.speed.toFixed(1)} <span className="text-xs font-normal">m/s</span>
          </div>
          <div className="text-[10px] text-slate-500">17.2 km/h</div>
        </div>

        {/* Heading */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">Heading</span>
            <Compass className="w-3.5 h-3.5 text-navy-700" />
          </div>
          <div className="text-xl font-black text-navy-950 font-mono">
            {Math.round(currentTelemetry.heading)}° <span className="text-xs font-normal">SE</span>
          </div>
          <div className="text-[10px] text-slate-500">Alt: {currentTelemetry.altitude}m</div>
        </div>

        {/* Signal */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">Signal</span>
            <Signal className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-xl font-black text-navy-950 font-mono">
            {currentTelemetry.signalStrength}%
          </div>
          <div className="text-[10px] text-slate-500">Latency: {currentTelemetry.networkLatency}ms</div>
        </div>
      </div>

      {/* Telemetry Chart: Battery Drain & Speed */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex-1 min-h-[140px]">
        <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-600">
          <span>Battery (%) & Speed (m/s) Over Time</span>
          <span className="text-[10px] text-cyan-700">Live Trend</span>
        </div>

        <div className="w-full h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayChartData}>
              <defs>
                <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
              <Area type="monotone" dataKey="battery" stroke="#0d9488" fillOpacity={1} fill="url(#batteryGrad)" strokeWidth={2} name="Battery %" />
              <Area type="monotone" dataKey="speed" stroke="#0284c7" fillOpacity={1} fill="url(#speedGrad)" strokeWidth={2} name="Speed m/s" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
