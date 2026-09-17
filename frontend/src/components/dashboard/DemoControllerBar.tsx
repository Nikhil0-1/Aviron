import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Cpu, Sparkles } from 'lucide-react';
import { DemoSimulationEngine } from '../../services/simulation/DemoSimulationEngine';
import { useSimulationStore } from '../../store/useSimulationStore';

export const DemoControllerBar: React.FC = () => {
  const { isPlaying, speed, currentStep, setIsPlaying, setSpeed, setCurrentStep } = useSimulationStore();
  const engine = DemoSimulationEngine.getInstance();

  const handleTogglePlay = () => {
    if (isPlaying) {
      engine.pause();
      setIsPlaying(false);
    } else {
      engine.start();
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    engine.reset();
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleNextEvent = () => {
    engine.nextStep();
    setCurrentStep(engine.getState().currentStep);
  };

  const handleSpeedChange = (s: number) => {
    setSpeed(s);
    engine.setSpeed(s);
  };

  const latestEvent = engine.getState().latestEvent;

  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3 shadow-subtle mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      {/* Left Title & Status */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-700 flex items-center justify-center font-bold">
          <Cpu className="w-4 h-4 animate-pulse text-amber-600" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
              DEMO SIMULATION CONTROLLER
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900">
              Scenario: Flood Rescue (AV-001)
            </span>
          </div>
          <p className="text-[11px] text-amber-800/90 font-medium truncate max-w-xs sm:max-w-md">
            {latestEvent ? `${latestEvent.title}: ${latestEvent.description}` : 'Simulation active.'}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        {/* Play/Pause */}
        <button
          onClick={handleTogglePlay}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Start</span>
            </>
          )}
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300 font-bold text-xs flex items-center space-x-1 transition-all"
          title="Reset Simulation Scenario"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
          <span className="hidden xs:inline">Reset</span>
        </button>

        {/* Next Event */}
        <button
          onClick={handleNextEvent}
          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300 font-bold text-xs flex items-center space-x-1 transition-all"
          title="Jump to Next Scenario Event"
        >
          <FastForward className="w-3.5 h-3.5 text-amber-700" />
          <span className="hidden xs:inline">Next Event</span>
        </button>

        {/* Speed Selector */}
        <div className="flex items-center space-x-1 bg-white border border-amber-300 rounded-xl p-0.5 text-[11px] font-bold">
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                speed === s
                  ? 'bg-amber-600 text-white shadow-xs font-black'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
