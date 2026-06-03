import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, Target, Flame, Calendar, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ProgressRing({ score }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444';
  const label = score >= 80 ? 'Ajoyib!' : score >= 50 ? "O'rtacha" : 'Yaxshilash kerak';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg width="180" height="180">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--border)" strokeWidth="10" />
          <circle cx="90" cy="90" r={radius} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="progress-ring" transform="rotate(-90 90 90)" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{score}%</span>
          <span className="text-sm font-medium" style={{ color }}>{label}</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Life Activity Score</p>
    </div>
  );
}

export default function Dashboard() {
  const { tasks, habits, goals, events, achievements, calculateLifeScore } = useApp();
  const { currentUser, t, language } = useAuth();
  const navigate = useNavigate();
  const lifeScore = calculateLifeScore();
  const lang = language || 'uz';

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tashkentTime = new Date(currentTime.toLocaleString("en-US", { timeZone: "Asia/Tashkent" }));
  const timeStr = tashkentTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const dayOfWeekToKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayKey = dayOfWeekToKey[tashkentTime.getDay()];

  const todayTasks = tasks.filter(t => t.day === todayKey);
  const completedToday = todayTasks.filter(t => t.completed).length;
  const totalToday = todayTasks.length;
  const maxStreak = Math.max(...habits.map(h => h.streak), 0);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const userName = currentUser?.name || 'User';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('dashboard')}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('welcomeUser')}, {userName}!</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold font-mono" style={{ color: 'var(--accent)' }}>{timeStr}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card flex items-center gap-3 cursor-pointer hover:ring-2 hover:ring-blue-300" onClick={() => navigate('/daily')}>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20"><CheckCircle2 size={22} className="text-blue-500" /></div>
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{completedToday}/{totalToday}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Kunlik vazifalar</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 cursor-pointer hover:ring-2 hover:ring-blue-300" onClick={() => navigate('/weekly')}>
          <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-900/20"><Calendar size={22} className="text-cyan-500" /></div>
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{tasks.length}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Haftalik vazifalar</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 cursor-pointer hover:ring-2 hover:ring-blue-300" onClick={() => navigate('/habits')}>
          <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-900/20"><Flame size={22} className="text-orange-500" /></div>
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{maxStreak}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Max Streak</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 cursor-pointer hover:ring-2 hover:ring-blue-300" onClick={() => navigate('/goals')}>
          <div className="p-2 rounded-xl bg-green-50 dark:bg-green-900/20"><Target size={22} className="text-green-500" /></div>
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{goals.length}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Yillik maqsadlar</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 cursor-pointer hover:ring-2 hover:ring-blue-300" onClick={() => navigate('/achievements')}>
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20"><Award size={22} className="text-purple-500" /></div>
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{unlockedAchievements}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Yutuqlar</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Life Score */}
        <div className="card flex items-center justify-center"><ProgressRing score={lifeScore} /></div>

        {/* Today's Tasks */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Bugungi vazifalar</h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{totalToday} ta</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
            {todayTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${task.completed ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{task.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Yaqinlashayotgan voqealar</h3>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <span className="text-2xl">{event.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{event.date} {event.location ? `📍 ${event.location}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Streaks & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-orange-500" />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Faol Streak'lar</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {habits.filter(h => h.streak > 0).slice(0, 6).map(habit => (
              <div key={habit.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <span className="text-lg">{habit.icon}</span>
                <div><p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{habit.name}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>🔥 {habit.streak} kun</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1))' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>AI Tavsiyalari</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">Premium</span>
          </div>
          <div className="space-y-3">
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>💡 "Siz eng samarali ishlaydigan vaqt <b>09:00–12:00</b> oralig'i."</p>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>📊 "Bu hafta sport vazifalarining <b>60%</b> bajarildi."</p>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>🎯 "Yillik maqsadlaringiz <b>{goals.length > 0 ? Math.round(goals.reduce((a,g) => a + g.progress, 0) / goals.length) : 0}%</b> bajarildi."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
