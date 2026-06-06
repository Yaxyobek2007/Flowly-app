import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PomodoroTimer from './PomodoroTimer';
import FocusMode from './FocusMode';
import Routines from './Routines';
import { Timer, Shield, Sunrise } from 'lucide-react';

const tabs = [
  { key: 'pomodoro', icon: Timer, uz: 'Pomodoro', ru: 'Помодоро', en: 'Pomodoro' },
  { key: 'focus', icon: Shield, uz: 'Fokus', ru: 'Фокус', en: 'Focus' },
  { key: 'routines', icon: Sunrise, uz: 'Rutina', ru: 'Рутина', en: 'Routines' },
];

export default function FocusPage() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const [activeTab, setActiveTab] = useState('pomodoro');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30' : ''}`}
            style={activeTab !== tab.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' } : {}}>
            <tab.icon size={16} />
            {tab[lang]}
          </button>
        ))}
      </div>

      {activeTab === 'pomodoro' && <PomodoroTimer />}
      {activeTab === 'focus' && <FocusMode />}
      {activeTab === 'routines' && <Routines />}
    </div>
  );
}
