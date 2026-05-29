import { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CalendarHeatmap from '../components/CalendarHeatmap';
import DayTimeline from '../components/DayTimeline';
import { useHydrationStore } from '../store/useHydrationStore';
import type { DayData } from '../utils/mockData';
import { formatVolume } from '../utils/helpers';

export default function HistoryScreen() {
  const { history, todayGoalMl } = useHydrationStore();
  const [selected, setSelected] = useState<{ data: DayData | null; dateStr: string } | null>(null);

  const today = new Date();
  const weekDays = eachDayOfInterval({ start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) });
  const weekData = weekDays.map(d => {
    const ds = format(d, 'yyyy-MM-dd');
    const found = history.find(h => h.date === ds);
    const total = found ? found.records.reduce((s, r) => s + r.ml, 0) : 0;
    return { ds, total, name: format(d, 'EEE', { locale: ptBR }) };
  });
  const weekSum = weekData.reduce((s, d) => s + d.total, 0);
  const weekAvg = Math.round(weekSum / weekDays.length);
  const best = weekData.reduce((a, b) => a.total >= b.total ? a : b);
  const completedDays = weekData.filter(d => d.total >= todayGoalMl).length;

  return (
    <div className="screen">
      <div style={{ marginBottom: 28 }}>
        <h1 className="t-title" style={{ fontSize: 30 }}>histórico</h1>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <CalendarHeatmap history={history} goalMl={todayGoalMl} onDayPress={(d, ds) => setSelected({ data: d, dateStr: ds })} />
      </div>

      <span className="label">esta semana</span>
      <div className="metric-grid">
        {[
          { label: 'Média diária', value: formatVolume(weekAvg) },
          { label: 'Melhor dia', value: best.total > 0 ? best.name.toUpperCase() : '—' },
          { label: 'Total', value: formatVolume(weekSum) },
          { label: 'Metas completas', value: `${completedDays}/7` },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="metric-label">{m.label}</div>
            <div className="metric-value">{m.value}</div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            {(() => {
              const records = selected.data?.records ?? [];
              const total = records.reduce((s, r) => s + r.ml, 0);
              const avgTemp = records.length > 0 ? (records.reduce((s, r) => s + r.tempC, 0) / records.length).toFixed(1) : '—';
              const sorted = [...records].sort((a, b) => a.timestamp - b.timestamp);
              return (
                <>
                  <h2 className="t-title" style={{ fontSize: 22, marginBottom: 20 }}>
                    {format(new Date(selected.dateStr), "d 'de' MMMM", { locale: ptBR })}
                  </h2>
                  <div style={{ display:'flex', gap:10, marginBottom:20 }}>
                    {[
                      { label:'Total', value: formatVolume(total) },
                      { label:'Registros', value: String(records.length) },
                      { label:'Temp. média', value: `${avgTemp}°C` },
                    ].map(m => (
                      <div key={m.label} style={{ flex:1, background:'var(--bg)', borderRadius:12, padding:14 }}>
                        <div style={{ fontSize:10, color:'var(--text-2)', fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>{m.label}</div>
                        <div className="t-title" style={{ fontSize:20 }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                  {sorted.length > 0 && (
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16, fontSize:12, color:'var(--text-2)' }}>
                      <span>primeiro: <strong style={{ color:'var(--text)' }}>{format(new Date(sorted[0].timestamp), 'HH:mm')}</strong></span>
                      <span>último: <strong style={{ color:'var(--text)' }}>{format(new Date(sorted[sorted.length-1].timestamp), 'HH:mm')}</strong></span>
                    </div>
                  )}
                  <span className="label">linha do dia</span>
                  <DayTimeline records={records} />
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
