import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Analytics from './Analytics';
import EisenhowerMatrix from './EisenhowerMatrix';
import WeeklyReview from './WeeklyReview';
import { BarChart3, Grid, FileText } from 'lucide-react';

const tabs = [
  { key: 'analytics', icon: BarChart3, uz: 'Statistika', ru: 'Аналитика', en: 'Analytics' },
  { key: 'matrix', icon: Grid, uz: 'Matritsa', ru: 'Матрица', en: 'Matrix' },
  { key: 'review', icon: FileText, uz: 'Sharh', ru: 'Обзор', en: 'Review' },
];

export default function AnalysisPage() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30' : ''}`}
            style={activeTab !== tab.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' } : {}}>
            <tab.icon size={16} />
            {tab[lang]}
          </button>
        ))}
      </div>

      {activeTab === 'analytics' && <Analytics />}
      {activeTab === 'matrix' && <EisenhowerMatrix />}
      {activeTab === 'review' && <WeeklyReview />}
    </div>
  );
}
