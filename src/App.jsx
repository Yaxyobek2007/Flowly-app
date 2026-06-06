import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';

// Auth loaded eagerly (first screen)
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

// Lazy loaded pages (code splitting)
const Plans = lazy(() => import('./pages/Plans'));
const Goals = lazy(() => import('./pages/Goals'));
const FocusPage = lazy(() => import('./pages/FocusPage'));
const HealthPage = lazy(() => import('./pages/HealthPage'));
const MotivationPage = lazy(() => import('./pages/MotivationPage'));
const FinancePage = lazy(() => import('./pages/FinancePage'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));
const SocialPage = lazy(() => import('./pages/SocialPage'));
const Notes = lazy(() => import('./pages/Notes'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const Premium = lazy(() => import('./pages/Premium'));
const Certificates = lazy(() => import('./pages/Certificates'));
const LocationMap = lazy(() => import('./pages/LocationMap'));
const CrmErp = lazy(() => import('./pages/CrmErp'));
const HelpSupport = lazy(() => import('./pages/HelpSupport'));
const AiChat = lazy(() => import('./pages/AiChat'));

// Page loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Dynamic page title based on route
function usePageTitle() {
  const location = window.location.pathname;
  useEffect(() => {
    const titles = {
      '/': 'Flowly — Dashboard',
      '/plans': 'Flowly — Rejalar',
      '/goals': 'Flowly — Maqsadlar',
      '/focus': 'Flowly — Fokus',
      '/health': 'Flowly — Odatlar',
      '/motivation': 'Flowly — Yutuqlar',
      '/finance': 'Flowly — Moliya',
      '/analysis': 'Flowly — Statistika',
      '/social': 'Flowly — Do\'stlar',
      '/notes': 'Flowly — Yozuvlar',
      '/location': 'Flowly — Xarita',
      '/settings': 'Flowly — Sozlamalar',
      '/profile': 'Flowly — Profil',
      '/premium': 'Flowly — Premium',
      '/help': 'Flowly — Yordam',
      '/crm': 'Flowly — Admin Panel',
      '/auth': 'Flowly — Kirish',
    };
    document.title = titles[location] || 'Flowly — Plan. Act. Achieve.';
  }, [location]);
}

// Session timeout: 24 hours of inactivity
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

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
  usePageTitle();

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
        
        {/* Combined tabbed pages — lazy loaded */}
        <Route path="plans" element={<Suspense fallback={<PageLoader />}><Plans /></Suspense>} />
        <Route path="goals" element={<Suspense fallback={<PageLoader />}><Goals /></Suspense>} />
        <Route path="focus" element={<Suspense fallback={<PageLoader />}><FocusPage /></Suspense>} />
        <Route path="health" element={<Suspense fallback={<PageLoader />}><HealthPage /></Suspense>} />
        <Route path="motivation" element={<Suspense fallback={<PageLoader />}><MotivationPage /></Suspense>} />
        <Route path="finance" element={<Suspense fallback={<PageLoader />}><FinancePage /></Suspense>} />
        <Route path="analysis" element={<Suspense fallback={<PageLoader />}><AnalysisPage /></Suspense>} />
        <Route path="social" element={<Suspense fallback={<PageLoader />}><SocialPage /></Suspense>} />

        {/* Standalone — lazy loaded */}
        <Route path="notes" element={<Suspense fallback={<PageLoader />}><Notes /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
        <Route path="profile" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
        <Route path="premium" element={<Suspense fallback={<PageLoader />}><Premium /></Suspense>} />
        <Route path="certificates" element={<Suspense fallback={<PageLoader />}><Certificates /></Suspense>} />
        <Route path="location" element={<Suspense fallback={<PageLoader />}><LocationMap /></Suspense>} />
        <Route path="help" element={<Suspense fallback={<PageLoader />}><HelpSupport /></Suspense>} />
        <Route path="ai" element={<Suspense fallback={<PageLoader />}><AiChat /></Suspense>} />
        <Route path="crm" element={<Suspense fallback={<PageLoader />}><CrmErp /></Suspense>} />

        {/* Legacy standalone redirects */}

        {/* Legacy URL redirects */}
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
        <Route path="voice" element={<Navigate to="/social" replace />} />
        <Route path="privacy" element={<Navigate to="/settings" replace />} />
        <Route path="chat" element={<Navigate to="/social" replace />} />
        <Route path="breakdown" element={<Navigate to="/goals" replace />} />
        <Route path="meditation" element={<Navigate to="/motivation" replace />} />
        <Route path="mood" element={<Navigate to="/motivation" replace />} />
        <Route path="flashcards" element={<Navigate to="/goals" replace />} />
        <Route path="journal" element={<Navigate to="/focus" replace />} />
        <Route path="tags" element={<Navigate to="/plans" replace />} />
        <Route path="recurring" element={<Navigate to="/plans" replace />} />

        {/* Admin legacy */}
        <Route path="admin" element={<Suspense fallback={<PageLoader />}><CrmErp /></Suspense>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
