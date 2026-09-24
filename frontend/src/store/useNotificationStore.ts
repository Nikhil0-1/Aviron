import { create } from 'zustand';
import { AppNotification, Role } from '../types';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;

  addNotification: (notification: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    targetRole: 'ADMIN',
    type: 'EMERGENCY',
    title: '🚨 CRITICAL EMERGENCY CREATED',
    message: 'New Flood Rescue request #ER-2026-001 created by Aarav Kumar near Sector 4.',
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-02',
    targetRole: 'RESCUE_OPERATOR',
    type: 'MISSION',
    title: '⚡ MISSION ACCEPTED BY TEAM ALPHA',
    message: 'Capt. Rahul accepted Flood Rescue mission for Emergency #ER-2026-001.',
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-03',
    targetRole: 'VICTIM',
    type: 'TELEMETRY',
    title: '🚁 AVIRON-01 DEPLOYED EN ROUTE',
    message: 'Autonomous unit AVIRON-01 is en route to your position. ETA: 4 minutes.',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: INITIAL_NOTIFICATIONS,
  unreadCount: INITIAL_NOTIFICATIONS.filter((n) => !n.isRead).length,

  addNotification: (notification) => {
    const newNotif: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const updated = [newNotif, ...state.notifications];
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      };
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
