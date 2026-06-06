import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import YearlyGoals from './YearlyGoals';
import SmartPlanner from './SmartPlanner';
import SprintMode from './SprintMode';
import SmartBreakdown from './SmartBreakdown';
import { Target, Zap, Rocket, BookOpen } from 'lucide-react';

const tabs = [
  { key: 'yearly', icon: Target, uz: 'Yillik', ru: 'Годовые', en: 'Yearly' },
  { key: 'smart', icon: Zap, uz: 'Aqlli reja', ru: 'Умный план', en: 'Smart Plan' },
  { key: 'sprint', icon: Rocket, uz: 'Sprint', ru: 'Спринт', en: 'Sprint' },
  { key: 'breakdown', icon: BookOpen, uz: 'Bo\'lish', ru: 'Разбивка', en: 'Breakdown' },
];

export default function Goals() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const [activeTab, setActiveTab] = useState('yearly');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30' : ''}`}
            style={activeTab !== tab.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' } : {}}>
            <tab.icon size={16} />
            {tab[lang]}
          </button>
        ))}
      </div>

      {activeTab === 'yearly' && <YearlyGoals />}
      {activeTab === 'smart' && <SmartPlanner />}
      {activeTab === 'sprint' && <SprintMode />}
      {activeTab === 'breakdown' && <SmartBreakdown />}
    </div>
  );
}
