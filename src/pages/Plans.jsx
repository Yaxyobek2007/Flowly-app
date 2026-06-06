import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DailyPlanner from './DailyPlanner';
import WeeklyPlanner from './WeeklyPlanner';
import MonthlyPlanner from './MonthlyPlanner';
import CalendarView from './CalendarView';
import RecurringTasks from './RecurringTasks';
import TagsFilters from './TagsFilters';
import { CalendarDays, CalendarRange, Calendar, CalendarClock, Repeat, Tag } from 'lucide-react';

const tabs = [
  { key: 'daily', icon: CalendarDays, uz: 'Kunlik', ru: 'День', en: 'Daily' },
  { key: 'weekly', icon: CalendarRange, uz: 'Haftalik', ru: 'Неделя', en: 'Weekly' },
  { key: 'monthly', icon: Calendar, uz: 'Oylik', ru: 'Месяц', en: 'Monthly' },
  { key: 'calendar', icon: CalendarClock, uz: 'Kalendar', ru: 'Календарь', en: 'Calendar' },
  { key: 'recurring', icon: Repeat, uz: 'Takroriy', ru: 'Повтор', en: 'Recurring' },
  { key: 'tags', icon: Tag, uz: 'Teglar', ru: 'Теги', en: 'Tags' },
];

export default function Plans() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' : ''}`}
            style={activeTab !== tab.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' } : {}}>
            <tab.icon size={16} />
            {tab[lang]}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'daily' && <DailyPlanner />}
      {activeTab === 'weekly' && <WeeklyPlanner />}
      {activeTab === 'monthly' && <MonthlyPlanner />}
      {activeTab === 'calendar' && <CalendarView />}
      {activeTab === 'recurring' && <RecurringTasks />}
      {activeTab === 'tags' && <TagsFilters />}
    </div>
  );
}
