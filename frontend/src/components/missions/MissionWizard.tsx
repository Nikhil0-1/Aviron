import React, { useState } from 'react';
import { Send, MapPin, Plane, Package, ShieldAlert, CheckCircle2, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useAvironStore } from '../../store/useAvironStore';
import { useMissionStore } from '../../store/useMissionStore';
import { MissionType, MissionPriority } from '../../types';

interface MissionWizardProps {
  onClose: () => void;
}

export const MissionWizard: React.FC<MissionWizardProps> = ({ onClose }) => {
  const { units } = useAvironStore();
  const { addMission } = useMissionStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    type: 'FLOOD_RESCUE' as MissionType,
    targetLat: '28.6155',
    targetLng: '77.2125',
    searchRadius: '500',
    avironUnitId: units[0]?.id || '',
    payload: 'REAK-1 Emergency Medical Kit',
    priority: 'HIGH' as MissionPriority,
  });

  const missionTypes: { type: MissionType; title: string; desc: string }[] = [
    { type: 'FLOOD_RESCUE', title: 'Flood Rescue & Extraction', desc: 'Amphibious survivor location & supply delivery' },
    { type: 'SEARCH_AND_RESCUE', title: 'Urban Search & Rescue', desc: 'Disaster zone human thermal detection' },
    { type: 'MEDICAL_EMERGENCY', title: 'Medical Emergency Drop', desc: 'Rapid delivery of blood plasma & meds' },
    { type: 'DISASTER_RECON', title: 'Disaster Reconnaissance', desc: 'High altitude perimeter mapping' },
    { type: 'SURVIVOR_DETECTION', title: 'Survivor Detection Sweep', desc: 'AI visual & thermal human scanning' },
    { type: 'MEDICAL_SUPPLY_DELIVERY', title: 'Supply Transport', desc: 'Heavy payload cargo transport' },
    { type: 'ENVIRONMENTAL_MONITORING', title: 'Environmental Recon', desc: 'Hazardous gas & air quality scanning' },
  ];

  const handleNext = () => setStep((s) => Math.min(7, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = () => {
    const count = Math.floor(Math.random() * 900) + 100;
    const newMission = {
      id: `m-wizard-${Date.now()}`,
      code: `AV-${count}`,
      title: formData.title || `${formData.type.replace('_', ' ')} Operation`,
      type: formData.type,
      priority: formData.priority,
      status: 'READY' as const,
      targetLat: parseFloat(formData.targetLat),
      targetLng: parseFloat(formData.targetLng),
      searchRadius: parseFloat(formData.searchRadius),
      avironUnitId: formData.avironUnitId,
      createdAt: new Date().toISOString(),
      waypoints: [
        { seq: 1, lat: 28.6139, lng: 77.2090, altitude: 20, action: 'TAKEOFF' as const, isReached: true },
        { seq: 2, lat: parseFloat(formData.targetLat), lng: parseFloat(formData.targetLng), altitude: 15, action: 'SEARCH_PATTERN' as const, isReached: false },
      ],
    };

    addMission(newMission);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-elevated border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Wizard Header */}
        <div className="bg-navy-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-extrabold">Create New Rescue Mission</h3>
              <p className="text-[11px] text-slate-300">Step {step} of 7 — {step === 1 ? 'Mission Type' : step === 2 ? 'Location' : step === 3 ? 'Assign Unit' : step === 4 ? 'Payload' : step === 5 ? 'Priority' : step === 6 ? 'Review' : 'Launch'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-navy-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Step 1: Type */}
          {step === 1 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Mission Classification
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {missionTypes.map((item) => (
                  <div
                    key={item.type}
                    onClick={() => setFormData({ ...formData, type: item.type, title: item.title })}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      formData.type === item.type
                        ? 'bg-cyan-50 border-cyan-500 ring-2 ring-cyan-500/20 text-navy-950 font-bold'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-navy-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Target Location */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <label className="block font-bold text-slate-700 uppercase tracking-wider">
                Target Zone Coordinates & Search Radius
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block mb-1">Latitude</span>
                  <input
                    type="text"
                    value={formData.targetLat}
                    onChange={(e) => setFormData({ ...formData, targetLat: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Longitude</span>
                  <input
                    type="text"
                    value={formData.targetLng}
                    onChange={(e) => setFormData({ ...formData, targetLng: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Search Radius (Meters)</span>
                <input
                  type="number"
                  value={formData.searchRadius}
                  onChange={(e) => setFormData({ ...formData, searchRadius: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                />
              </div>
            </div>
          )}

          {/* Step 3: Unit Assignment */}
          {step === 3 && (
            <div className="space-y-3 text-xs">
              <label className="block font-bold text-slate-700 uppercase tracking-wider">
                Assign AVIRON Unit
              </label>
              <div className="space-y-2">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    onClick={() => setFormData({ ...formData, avironUnitId: unit.id })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      formData.avironUnitId === unit.id
                        ? 'bg-navy-900 text-white border-navy-800'
                        : 'bg-slate-50 text-navy-950 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold">{unit.code} — {unit.name}</div>
                      <div className="text-[11px] opacity-80">{unit.model}</div>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold">{unit.battery}% Battery</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Payload */}
          {step === 4 && (
            <div className="space-y-3 text-xs">
              <label className="block font-bold text-slate-700 uppercase tracking-wider">
                Select Rescue Payload
              </label>
              {[
                'REAK-1 Rapid Emergency Aid Kit',
                'Emergency VHF Beacon & Battery Pack',
                'Insulin & Blood Plasma Unit',
                'Thermal Rescue Blanket & Rations',
              ].map((pl) => (
                <div
                  key={pl}
                  onClick={() => setFormData({ ...formData, payload: pl })}
                  className={`p-3 rounded-xl border cursor-pointer font-bold transition-all ${
                    formData.payload === pl
                      ? 'bg-cyan-50 border-cyan-500 text-navy-950 ring-2 ring-cyan-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pl}
                </div>
              ))}
            </div>
          )}

          {/* Step 5: Priority */}
          {step === 5 && (
            <div className="space-y-3 text-xs">
              <label className="block font-bold text-slate-700 uppercase tracking-wider">
                Set Priority Level
              </label>
              {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
                <div
                  key={p}
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`p-3 rounded-xl border cursor-pointer font-extrabold tracking-wider transition-all ${
                    formData.priority === p
                      ? 'bg-red-50 border-red-500 text-red-950 ring-2 ring-red-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p} PRIORITY
                </div>
              ))}
            </div>
          )}

          {/* Step 6 & 7: Review & Launch */}
          {(step === 6 || step === 7) && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-extrabold text-navy-950 text-sm">{formData.title || 'Rescue Operation'}</div>
                <div>Type: <span className="font-bold text-cyan-700">{formData.type}</span></div>
                <div>Target Coords: <span className="font-mono font-bold">{formData.targetLat}, {formData.targetLng}</span></div>
                <div>Priority: <span className="font-bold text-red-600">{formData.priority}</span></div>
                <div>Payload: <span className="font-bold text-navy-900">{formData.payload}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs disabled:opacity-40"
          >
            Back
          </button>
          {step < 7 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-navy-900 text-cyan-400 font-bold text-xs flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md"
            >
              🚀 START MISSION NOW
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
