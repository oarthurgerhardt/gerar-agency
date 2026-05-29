import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateMockHistory } from '../utils/mockData';
import type { DayData, HydrationRecord } from '../utils/mockData';
import { todayStr } from '../utils/helpers';

interface HydrationState {
  history: DayData[];
  streak: number;
  todayGoalMl: number;
  celebrationVisible: boolean;
  initialized: boolean;
  getTodayData: () => DayData;
  getTodayTotal: () => number;
  addRecord: (ml: number, tempC?: number) => void;
  removeRecord: (timestamp: number) => void;
  setGoal: (ml: number) => void;
  hideCelebration: () => void;
}

function calcStreak(history: DayData[], goalMl: number): number {
  const today = todayStr();
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const day of sorted) {
    if (day.date === today) continue;
    const total = day.records.reduce((s, r) => s + r.ml, 0);
    if (total >= goalMl) streak++;
    else break;
  }
  const todayData = history.find((d) => d.date === today);
  if (todayData && todayData.records.reduce((s, r) => s + r.ml, 0) >= goalMl) streak++;
  return streak;
}

export const useHydrationStore = create<HydrationState>()(
  persist(
    (set, get) => ({
      history: generateMockHistory(),
      streak: 0,
      todayGoalMl: 2170,
      celebrationVisible: false,
      initialized: true,

      getTodayData: () => {
        const today = todayStr();
        return get().history.find((d) => d.date === today) ?? { date: today, records: [] };
      },

      getTodayTotal: () => {
        return get().getTodayData().records.reduce((s, r) => s + r.ml, 0);
      },

      addRecord: (ml, tempC = 21.3) => {
        const today = todayStr();
        const { history, todayGoalMl, getTodayTotal } = get();
        const prevTotal = getTodayTotal();
        const record: HydrationRecord = { timestamp: Date.now(), ml, tempC };
        const idx = history.findIndex((d) => d.date === today);
        const newHistory = idx >= 0
          ? history.map((d, i) => i === idx ? { ...d, records: [...d.records, record] } : d)
          : [...history, { date: today, records: [record] }];
        const newTotal = newHistory.find((d) => d.date === today)!.records.reduce((s, r) => s + r.ml, 0);
        const streak = calcStreak(newHistory, todayGoalMl);
        const celebrationVisible = prevTotal < todayGoalMl && newTotal >= todayGoalMl;
        set({ history: newHistory, streak, celebrationVisible });
      },

      removeRecord: (timestamp) => {
        const today = todayStr();
        const { history, todayGoalMl } = get();
        const newHistory = history.map((d) =>
          d.date === today ? { ...d, records: d.records.filter((r) => r.timestamp !== timestamp) } : d
        );
        const streak = calcStreak(newHistory, todayGoalMl);
        set({ history: newHistory, streak });
      },

      setGoal: (ml) => set((s) => ({ todayGoalMl: ml, streak: calcStreak(s.history, ml) })),
      hideCelebration: () => set({ celebrationVisible: false }),
    }),
    { name: 'drip-hydration' }
  )
);

// init streak on load
const s = useHydrationStore.getState();
useHydrationStore.setState({ streak: calcStreak(s.history, s.todayGoalMl) });
