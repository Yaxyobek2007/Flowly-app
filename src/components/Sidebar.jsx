import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, CalendarRange, Calendar,
  Target, CheckSquare, FileText, BarChart3, Trophy, MapPin,
  ChevronLeft, ChevronRight, Zap, Timer, BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'dashboard' },
  { path: '/daily', icon: CalendarDays, label: 'dailyPlanner' },
  { path: '/weekly', icon: CalendarRange, label: 'weeklyPlanner' },
  { path: '/monthly', icon: Calendar, label: 'monthlyPlanner' },
  { path: '/goals', icon: Target, label: 'yearlyGoals' },
  { path: '/smart-plan', icon: Zap, label: 'smartPlan' },
  { path: '/pomodoro', icon: Timer, BookOpen, label: 'pomodoro' },
  { path: '/journal', icon: BookOpen, label: 'journal' },
  { path: '/habits', icon: CheckSquare, label: 'habitTracker' },
  { path: '/achievements', icon: Trophy, label: 'achievements' },
  { path: '/notes', icon: FileText, label: 'notes' },
  { path: '/analytics', icon: BarChart3, label: 'analytics' },
  { path: '/location', icon: MapPin, label: 'location' },
];

const labels = {
  uz: { dashboard: 'Asosiy', dailyPlanner: 'Kunlik reja', weeklyPlanner: 'Haftalik', monthlyPlanner: 'Oylik', yearlyGoals: 'Maqsadlar', habitTracker: 'Odatlar', notes: 'Yozuvlar', analytics: 'Statistika', achievements: 'Yutuqlar', location: 'Xarita', smartPlan: 'Aqlli reja', pomodoro: 'Pomodoro', journal: 'Kundalik' },
  ru: { dashboard: 'Главная', dailyPlanner: 'День', weeklyPlanner: 'Неделя', monthlyPlanner: 'Месяц', yearlyGoals: 'Цели', habitTracker: 'Привычки', notes: 'Заметки', analytics: 'Аналитика', achievements: 'Достижения', location: 'Карта', smartPlan: 'Умный план', pomodoro: 'Помодоро', journal: 'Дневник' },
  en: { dashboard: 'Main', dailyPlanner: 'Daily', weeklyPlanner: 'Weekly', monthlyPlanner: 'Monthly', yearlyGoals: 'Goals', habitTracker: 'Habits', notes: 'Notes', analytics: 'Analytics', achievements: 'Achievements', location: 'Map', smartPlan: 'Smart Plan', pomodoro: 'Pomodoro', journal: 'Kundalik' },
};

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const { language } = useAuth();
  const t = (key) => labels[language]?.[key] || labels.en[key] || key;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'w-16' : 'w-56'}`}
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
        
        {/* Logo */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4`}>
          <NavLink to="/" onClick={onClose} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            {!collapsed && <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Flowly</h1>}
          </NavLink>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? t(item.label) : undefined}>
              <item.icon size={18} />
              {!collapsed && <span className="text-sm">{t(item.label)}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="hidden lg:block p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
            style={{ color: 'var(--text-secondary)' }}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
