import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { requests, activeRequestId, addRequest, addMediaToRequest } = useEmergencyStore();
  const { chatMessages, addChatMessage } = useTeamStore();
  const { addNotification } = useNotificationStore();

  const activeRequest = requests.find((r) => r.id === activeRequestId) || requests[0];

  const getTabFromPath = (path: string) => {
    if (path.includes('/status')) return 'STATUS';
    if (path.includes('/map') || path.includes('/wizard')) return 'WIZARD';
    if (path.includes('/chat')) return 'CHAT';
    if (path.includes('/uploads') || path.includes('/media')) return 'MEDIA';
    if (path.includes('/more')) return 'STATUS';
    return 'HOME';
  };

  const activeTab = getTabFromPath(location.pathname);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'HOME') navigate('/victim');
    else if (tabId === 'STATUS') navigate('/victim/status');
    else if (tabId === 'WIZARD' || tabId === 'MAP') navigate('/victim/map');
    else if (tabId === 'CHAT') navigate('/victim/chat');
    else if (tabId === 'MEDIA' || tabId === 'UPLOADS') navigate('/victim/uploads');
    else if (tabId === 'MORE') navigate('/victim/more');
  };

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

    handleTabChange('STATUS');
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
    { key: 'NEW', label: 'RECEIVED' },
    { key: 'ACKNOWLEDGED', label: 'ACKNOWLEDGED' },
    { key: 'ASSIGNED', label: 'ASSIGNED' },
    { key: 'AVIRON_DEPLOYED', label: 'DEPLOYED' },
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
    <div className="min-h-screen bg-rose-50/40 text-slate-900 pb-20 max-w-full min-w-0 overflow-x-hidden">
      {/* Responsive Header */}
      <div className="bg-white border-b border-rose-100 px-3 sm:px-4 py-2.5 sticky top-[41px] z-30 shadow-sm min-w-0 max-w-full">
        <div className="max-w-xl mx-auto space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-black text-rose-950 truncate leading-tight">AVIRON Victim Portal</h1>
                <p className="text-[10px] font-bold text-rose-600 truncate">Emergency Survivor Portal</p>
              </div>
            </div>

            <button
              onClick={() => {
                handleTabChange('WIZARD');
                setWizardStep(1);
              }}
              className="px-3 py-1.5 bg-rose-600 text-white font-extrabold text-[11px] rounded-xl shadow-sm shrink-0 flex items-center space-x-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>REQUEST HELP</span>
            </button>
          </div>

          {/* Scrollable Tab Container (Scrolls ONLY inside tabs container, never whole page) */}
          <div className="flex items-center space-x-1 bg-rose-100/60 p-1 rounded-xl overflow-x-auto no-scrollbar max-w-full min-w-0 flex-nowrap text-xs font-bold">
            <button
              onClick={() => handleTabChange('HOME')}
              className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'HOME' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleTabChange('STATUS')}
              className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'STATUS' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Live Status
            </button>
            <button
              onClick={() => handleTabChange('CHAT')}
              className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'CHAT' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Team Chat
            </button>
            <button
              onClick={() => handleTabChange('MEDIA')}
              className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'MEDIA' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              R2 Upload
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-3 sm:px-4 pt-4 min-w-0">
        {/* TAB 1: HOME */}
        {activeTab === 'HOME' && (
          <div className="space-y-4 text-center min-w-0">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-rose-200 shadow-xl space-y-5 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-4 ring-rose-50">
                <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
              </div>

              <div className="min-w-0 space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-rose-950 break-words">Hello, {user?.name || 'Survivor'}</h2>
                <p className="text-sm sm:text-base font-extrabold text-slate-700">Are you safe?</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  If you are in immediate danger or stranded during a flood, tap below to dispatch AVIRON.
                </p>
              </div>

              <button
                onClick={() => {
                  handleTabChange('WIZARD');
                  setWizardStep(1);
                }}
                className="w-full min-h-[52px] py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="truncate">REQUEST EMERGENCY HELP</span>
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-xs font-bold text-slate-600">
                <button onClick={() => handleTabChange('STATUS')} className="hover:text-rose-600 flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-600" />
                  <span>View Status</span>
                </button>
                <span>•</span>
                <button onClick={() => handleTabChange('CHAT')} className="hover:text-rose-600 flex items-center space-x-1">
                  <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Chat With Team</span>
                </button>
              </div>
            </div>

            {/* Active Request Overview Card */}
            {activeRequest && (
              <div className="bg-white rounded-2xl p-4 border border-rose-200 text-left space-y-2 shadow-sm min-w-0">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-mono font-bold text-rose-600">{activeRequest.requestCode}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    {activeRequest.status}
                  </span>
                </div>
                <div className="text-xs space-y-0.5 min-w-0">
                  <p className="font-extrabold text-navy-950">{activeRequest.type} EMERGENCY</p>
                  <p className="text-slate-600 truncate">{activeRequest.locationName}</p>
                </div>
                <button
                  onClick={() => handleTabChange('STATUS')}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
                >
                  Track Live Assistance →
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STEP-BY-STEP WIZARD */}
        {activeTab === 'WIZARD' && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-200 shadow-xl space-y-5 min-w-0">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-rose-950">Emergency Assistance Wizard</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                Step {wizardStep} of 5
              </span>
            </div>

            {/* Step 1: Emergency Type */}
            {wizardStep === 1 && (
              <div className="space-y-3 min-w-0">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase font-mono">Step 1 — Emergency Type</h3>
                <div className="grid grid-cols-2 gap-2.5">
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
                      className={`p-3 rounded-2xl border text-left flex items-center space-x-2 transition-all ${
                        emergencyType === t.id
                          ? 'bg-rose-50 border-rose-600 text-rose-950 font-bold ring-2 ring-rose-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xl shrink-0">{t.icon}</span>
                      <span className="text-xs font-bold truncate">{t.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setWizardStep(2)}
                  className="w-full py-3.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-md"
                >
                  Continue to Location →
                </button>
              </div>
            )}

            {/* Step 2: Location */}
            {wizardStep === 2 && (
              <div className="space-y-3 min-w-0">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase font-mono">Step 2 — Specify Location</h3>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-700">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>GPS Fix (Simulated RTK Lock)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white p-2 rounded-xl border border-slate-200">
                    <div>LAT: {lat.toFixed(4)}</div>
                    <div>LNG: {lng.toFixed(4)}</div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Location Details / Landmark</label>
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                <div className="flex space-x-2">
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
              <div className="space-y-3 min-w-0">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase font-mono">Step 3 — Victim Condition</h3>
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
                      className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                        condition === cond
                          ? 'bg-rose-50 border-rose-600 text-rose-950 ring-2 ring-rose-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
                <div className="flex space-x-2">
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
              <div className="space-y-3 min-w-0">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase font-mono">Step 4 — Additional Info</h3>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Describe situation for rescue team</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mt-1 p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="e.g. 3 people on rooftop, water level rising..."
                  />
                </div>
                <div className="flex space-x-2">
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
              <div className="space-y-3 min-w-0">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase font-mono">Step 5 — Confirm & Send</h3>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Type:</span><span className="font-extrabold text-rose-700">{emergencyType}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Location:</span><span className="font-bold text-slate-800 truncate">{locationName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Condition:</span><span className="font-bold text-slate-800 truncate">{condition}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Description:</span><span className="font-semibold text-slate-700 truncate">{description}</span></div>
                </div>

                <button
                  onClick={handleCreateEmergency}
                  className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span className="truncate">SEND EMERGENCY REQUEST NOW</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STATUS & LIVE TRACKING */}
        {activeTab === 'STATUS' && activeRequest && (
          <div className="space-y-4 min-w-0">
            <div className="bg-white rounded-3xl p-5 border border-rose-200 shadow-xl space-y-5 min-w-0">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold text-rose-600 uppercase">Emergency Record</span>
                  <h2 className="text-lg font-black text-rose-950 truncate">{activeRequest.requestCode}</h2>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 shrink-0">
                  {activeRequest.status}
                </span>
              </div>

              {/* Progress Bar Tracker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Progress Tracker</span>
                  <span>{getCurrentStepIndex() + 1} / {STATUS_STEPS.length}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
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
              <div className="bg-slate-950 rounded-2xl p-4 text-white space-y-3 shadow-inner min-w-0">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
                    <span className="font-extrabold text-xs text-cyan-400 truncate">AVIRON-01 DRONE</span>
                  </div>
                  <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 shrink-0">
                    EN ROUTE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px]">DISTANCE</span>
                    <p className="text-base font-black text-cyan-400">{activeRequest.distanceKm || 1.2} km</p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px]">ETA</span>
                    <p className="text-base font-black text-emerald-400">04:32 min</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 font-medium bg-slate-900 p-2.5 rounded-xl border border-slate-800 truncate">
                  <span className="text-cyan-400 font-bold">Assigned:</span> {activeRequest.assignedTeamName || 'Team Alpha'}
                </div>
              </div>

              {/* Communication Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTabChange('CHAT')}
                  className="py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1 shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Team Chat</span>
                </button>
                <button
                  onClick={() => alert('Dispatching emergency call to Capt. Rahul...')}
                  className="py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Team</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHAT */}
        {activeTab === 'CHAT' && (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-200 shadow-xl flex flex-col h-[480px] min-w-0">
            <div className="pb-2.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-rose-950 text-xs sm:text-sm">Emergency Chat</h3>
                <p className="text-[10px] text-slate-500">Victim ↔ Rescue Team Link</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1 text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.senderRole === 'VICTIM' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center space-x-1 text-[9px] text-slate-400 font-bold mb-0.5">
                    <span>{msg.senderName}</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div
                    className={`max-w-[88%] p-2.5 rounded-2xl font-medium leading-snug ${
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
            <form onSubmit={handleSendChatMessage} className="pt-2 border-t border-slate-100 flex space-x-2">
              <input
                type="text"
                placeholder="Type emergency message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 min-w-0"
              />
              <button
                type="submit"
                className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center shadow-md shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: MEDIA UPLOAD & MEDICAL NOTES */}
        {activeTab === 'MEDIA' && (
          <div className="space-y-4 min-w-0">
            <div className="bg-white rounded-3xl p-5 border border-rose-200 shadow-xl space-y-4 min-w-0">
              <div>
                <h3 className="font-black text-rose-950 text-sm">Cloudflare R2 Media Upload</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload location evidence images to assist AVIRON navigation.
                </p>
              </div>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-rose-200 rounded-2xl p-5 text-center space-y-2.5 bg-rose-50/50">
                <Upload className="w-8 h-8 text-rose-500 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Upload Evidence File</p>

                {isUploading ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-600">Uploading to R2... {uploadProgress}%</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSimulateFileUpload}
                    className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-rose-700 transition-all"
                  >
                    Select File to Upload
                  </button>
                )}
              </div>

              {/* Medical Disclaimer */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-700 font-bold">
                  <Activity className="w-3.5 h-3.5 shrink-0" />
                  <span>Medical Disclaimer</span>
                </div>
                <p className="text-slate-600 text-[10px] leading-relaxed">
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
