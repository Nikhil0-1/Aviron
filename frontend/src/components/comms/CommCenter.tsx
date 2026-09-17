import React, { useState } from 'react';
import { MessageSquare, Mic, MicOff, Volume2, VolumeX, Send, Radio } from 'lucide-react';
import { CommunicationMessage } from '../../types';

export const CommCenter: React.FC = () => {
  const [micActive, setMicActive] = useState(false);
  const [speakerActive, setSpeakerActive] = useState(true);
  const [inputMsg, setInputMsg] = useState('');

  const [messages, setMessages] = useState<CommunicationMessage[]>([
    { id: '1', sender: 'OPERATOR', message: 'AVIRON-01, proceed to sector 2 flood coordinates.', channel: 'PRIMARY_RADIO', timestamp: new Date(Date.now() - 300000).toISOString() },
    { id: '2', sender: 'AVIRON', message: 'Command acknowledged. Navigation lock engaged. En route.', channel: 'PRIMARY_RADIO', timestamp: new Date(Date.now() - 240000).toISOString() },
    { id: '3', sender: 'AVIRON', message: 'Visual and thermal match found. Survivor confirmed.', channel: 'PRIMARY_RADIO', timestamp: new Date(Date.now() - 120000).toISOString() },
    { id: '4', sender: 'OPERATOR', message: 'Prepare medical payload deployment. Stand by for drop signal.', channel: 'PRIMARY_RADIO', timestamp: new Date(Date.now() - 60000).toISOString() },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: CommunicationMessage = {
      id: String(Date.now()),
      sender: 'OPERATOR',
      message: inputMsg.trim(),
      channel: 'PRIMARY_RADIO',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Simulate AVIRON response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'AVIRON',
          message: 'Command received. Telemetry sync active.',
          channel: 'PRIMARY_RADIO',
          timestamp: new Date().toISOString(),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center font-bold">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-navy-950 uppercase tracking-wide">
              AVIRON Communications Center
            </h3>
            <p className="text-[11px] text-slate-500">Dual-Band VHF / Encrypted Tactical Radio Link</p>
          </div>
        </div>

        {/* Audio Status Controls */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setMicActive(!micActive)}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 transition-all ${
              micActive ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
            title="Push-to-talk microphone"
          >
            {micActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">{micActive ? 'MIC ON' : 'MIC OFF'}</span>
          </button>

          <button
            onClick={() => setSpeakerActive(!speakerActive)}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 transition-all ${
              speakerActive ? 'bg-navy-900 text-cyan-400 shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
            title="Audio speaker monitor"
          >
            {speakerActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">{speakerActive ? 'AUDIO ON' : 'MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 min-h-[220px] max-h-[280px] overflow-y-auto space-y-2 p-2 bg-slate-50 rounded-xl border border-slate-200 mb-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2.5 rounded-xl max-w-[85%] text-xs shadow-xs ${
              msg.sender === 'OPERATOR'
                ? 'ml-auto bg-navy-900 text-white border border-navy-800'
                : 'mr-auto bg-white text-navy-950 border border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-[10px] mb-1 opacity-80">
              <span className={msg.sender === 'OPERATOR' ? 'text-cyan-400' : 'text-teal-700'}>{msg.sender}</span>
              <span className="font-mono text-[9px]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="leading-relaxed font-sans">{msg.message}</p>
          </div>
        ))}
      </div>

      {/* Dispatch Input Bar */}
      <form onSubmit={handleSend} className="flex items-center space-x-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Type command message to AVIRON onboard unit..."
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-950 text-cyan-400 font-bold text-xs shadow-sm flex items-center space-x-1 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
