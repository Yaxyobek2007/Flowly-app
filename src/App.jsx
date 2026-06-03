import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/auth" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { currentUser } = useAuth();
  if (currentUser) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
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
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
