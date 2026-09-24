import React, { useState } from 'react';
import { HeartHandshake, MapPin, Send, AlertTriangle, ShieldCheck, PhoneCall, Upload, MessageSquare, CheckCircle2, Clock, Navigation, Activity, Image as ImageIcon, FileText } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useEmergencyStore } from '../store/useEmergencyStore';
import { useTeamStore } from '../store/useTeamStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { EmergencyType, IncidentMedia } from '../types';

interface VictimPanelViewProps {
  onNavigatePanel: (panel: 'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN') => void;
}

export const VictimPanelView: React.FC<VictimPanelViewProps> = ({ onNavigatePanel }) => {
  const { user } = useAuthStore();
  const { requests, activeRequestId, addRequest, addMediaToRequest } = useEmergencyStore();
  const { chatMessages, addChatMessage } = useTeamStore();
  const { addNotification } = useNotificationStore();

  const activeRequest = requests.find((r) => r.id === activeRequestId) || requests[0];

  const [activeTab, setActiveTab] = useState<'HOME' | 'WIZARD' | 'STATUS' | 'CHAT' | 'MEDIA'>('HOME');

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [emergencyType, setEmergencyType] = useState<EmergencyType>('FLOOD');
  const [locationName, setLocationName] = useState('Sector 4 Flood Plain, Delhi');
  const [lat, setLat] = useState(28.6152);
  const [lng, setLng] = useState(77.2120);
  const [condition, setCondition] = useState('Cannot move, stranded on rooftop with 2 family members');
  const [description, setDescription] = useState('Flood water rising fast near Sector 4 riverbank');

  // Chat message state
  const [chatInput, setChatInput] = useState('');

  // Media upload simulation state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleCreateEmergency = () => {
    const newReq = addRequest({
      victimId: user?.id || 'usr-victim-01',
      victimName: user?.name || 'Aarav Kumar',
      victimPhone: user?.phone || '+91 98765 43210',
      type: emergencyType,
      priority: 'CRITICAL',
      description,
      condition,
      lat,
      lng,
      locationName,
    });

    addNotification({
      targetRole: 'ADMIN',
      type: 'EMERGENCY',
      title: '🚨 NEW VICTIM EMERGENCY REQUEST',
      message: `${user?.name || 'Victim'} requested help for ${emergencyType} at ${locationName}.`,
    });

    addNotification({
      targetRole: 'RESCUE_OPERATOR',
      type: 'EMERGENCY',
      title: '⚡ NEW MISSION DISPATCH AVAILABLE',
      message: `Emergency #${newReq.requestCode} created. Requires immediate team assignment.`,
    });

    setActiveTab('STATUS');
    setWizardStep(1);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    addChatMessage({
      teamId: activeRequest?.assignedTeamId || 'team-alpha',
      missionId: activeRequest?.id,
      channel: 'EMERGENCY',
      senderId: user?.id || 'usr-victim-01',
      senderName: `${user?.name || 'Victim'} (Survivor)`,
      senderRole: 'VICTIM',
      message: chatInput,
    });

    setChatInput('');
  };

  const handleSimulateFileUpload = () => {
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          if (activeRequest) {
            const media: IncidentMedia = {
              id: `med-${Date.now()}`,
              incidentId: activeRequest.id,
              uploadedBy: user?.id || 'usr-victim-01',
              fileName: `emergency_evidence_${Date.now()}.jpg`,
              fileType: 'IMAGE',
              r2Key: `aviron/incidents/${activeRequest.id}/emergency_evidence_${Date.now()}.jpg`,
              url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
              fileSize: 1850000,
              createdAt: new Date().toISOString(),
            };
            addMediaToRequest(activeRequest.id, media);
          }
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  const STATUS_STEPS = [
    { key: 'NEW', label: 'REQUEST RECEIVED' },
    { key: 'ACKNOWLEDGED', label: 'ACKNOWLEDGED' },
    { key: 'ASSIGNED', label: 'TEAM ASSIGNED' },
    { key: 'AVIRON_DEPLOYED', label: 'AVIRON DEPLOYED' },
    { key: 'EN_ROUTE', label: 'EN ROUTE' },
    { key: 'ARRIVED', label: 'ARRIVED' },
    { key: 'ASSISTANCE_IN_PROGRESS', label: 'IN PROGRESS' },
    { key: 'RESOLVED', label: 'RESOLVED' },
  ];

  const getCurrentStepIndex = () => {
    const status = activeRequest?.status || 'NEW';
    const idx = STATUS_STEPS.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="min-h-screen bg-rose-50/40 text-slate-900 pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-rose-100 px-4 py-3 sticky top-[41px] z-30 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-rose-950 leading-tight">AVIRON Victim Assistance</h1>
            <p className="text-[11px] font-semibold text-rose-600">Emergency Survivor Portal</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-rose-100/60 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('HOME')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'HOME' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('STATUS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'STATUS' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Status
          </button>
          <button
            onClick={() => setActiveTab('CHAT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'CHAT' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('MEDIA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'MEDIA' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-6">
        {/* TAB 1: HOME */}
        {activeTab === 'HOME' && (
          <div className="space-y-6 text-center">
            <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-xl space-y-6">
              <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-4 ring-rose-50">
                <AlertTriangle className="w-10 h-10 animate-pulse" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-rose-950">Hello, {user?.name || 'Survivor'}</h2>
                <p className="text-base font-extrabold text-slate-700 mt-1">Are you safe?</p>
                <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                  If you are in immediate danger or need flood rescue assistance, tap the button below.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('WIZARD');
                  setWizardStep(1);
                }}
                className="w-full py-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-lg shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center space-x-3"
              >
                <AlertTriangle className="w-6 h-6" />
                <span>REQUEST EMERGENCY HELP</span>
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-xs font-bold text-slate-600">
                <button onClick={() => setActiveTab('STATUS')} className="hover:text-rose-600 flex items-center space-x-1">
                  <Activity className="w-4 h-4 text-cyan-600" />
                  <span>View Active Request</span>
                </button>
                <span>•</span>
                <button onClick={() => setActiveTab('CHAT')} className="hover:text-rose-600 flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                  <span>Chat With Team</span>
                </button>
              </div>
            </div>

            {/* Active Request Overview Card */}
            {activeRequest && (
              <div className="bg-white rounded-2xl p-4 border border-rose-200 text-left space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-mono font-bold text-rose-600">{activeRequest.requestCode}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    {activeRequest.status}
                  </span>
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-navy-950">{activeRequest.type} EMERGENCY</p>
                  <p className="text-slate-600">{activeRequest.locationName}</p>
                </div>
                <button
                  onClick={() => setActiveTab('STATUS')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                >
                  Track Live Assistance →
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STEP-BY-STEP WIZARD */}
        {activeTab === 'WIZARD' && (
          <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-rose-950">Emergency Assistance Request</h2>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700">
                Step {wizardStep} of 5
              </span>
            </div>

            {/* Step 1: Emergency Type */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800">Step 1 — Select Emergency Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'FLOOD', label: 'Flood Rescue', icon: '🌊' },
                    { id: 'MEDICAL', label: 'Medical Emergency', icon: '🩺' },
                    { id: 'TRAPPED', label: 'Trapped Person', icon: '🏚️' },
                    { id: 'ACCIDENT', label: 'Accident', icon: '🚗' },
                    { id: 'FIRE', label: 'Fire Incident', icon: '🔥' },
                    { id: 'EARTHQUAKE', label: 'Earthquake', icon: '🧱' },
                    { id: 'MISSING', label: 'Missing Person', icon: '🔍' },
                    { id: 'OTHER', label: 'Other Hazard', icon: '⚠️' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setEmergencyType(t.id as EmergencyType)}
                      className={`p-4 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                        emergencyType === t.id
                          ? 'bg-rose-50 border-rose-600 text-rose-950 shadow-sm font-bold ring-2 ring-rose-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-2xl">{t.icon}</span>
                      <span className="text-xs font-extrabold">{t.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setWizardStep(2)}
                  className="w-full py-3.5 rounded-xl bg-rose-600 text-white font-extrabold text-sm shadow-md"
                >
                  Continue to Location →
                </button>
              </div>
            )}

            {/* Step 2: Location */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800">Step 2 — Specify Location</h3>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-rose-700">
                    <MapPin className="w-4 h-4" />
                    <span>GPS Coordinates (Simulated RTK Fix)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white p-2.5 rounded-xl border border-slate-200">
                    <div>LAT: {lat.toFixed(4)}</div>
                    <div>LNG: {lng.toFixed(4)}</div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500">Location Details / Landmark</label>
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="w-full mt-1 p-3 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setLat(28.6152 + (Math.random() * 0.002 - 0.001));
                      setLng(77.2120 + (Math.random() * 0.002 - 0.001));
                    }}
                    className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    📍 Refresh GPS Fix
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setWizardStep(1)} className="w-1/3 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                    ← Back
                  </button>
                  <button onClick={() => setWizardStep(3)} className="w-2/3 py-3 rounded-xl bg-rose-600 text-white font-extrabold text-xs">
                    Continue to Condition →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Condition */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800">Step 3 — Victim Condition</h3>
                <div className="space-y-2">
                  {[
                    'Need immediate rescue / trapped',
                    'Injured (minor / major)',
                    'Cannot move',
                    'Need medical supplies / oxygen',
                    'Need communication assistance',
                    'Other urgent requirement',
                  ].map((cond) => (
                    <button
                      key={cond}
                      onClick={() => setCondition(cond)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                        condition === cond
                          ? 'bg-rose-50 border-rose-600 text-rose-950 ring-2 ring-rose-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setWizardStep(2)} className="w-1/3 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                    ← Back
                  </button>
                  <button onClick={() => setWizardStep(4)} className="w-2/3 py-3 rounded-xl bg-rose-600 text-white font-extrabold text-xs">
                    Continue to Info →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Additional Info */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800">Step 4 — Additional Information</h3>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">Describe your situation for rescue team</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mt-1 p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="e.g. 3 people on rooftop, water level rising, wearing red jacket..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setWizardStep(3)} className="w-1/3 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                    ← Back
                  </button>
                  <button onClick={() => setWizardStep(5)} className="w-2/3 py-3 rounded-xl bg-rose-600 text-white font-extrabold text-xs">
                    Review Request →
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Confirm & Send */}
            {wizardStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800">Step 5 — Confirm & Send Request</h3>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Type:</span><span className="font-extrabold text-rose-700">{emergencyType}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Location:</span><span className="font-bold text-slate-800">{locationName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Condition:</span><span className="font-bold text-slate-800">{condition}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Description:</span><span className="font-semibold text-slate-700">{description}</span></div>
                </div>

                <button
                  onClick={handleCreateEmergency}
                  className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base shadow-xl shadow-rose-600/30 flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>SEND EMERGENCY REQUEST NOW</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STATUS & LIVE TRACKING */}
        {activeTab === 'STATUS' && activeRequest && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-rose-600 uppercase">Emergency Request Record</span>
                  <h2 className="text-xl font-black text-rose-950">{activeRequest.requestCode}</h2>
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-rose-100 text-rose-800">
                  {activeRequest.status}
                </span>
              </div>

              {/* Progress Bar Tracker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Progress Tracker</span>
                  <span>{getCurrentStepIndex() + 1} / {STATUS_STEPS.length}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div
                    className="bg-rose-600 h-full transition-all duration-500"
                    style={{ width: `${((getCurrentStepIndex() + 1) / STATUS_STEPS.length) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-slate-500 text-center pt-1">
                  <span className={getCurrentStepIndex() >= 0 ? 'text-rose-700 font-bold' : ''}>RECEIVED</span>
                  <span className={getCurrentStepIndex() >= 2 ? 'text-rose-700 font-bold' : ''}>ASSIGNED</span>
                  <span className={getCurrentStepIndex() >= 4 ? 'text-rose-700 font-bold' : ''}>EN ROUTE</span>
                  <span className={getCurrentStepIndex() >= 7 ? 'text-emerald-700 font-bold' : ''}>RESOLVED</span>
                </div>
              </div>

              {/* Live Tracking Card */}
              <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-4 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="font-extrabold text-xs text-cyan-400">AVIRON-01 RECON DRONE</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                    EN ROUTE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px]">DISTANCE</span>
                    <p className="text-lg font-black text-cyan-400">{activeRequest.distanceKm || 1.2} km</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px]">ESTIMATED ETA</span>
                    <p className="text-lg font-black text-emerald-400">04:32 min</p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-medium bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-cyan-400 font-bold">Team Assignment:</span> {activeRequest.assignedTeamName || 'Team Alpha (Rapid Recon)'}
                </div>
              </div>

              {/* Quick Communication Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('CHAT')}
                  className="py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat With Team</span>
                </button>
                <button
                  onClick={() => alert('Emergency dispatch helpline: Calling Team Leader Capt. Rahul...')}
                  className="py-3 bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Call Rescue Team</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHAT */}
        {activeTab === 'CHAT' && (
          <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-xl flex flex-col h-[520px]">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-rose-950 text-sm">Emergency Communication Channel</h3>
                <p className="text-[11px] text-slate-500">Live Victim ↔ Rescue Team Link</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.senderRole === 'VICTIM' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-bold mb-1">
                    <span>{msg.senderName}</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl font-medium leading-relaxed ${
                      msg.senderRole === 'VICTIM'
                        ? 'bg-rose-600 text-white rounded-br-none shadow-sm'
                        : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-slate-100 flex space-x-2">
              <input
                type="text"
                placeholder="Type emergency message to team..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: MEDIA UPLOAD & MEDICAL NOTES */}
        {activeTab === 'MEDIA' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-xl space-y-6">
              <div>
                <h3 className="font-black text-rose-950 text-base">Cloudflare R2 Emergency Media Upload</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload image or video evidence of your location to assist AVIRON navigation.
                </p>
              </div>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-rose-200 rounded-2xl p-6 text-center space-y-3 bg-rose-50/50">
                <Upload className="w-10 h-10 text-rose-500 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Upload Image / Video Evidence</p>
                <p className="text-[10px] text-slate-400">Supported: JPG, PNG, MP4 (Max 25MB)</p>

                {isUploading ? (
                  <div className="space-y-2 pt-2">
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-600">Uploading to R2... {uploadProgress}%</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSimulateFileUpload}
                    className="px-5 py-2.5 bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-rose-700 transition-all"
                  >
                    Select File to Upload
                  </button>
                )}
              </div>

              {/* Uploaded Media Files List */}
              {activeRequest?.media && activeRequest.media.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-800">Uploaded Incident Media ({activeRequest.media.length})</h4>
                  <div className="space-y-2">
                    {activeRequest.media.map((med) => (
                      <div key={med.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <ImageIcon className="w-4 h-4 text-cyan-600" />
                          <span className="font-bold text-slate-800">{med.fileName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          R2 STORED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medical Information Notice & Disclaimer */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-amber-700 font-bold">
                  <Activity className="w-4 h-4" />
                  <span>Medical Disclaimer</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  This information is for emergency assistance and does not replace professional medical diagnosis.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
