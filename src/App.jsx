import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

// Combined pages (tabbed)
import Plans from './pages/Plans';
import Goals from './pages/Goals';
import FocusPage from './pages/FocusPage';
import HealthPage from './pages/HealthPage';
import MotivationPage from './pages/MotivationPage';
import FinancePage from './pages/FinancePage';
import AnalysisPage from './pages/AnalysisPage';
import SocialPage from './pages/SocialPage';

// Standalone pages
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Premium from './pages/Premium';
import Certificates from './pages/Certificates';
import LocationMap from './pages/LocationMap';
import CrmErp from './pages/CrmErp';
import HelpSupport from './pages/HelpSupport';
import AiChat from './pages/AiChat';

// Special pages (rewritten)
import VoiceAssistant from './pages/VoiceAssistant';
import PrivacyPermissions from './pages/PrivacyPermissions';
import FriendsChat from './pages/FriendsChat';
import SmartBreakdown from './pages/SmartBreakdown';

// Extra pages (still accessible)
import Meditation from './pages/Meditation';
import MoodCalendar from './pages/MoodCalendar';
import Flashcards from './pages/Flashcards';
import Journal from './pages/Journal';
import TagsFilters from './pages/TagsFilters';
import RecurringTasks from './pages/RecurringTasks';

// Session timeout: 100 hours
const SESSION_TIMEOUT = 100 * 60 * 60 * 1000;

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/auth" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { currentUser } = useAuth();
  if (currentUser) {
    if (currentUser.role === 'admin') return <Navigate to="/crm" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
}

// Redirect /join?ref=CODE → /auth?ref=CODE
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
    }, 60000);

    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <Routes>
      <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
      <Route path="/join" element={<JoinRedirect />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        
        {/* Combined tabbed pages */}
        <Route path="plans" element={<Plans />} />
        <Route path="goals" element={<Goals />} />
        <Route path="focus" element={<FocusPage />} />
        <Route path="health" element={<HealthPage />} />
        <Route path="motivation" element={<MotivationPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="analysis" element={<AnalysisPage />} />
        <Route path="social" element={<SocialPage />} />

        {/* Standalone */}
        <Route path="notes" element={<Notes />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="premium" element={<Premium />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="location" element={<LocationMap />} />
        <Route path="help" element={<HelpSupport />} />
        <Route path="ai" element={<AiChat />} />
        <Route path="crm" element={<CrmErp />} />

        {/* Special rewritten pages */}
        <Route path="voice" element={<VoiceAssistant />} />
        <Route path="privacy" element={<PrivacyPermissions />} />
        <Route path="chat" element={<FriendsChat />} />
        <Route path="breakdown" element={<SmartBreakdown />} />

        {/* Extra pages */}
        <Route path="meditation" element={<Meditation />} />
        <Route path="mood" element={<MoodCalendar />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="journal" element={<Journal />} />
        <Route path="tags" element={<TagsFilters />} />
        <Route path="recurring" element={<RecurringTasks />} />

        {/* Legacy redirects - old URLs redirect to new combined pages */}
        <Route path="daily" element={<Navigate to="/plans" replace />} />
        <Route path="weekly" element={<Navigate to="/plans" replace />} />
        <Route path="monthly" element={<Navigate to="/plans" replace />} />
        <Route path="calendar" element={<Navigate to="/plans" replace />} />
        <Route path="smart-plan" element={<Navigate to="/goals" replace />} />
        <Route path="sprint" element={<Navigate to="/goals" replace />} />
        <Route path="pomodoro" element={<Navigate to="/focus" replace />} />
        <Route path="routines" element={<Navigate to="/focus" replace />} />
        <Route path="habits" element={<Navigate to="/health" replace />} />
        <Route path="water" element={<Navigate to="/health" replace />} />
        <Route path="sleep" element={<Navigate to="/health" replace />} />
        <Route path="achievements" element={<Navigate to="/motivation" replace />} />
        <Route path="pet" element={<Navigate to="/motivation" replace />} />
        <Route path="leaderboard" element={<Navigate to="/motivation" replace />} />
        <Route path="challenge" element={<Navigate to="/motivation" replace />} />
        <Route path="quote" element={<Navigate to="/motivation" replace />} />
        <Route path="invest" element={<Navigate to="/finance" replace />} />
        <Route path="matrix" element={<Navigate to="/analysis" replace />} />
        <Route path="review" element={<Navigate to="/analysis" replace />} />
        <Route path="friends" element={<Navigate to="/social" replace />} />
        <Route path="analytics" element={<Navigate to="/analysis" replace />} />

        {/* Admin legacy */}
        <Route path="admin" element={<CrmErp />} />
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
