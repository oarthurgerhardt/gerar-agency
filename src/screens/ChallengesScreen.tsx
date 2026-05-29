import { useHydrationStore } from '../store/useHydrationStore';
import { useUserStore } from '../store/useUserStore';
import { MOCK_FRIENDS } from '../utils/mockData';
import type { Friend } from '../utils/mockData';
import { formatVolume } from '../utils/helpers';

const MEDALS = ['🥇', '🥈', '🥉'];
const ME_WEEKLY = 12400;

interface Challenge {
  id: string; title: string; description: string; progress: number;
  status: 'available' | 'in_progress' | 'completed';
}

const STATUS_LABEL = { available: 'disponível', in_progress: 'em andamento', completed: 'concluído' };

function Avatar({ friend, size = 38 }: { friend: Friend; size?: number }) {
  return (
    <div className="avatar" style={{ width: size, height: size, borderRadius: size / 2 }}>
      {friend.photo
        ? <img src={friend.photo} alt={friend.name} />
        : <span>{friend.initials}</span>
      }
    </div>
  );
}

export default function ChallengesScreen() {
  const { streak, history, todayGoalMl } = useHydrationStore();
  const { name } = useUserStore();
  const completed30 = history.filter(d => d.records.reduce((s, r) => s + r.ml, 0) >= todayGoalMl).length;

  const challenges: Challenge[] = [
    { id:'1', title:'madrugador', description:'Beba água antes das 9h por 5 dias seguidos', progress: Math.min(streak/5,1), status: streak>=5?'completed':streak>0?'in_progress':'available' },
    { id:'2', title:'semana perfeita', description:'Bata a meta 7 dias consecutivos', progress: Math.min(streak/7,1), status: streak>=7?'completed':streak>0?'in_progress':'available' },
    { id:'3', title:'sem pausa', description:'Nunca fique mais de 3h sem beber em um dia', progress: Math.min(completed30/10,1), status: completed30>=10?'completed':completed30>0?'in_progress':'available' },
    { id:'4', title:'mês hidratado', description:'Complete a meta em 20 dias num mês', progress: Math.min(completed30/20,1), status: completed30>=20?'completed':completed30>0?'in_progress':'available' },
  ];

  const me: Friend = { id:'me', name, initials: name.slice(0,2).toUpperCase(), weeklyMl: ME_WEEKLY, photo: '/avatars/gabriela.jpg' };
  const all = [...MOCK_FRIENDS, me].sort((a,b) => b.weeklyMl - a.weeklyMl);

  return (
    <div className="screen">
      <div style={{ marginBottom: 28 }}>
        <h1 className="t-title" style={{ fontSize: 30, marginBottom: 4 }}>desafios</h1>
        <p style={{ fontSize: 13, color: 'var(--text-2)' }}>personalizados para o seu histórico</p>
      </div>

      <span className="label">pessoais</span>
      {challenges.map((c, i) => (
        <div key={c.id} className={`challenge-card ${c.status === 'in_progress' ? 'in-progress' : ''}`} style={{ animationDelay: `${i*80}ms` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
            <span className="t-title" style={{ fontSize:17, flex:1, marginRight:8 }}>{c.title}</span>
            <span className={`badge badge-${c.status.replace('_','-')}`}>{STATUS_LABEL[c.status]}</span>
          </div>
          <span style={{ fontSize:13, color:'var(--text-2)' }}>{c.description}</span>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${c.progress*100}%` }} />
          </div>
        </div>
      ))}

      <span className="label" style={{ marginTop: 20 }}>seus amigos esta semana</span>
      <div className="card" style={{ padding: 0, overflow:'hidden' }}>
        {all.map((f, i) => (
          <div key={f.id} className={`leaderboard-row ${f.id==='me'?'me':''}`}>
            <span style={{ fontSize:18, width:28, flexShrink:0 }}>{MEDALS[i] ?? `${i+1}º`}</span>
            <Avatar friend={f} />
            <span style={{ flex:1, fontSize:14, fontWeight: f.id==='me'?700:400, fontFamily:'Sora,sans-serif' }}>{f.name}</span>
            <span style={{ fontSize:13, color:'var(--teal)', fontWeight:700 }}>{formatVolume(f.weeklyMl)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
