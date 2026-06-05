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

import LocationMap from './pages/LocationMap';
import CrmErp from './pages/CrmErp';
import HelpSupport from './pages/HelpSupport';
import AiChat from './pages/AiChat';
import SmartPlanner from './pages/SmartPlanner';
import PomodoroTimer from './pages/PomodoroTimer';
import Journal from './pages/Journal';
import EisenhowerMatrix from './pages/EisenhowerMatrix';
import FocusMode from './pages/FocusMode';
import RecurringTasks from './pages/RecurringTasks';
import CalendarView from './pages/CalendarView';
import Routines from './pages/Routines';
import SprintMode from './pages/SprintMode';
import TagsFilters from './pages/TagsFilters';
import WaterTracker from './pages/WaterTracker';
import SleepTracker from './pages/SleepTracker';
import FinanceTracker from './pages/FinanceTracker';
import DailyQuote from './pages/DailyQuote';
import WeeklyReview from './pages/WeeklyReview';
import VirtualPet from './pages/VirtualPet';
import Leaderboard from './pages/Leaderboard';
import Meditation from './pages/Meditation';
import DailyChallenge from './pages/DailyChallenge';
import MoodCalendar from './pages/MoodCalendar';
import Flashcards from './pages/Flashcards';
import InvestmentPlanner from './pages/InvestmentPlanner';
import VoiceAssistant from './pages/VoiceAssistant';
import PrivacyPermissions from './pages/PrivacyPermissions';
import FriendsChat from './pages/FriendsChat';
import SmartBreakdown from './pages/SmartBreakdown';

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

// Redirect /join?ref=CODE → /auth?ref=CODE (for referral links)
function JoinRedirect() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref') || '';
  return <Navigate to={`/auth?ref=${ref}`} replace />;
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
      <Route path="/join" element={<JoinRedirect />} />
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
        <Route path="admin" element={<CrmErp />} />
        <Route path="location" element={<LocationMap />} />
        <Route path="help" element={<HelpSupport />} />
        <Route path="ai" element={<AiChat />} />
        <Route path="smart-plan" element={<SmartPlanner />} />
        <Route path="pomodoro" element={<PomodoroTimer />} />
        <Route path="journal" element={<Journal />} />
        <Route path="matrix" element={<EisenhowerMatrix />} />
        <Route path="focus" element={<FocusMode />} />
        <Route path="recurring" element={<RecurringTasks />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="routines" element={<Routines />} />
        <Route path="sprint" element={<SprintMode />} />
        <Route path="tags" element={<TagsFilters />} />
        <Route path="water" element={<WaterTracker />} />
        <Route path="sleep" element={<SleepTracker />} />
        <Route path="finance" element={<FinanceTracker />} />
        <Route path="quote" element={<DailyQuote />} />
        <Route path="review" element={<WeeklyReview />} />
        <Route path="pet" element={<VirtualPet />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="meditation" element={<Meditation />} />
        <Route path="challenge" element={<DailyChallenge />} />
        <Route path="mood" element={<MoodCalendar />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="invest" element={<InvestmentPlanner />} />
        <Route path="voice" element={<VoiceAssistant />} />
        <Route path="privacy" element={<PrivacyPermissions />} />
        <Route path="chat" element={<FriendsChat />} />
        <Route path="breakdown" element={<SmartBreakdown />} />
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
