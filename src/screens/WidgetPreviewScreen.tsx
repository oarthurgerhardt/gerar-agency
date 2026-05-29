import ProgressArc from '../components/ProgressArc';
import DayTimeline from '../components/DayTimeline';
import { useHydrationStore } from '../store/useHydrationStore';

export default function WidgetPreviewScreen({ onBack }: { onBack: () => void }) {
  const { getTodayTotal, todayGoalMl, getTodayData, streak } = useHydrationStore();
  const total = getTodayTotal();
  const progress = todayGoalMl > 0 ? total / todayGoalMl : 0;
  const todayData = getTodayData();
  const lastTemp = todayData.records.length > 0 ? todayData.records[todayData.records.length - 1].tempC : 21.3;
  const consumed = total >= 1000 ? (total/1000).toFixed(1).replace('.',',') : String(total);

  return (
    <div className="screen">
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <button onClick={onBack} style={{ fontSize:22, color:'#1D9E75', background:'none', border:'none', cursor:'pointer' }}>‹</button>
        <span style={{ fontSize:22, fontWeight:600 }}>Preview do Widget</span>
      </div>

      <div className="phone-mockup">
        <div className="phone-notch" />
        <div className="phone-screen">

          <div>
            <div className="widget-label">PEQUENO (2×2)</div>
            <div className="widget-sm">
              <ProgressArc progress={progress} consumedLabel={`${Math.round(progress*100)}%`} goalLabel="" tempC={lastTemp} small />
            </div>
          </div>

          <div>
            <div className="widget-label">MÉDIO (4×2)</div>
            <div className="widget-md">
              <div style={{ transform:'scale(0.5)', transformOrigin:'left center', flexShrink:0, marginRight:-80 }}>
                <ProgressArc progress={progress} consumedLabel={`${Math.round(progress*100)}%`} goalLabel="" />
              </div>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                <div className={`chip ${streak > 0 ? 'chip-teal' : 'chip-grey'}`} style={{ alignSelf:'flex-start' }}>
                  {streak > 0 ? '🔥' : '🕯️'} {streak}
                </div>
                <span className="label" style={{ margin:0 }}>hoje</span>
                <DayTimeline records={todayData.records} />
              </div>
            </div>
          </div>

        </div>
        <div style={{ width:120, height:4, background:'#444', borderRadius:2, margin:'12px auto 0' }} />
      </div>

      <p style={{ fontSize:13, color:'#888780', textAlign:'center', marginTop:20, lineHeight:'20px' }}>
        Preview simulado do widget na tela inicial do celular
      </p>
    </div>
  );
}
