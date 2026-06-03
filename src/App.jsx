import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DailyPlanner from './pages/DailyPlanner';
import WeeklyPlanner from './pages/WeeklyPlanner';
import MonthlyPlanner from './pages/MonthlyPlanner';
import YearlyGoals from './pages/YearlyGoals';
import HabitTracker from './pages/HabitTracker';
import Notes from './pages/Notes';
import Analytics from './pages/Analytics';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Premium from './pages/Premium';
import Friends from './pages/Friends';
import Certificates from './pages/Certificates';
import AdminPanel from './pages/AdminPanel';
import LocationMap from './pages/LocationMap';
import CrmErp from './pages/CrmErp';
import HelpSupport from './pages/HelpSupport';

// Session timeout: 100 hours
const SESSION_TIMEOUT = 100 * 60 * 60 * 1000;

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/auth" replace />;
  return children;
}

function AdminRedirect({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/auth" replace />;
  // Admin (yaxyobek/admin123) goes to CRM
  if (currentUser.role === 'admin' && window.location.pathname === '/') {
    return <Navigate to="/crm" replace />;
  }
  return children;
}

function AuthRoute({ children }) {
  const { currentUser } = useAuth();
  if (currentUser) {
    // Admin goes to CRM, regular user to main
    if (currentUser.role === 'admin') return <Navigate to="/crm" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  const { currentUser, logout } = useAuth();

  // Auto-logout after 100 hours of inactivity
  useEffect(() => {
    if (!currentUser) return;
    const lastActivity = localStorage.getItem('flowly-last-activity');
    const now = Date.now();
    if (lastActivity && (now - parseInt(lastActivity)) > SESSION_TIMEOUT) {
      logout();
      return;
    }
    localStorage.setItem('flowly-last-activity', now.toString());

    const interval = setInterval(() => {
      localStorage.setItem('flowly-last-activity', Date.now().toString());
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <Routes>
      <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="daily" element={<DailyPlanner />} />
        <Route path="weekly" element={<WeeklyPlanner />} />
        <Route path="monthly" element={<MonthlyPlanner />} />
        <Route path="goals" element={<YearlyGoals />} />
        <Route path="habits" element={<HabitTracker />} />
        <Route path="notes" element={<Notes />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="premium" element={<Premium />} />
        <Route path="friends" element={<Friends />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="location" element={<LocationMap />} />
        <Route path="help" element={<HelpSupport />} />
        <Route path="crm" element={<CrmErp />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
          {!loading && (
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          )}
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
