import { subDays, startOfDay, addHours, addMinutes, format as dateFnsFormat } from 'date-fns';

export type HydrationRecord = {
  timestamp: number;
  ml: number;
  tempC: number;
};

export type DayData = {
  date: string;
  records: HydrationRecord[];
};

export type Friend = {
  id: string;
  name: string;
  initials: string;
  weeklyMl: number;
  photo?: string;
};

const DAILY_GOAL_ML = 2170;

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function generateDayRecords(date: Date, targetMl: number): HydrationRecord[] {
  if (targetMl === 0) return [];
  const records: HydrationRecord[] = [];
  const numDrinks = Math.floor(rnd(4, 10));
  const base = startOfDay(date);
  const hours = [7,8,9,10,11,13,14,15,16,17,18,19,20,21]
    .sort(() => Math.random() - 0.5)
    .slice(0, numDrinks)
    .sort((a, b) => a - b);
  for (const h of hours) {
    const ml = Math.max(80, Math.round(targetMl / numDrinks + rnd(-80, 80)));
    const ts = addMinutes(addHours(base, h), Math.floor(rnd(0, 50)));
    records.push({ timestamp: ts.getTime(), ml, tempC: parseFloat(rnd(8, 16).toFixed(1)) });
  }
  return records;
}

export function generateMockHistory(): DayData[] {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i);
    const dateStr = dateFnsFormat(date, 'yyyy-MM-dd');
    const roll = Math.random();
    const targetMl = roll > 0.1 ? Math.round(DAILY_GOAL_ML * rnd(0.6, 1.2)) : 0;
    return { date: dateStr, records: generateDayRecords(date, targetMl) };
  });
}

export const MOCK_FRIENDS: Friend[] = [
  { id: 'arthur',  name: 'Arthur Gerhardt',     initials: 'AG', weeklyMl: 15400, photo: '/avatars/arthur.jpg'  },
  { id: 'ian',     name: 'Ian Narciso',          initials: 'IN', weeklyMl: 13200, photo: '/avatars/ian.jpg'     },
  { id: 'ana',     name: 'Ana Paula Gonçalves',  initials: 'AP', weeklyMl: 11800, photo: '/avatars/ana.jpg'     },
  { id: 'thallys', name: 'Thallys Bento',        initials: 'TB', weeklyMl: 9600,  photo: '/avatars/thallys.jpg' },
];
