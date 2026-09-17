import { create } from 'zustand';

export type ConnectionStatus = 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED';

interface ConnectionState {
  status: ConnectionStatus;
  reconnectAttempts: number;
  lastHeartbeat: string | null;
  setStatus: (status: ConnectionStatus) => void;
  incrementReconnect: () => void;
  resetReconnect: () => void;
  setHeartbeat: (timestamp: string) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: 'CONNECTED',
  reconnectAttempts: 0,
  lastHeartbeat: new Date().toISOString(),
  setStatus: (status) => set({ status }),
  incrementReconnect: () => set((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 })),
  resetReconnect: () => set({ reconnectAttempts: 0 }),
  setHeartbeat: (lastHeartbeat) => set({ lastHeartbeat }),
}));
