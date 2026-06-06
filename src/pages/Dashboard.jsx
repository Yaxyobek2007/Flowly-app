import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, Target, Flame, Calendar, TrendingUp, TrendingDown, Award, ArrowRight, ArrowUpRight, ArrowDownRight, Zap, BarChart3, Plus, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import XpLevelBar from '../components/XpLevelBar';

// Mini sparkline chart (like YouTube Studio)
function Sparkline({ data, color = '#3b82f6', height = 40 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 100;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 4)}`).join(' ');
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${height} ${points} ${w},${height}`} fill={`${color}15`} stroke="none" />
    </svg>
  );
}

// Stat card with trend
function StatCard({ icon: Icon, iconColor, iconBg, value, label, sub, trend, trendUp, onClick }) {
  return (
    <div className="card cursor-pointer hover:ring-2 hover:ring-blue-400/30 active:scale-[0.98] transition-all" onClick={onClick} style={{ padding: '1rem' }}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={17} className={iconColor} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${trendUp ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
            {trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {trend}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {sub && <p className="text-[9px] mt-1" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
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
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
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
  const totalHabits = habits.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  // Weekly data for sparklines (simulated from real data)
  const weeklyTaskData = useMemo(() => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(d => tasks.filter(t => t.day === d && t.completed).length);
  }, [tasks]);

  const weeklyHabitData = useMemo(() => {
    return habits.map(h => h.streak || 0).slice(0, 7);
  }, [habits]);

  const goalProgress = useMemo(() => {
    return goals.length > 0 ? Math.round(goals.reduce((a, g) => a + (g.progress || 0), 0) / goals.length) : 0;
  }, [goals]);

  // Trend calculation
  const totalCompleted = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;
  const habitRate = totalHabits > 0 ? Math.round((habitsToday / totalHabits) * 100) : 0;

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  const userName = currentUser?.name || 'User';
  const dayNames = { uz: ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'], ru: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'], en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] };
  const monthNames = { uz: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr'], ru: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'], en: ['January','February','March','April','May','June','July','August','September','October','November','December'] };
  const dayName = dayNames[lang]?.[tashkentTime.getDay()];
  const dateStr = `${tashkentTime.getDate()} ${monthNames[lang]?.[tashkentTime.getMonth()]}`;
  const hour = tashkentTime.getHours();
  const greeting = hour < 6 ? (lang === 'ru' ? 'Доброй ночи' : lang === 'en' ? 'Good night' : 'Hayrli tun') : hour < 12 ? (lang === 'ru' ? 'Доброе утро' : lang === 'en' ? 'Good morning' : 'Hayrli tong') : hour < 18 ? (lang === 'ru' ? 'Добрый день' : lang === 'en' ? 'Good afternoon' : 'Hayrli kun') : (lang === 'ru' ? 'Добрый вечер' : lang === 'en' ? 'Good evening' : 'Hayrli kech');

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Top Bar — YouTube Studio style */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{greeting} 👋</p>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{userName}</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{dayName}, {dateStr} • {timeStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <XpLevelBar />
        </div>
      </div>

      {/* KPI Cards — like YouTube Studio overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard icon={Activity} iconColor="text-blue-500" iconBg="bg-blue-500/10"
          value={lifeScore} label="Life Score" sub={lifeScore >= 70 ? '🟢 Ajoyib' : lifeScore >= 40 ? '🟡 O\'rtacha' : '🔴 Yaxshilang'}
          trend={todayPercent > 50 ? 12 : -5} trendUp={todayPercent > 50}
          onClick={() => navigate('/analysis')} />
        <StatCard icon={CheckCircle2} iconColor="text-green-500" iconBg="bg-green-500/10"
          value={`${completedToday}/${totalToday}`} label={lang === 'ru' ? 'Сегодня' : lang === 'en' ? 'Today' : 'Bugun'}
          sub={`${completionRate}% ${lang === 'ru' ? 'общая' : 'umumiy'}`}
          trend={completionRate} trendUp={completionRate >= 50}
          onClick={() => navigate('/plans')} />
        <StatCard icon={Flame} iconColor="text-orange-500" iconBg="bg-orange-500/10"
          value={maxStreak} label={lang === 'ru' ? 'Max Streak' : 'Max Streak'}
          sub={`${habitsToday}/${totalHabits} ${lang === 'ru' ? 'сегодня' : 'bugun'}`}
          trend={habitRate} trendUp={habitRate >= 50}
          onClick={() => navigate('/health')} />
        <StatCard icon={Target} iconColor="text-purple-500" iconBg="bg-purple-500/10"
          value={`${goalProgress}%`} label={lang === 'ru' ? 'Цели' : lang === 'en' ? 'Goals' : 'Maqsadlar'}
          sub={`${goals.length} ta`}
          trend={goalProgress} trendUp={goalProgress >= 30}
          onClick={() => navigate('/goals')} />
        <StatCard icon={Award} iconColor="text-yellow-500" iconBg="bg-yellow-500/10"
          value={currentUser?.points || 0} label={lang === 'ru' ? 'Баллы' : lang === 'en' ? 'Points' : 'Ball'}
          sub={`🏆 ${unlockedAchievements} yutuq`}
          onClick={() => navigate('/motivation')} />
      </div>

      {/* Charts Row — YouTube Studio style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Tasks Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {lang === 'ru' ? 'Задачи за неделю' : lang === 'en' ? 'Weekly Tasks' : 'Haftalik vazifalar'}
            </h3>
            <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{totalCompleted}</span>
          </div>
          <Sparkline data={weeklyTaskData} color="#3b82f6" height={50} />
          <div className="flex justify-between mt-2">
            {['D','S','Ch','P','J','Sh','Y'].map((d, i) => (
              <span key={i} className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>{d}</span>
            ))}
          </div>
        </div>

        {/* Habits Streaks Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {lang === 'ru' ? 'Серии привычек' : lang === 'en' ? 'Habit Streaks' : 'Odat streak\'lari'}
            </h3>
            <span className="text-xs font-bold text-orange-500">🔥 {maxStreak}</span>
          </div>
          <Sparkline data={weeklyHabitData.length > 1 ? weeklyHabitData : [0, 1, 2, 1, 3, 2, 4]} color="#f97316" height={50} />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{totalHabits} {lang === 'ru' ? 'привычек' : 'odat'}</span>
            <span className="text-[9px]" style={{ color: habitRate >= 70 ? '#22c55e' : 'var(--text-secondary)' }}>{habitRate}% {lang === 'ru' ? 'сегодня' : 'bugun'}</span>
          </div>
        </div>

        {/* Life Score / Goals Progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {lang === 'ru' ? 'Прогресс целей' : lang === 'en' ? 'Goals Progress' : 'Maqsadlar'}
            </h3>
            <span className="text-xs font-bold text-purple-500">{goalProgress}%</span>
          </div>
          {goals.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Нет целей' : "Maqsad yo'q"}</p>
              <button onClick={() => navigate('/goals')} className="text-[10px] mt-1 font-medium" style={{ color: 'var(--accent)' }}>+ {lang === 'ru' ? 'Добавить' : "Qo'shish"}</button>
            </div>
          ) : (
            <div className="space-y-2">
              {goals.slice(0, 4).map(g => (
                <div key={g.id} className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-2 rounded-full bg-purple-500 transition-all" style={{ width: `${g.progress || 0}%` }} />
                  </div>
                  <span className="text-[9px] font-bold w-8 text-right" style={{ color: 'var(--text-secondary)' }}>{g.progress || 0}%</span>
                </div>
              ))}
              <p className="text-[9px] text-right" style={{ color: 'var(--text-secondary)' }}>{goals.length} {lang === 'ru' ? 'целей' : 'maqsad'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Today's Tasks */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: 'var(--accent)' }} />
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {lang === 'ru' ? 'Задачи на сегодня' : lang === 'en' ? "Today's Tasks" : 'Bugungi vazifalar'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{totalToday}</span>
            </div>
            <button onClick={() => navigate('/plans')} className="text-xs font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ color: 'var(--accent)' }}>
              {lang === 'ru' ? 'Все' : 'Barchasi'} <ArrowRight size={12} />
            </button>
          </div>

          {todayTasks.length === 0 ? (
            <div className="text-center py-10">
              <Plus size={32} className="text-blue-300 mx-auto mb-2" />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Пусто — добавьте задачу' : "Bo'sh — vazifa qo'shing"}</p>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                {todayTasks.slice(0, 6).map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
                      {task.completed && <CheckCircle2 size={10} className="text-white" />}
                    </div>
                    <p className={`text-sm flex-1 truncate ${task.completed ? 'line-through opacity-40' : ''}`} style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                    {task.time && <span className="text-[9px] px-1.5 py-0.5 rounded-md" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>{task.time}</span>}
                    {task.priority === 'high' && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>}
                  </div>
                ))}
              </div>
              {/* Progress */}
              <div className="mt-4 pt-3 border-t flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${todayPercent}%`, background: todayPercent >= 70 ? '#22c55e' : todayPercent >= 40 ? '#eab308' : '#ef4444' }} />
                </div>
                <span className="text-xs font-bold" style={{ color: todayPercent >= 70 ? '#22c55e' : 'var(--accent)' }}>{todayPercent}%</span>
              </div>
            </>
          )}
        </div>

        {/* Right: Events + Quick */}
        <div className="lg:col-span-2 space-y-4">
          {/* Upcoming */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={15} style={{ color: 'var(--accent)' }} />
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {lang === 'ru' ? 'Ближайшие' : lang === 'en' ? 'Upcoming' : 'Yaqinda'}
              </h3>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-center py-3" style={{ color: 'var(--text-secondary)' }}>—</p>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.slice(0, 3).map(ev => (
                  <div key={ev.id} className="flex items-center gap-2.5 p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                    <span className="text-lg">{ev.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{ev.title}</p>
                      <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{ev.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding: '0.75rem' }}>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { icon: Plus, label: lang === 'ru' ? 'Задача' : 'Vazifa', color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/plans' },
                { icon: Target, label: lang === 'ru' ? 'Цель' : 'Maqsad', color: 'text-green-500', bg: 'bg-green-500/10', path: '/goals' },
                { icon: BarChart3, label: lang === 'ru' ? 'Статы' : 'Tahlil', color: 'text-purple-500', bg: 'bg-purple-500/10', path: '/analysis' },
                { icon: Zap, label: lang === 'ru' ? 'Фокус' : 'Fokus', color: 'text-orange-500', bg: 'bg-orange-500/10', path: '/focus' },
              ].map((a, i) => (
                <button key={i} onClick={() => navigate(a.path)} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95" style={{ background: 'var(--bg-secondary)' }}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.bg}`}><a.icon size={15} className={a.color} /></div>
                  <span className="text-[9px] font-medium" style={{ color: 'var(--text-secondary)' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Streaks mini */}
          {habits.filter(h => h.streak > 0).length > 0 && (
            <div className="card" style={{ padding: '0.75rem 1rem' }}>
              <div className="flex items-center gap-2 mb-2">
                <Flame size={14} className="text-orange-500" />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Streak'lar</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {habits.filter(h => h.streak > 0).slice(0, 5).map(h => (
                  <span key={h.id} className="text-[9px] px-2 py-1 rounded-lg font-medium" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    {h.icon} {h.streak}d
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
