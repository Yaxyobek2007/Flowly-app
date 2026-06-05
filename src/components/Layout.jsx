import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import DailyBonusModal from './DailyBonusModal';
import PointsShop from './PointsShop';
import AiFloatingButton from './AiFloatingButton';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showPointsShop, setShowPointsShop] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 60) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-56'}`}>
        <Header onMenuClick={() => setSidebarOpen(true)} visible={headerVisible} onOpenShop={() => setShowPointsShop(true)} />
        <main className="p-4 sm:p-6 animate-in">
          <Outlet />
        </main>
      </div>

      {/* Global modals & floating */}
      <DailyBonusModal />
      <PointsShop isOpen={showPointsShop} onClose={() => setShowPointsShop(false)} />
      <AiFloatingButton />
    </div>
  );
}
