import { useState, useEffect } from 'react';
import { Menu, Bell, Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SearchModal from './SearchModal';

export default function Header({ onMenuClick }) {
  const { notifications, markNotificationRead, clearNotifications } = useApp();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  // Real time Toshkent
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tashkent = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tashkent" }));
  const timeStr = tashkent.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  const dateStr = tashkent.toLocaleDateString('uz-UZ', { weekday: 'short', month: 'short', day: 'numeric' });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowNotifs(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 glass px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={onMenuClick}>
            <Menu size={24} style={{ color: 'var(--text-primary)' }} />
          </button>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{dateStr}</p>
            <p className="text-lg font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{timeStr}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search button */}
          <button onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
            style={{ border: '1px solid var(--border)' }}>
            <Search size={16} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>Qidirish...</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded hidden sm:inline" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>⌘K</kbd>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 relative">
              <Bell size={20} style={{ color: 'var(--text-secondary)' }} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">{unreadCount}</span>}
            </button>
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden animate-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Bildirishnomalar</h4>
                  <button onClick={clearNotifications} className="text-xs text-blue-500">Tozalash</button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-sm" style={{ color: 'var(--text-secondary)' }}>Bildirishnomalar yo'q</p>
                  ) : (
                    notifications.slice(0, 10).map(n => (
                      <div key={n.id} className={`p-3 border-b cursor-pointer transition-colors ${n.read ? '' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}
                        style={{ borderColor: 'var(--border)' }} onClick={() => markNotificationRead(n.id)}>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">YN</span>
          </div>
        </div>
      </header>

      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}
