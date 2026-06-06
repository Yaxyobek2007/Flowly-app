import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, Target, Flame, Calendar, TrendingUp, Award, ArrowRight, Zap, BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import XpLevelBar from '../components/XpLevelBar';

function ProgressRing({ score, size = 160 }) {
  const radius = (size / 2) - 15;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--border)" strokeWidth="8" opacity="0.3" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="progress-ring" transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{score}</span>
        <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>/ 100</span>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, color, bgColor, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all hover:scale-105 active:scale-95 w-full" style={{ background: 'var(--bg-secondary)' }}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
        <Icon size={18} className={color} />
      </div>
      <span className="text-[10px] font-medium text-center leading-tight" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </button>
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
  const timeStr = tashkentTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

  const dayOfWeekToKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayKey = dayOfWeekToKey[tashkentTime.getDay()];

  const todayTasks = tasks.filter(t => t.day === todayKey);
  const completedToday = todayTasks.filter(t => t.completed).length;
  const totalToday = todayTasks.length;
  const todayPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  const maxStreak = Math.max(...habits.map(h => h.streak), 0);
  const habitsToday = habits.filter(h => h.todayDone).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  const userName = currentUser?.name || 'User';

  const dayNames = {
    uz: ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'],
    ru: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
    en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  };
  const monthNames = {
    uz: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr'],
    ru: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  };

  const dayName = dayNames[lang]?.[tashkentTime.getDay()];
  const dateStr = `${tashkentTime.getDate()} ${monthNames[lang]?.[tashkentTime.getMonth()]}`;

  // Greeting based on time
  const hour = tashkentTime.getHours();
  const greeting = hour < 6 ? (lang === 'ru' ? 'Доброй ночи' : lang === 'en' ? 'Good night' : 'Hayrli tun')
    : hour < 12 ? (lang === 'ru' ? 'Доброе утро' : lang === 'en' ? 'Good morning' : 'Hayrli tong')
    : hour < 18 ? (lang === 'ru' ? 'Добрый день' : lang === 'en' ? 'Good afternoon' : 'Hayrli kun')
    : (lang === 'ru' ? 'Добрый вечер' : lang === 'en' ? 'Good evening' : 'Hayrli kech');

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Hero Section */}
      <div className="card overflow-hidden relative" style={{ padding: 0 }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, var(--accent), transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{greeting} 👋</p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{userName}</h1>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{dayName}, {dateStr} • {timeStr}</p>
            </div>
            <ProgressRing score={lifeScore} size={100} />
          </div>
          <XpLevelBar />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card cursor-pointer hover:ring-2 hover:ring-blue-400/50 active:scale-[0.98]" onClick={() => navigate('/plans')} style={{ padding: '1rem' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"><CheckCircle2 size={16} className="text-blue-500" /></div>
            <span className="text-xs font-medium px-1.5 py-0.5 rounded-md" style={{ background: todayPercent >= 70 ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)', color: todayPercent >= 70 ? '#22c55e' : '#eab308' }}>{todayPercent}%</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{completedToday}<span className="text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>/{totalToday}</span></p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Задач сегодня' : lang === 'en' ? 'Tasks today' : 'Bugungi vazifalar'}</p>
        </div>

        <div className="card cursor-pointer hover:ring-2 hover:ring-orange-400/50 active:scale-[0.98]" onClick={() => navigate('/health')} style={{ padding: '1rem' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center"><Flame size={16} className="text-orange-500" /></div>
            <span className="text-xs font-bold text-orange-500">{maxStreak}🔥</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{habitsToday}<span className="text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>/{habits.length}</span></p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Привычки' : lang === 'en' ? 'Habits' : 'Odatlar'}</p>
        </div>

        <div className="card cursor-pointer hover:ring-2 hover:ring-green-400/50 active:scale-[0.98]" onClick={() => navigate('/goals')} style={{ padding: '1rem' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center"><Target size={16} className="text-green-500" /></div>
            <ArrowRight size={14} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{goals.length}</p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Цели' : lang === 'en' ? 'Goals' : 'Maqsadlar'}</p>
        </div>

        <div className="card cursor-pointer hover:ring-2 hover:ring-purple-400/50 active:scale-[0.98]" onClick={() => navigate('/motivation')} style={{ padding: '1rem' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><Award size={16} className="text-purple-500" /></div>
            <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>⭐{currentUser?.points || 0}</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{unlockedAchievements}</p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Достижения' : lang === 'en' ? 'Achievements' : 'Yutuqlar'}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Today Tasks + Quick Actions */}
        <div className="lg:col-span-3 space-y-5">
          {/* Today's Tasks */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={16} style={{ color: 'var(--accent)' }} />
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {lang === 'ru' ? 'Сегодня' : lang === 'en' ? 'Today' : 'Bugun'}
                </h3>
              </div>
              <button onClick={() => navigate('/plans')} className="text-xs font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ color: 'var(--accent)' }}>
                {lang === 'ru' ? 'Все' : lang === 'en' ? 'All' : 'Barchasi'} <ArrowRight size={12} />
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                  <Plus size={20} className="text-blue-500" />
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Нет задач на сегодня' : lang === 'en' ? 'No tasks today' : 'Bugun vazifa yo\'q'}</p>
                <button onClick={() => navigate('/plans')} className="mt-2 text-xs font-medium" style={{ color: 'var(--accent)' }}>+ {lang === 'ru' ? 'Добавить' : lang === 'en' ? 'Add' : 'Qo\'shish'}</button>
              </div>
            ) : (
              <div className="space-y-2">
                {todayTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors" style={{ background: 'var(--bg-secondary)' }}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
                      {task.completed && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${task.completed ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                    </div>
                    {task.time && <span className="text-[10px] font-medium px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>{task.time}</span>}
                  </div>
                ))}
                {todayTasks.length > 5 && (
                  <button onClick={() => navigate('/plans')} className="w-full text-center text-xs py-2 font-medium" style={{ color: 'var(--accent)' }}>+{todayTasks.length - 5} {lang === 'ru' ? 'ещё' : 'ta yana'}</button>
                )}
              </div>
            )}

            {/* Progress bar */}
            {totalToday > 0 && (
              <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Прогресс дня' : lang === 'en' ? 'Day progress' : 'Kun progressi'}</span>
                  <span className="text-[10px] font-bold" style={{ color: todayPercent >= 70 ? '#22c55e' : 'var(--accent)' }}>{todayPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${todayPercent}%`, background: todayPercent >= 70 ? '#22c55e' : todayPercent >= 40 ? '#eab308' : '#ef4444' }} />
                </div>
              </div>
            )}
          </div>

          {/* Active Streaks */}
          {habits.filter(h => h.streak > 0).length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-orange-500" />
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Активные серии' : lang === 'en' ? 'Active Streaks' : 'Faol Streak\'lar'}</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {habits.filter(h => h.streak > 0).slice(0, 6).map(habit => (
                  <div key={habit.id} className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <span className="text-lg">{habit.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{habit.name}</p>
                      <p className="text-[10px] font-bold text-orange-500">{habit.streak} 🔥</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick Actions */}
          <div className="card" style={{ padding: '1rem' }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Быстрые действия' : lang === 'en' ? 'Quick Actions' : 'Tezkor amallar'}</h3>
            <div className="grid grid-cols-4 gap-2">
              <QuickAction icon={Plus} label={lang === 'ru' ? 'Задача' : lang === 'en' ? 'Task' : 'Vazifa'} color="text-blue-500" bgColor="bg-blue-500/10" onClick={() => navigate('/plans')} />
              <QuickAction icon={Target} label={lang === 'ru' ? 'Цель' : lang === 'en' ? 'Goal' : 'Maqsad'} color="text-green-500" bgColor="bg-green-500/10" onClick={() => navigate('/goals')} />
              <QuickAction icon={BarChart3} label={lang === 'ru' ? 'Аналитика' : lang === 'en' ? 'Stats' : 'Statistika'} color="text-purple-500" bgColor="bg-purple-500/10" onClick={() => navigate('/analysis')} />
              <QuickAction icon={Zap} label={lang === 'ru' ? 'Фокус' : lang === 'en' ? 'Focus' : 'Fokus'} color="text-orange-500" bgColor="bg-orange-500/10" onClick={() => navigate('/focus')} />
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} style={{ color: 'var(--accent)' }} />
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Ближайшие' : lang === 'en' ? 'Upcoming' : 'Yaqinda'}</h3>
              </div>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Нет событий' : lang === 'en' ? 'No events' : 'Voqealar yo\'q'}</p>
            ) : (
              <div className="space-y-2.5">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <span className="text-xl">{event.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Insights */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(147,51,234,0.05))' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Аналитика' : lang === 'en' ? 'Insights' : 'Tahlil'}</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="text-sm">💡</span>
                <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Лучшее время работы' : lang === 'en' ? 'Best productive time' : 'Samarali vaqt'}: <b>09:00–12:00</b></p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">📊</span>
                <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Прогресс целей' : lang === 'en' ? 'Goals progress' : 'Maqsadlar'}: <b>{goals.length > 0 ? Math.round(goals.reduce((a,g) => a + g.progress, 0) / goals.length) : 0}%</b></p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">🔥</span>
                <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Макс серия' : lang === 'en' ? 'Max streak' : 'Max streak'}: <b>{maxStreak} {lang === 'ru' ? 'дней' : lang === 'en' ? 'days' : 'kun'}</b></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
