import { useApp } from '../context/AppContext';
import { CheckCircle2, Clock, Target, Flame, Calendar, TrendingUp } from 'lucide-react';

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
  const lifeScore = calculateLifeScore();

  const todayTasks = tasks.filter(t => t.day === 'monday');
  const completedToday = todayTasks.filter(t => t.completed).length;
  const totalToday = todayTasks.length;

  const activeStreaks = habits.filter(h => h.streak > 0);
  const maxStreak = Math.max(...habits.map(h => h.streak), 0);

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Xush kelibsiz, Yaxyobek!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <CheckCircle2 size={24} className="text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{completedToday}/{totalToday}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Bugungi vazifalar</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-900/20">
            <Flame size={24} className="text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{maxStreak}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Max Streak</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="p-2 rounded-xl bg-green-50 dark:bg-green-900/20">
            <Target size={24} className="text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{goals.length}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Yillik maqsadlar</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <Trophy size={24} className="text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{unlockedAchievements}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Yutuqlar</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Life Score */}
        <div className="card flex items-center justify-center">
          <ProgressRing score={lifeScore} />
        </div>

        {/* Today's Tasks */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Bugungi vazifalar</h3>
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
            {todayTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${task.completed ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{task.time}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                }`}>{task.priority}</span>
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
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Streaks & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Streaks */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-orange-500" />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Faol Streak'lar</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {activeStreaks.slice(0, 6).map(habit => (
              <div key={habit.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <span className="text-lg">{habit.icon}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{habit.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>🔥 {habit.streak} kun</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1))' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>AI Tavsiyalari</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">Premium</span>
          </div>
          <div className="space-y-3">
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              💡 "Siz eng samarali ishlaydigan vaqt <b>09:00–12:00</b> oralig'i. Muhim vazifalarni shu vaqtga rejalashtiring."
            </p>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              📊 "Bu hafta sport vazifalarining <b>60%</b> bajarildi. Muntazamlikni oshiring!"
            </p>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              🎯 "Yillik maqsadlaringiz <b>24%</b> bajarildi. O'rtacha tezlik bilan 2027-yilgacha yetasiz."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Trophy({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  );
}
