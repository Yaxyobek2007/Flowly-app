import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Achievements from './Achievements';
import VirtualPet from './VirtualPet';
import Leaderboard from './Leaderboard';
import DailyChallenge from './DailyChallenge';
import DailyQuote from './DailyQuote';
import { Trophy, Heart, Crown, Dice6, BookOpen } from 'lucide-react';

const tabs = [
  { key: 'achievements', icon: Trophy, uz: 'Yutuqlar', ru: 'Достижения', en: 'Achievements' },
  { key: 'pet', icon: Heart, uz: 'Pet', ru: 'Питомец', en: 'Pet' },
  { key: 'leaderboard', icon: Crown, uz: 'Reyting', ru: 'Рейтинг', en: 'Leaderboard' },
  { key: 'challenge', icon: Dice6, uz: 'Challenge', ru: 'Челлендж', en: 'Challenge' },
  { key: 'quote', icon: BookOpen, uz: 'Iqtibos', ru: 'Цитата', en: 'Quote' },
];

export default function MotivationPage() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const [activeTab, setActiveTab] = useState('achievements');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30' : ''}`}
            style={activeTab !== tab.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' } : {}}>
            <tab.icon size={16} />
            {tab[lang]}
          </button>
        ))}
      </div>

      {activeTab === 'achievements' && <Achievements />}
      {activeTab === 'pet' && <VirtualPet />}
      {activeTab === 'leaderboard' && <Leaderboard />}
      {activeTab === 'challenge' && <DailyChallenge />}
      {activeTab === 'quote' && <DailyQuote />}
    </div>
  );
}
