import { useState } from 'react';
import type { HydrationRecord } from '../utils/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DayTimeline({ records }: { records: HydrationRecord[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (records.length === 0) {
    return (
      <div className="timeline">
        <div className="timeline-line" />
        <span className="timeline-empty" style={{ background: 'transparent' }}>nenhum registro ainda</span>
      </div>
    );
  }

  return (
    <div className="timeline">
      <div className="timeline-line" />
      {records.map((r, i) => {
        const h = new Date(r.timestamp).getHours() + new Date(r.timestamp).getMinutes() / 60;
        const pct = Math.max(0, Math.min(1, (h - 5) / 18)) * 100;
        return (
          <div
            key={i}
            className="timeline-dot"
            style={{ left: `${pct}%` }}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
            onClick={() => setActiveIdx(activeIdx === i ? null : i)}
          >
            {activeIdx === i && (
              <span className="timeline-tooltip">
                {format(new Date(r.timestamp), 'HH:mm', { locale: ptBR })} · {r.ml}ml
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
