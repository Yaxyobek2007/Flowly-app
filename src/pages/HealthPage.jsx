import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import HabitTracker from './HabitTracker';
import WaterTracker from './WaterTracker';
import SleepTracker from './SleepTracker';
import { CheckSquare, Droplets, Moon } from 'lucide-react';

const tabs = [
  { key: 'habits', icon: CheckSquare, uz: 'Odatlar', ru: 'Привычки', en: 'Habits' },
  { key: 'water', icon: Droplets, uz: 'Suv', ru: 'Вода', en: 'Water' },
  { key: 'sleep', icon: Moon, uz: 'Uyqu', ru: 'Сон', en: 'Sleep' },
];

export default function HealthPage() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const [activeTab, setActiveTab] = useState('habits');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30' : ''}`}
            style={activeTab !== tab.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' } : {}}>
            <tab.icon size={16} />
            {tab[lang]}
          </button>
        ))}
      </div>

      {activeTab === 'habits' && <HabitTracker />}
      {activeTab === 'water' && <WaterTracker />}
      {activeTab === 'sleep' && <SleepTracker />}
    </div>
  );
}
