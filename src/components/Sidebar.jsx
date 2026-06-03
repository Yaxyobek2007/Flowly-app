import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, CalendarRange, Calendar,
  Target, CheckSquare, FileText, BarChart3, Trophy, Sun, Moon, X,
  Settings, Award, Users, Crown, Shield, User, MapPin, Briefcase
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/daily', icon: CalendarDays, label: 'Daily Planner' },
  { path: '/weekly', icon: CalendarRange, label: 'Weekly Planner' },
  { path: '/monthly', icon: Calendar, label: 'Monthly Planner' },
  { path: '/goals', icon: Target, label: 'Yearly Goals' },
  { path: '/habits', icon: CheckSquare, label: 'Habit Tracker' },
  { path: '/notes', icon: FileText, label: 'Notes' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/achievements', icon: Trophy, label: 'Achievements' },
  { path: '/certificates', icon: Award, label: 'Sertifikatlar' },
  { path: '/friends', icon: Users, label: "Do'stlar" },
  { path: '/premium', icon: Crown, label: 'Premium' },
  { path: '/location', icon: MapPin, label: 'Xarita' },
];

const bottomItems = [
  { path: '/profile', icon: User, label: 'Profil' },
  { path: '/settings', icon: Settings, label: 'Sozlamalar' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { darkMode, toggleDark } = useTheme();
  const { currentUser } = useAuth();

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
        
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Flowly</h1>
          </div>
          <button className="lg:hidden" onClick={onClose}>
            <X size={20} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <item.icon size={18} /><span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
          {currentUser?.role === 'admin' && (
            <>
              <NavLink to="/admin" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Shield size={18} /><span className="text-sm">Admin Panel</span>
              </NavLink>
              <NavLink to="/crm" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Briefcase size={18} /><span className="text-sm">CRM / ERP</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="px-3 pb-2 space-y-1">
          {bottomItems.map(item => (
            <NavLink key={item.path} to={item.path} onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <item.icon size={18} /><span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={toggleDark} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
