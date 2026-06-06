import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Target, Timer,
  CheckSquare, FileText, BarChart3, Trophy, MapPin,
  Crown, Settings, HelpCircle, Shield, Users, Wallet,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'dashboard' },
  { path: '/plans', icon: CalendarDays, label: 'plans' },
  { path: '/goals', icon: Target, label: 'goals' },
  { path: '/focus', icon: Timer, label: 'focus' },
  { path: '/health', icon: CheckSquare, label: 'health' },
  { path: '/motivation', icon: Trophy, label: 'motivation' },
  { path: '/finance', icon: Wallet, label: 'finance' },
  { path: '/analysis', icon: BarChart3, label: 'analysis' },
  { path: '/social', icon: Users, label: 'social' },
  { path: '/notes', icon: FileText, label: 'notes' },
  { path: '/location', icon: MapPin, label: 'location' },
];

const bottomItems = [
  { path: '/premium', icon: Crown, label: 'premium' },
  { path: '/settings', icon: Settings, label: 'settings' },
  { path: '/help', icon: HelpCircle, label: 'help' },
];

const labels = {
  uz: {
    dashboard: 'Asosiy',
    plans: 'Rejalar',
    goals: 'Maqsadlar',
    focus: 'Fokus',
    health: 'Odatlar',
    motivation: 'Yutuqlar',
    finance: 'Moliya',
    analysis: 'Statistika',
    social: "Do'stlar",
    notes: 'Yozuvlar',
    location: 'Xarita',
    premium: 'Premium',
    settings: 'Sozlamalar',
    help: 'Yordam',
    crm: 'Boshqaruv',
  },
  ru: {
    dashboard: 'Главная',
    plans: 'Планы',
    goals: 'Цели',
    focus: 'Фокус',
    health: 'Привычки',
    motivation: 'Достижения',
    finance: 'Финансы',
    analysis: 'Аналитика',
    social: 'Друзья',
    notes: 'Заметки',
    location: 'Карта',
    premium: 'Премиум',
    settings: 'Настройки',
    help: 'Помощь',
    crm: 'Управление',
  },
  en: {
    dashboard: 'Home',
    plans: 'Plans',
    goals: 'Goals',
    focus: 'Focus',
    health: 'Habits',
    motivation: 'Achievements',
    finance: 'Finance',
    analysis: 'Analytics',
    social: 'Friends',
    notes: 'Notes',
    location: 'Map',
    premium: 'Premium',
    settings: 'Settings',
    help: 'Help',
    crm: 'Management',
  },
};

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const { language, currentUser } = useAuth();
  const lang = language || 'uz';
  const t = (key) => labels[lang]?.[key] || labels.en[key] || key;

  const adminItem = currentUser?.role === 'admin'
    ? [{ path: '/crm', icon: Shield, label: 'crm' }]
    : [];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'w-16' : 'w-56'}`}
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
        role="navigation"
        aria-label="Main navigation">
        
        {/* Logo */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4`}>
          <NavLink to="/" onClick={onClose} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            {!collapsed && <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Flowly</h1>}
          </NavLink>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? t(item.label) : undefined}>
              <item.icon size={18} />
              {!collapsed && <span className="text-sm">{t(item.label)}</span>}
            </NavLink>
          ))}

          {/* Admin only */}
          {adminItem.map(item => (
            <NavLink key={item.path} to={item.path} onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? t(item.label) : undefined}>
              <item.icon size={18} />
              {!collapsed && <span className="text-sm">{t(item.label)}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: Premium, Settings, Help */}
        <div className="px-2 pb-2 space-y-1 border-t pt-2" style={{ borderColor: 'var(--border)' }}>
          {bottomItems.map(item => (
            <NavLink key={item.path} to={item.path} onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? t(item.label) : undefined}>
              <item.icon size={18} />
              {!collapsed && <span className="text-sm">{t(item.label)}</span>}
            </NavLink>
          ))}
        </div>

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
