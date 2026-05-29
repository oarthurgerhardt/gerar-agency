import { useState } from 'react';
import TodayScreen from './screens/TodayScreen';
import HistoryScreen from './screens/HistoryScreen';
import ChallengesScreen from './screens/ChallengesScreen';
import ProfileScreen from './screens/ProfileScreen';
import CelebrationScreen from './screens/CelebrationScreen';

type Tab = 'hoje' | 'historico' | 'desafios' | 'perfil';

const TABS: { id: Tab; icon: string }[] = [
  { id: 'hoje', icon: '💧' },
  { id: 'historico', icon: '📅' },
  { id: 'desafios', icon: '🏆' },
  { id: 'perfil', icon: '👤' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('hoje');

  return (
    <>
      {tab === 'hoje' && <TodayScreen />}
      {tab === 'historico' && <HistoryScreen />}
      {tab === 'desafios' && <ChallengesScreen />}
      {tab === 'perfil' && <ProfileScreen />}

      <CelebrationScreen />

      <nav className="tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.icon}
          </button>
        ))}
      </nav>
    </>
  );
}
