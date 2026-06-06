import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, X, User, Settings, Crown, Users, Award, Sun, Moon, HelpCircle, LogOut, ChevronDown, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchModal from './SearchModal';

export default function Header({ onMenuClick, visible, onOpenShop }) {
  const { notifications, markNotificationRead, clearNotifications } = useApp();
  const { currentUser, logout, language, t } = useAuth();
  const lang = language || 'uz';
  const { darkMode, toggleDark } = useTheme();
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

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
    { icon: User, label: lang === 'ru' ? 'Профиль' : lang === 'en' ? 'Profile' : 'Profil', path: '/profile' },
    { icon: Settings, label: lang === 'ru' ? 'Настройки' : lang === 'en' ? 'Settings' : 'Sozlamalar', path: '/settings' },
    { icon: Crown, label: 'Premium', path: '/premium' },
    { icon: Users, label: lang === 'ru' ? 'Друзья' : lang === 'en' ? 'Friends' : "Do'stlar", path: '/social' },
    { icon: Award, label: lang === 'ru' ? 'Сертификаты' : lang === 'en' ? 'Certificates' : 'Sertifikatlar', path: '/certificates' },
    { icon: HelpCircle, label: lang === 'ru' ? 'Помощь' : lang === 'en' ? 'Help' : 'Yordam', path: '/help' },
    ...(currentUser?.role === 'admin' ? [{ icon: Shield, label: lang === 'ru' ? 'Управление' : lang === 'en' ? 'Management' : 'Boshqaruv', path: '/crm' }] : []),
  ];

  return (
    <>
      <header className={`sticky top-0 z-30 glass px-4 py-3 flex items-center justify-between transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* Left: Menu only */}
        <div className="flex items-center gap-2">
          <button className="lg:hidden p-1" onClick={onMenuClick}>
            <Menu size={22} style={{ color: 'var(--text-primary)' }} />
          </button>
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
            <button onClick={() => {
              setShowNotifs(!showNotifs);
              setShowUserMenu(false);
              // Vibrate + sound on open if has unread
              if (!showNotifs && unreadCount > 0) {
                if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
                try {
                  const ctx = new (window.AudioContext || window.webkitAudioContext)();
                  const osc = ctx.createOscillator(); const g = ctx.createGain();
                  osc.connect(g); g.connect(ctx.destination);
                  osc.frequency.setValueAtTime(880, ctx.currentTime);
                  osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.08);
                  g.gain.setValueAtTime(0.2, ctx.currentTime);
                  g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                  osc.start(); osc.stop(ctx.currentTime + 0.3);
                } catch(e) {}
              }
            }}
              className="p-2 rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 relative">
              <Bell size={18} style={{ color: 'var(--text-secondary)' }} />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold animate-pulse">{unreadCount}</span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden animate-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t('notifications')}</h4>
                  <button onClick={() => { clearNotifications(); if ('vibrate' in navigator) navigator.vibrate(50); }}
                    className="text-xs px-2 py-0.5 rounded-lg bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium">
                    🗑️ {t('clearAll')}
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>✓ {t('noNotifications')}</p>
                  ) : (
                    notifications.slice(0, 10).map(n => (
                      <div key={n.id} className={`flex items-center gap-2 p-3 border-b transition-colors ${n.read ? '' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}
                        style={{ borderColor: 'var(--border)' }}>
                        <div className="flex-1 cursor-pointer" onClick={() => markNotificationRead(n.id)}>
                          <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                        </div>
                        <button onClick={() => { markNotificationRead(n.id); clearNotifications(); }}
                          className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                          title={t('delete')}>
                          <X size={14} className="text-red-500" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu (YN avatar) */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
              className="flex items-center gap-2 p-1 rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{(currentUser?.name?.[0] || 'U').toUpperCase()}{(currentUser?.surname?.[0] || '').toUpperCase()}</span>
                </div>
              )}
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
                    <span className="text-sm text-red-500">{lang === 'ru' ? 'Выйти' : lang === 'en' ? 'Log out' : 'Chiqish'}</span>
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
