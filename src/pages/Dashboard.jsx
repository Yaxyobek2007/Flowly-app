import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, Target, Flame, Calendar, Award, ArrowRight, Plus, Wallet, TrendingUp, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import XpLevelBar from '../components/XpLevelBar';

export default function Dashboard() {
  const { tasks, habits, goals, events, achievements, calculateLifeScore, addTask } = useApp();
  const { currentUser, language } = useAuth();
  const navigate = useNavigate();
  const lifeScore = calculateLifeScore();
  const lang = language || 'uz';
  const [quickTask, setQuickTask] = useState('');

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
  const maxStreak = Math.max(...habits.map(h => h.streak || 0), 0);
  const habitsToday = habits.filter(h => h.todayDone).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const userName = currentUser?.name || 'User';
  const dayNames = { uz: ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'], ru: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'], en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] };
  const monthNames = { uz: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr'], ru: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'], en: ['January','February','March','April','May','June','July','August','September','October','November','December'] };
  const dayName = dayNames[lang]?.[tashkentTime.getDay()];
  const dateStr = `${tashkentTime.getDate()} ${monthNames[lang]?.[tashkentTime.getMonth()]}`;
  const hour = tashkentTime.getHours();
  const greeting = hour < 6 ? (lang === 'ru' ? 'Доброй ночи' : lang === 'en' ? 'Good night' : 'Hayrli tun') : hour < 12 ? (lang === 'ru' ? 'Доброе утро' : lang === 'en' ? 'Good morning' : 'Hayrli tong') : hour < 18 ? (lang === 'ru' ? 'Добрый день' : lang === 'en' ? 'Good afternoon' : 'Hayrli kun') : (lang === 'ru' ? 'Добрый вечер' : lang === 'en' ? 'Good evening' : 'Hayrli kech');

  const goalProgress = goals.length > 0 ? Math.round(goals.reduce((a, g) => a + (g.progress || 0), 0) / goals.length) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{greeting} 👋</p>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{userName}</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{dayName}, {dateStr} • {timeStr}</p>
        </div>
        {/* Life Score ring */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="27" fill="none" stroke="var(--border)" strokeWidth="5" opacity="0.3" />
            <circle cx="32" cy="32" r="27" fill="none"
              stroke={lifeScore >= 70 ? '#22c55e' : lifeScore >= 40 ? '#eab308' : '#ef4444'}
              strokeWidth="5" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 27}`}
              strokeDashoffset={`${2 * Math.PI * 27 * (1 - lifeScore / 100)}`}
              transform="rotate(-90 32 32)" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{lifeScore}</span>
          </div>
        </div>
      </div>

      {/* XP Level */}
      <XpLevelBar />

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <button onClick={() => navigate('/plans')} className="card text-center active:scale-95 transition-all hover:ring-2 hover:ring-blue-400/30" style={{ padding: '0.75rem' }}>
          <CheckCircle2 size={18} className="text-blue-500 mx-auto mb-1" />
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{completedToday}/{totalToday}</p>
          <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Задачи' : 'Vazifalar'}</p>
        </button>
        <button onClick={() => navigate('/health')} className="card text-center active:scale-95 transition-all hover:ring-2 hover:ring-orange-400/30" style={{ padding: '0.75rem' }}>
          <Flame size={18} className="text-orange-500 mx-auto mb-1" />
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{maxStreak}</p>
          <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>Streak 🔥</p>
        </button>
        <button onClick={() => navigate('/goals')} className="card text-center active:scale-95 transition-all hover:ring-2 hover:ring-green-400/30" style={{ padding: '0.75rem' }}>
          <Target size={18} className="text-green-500 mx-auto mb-1" />
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{goalProgress}%</p>
          <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Цели' : 'Maqsadlar'}</p>
        </button>
        <button onClick={() => navigate('/motivation')} className="card text-center active:scale-95 transition-all hover:ring-2 hover:ring-purple-400/30" style={{ padding: '0.75rem' }}>
          <Award size={18} className="text-purple-500 mx-auto mb-1" />
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{currentUser?.points || 0}</p>
          <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>⭐ Ball</p>
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Today */}
        <div className="lg:col-span-3 space-y-4">
          {/* Today's Tasks */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={16} style={{ color: 'var(--accent)' }} />
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {lang === 'ru' ? 'Сегодня' : lang === 'en' ? 'Today' : 'Bugungi vazifalar'}
                </h3>
              </div>
              <button onClick={() => navigate('/plans')} className="text-[10px] font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ color: 'var(--accent)' }}>
                {lang === 'ru' ? 'Все' : 'Barchasi'} <ArrowRight size={10} />
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="text-center py-10">
                <Plus size={28} className="text-blue-300 mx-auto mb-2" />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Нет задач' : "Vazifa yo'q"}</p>
                <button onClick={() => navigate('/plans')} className="text-[10px] mt-2 font-medium" style={{ color: 'var(--accent)' }}>+ {lang === 'ru' ? 'Добавить' : "Qo'shish"}</button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {todayTasks.slice(0, 7).map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
                      {task.completed && <CheckCircle2 size={9} className="text-white" />}
                    </div>
                    <p className={`text-sm flex-1 truncate ${task.completed ? 'line-through opacity-40' : ''}`} style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                    {task.time && <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>{task.time}</span>}
                    {task.priority === 'high' && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>}
                  </div>
                ))}
              </div>
            )}

            {totalToday > 0 && (
              <div className="mt-3 pt-3 border-t flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${todayPercent}%`, background: todayPercent >= 70 ? '#22c55e' : todayPercent >= 40 ? '#eab308' : '#ef4444' }} />
                </div>
                <span className="text-[10px] font-bold" style={{ color: todayPercent >= 70 ? '#22c55e' : 'var(--accent)' }}>{todayPercent}%</span>
              </div>
            )}

            {/* Quick Add Task */}
            <div className="mt-3 pt-3 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
              <input type="text" value={quickTask} onChange={e => setQuickTask(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && quickTask.trim()) {
                    const timeStr2 = new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tashkent' });
                    addTask({ title: quickTask.trim(), time: timeStr2, priority: 'medium', day: todayKey, category: 'personal', completed: false });
                    setQuickTask('');
                    if ('vibrate' in navigator) navigator.vibrate(30);
                  }
                }}
                placeholder={lang === 'ru' ? '+ Быстрая задача...' : lang === 'en' ? '+ Quick task...' : "+ Tez vazifa qo'shish..."}
                className="flex-1 px-3 py-2 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-400"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              <button onClick={() => {
                if (quickTask.trim()) {
                  const timeStr2 = new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tashkent' });
                  addTask({ title: quickTask.trim(), time: timeStr2, priority: 'medium', day: todayKey, category: 'personal', completed: false });
                  setQuickTask('');
                  if ('vibrate' in navigator) navigator.vibrate(30);
                }
              }} className="p-2 rounded-xl bg-blue-500 text-white active:scale-90 transition-all" disabled={!quickTask.trim()}>
                <Send size={14} />
              </button>
            </div>
          </div>

          {/* Weekly Progress Mini Chart */}
          <div className="card" style={{ padding: '0.75rem 1rem' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                {lang === 'ru' ? 'Неделя' : 'Hafta'}
              </span>
              <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                {tasks.filter(t => t.completed).length}/{tasks.length} {lang === 'ru' ? 'задач' : 'vazifa'}
              </span>
            </div>
            <div className="flex items-end gap-1" style={{ height: '32px' }}>
              {['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map((day, i) => {
                const dayTasks = tasks.filter(t => t.day === day);
                const done = dayTasks.filter(t => t.completed).length;
                const total = dayTasks.length;
                const pct = total > 0 ? (done / total) * 100 : 0;
                const isToday = day === todayKey;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full rounded-sm transition-all" style={{
                      height: `${Math.max(pct * 0.28, 2)}px`,
                      background: isToday ? 'var(--accent)' : pct >= 100 ? '#22c55e' : pct > 0 ? '#3b82f680' : 'var(--border)',
                    }} />
                    <span className="text-[6px]" style={{ color: isToday ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      {['D','S','Ch','P','J','Sh','Y'][i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Habits */}
          {habits.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-orange-500" />
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {lang === 'ru' ? 'Привычки' : 'Odatlar'} ({habitsToday}/{habits.length})
                  </h3>
                </div>
                <button onClick={() => navigate('/health')} className="text-[10px] font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20" style={{ color: '#f97316' }}>
                  {lang === 'ru' ? 'Все' : 'Barchasi'} <ArrowRight size={10} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {habits.slice(0, 6).map(h => (
                  <div key={h.id} className={`flex items-center gap-2 p-2.5 rounded-xl ${h.todayDone ? 'ring-1 ring-green-500/30' : ''}`} style={{ background: 'var(--bg-secondary)' }}>
                    <span className="text-lg">{h.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{h.name}</p>
                      <p className="text-[9px]" style={{ color: h.todayDone ? '#22c55e' : 'var(--text-secondary)' }}>
                        {h.todayDone ? '✓' : '○'} {h.streak || 0}🔥
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Upcoming Events */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={15} style={{ color: 'var(--accent)' }} />
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {lang === 'ru' ? 'Ближайшие события' : lang === 'en' ? 'Upcoming' : 'Yaqinlashayotgan'}
              </h3>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'ru' ? 'Нет событий' : "Voqealar yo'q"}
              </p>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.map(ev => (
                  <div key={ev.id} className="flex items-center gap-2.5 p-2 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
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

          {/* Goals mini */}
          {goals.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target size={15} className="text-green-500" />
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {lang === 'ru' ? 'Цели' : 'Maqsadlar'}
                  </h3>
                </div>
                <button onClick={() => navigate('/goals')} className="text-[10px] font-medium" style={{ color: 'var(--accent)' }}><ArrowRight size={12} /></button>
              </div>
              <div className="space-y-2.5">
                {goals.slice(0, 4).map(g => (
                  <div key={g.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium truncate max-w-[75%]" style={{ color: 'var(--text-primary)' }}>{g.title}</span>
                      <span className="text-[9px] font-bold" style={{ color: g.progress >= 100 ? '#22c55e' : 'var(--accent)' }}>{g.progress || 0}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${g.progress || 0}%`, background: g.progress >= 100 ? '#22c55e' : g.progress >= 50 ? '#3b82f6' : '#eab308' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budget mini widget */}
          <BudgetWidget lang={lang} navigate={navigate} />

          {/* Quick navigation */}
          <div className="card" style={{ padding: '0.75rem' }}>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { icon: Plus, label: lang === 'ru' ? 'Задача' : 'Vazifa', color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/plans' },
                { icon: TrendingUp, label: lang === 'ru' ? 'Статы' : 'Tahlil', color: 'text-purple-500', bg: 'bg-purple-500/10', path: '/analysis' },
                { icon: Wallet, label: lang === 'ru' ? 'Финансы' : 'Moliya', color: 'text-emerald-500', bg: 'bg-emerald-500/10', path: '/finance' },
                { icon: Award, label: 'Premium', color: 'text-yellow-500', bg: 'bg-yellow-500/10', path: '/premium' },
              ].map((a, i) => (
                <button key={i} onClick={() => navigate(a.path)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all hover:scale-105 active:scale-95" style={{ background: 'var(--bg-secondary)' }}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.bg}`}><a.icon size={14} className={a.color} /></div>
                  <span className="text-[8px] font-medium" style={{ color: 'var(--text-secondary)' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// Budget mini-widget for Dashboard
function BudgetWidget({ lang, navigate }) {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.slice(0, 7);
  let budget = null;
  try { const s = localStorage.getItem(`flowly-budget-${currentMonth}`); budget = s ? JSON.parse(s) : null; } catch(e) {}
  
  if (!budget || !budget.salary) return null;

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - new Date().getDate();
  const totalIncome = budget.salary + (budget.extraIncome || 0);
  const fixed = (budget.fixed?.rent || 0) + (budget.fixed?.phone || 0) + (budget.fixed?.savings || 0);
  const spent = (budget.expenses || []).reduce((a, e) => a + (e.amount > 0 ? e.amount : 0), 0);
  const balance = totalIncome - fixed - spent;
  const dailyLimit = daysLeft > 0 ? Math.floor(balance / daysLeft) : 0;
  const pct = totalIncome > 0 ? Math.round(((totalIncome - balance) / totalIncome) * 100) : 0;
  const fmt = (n) => n >= 1000000 ? (n/1000000).toFixed(1) + 'M' : Math.round(n).toLocaleString('ru-RU');

  return (
    <div className="card cursor-pointer active:scale-[0.98] transition-all" onClick={() => navigate('/finance')} style={{ padding: '0.75rem 1rem' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Wallet size={14} className="text-emerald-500" />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Бюджет' : 'Budjet'}</span>
        </div>
        <span className="text-[9px] font-bold" style={{ color: balance > 0 ? '#22c55e' : '#ef4444' }}>{fmt(balance)} so'm</span>
      </div>
      <div className="h-1.5 rounded-full mb-1.5" style={{ background: 'var(--bg-secondary)' }}>
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: pct > 80 ? '#ef4444' : pct > 60 ? '#eab308' : '#22c55e' }} />
      </div>
      <div className="flex justify-between text-[8px]">
        <span style={{ color: 'var(--text-secondary)' }}>{pct}% ishlatildi</span>
        <span style={{ color: 'var(--accent)' }}>{fmt(dailyLimit)}/kun • {daysLeft}d</span>
      </div>
    </div>
  );
}
