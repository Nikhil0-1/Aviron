import React, { useState } from 'react';
import { HeartPulse, Activity, Package, CheckCircle2, ShieldAlert, Send } from 'lucide-react';
import { DemoSimulationEngine } from '../../services/simulation/DemoSimulationEngine';
import { ProviderFactory } from '../../services/hardware/ProviderFactory';
import { useAvironStore } from '../../store/useAvironStore';

export const MedicalPanel: React.FC = () => {
  const { mode, selectedUnitId } = useAvironStore();
  const engine = DemoSimulationEngine.getInstance();
  const survivors = engine.getState().survivors;

  const [payloadStatus, setPayloadStatus] = useState<'READY' | 'LOADED' | 'DEPLOYING' | 'DELIVERED'>('LOADED');
  const [feedback, setFeedback] = useState<string | null>(null);

  const survivor = survivors[0] || {
    code: 'SURVIVOR #001',
    status: 'ASSISTANCE_REQUESTED',
    heartRate: 88,
    spO2: 96,
    temperature: 36.9,
    lat: 28.6152,
    lng: 77.2120,
    notes: 'Stranded individual on rooftop in flood sector.',
  };

  const handleDeployPayload = async () => {
    setPayloadStatus('DEPLOYING');
    const provider = ProviderFactory.getProvider(mode);
    const res = await provider.deployPayload(selectedUnitId || 'unit-01', 'REAK-1 Emergency Medical Kit');

    setTimeout(() => {
      setPayloadStatus('DELIVERED');
      setFeedback('✓ REAK-1 Emergency Kit dropped onto survivor platform!');
      setTimeout(() => setFeedback(null), 5000);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-bold">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-navy-950 uppercase tracking-wide">
              Emergency Medical & Survivor Assistance
            </h3>
            <p className="text-[11px] text-slate-500">Autonomous Payload Deployment & Triage Monitoring</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          DEMO DATA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Survivor Vitals Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-950">{survivor.code}</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 uppercase">
              {survivor.status}
            </span>
          </div>

          <p className="text-xs text-slate-600 font-medium leading-relaxed">{survivor.notes}</p>

          {/* Vitals Grid */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200">
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Heart Rate</span>
              <span className="text-lg font-black text-navy-950">{survivor.heartRate} <span className="text-xs font-normal text-slate-500">bpm</span></span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">SpO₂</span>
              <span className="text-lg font-black text-teal-700">{survivor.spO2}%</span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Temp</span>
              <span className="text-lg font-black text-amber-700">{survivor.temperature}°C</span>
            </div>
          </div>
        </div>

        {/* Payload Deployment Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center space-x-1.5">
                <Package className="w-4 h-4 text-cyan-600" />
                <span>Onboard Medical Payload</span>
              </span>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  payloadStatus === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : payloadStatus === 'DEPLOYING'
                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                    : 'bg-cyan-100 text-cyan-900'
                }`}
              >
                {payloadStatus}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              REAK-1 (Rapid Emergency Aid Kit with VHF emergency radio beacon & hypothermia wrap).
            </p>
          </div>

          {feedback && (
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              {feedback}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={handleDeployPayload}
              disabled={payloadStatus === 'DELIVERED' || payloadStatus === 'DEPLOYING'}
              className="flex-1 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{payloadStatus === 'DELIVERED' ? 'PAYLOAD DELIVERED' : 'DEPLOY MEDICAL PAYLOAD'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
