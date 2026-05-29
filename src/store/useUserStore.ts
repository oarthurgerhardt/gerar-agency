import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calcDailyGoal } from '../utils/helpers';

export type LedColor = '#1D9E75' | '#D4537E' | '#EF9F27' | '#7F77DD' | '#378ADD' | '#F0F0F0';

interface UserState {
  name: string;
  weightKg: number;
  adjustForClimate: boolean;
  adjustForWatch: boolean;
  ledColor: LedColor;
  notificationsEnabled: boolean;
  reminderHours: number;
  dropName: string;
  dropColor: string;
  daysUsing: number;
  getGoalMl: () => number;
  setLedColor: (c: LedColor) => void;
  toggleClimate: () => void;
  toggleWatch: () => void;
  toggleNotifications: () => void;
  setReminderHours: (h: number) => void;
  setWeight: (kg: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: 'Gabriela',
      weightKg: 62,
      adjustForClimate: false,
      adjustForWatch: false,
      ledColor: '#1D9E75',
      notificationsEnabled: true,
      reminderHours: 2,
      dropName: 'Areia — Drop 01',
      dropColor: '#C8B89A',
      daysUsing: 31,
      getGoalMl: () => calcDailyGoal(get().weightKg, get().adjustForClimate, get().adjustForWatch),
      setLedColor: (ledColor) => set({ ledColor }),
      toggleClimate: () => set((s) => ({ adjustForClimate: !s.adjustForClimate })),
      toggleWatch: () => set((s) => ({ adjustForWatch: !s.adjustForWatch })),
      toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
      setReminderHours: (reminderHours) => set({ reminderHours }),
      setWeight: (weightKg) => set({ weightKg }),
    }),
    { name: 'drip-user-v2' }
  )
);
