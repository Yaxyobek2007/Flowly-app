import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Target, Timer, Heart,
  Trophy, Wallet, BarChart3, Users, Mic, Lock, MessageCircle,
  BookOpen, MapPin, Crown, Settings, HelpCircle, Shield,
  ChevronLeft, ChevronRight, FileText, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'dashboard' },
  { path: '/plans', icon: CalendarDays, label: 'plans' },
  { path: '/goals', icon: Target, label: 'goals' },
  { path: '/focus', icon: Timer, label: 'focus' },
  { path: '/health', icon: Heart, label: 'health' },
  { path: '/motivation', icon: Trophy, label: 'motivation' },
  { path: '/finance', icon: Wallet, label: 'finance' },
  { path: '/analysis', icon: BarChart3, label: 'analysis' },
  { path: '/social', icon: Users, label: 'social' },
  { path: '/notes', icon: FileText, label: 'notes' },
  { path: '/voice', icon: Mic, label: 'voice' },
  { path: '/breakdown', icon: BookOpen, label: 'breakdown' },
  { path: '/location', icon: MapPin, label: 'location' },
  { path: '/privacy', icon: Lock, label: 'privacy' },
  { path: '/premium', icon: Crown, label: 'premium' },
  { path: '/settings', icon: Settings, label: 'settings' },
  { path: '/help', icon: HelpCircle, label: 'help' },
];

const labels = {
  uz: {
    dashboard: 'Asosiy',
    plans: '📅 Rejalar',
    goals: '🎯 Maqsadlar',
    focus: '⏱️ Fokus',
    health: '💪 Sog\'liq',
    motivation: '🏆 Motivatsiya',
    finance: '💰 Moliya',
    analysis: '📊 Tahlil',
    social: '👥 Ijtimoiy',
    notes: '📝 Yozuvlar',
    voice: '🎤 Ovozli',
    breakdown: '📐 Bo\'lish',
    location: '📍 Xarita',
    privacy: '🔒 Maxfiylik',
    premium: '👑 Premium',
    settings: '⚙️ Sozlamalar',
    help: '❓ Yordam',
  },
  ru: {
    dashboard: 'Главная',
    plans: '📅 Планы',
    goals: '🎯 Цели',
    focus: '⏱️ Фокус',
    health: '💪 Здоровье',
    motivation: '🏆 Мотивация',
    finance: '💰 Финансы',
    analysis: '📊 Анализ',
    social: '👥 Соцсети',
    notes: '📝 Заметки',
    voice: '🎤 Голос',
    breakdown: '📐 Разбивка',
    location: '📍 Карта',
    privacy: '🔒 Приватность',
    premium: '👑 Премиум',
    settings: '⚙️ Настройки',
    help: '❓ Помощь',
  },
  en: {
    dashboard: 'Home',
    plans: '📅 Plans',
    goals: '🎯 Goals',
    focus: '⏱️ Focus',
    health: '💪 Health',
    motivation: '🏆 Motivation',
    finance: '💰 Finance',
    analysis: '📊 Analysis',
    social: '👥 Social',
    notes: '📝 Notes',
    voice: '🎤 Voice',
    breakdown: '📐 Breakdown',
    location: '📍 Map',
    privacy: '🔒 Privacy',
    premium: '👑 Premium',
    settings: '⚙️ Settings',
    help: '❓ Help',
  },
};

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const { language, currentUser } = useAuth();
  const lang = language || 'uz';
  const t = (key) => labels[lang]?.[key] || labels.en[key] || key;

  // Add admin/CRM link if user is admin
  const allItems = currentUser?.role === 'admin'
    ? [...navItems, { path: '/crm', icon: Shield, label: 'crm' }]
    : navItems;

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
          {allItems.map(item => (
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
