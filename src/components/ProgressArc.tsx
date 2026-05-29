import { useEffect, useRef } from 'react';

const R = 90;
const STROKE = 8;
const SIZE = (R + STROKE) * 2;
const CIRC = 2 * Math.PI * R;

interface Props {
  progress: number;
  consumedLabel: string;
  goalLabel: string;
  tempC?: number;
  small?: boolean;
}

export default function ProgressArc({ progress, consumedLabel, goalLabel, tempC, small }: Props) {
  const circleRef = useRef<SVGCircleElement>(null);
  const prevProgress = useRef(0);

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    const target = CIRC * (1 - Math.min(progress, 1));
    el.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    el.style.strokeDashoffset = String(target);
    prevProgress.current = progress;
  }, [progress]);

  const scale = small ? 0.55 : 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${scale})`, transformOrigin: 'center top' }}>
      <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE}>
          <circle cx={SIZE/2} cy={SIZE/2} r={R} stroke="#EEEEEB" strokeWidth={STROKE} fill="none" />
          <circle
            ref={circleRef}
            cx={SIZE/2} cy={SIZE/2} r={R}
            stroke="#1D9E75" strokeWidth={STROKE} fill="none"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC}
            strokeLinecap="round"
            transform={`rotate(-90 ${SIZE/2} ${SIZE/2})`}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 48, fontWeight: 300, color: '#1A1A1A', letterSpacing: 2, lineHeight: 1 }}>{consumedLabel}</span>
          {goalLabel && <span style={{ fontSize: 13, color: '#888780', marginTop: 4 }}>de {goalLabel}</span>}
        </div>
      </div>
      {tempC !== undefined && (
        <div className="chip chip-teal" style={{ marginTop: 12 }}>
          🌡 {tempC.toFixed(1).replace('.', ',')}°C
        </div>
      )}
    </div>
  );
}
