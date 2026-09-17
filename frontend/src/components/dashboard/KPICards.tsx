import React from 'react';
import { Plane, Send, HeartPulse, Activity } from 'lucide-react';
import { useAvironStore } from '../../store/useAvironStore';
import { useMissionStore } from '../../store/useMissionStore';

export const KPICards: React.FC = () => {
  const { units } = useAvironStore();
  const { missions } = useMissionStore();

  const activeUnits = units.filter((u) => u.status === 'ACTIVE').length;
  const activeMissions = missions.filter((m) => m.status === 'IN_PROGRESS' || m.status === 'READY').length;
  const survivorsFound = 1;
  const healthPercent = 98;

  const cards = [
    {
      title: 'ACTIVE AVIRON UNITS',
      value: String(activeUnits).padStart(2, '0'),
      subtitle: `${units.length} Total Registered`,
      icon: Plane,
      color: 'border-l-cyan-500 text-cyan-600 bg-cyan-50/50',
    },
    {
      title: 'ACTIVE MISSIONS',
      value: String(activeMissions).padStart(2, '0'),
      subtitle: '1 In Progress (AV-001)',
      icon: Send,
      color: 'border-l-navy-900 text-navy-900 bg-slate-50',
    },
    {
      title: 'SURVIVORS DETECTED',
      value: String(survivorsFound).padStart(2, '0'),
      subtitle: 'Medical Kit Deployed',
      icon: HeartPulse,
      color: 'border-l-red-500 text-red-600 bg-red-50/50',
    },
    {
      title: 'SYSTEM HEALTH',
      value: `${healthPercent}%`,
      subtitle: 'All Core Sensors Online',
      icon: Activity,
      color: 'border-l-teal-500 text-teal-600 bg-teal-50/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-2xl p-4 border border-slate-200 border-l-4 shadow-subtle flex items-center justify-between transition-all hover:shadow-card ${card.color}`}
          >
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                {card.title}
              </p>
              <div className="text-2xl sm:text-3xl font-black text-navy-950 font-sans mt-0.5">
                {card.value}
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{card.subtitle}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center">
              <Icon className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
