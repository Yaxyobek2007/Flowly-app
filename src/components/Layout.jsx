import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const lastScrollY = useRef(0);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setHeaderVisible(true);
  }, [location.pathname]);

  // Offline/Online detection
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => { window.removeEventListener('offline', goOffline); window.removeEventListener('online', goOnline); };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 60) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      setShowBackToTop(currentY > 400);
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

      {/* Offline banner */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[999] bg-red-500 text-white text-center py-2 text-xs font-medium animate-in">
          ⚡ Internet aloqasi yo'q — offline rejimda ishlayapsiz
        </div>
      )}

      {/* Back to top button */}
      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-5 z-[60] w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-90 animate-in"
          style={{ background: 'var(--accent)', color: 'white' }}
          aria-label="Scroll to top">
          ↑
        </button>
      )}
    </div>
  );
}
