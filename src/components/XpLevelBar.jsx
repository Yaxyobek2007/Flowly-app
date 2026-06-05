import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Zap } from 'lucide-react';

function calculateXP({ tasks, habits, goals, currentUser }) {
  let xp = 0;
  // Tasks: +10 per completed
  xp += tasks.filter(t => t.completed).length * 10;
  // Habits: +15 per done today
  xp += habits.filter(h => h.todayDone).length * 15;
  // Habits streaks: +2 per streak day
  xp += habits.reduce((a, h) => a + (h.streak || 0) * 2, 0);
  // Goals: +1 per % progress
  xp += goals.reduce((a, g) => a + (g.progress || 0), 0);
  // Login streak: +5 per day
  xp += (currentUser?.loginStreak || 0) * 5;
  // Points earned = XP bonus
  xp += (currentUser?.points || 0);
  // Pomodoro: +3 per session
  xp += parseInt(localStorage.getItem('flowly-pomo-sessions') || '0') * 3;
  // Journal entries: +10 per entry
  const journal = JSON.parse(localStorage.getItem('flowly-journal') || '[]');
  xp += journal.length * 10;
  // Smart plans: +20 per plan
  const plans = JSON.parse(localStorage.getItem('flowly-smart-plans') || '[]');
  xp += plans.length * 20;
  // Certificates: +25 per cert
  const certs = JSON.parse(localStorage.getItem('flowly-certificates') || '[]');
  xp += certs.length * 25;
  return xp;
}

function getLevel(xp) {
  if (xp < 50) return 1;
  if (xp < 150) return 2;
  if (xp < 300) return 3;
  if (xp < 500) return 4;
  if (xp < 800) return 5;
  if (xp < 1200) return 6;
  if (xp < 1800) return 7;
  if (xp < 2500) return 8;
  if (xp < 3500) return 9;
  return Math.min(Math.floor(xp / 500) + 5, 99);
}

function getXPForLevel(level) {
  const thresholds = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500];
  if (level <= 9) return thresholds[level] || 0;
  return (level - 5) * 500;
}

function getLevelTitle(level, lang) {
  const titles = {
    uz: ['Yangi', 'Boshlovchi', 'Faol', 'Izchil', 'Intizomli', 'Tajribali', 'Professional', 'Ekspert', 'Master', 'Legend', 'Elitr'],
    ru: ['Новый', 'Начинающий', 'Активный', 'Стабильный', 'Дисциплинированный', 'Опытный', 'Профессионал', 'Эксперт', 'Мастер', 'Легенда', 'Элита'],
    en: ['New', 'Beginner', 'Active', 'Steady', 'Disciplined', 'Experienced', 'Professional', 'Expert', 'Master', 'Legend', 'Elite'],
  };
  const idx = Math.min(level - 1, 10);
  return titles[lang]?.[idx] || titles.en[idx] || 'Legend';
}

function getLevelColor(level) {
  if (level <= 2) return 'from-gray-400 to-gray-500';
  if (level <= 4) return 'from-green-400 to-emerald-500';
  if (level <= 6) return 'from-blue-400 to-blue-600';
  if (level <= 8) return 'from-purple-500 to-pink-500';
  return 'from-yellow-400 to-orange-500';
}

export default function XpLevelBar() {
  const { currentUser, language } = useAuth();
  const { tasks, habits, goals } = useApp();
  const lang = language || 'uz';

  if (!currentUser) return null;

  const xp = calculateXP({ tasks, habits, goals, currentUser });
  const level = getLevel(xp);
  const title = getLevelTitle(level, lang);
  const color = getLevelColor(level);
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const xpInLevel = xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const progressPercent = xpNeeded > 0 ? Math.min(Math.round((xpInLevel / xpNeeded) * 100), 100) : 100;

  return (
    <div className="card flex items-center gap-4 overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-10" style={{ background: `radial-gradient(circle, #f59e0b, transparent)` }}></div>
      
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg flex-shrink-0`}>
        <span className="text-white font-bold text-xl">{level}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Level {level}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium bg-gradient-to-r ${color} text-white`}>{title}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-yellow-500" />
            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{xp}</span>
          </div>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          <div className={`h-3 rounded-full bg-gradient-to-r ${color} transition-all duration-700`} style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{xpInLevel}/{xpNeeded} XP</span>
          <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>→ Lv.{level + 1} ({getLevelTitle(level + 1, lang)})</span>
        </div>
      </div>
    </div>
  );
}
