import { useEffect, useRef } from 'react';
import { useHydrationStore } from '../store/useHydrationStore';
import ProgressArc from '../components/ProgressArc';
import { formatVolume } from '../utils/helpers';

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 60,
  size: Math.random() * 8 + 4,
  delay: Math.random() * 600,
}));

export default function CelebrationScreen() {
  const { celebrationVisible, hideCelebration, getTodayTotal, todayGoalMl, streak } = useHydrationStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (celebrationVisible) {
      timerRef.current = setTimeout(hideCelebration, 4000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [celebrationVisible]);

  if (!celebrationVisible) return null;

  const total = getTodayTotal();
  const progress = todayGoalMl > 0 ? total / todayGoalMl : 1;
  const consumed = total >= 1000 ? (total / 1000).toFixed(1).replace('.', ',') : String(total);

  return (
    <div className="celebration">
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}

      <button
        onClick={hideCelebration}
        style={{ position: 'absolute', top: 20, right: 20, fontSize: 22, color: '#888780', background: 'none', border: 'none', cursor: 'pointer' }}
      >✕</button>

      <div style={{ textAlign: 'center', padding: 32, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 28, fontWeight: 600, color: '#1A1A1A' }}>Meta batida!</div>
        <div style={{ fontSize: 16, color: '#1D9E75', marginTop: 8 }}>
          {streak} {streak === 1 ? 'dia seguido' : 'dias seguidos'} 🔥
        </div>
        <div style={{ marginTop: 32 }}>
          <ProgressArc
            progress={progress}
            consumedLabel={consumed}
            goalLabel={formatVolume(todayGoalMl)}
            tempC={21.3}
          />
        </div>
        <button className="btn-primary" style={{ marginTop: 32, width: 'auto', paddingLeft: 32, paddingRight: 32 }} onClick={hideCelebration}>
          Fechar
        </button>
      </div>
    </div>
  );
}
