import { Menu, Bell, Search } from 'lucide-react';

export default function Header({ onMenuClick }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="sticky top-0 z-30 glass px-4 sm:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="lg:hidden" onClick={onMenuClick}>
          <Menu size={24} style={{ color: 'var(--text-primary)' }} />
        </button>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{dateStr}</p>
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{timeStr}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20">
          <Search size={20} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <button className="p-2 rounded-lg transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 relative">
          <Bell size={20} style={{ color: 'var(--text-secondary)' }} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">YN</span>
        </div>
      </div>
    </header>
  );
}
