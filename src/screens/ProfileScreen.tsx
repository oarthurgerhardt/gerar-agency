import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import type { LedColor } from '../store/useUserStore';
import { useHydrationStore } from '../store/useHydrationStore';
import WidgetPreviewScreen from './WidgetPreviewScreen';

const LED_COLORS: LedColor[] = ['#1D9E75','#D4537E','#EF9F27','#7F77DD','#378ADD','#F0F0F0'];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-track" />
      <span className="toggle-thumb" />
    </label>
  );
}

export default function ProfileScreen() {
  const { name, weightKg, adjustForClimate, adjustForWatch, ledColor, notificationsEnabled,
    reminderHours, dropName, dropColor, daysUsing, setLedColor, toggleClimate, toggleWatch,
    toggleNotifications, setReminderHours, getGoalMl } = useUserStore();
  const { setGoal } = useHydrationStore();
  const [showWidget, setShowWidget] = useState(false);
  const goalMl = getGoalMl();

  if (showWidget) return <WidgetPreviewScreen onBack={() => setShowWidget(false)} />;

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:28 }}>
        <div style={{ width:64, height:64, borderRadius:32, overflow:'hidden', border:'2px solid var(--border)', flexShrink:0 }}>
          <img src="/avatars/gabriela.jpg" alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
        <div>
          <h1 className="t-title" style={{ fontSize:24 }}>{name.toLowerCase()}</h1>
          <div style={{ fontSize:12, color:'var(--text-2)', marginTop:2 }}>{daysUsing} dias usando a drip</div>
          <div style={{ fontSize:12, color:'var(--teal)', marginTop:2, fontWeight:700 }}>● {dropName.split('—')[0].trim()}conectada</div>
        </div>
      </div>

      {/* LED */}
      <span className="label">cor do led</span>
      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
          {LED_COLORS.map(c => (
            <div key={c} className={`led-dot ${ledColor===c?'selected':''}`}
              style={{ background:c, borderColor: ledColor===c ? c : 'var(--border)', color:c }}
              onClick={() => setLedColor(c)}
            />
          ))}
        </div>
      </div>

      {/* Drop */}
      <span className="label">edição da garrafa</span>
      <div className="card" style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
        <div style={{ width:44, height:18, borderRadius:5, background:dropColor, flexShrink:0 }} />
        <span className="t-title" style={{ fontSize:16 }}>{dropName}</span>
      </div>

      {/* Goal */}
      <span className="label">meta diária</span>
      <div className="card" style={{ marginBottom:20 }}>
        <div className="setting-row">
          <span style={{ fontSize:14 }}>ajustar pelo clima</span>
          <Toggle checked={adjustForClimate} onChange={() => { toggleClimate(); setGoal(getGoalMl()); }} />
        </div>
        <div className="setting-row">
          <span style={{ fontSize:14 }}>ajustar pelo smartwatch</span>
          <Toggle checked={adjustForWatch} onChange={() => { toggleWatch(); setGoal(getGoalMl()); }} />
        </div>
        <div style={{ paddingTop:16 }}>
          <span style={{ fontSize:12, color:'var(--text-2)' }}>{weightKg}kg · 35ml/kg</span>
          <div className="t-title" style={{ fontSize:26, marginTop:4, color:'var(--teal)' }}>
            {(goalMl/1000).toFixed(2).replace('.',',')} L
          </div>
        </div>
      </div>

      {/* Notifications */}
      <span className="label">notificações</span>
      <div className="card" style={{ marginBottom:20 }}>
        <div className="setting-row">
          <span style={{ fontSize:14 }}>notificações ativas</span>
          <Toggle checked={notificationsEnabled} onChange={toggleNotifications} />
        </div>
        <div style={{ paddingTop:16 }}>
          <div style={{ fontSize:13, color:'var(--text-2)', marginBottom:12 }}>
            alertar se ficar mais de <strong style={{ color:'var(--text)' }}>{reminderHours}h</strong> sem beber
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {[1,2,3,4].map(h => (
              <button key={h} onClick={() => setReminderHours(h)}
                style={{ flex:1, padding:'10px 0', borderRadius:99, border:'none', cursor:'pointer', fontSize:12, fontWeight:700,
                  fontFamily:'Sora,sans-serif',
                  background: reminderHours===h ? 'var(--navy)' : 'var(--chip-bg)',
                  color: reminderHours===h ? '#fff' : 'var(--text-2)' }}>
                {h}h
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => setShowWidget(true)}
        style={{ width:'100%', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'18px 22px',
          display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', marginBottom:20 }}>
        <span className="t-title" style={{ fontSize:16 }}>preview do widget</span>
        <span style={{ color:'var(--text-2)', fontSize:18 }}>›</span>
      </button>
    </div>
  );
}
