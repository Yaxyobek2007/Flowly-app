import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, X, User, Settings, Crown, Users, Award, Sun, Moon, HelpCircle, LogOut, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchModal from './SearchModal';

export default function Header({ onMenuClick, visible, onOpenShop }) {
  const { notifications, markNotificationRead, clearNotifications } = useApp();
  const { currentUser, logout, language, t } = useAuth();
  const { darkMode, toggleDark } = useTheme();
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tashkent = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tashkent" }));
  const timeStr = tashkent.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Keyboard shortcut
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') { setShowSearch(false); setShowNotifs(false); setShowUserMenu(false); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const userMenuItems = [
    { icon: User, label: 'Profil', path: '/profile' },
    { icon: Settings, label: 'Sozlamalar', path: '/settings' },
    { icon: Crown, label: 'Premium', path: '/premium' },
    { icon: Users, label: "Do'stlar", path: '/friends' },
    { icon: Award, label: 'Sertifikatlar', path: '/certificates' },
    { icon: HelpCircle, label: 'Yordam', path: '/help' },
  ];

  return (
    <>
      <header className={`sticky top-0 z-30 glass px-4 py-3 flex items-center justify-between transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* Left: Menu + Time */}
        <div className="flex items-center gap-3">
          <button className="lg:hidden p-1" onClick={onMenuClick}>
            <Menu size={22} style={{ color: 'var(--text-primary)' }} />
          </button>
          <span className="text-sm font-bold font-mono hidden sm:block" style={{ color: 'var(--text-primary)' }}>{timeStr}</span>
        </div>

        {/* Center: Search */}
        <button onClick={() => setShowSearch(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:ring-2 hover:ring-blue-300 mx-4 flex-1 max-w-md"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <Search size={16} style={{ color: 'var(--text-secondary)' }} />
          <span className="text-sm hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>{t('search') || 'Qidirish...'}</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded hidden sm:inline ml-auto" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>⌘K</kbd>
        </button>

        {/* Right: Notifications + Theme + User menu */}
        <div className="flex items-center gap-2">
          {/* Points/Shop button */}
          <button onClick={onOpenShop} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
            style={{ border: '1px solid var(--border)' }}>
            <span className="text-sm">⭐</span>
            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{currentUser?.points || 0}</span>
          </button>

          {/* Theme toggle */}
          <button onClick={toggleDark} className="p-2 rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20">
            {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} style={{ color: 'var(--text-secondary)' }} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
              className="p-2 rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 relative">
              <Bell size={18} style={{ color: 'var(--text-secondary)' }} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{unreadCount}</span>}
            </button>
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl overflow-hidden animate-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Bildirishnomalar</h4>
                  <button onClick={clearNotifications} className="text-xs text-blue-500">Tozalash</button>
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-xs" style={{ color: 'var(--text-secondary)' }}>Bo'sh</p>
                  ) : notifications.slice(0, 8).map(n => (
                    <div key={n.id} className={`p-3 border-b cursor-pointer ${n.read ? '' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}
                      style={{ borderColor: 'var(--border)' }} onClick={() => markNotificationRead(n.id)}>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu (YN avatar) */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
              className="flex items-center gap-2 p-1 rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">{(currentUser?.name?.[0] || 'U').toUpperCase()}{(currentUser?.surname?.[0] || '').toUpperCase()}</span>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl overflow-hidden animate-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {/* User info */}
                <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{currentUser?.name} {currentUser?.surname}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{currentUser?.email}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mt-1 inline-block">{currentUser?.plan?.toUpperCase()}</span>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  {userMenuItems.map(item => (
                    <button key={item.path} onClick={() => { navigate(item.path); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/10">
                      <item.icon size={16} style={{ color: 'var(--text-secondary)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Logout */}
                <div className="border-t py-1" style={{ borderColor: 'var(--border)' }}>
                  <button onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-red-50 dark:hover:bg-red-900/10">
                    <LogOut size={16} className="text-red-500" />
                    <span className="text-sm text-red-500">Chiqish</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}
