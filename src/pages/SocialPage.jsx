import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Friends from './Friends';
import FriendsChat from './FriendsChat';
import DailyChallenge from './DailyChallenge';
import { Users, MessageCircle, Swords } from 'lucide-react';

const tabs = [
  { key: 'friends', icon: Users, uz: 'Do\'stlar', ru: 'Друзья', en: 'Friends' },
  { key: 'chat', icon: MessageCircle, uz: 'Chat', ru: 'Чат', en: 'Chat' },
  { key: 'challenges', icon: Swords, uz: 'Challenges', ru: 'Вызовы', en: 'Challenges' },
];

export default function SocialPage() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const [activeTab, setActiveTab] = useState('friends');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30' : ''}`}
            style={activeTab !== tab.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' } : {}}>
            <tab.icon size={16} />
            {tab[lang]}
          </button>
        ))}
      </div>

      {activeTab === 'friends' && <Friends />}
      {activeTab === 'chat' && <FriendsChat />}
      {activeTab === 'challenges' && <DailyChallenge />}
    </div>
  );
}
