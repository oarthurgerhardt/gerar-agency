import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ProgressArc from '../components/ProgressArc';
import DayTimeline from '../components/DayTimeline';
import { useHydrationStore } from '../store/useHydrationStore';
import { useUserStore } from '../store/useUserStore';
import { getGreeting, formatVolume } from '../utils/helpers';

export default function TodayScreen() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [inputMl, setInputMl] = useState('');
  const { getTodayData, getTodayTotal, addRecord, removeRecord, history, todayGoalMl, streak } = useHydrationStore();
  const { name } = useUserStore();

  const todayData = getTodayData();
  const total = getTodayTotal();
  const progress = todayGoalMl > 0 ? total / todayGoalMl : 0;
  const lastTemp = todayData.records.length > 0 ? todayData.records[todayData.records.length - 1].tempC : 21.3;
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });
  const [recordsOpen, setRecordsOpen] = useState(false);
  const hasInsight = history.filter(d => d.records.length > 0).length >= 3;
  const consumedLabel = total >= 1000 ? (total/1000).toFixed(1).replace('.',',') : String(total);

  const tempC = +(Math.random() * 8 + 8).toFixed(1);

  function confirm() {
    const ml = parseInt(inputMl, 10);
    if (!isNaN(ml) && ml > 0) { addRecord(ml, tempC); setInputMl(''); setSheetOpen(false); }
  }

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:52, height:52, borderRadius:26, overflow:'hidden', border:'2px solid var(--border)', flexShrink:0 }}>
            <img src="/avatars/gabriela.jpg" alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </div>
          <div>
            <div style={{ fontSize:12, color:'var(--text-2)', marginBottom:2 }}>{today}</div>
            <h1 className="t-title" style={{ fontSize:22, lineHeight:1.1 }}>
              {getGreeting(name).split(',')[0].toLowerCase()}, <span style={{ color:'var(--teal)' }}>{name.toLowerCase()}</span>
            </h1>
          </div>
        </div>
        <div className={`chip ${streak > 0 ? 'chip-teal streak-chip' : 'chip-grey'}`}>
          {streak > 0 ? '🔥' : '🕯️'} <span>{streak}</span>
        </div>
      </div>


      {/* Arc */}
      <div style={{ display:'flex', justifyContent:'center', marginBottom:36 }}>
        <ProgressArc
          progress={progress}
          consumedLabel={consumedLabel}
          goalLabel={formatVolume(todayGoalMl)}
          tempC={lastTemp}
        />
      </div>

      {/* Timeline */}
      <div style={{ marginBottom:28 }}>
        <span className="label">hoje</span>
        <DayTimeline records={todayData.records} />
      </div>

      {/* Buttons */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:28 }}>
        <button className="btn-outline" onClick={() => setSheetOpen(true)}>+ registrar</button>
        <button className="btn-simulate" onClick={() => addRecord(150, parseFloat((Math.random()*8+8).toFixed(1)))}>💧 simular gole</button>
        {todayData.records.length > 0 && (
          <button
            onClick={() => setRecordsOpen(true)}
            style={{ border:'1px solid var(--border)', color:'var(--text-2)', borderRadius:99, padding:'10px 16px', fontSize:13, fontWeight:600, background:'transparent', cursor:'pointer', fontFamily:'Sora,sans-serif' }}
          >
            ↩ corrigir
          </button>
        )}
      </div>

      {/* Insight */}
      {hasInsight && (
        <div className="insight-card">
          <div className="insight-label">insight do dia</div>
          <div className="insight-text">Você costuma esquecer de beber entre 14h e 16h. Que tal configurar um lembrete?</div>
        </div>
      )}

      {/* Registros do dia para remover */}
      {recordsOpen && (
        <div className="overlay" onClick={() => setRecordsOpen(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h2 className="t-title" style={{ fontSize:22, marginBottom:20 }}>registros de hoje</h2>
            {[...todayData.records].sort((a,b) => b.timestamp - a.timestamp).map((r) => (
              <div key={r.timestamp} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'14px 0', borderBottom:'1px solid var(--border)'
              }}>
                <div>
                  <span className="t-title" style={{ fontSize:18 }}>{r.ml} ml</span>
                  <span style={{ fontSize:12, color:'var(--text-2)', marginLeft:10 }}>
                    {format(new Date(r.timestamp), 'HH:mm', { locale: ptBR })} · {r.tempC}°C
                  </span>
                </div>
                <button
                  onClick={() => { removeRecord(r.timestamp); if (todayData.records.length <= 1) setRecordsOpen(false); }}
                  style={{ background:'rgba(160,80,64,0.1)', border:'none', borderRadius:99, padding:'6px 14px', fontSize:12, fontWeight:700, color:'var(--terra)', cursor:'pointer', fontFamily:'Sora,sans-serif' }}
                >
                  remover
                </button>
              </div>
            ))}
            {todayData.records.length === 0 && (
              <p style={{ fontSize:14, color:'var(--text-2)', textAlign:'center', padding:'20px 0' }}>nenhum registro hoje</p>
            )}
          </div>
        </div>
      )}

      {sheetOpen && (
        <div className="overlay" onClick={() => setSheetOpen(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h2 className="t-title" style={{ fontSize:22, marginBottom:20 }}>quanto você bebeu?</h2>
            <input
              className="big-input"
              type="number"
              placeholder="300"
              value={inputMl}
              onChange={e => setInputMl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirm()}
              autoFocus
            />
            <p style={{ fontSize:12, color:'var(--text-2)', marginBottom:4 }}>ml</p>
            <div className="quick-btns">
              {[150, 200, 300, 500].map(ml => (
                <button key={ml} className="quick-btn" onClick={() => setInputMl(String(ml))}>{ml}ml</button>
              ))}
            </div>
            <button className="btn-primary" onClick={confirm}>confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
}
