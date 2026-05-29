import { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, addMonths, subMonths, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { DayData } from '../utils/mockData';

const DAYS = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];

interface Props {
  history: DayData[];
  goalMl: number;
  onDayPress?: (data: DayData | null, dateStr: string) => void;
}

export default function CalendarHeatmap({ history, goalMl, onDayPress }: Props) {
  const [month, setMonth] = useState(new Date());
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const offset = getDay(startOfMonth(month));

  return (
    <div>
      <div className="cal-header">
        <button className="cal-nav" onClick={() => setMonth(subMonths(month, 1))}>‹</button>
        <span className="cal-month">{format(month, 'MMMM yyyy', { locale: ptBR })}</span>
        <button className="cal-nav" onClick={() => setMonth(addMonths(month, 1))}>›</button>
      </div>
      <div className="cal-grid">
        {DAYS.map(d => <div key={d} className="cal-day-hdr">{d}</div>)}
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {days.map(day => {
          const ds = format(day, 'yyyy-MM-dd');
          const found = history.find(h => h.date === ds);
          const total = found ? found.records.reduce((s, r) => s + r.ml, 0) : 0;
          const pct = goalMl > 0 ? total / goalMl : 0;
          let cls = 'cal-day';
          if (pct >= 1) cls += ' complete';
          else if (total > 0) cls += ' partial';
          if (isToday(day)) cls += ' today';
          return (
            <div key={ds} className={cls} onClick={() => onDayPress?.(found ?? null, ds)}>
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
}
