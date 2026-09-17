import { create } from 'zustand';

interface SimulationState {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setCurrentStep: (step: number) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isPlaying: true,
  speed: 1,
  currentStep: 0,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setSpeed: (speed) => set({ speed }),
  setCurrentStep: (currentStep) => set({ currentStep }),
}));
