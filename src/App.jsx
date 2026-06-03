import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DailyPlanner from './pages/DailyPlanner';
import WeeklyPlanner from './pages/WeeklyPlanner';
import MonthlyPlanner from './pages/MonthlyPlanner';
import YearlyGoals from './pages/YearlyGoals';
import HabitTracker from './pages/HabitTracker';
import Notes from './pages/Notes';
import Analytics from './pages/Analytics';
import Achievements from './pages/Achievements';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="daily" element={<DailyPlanner />} />
              <Route path="weekly" element={<WeeklyPlanner />} />
              <Route path="monthly" element={<MonthlyPlanner />} />
              <Route path="goals" element={<YearlyGoals />} />
              <Route path="habits" element={<HabitTracker />} />
              <Route path="notes" element={<Notes />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="achievements" element={<Achievements />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
