import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Star, TrendingUp } from 'lucide-react';

// XP calculation: tasks completed + habits done + goal progress + login streak
function calculateXP({ tasks, habits, goals, currentUser }) {
  const completedTasks = tasks.filter(t => t.completed).length * 10;
  const habitsXP = habits.filter(h => h.todayDone).length * 15;
  const goalXP = goals.reduce((a, g) => a + g.progress, 0);
  const streakXP = (currentUser?.loginStreak || 0) * 5;
  const sessionsXP = parseInt(localStorage.getItem('flowly-focus-total') || '0') * 2;
  return completedTasks + habitsXP + goalXP + streakXP + sessionsXP;
}

function getLevel(xp) {
  // Every 100 XP = 1 level
  return Math.floor(xp / 100) + 1;
}

function getLevelTitle(level, lang) {
  const titles = {
    uz: ['Yangi boshlovchi', 'Faol', 'Intizomli', 'Professional', 'Master', 'Legend'],
    ru: ['Новичок', 'Активный', 'Дисциплинированный', 'Профессионал', 'Мастер', 'Легенда'],
    en: ['Beginner', 'Active', 'Disciplined', 'Professional', 'Master', 'Legend'],
  };
  const idx = Math.min(Math.floor(level / 5), 5);
  return titles[lang]?.[idx] || titles.en[idx];
}

export default function XpLevelBar() {
  const { currentUser, language } = useAuth();
  const { tasks, habits, goals } = useApp();
  const lang = language || 'uz';

  if (!currentUser) return null;

  const xp = calculateXP({ tasks, habits, goals, currentUser });
  const level = getLevel(xp);
  const xpInLevel = xp % 100;
  const title = getLevelTitle(level, lang);

  return (
    <div className="card flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
        <span className="text-white font-bold text-lg">{level}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Level {level}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-medium">{title}</span>
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{xp} XP</span>
        </div>
        <div className="w-full h-2.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
          <div className="h-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500" style={{ width: `${xpInLevel}%` }}></div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{xpInLevel}/100 XP</span>
          <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>→ Level {level + 1}</span>
        </div>
      </div>
    </div>
  );
}
