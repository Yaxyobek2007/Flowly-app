import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, CheckCircle2, XCircle, Flame, Target, Calendar, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_SHORT = { uz: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'], ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] };

function MetricCard({ label, value, sub, icon: Icon, iconColor, trend, trendUp }) {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-opacity-10`} style={{ background: `${iconColor}15` }}>
          <Icon size={16} style={{ color: iconColor }} />
        </div>
        {trend !== undefined && (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${trendUp ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
            {trendUp ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />} {trend}%
          </span>
        )}
      </div>
      <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {sub && <p className="text-[9px] mt-1 font-medium" style={{ color: iconColor }}>{sub}</p>}
    </div>
  );
}

export default function Analytics() {
  const { tasks, habits, goals, calculateLifeScore } = useApp();
  const { language } = useAuth();
  const lang = language || 'uz';
  const lifeScore = calculateLifeScore();

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const failedTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalStreaks = habits.reduce((a, h) => a + (h.streak || 0), 0);
  const maxStreak = Math.max(...habits.map(h => h.streak || 0), 0);
  const habitsToday = habits.filter(h => h.todayDone).length;
  const habitRate = habits.length > 0 ? Math.round((habitsToday / habits.length) * 100) : 0;

  const goalProgress = goals.length > 0 ? Math.round(goals.reduce((a, g) => a + (g.progress || 0), 0) / goals.length) : 0;
  const goalsCompleted = goals.filter(g => g.progress >= 100).length;

  // Weekly tasks chart data
  const weeklyData = useMemo(() => {
    return DAYS.map((d, i) => ({
      day: DAY_SHORT[lang]?.[i] || DAY_SHORT.uz[i],
      completed: tasks.filter(t => t.day === d && t.completed).length,
      failed: tasks.filter(t => t.day === d && !t.completed).length,
      total: tasks.filter(t => t.day === d).length,
    }));
  }, [tasks, lang]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const cats = ['personal', 'education', 'health', 'work', 'finance'];
    const catLabels = { uz: ['Shaxsiy', "Ta'lim", "Sog'liq", 'Ish', 'Moliya'], ru: ['Личное', 'Учёба', 'Здоровье', 'Работа', 'Финансы'], en: ['Personal', 'Education', 'Health', 'Work', 'Finance'] };
    return cats.map((c, i) => ({
      name: catLabels[lang]?.[i] || catLabels.uz[i],
      value: tasks.filter(t => t.category === c).length,
    })).filter(c => c.value > 0);
  }, [tasks, lang]);

  // Habit streaks sorted
  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => (b.streak || 0) - (a.streak || 0));
  }, [habits]);

  // Simulated monthly trend (from real life score)
  const monthlyTrend = useMemo(() => {
    const base = lifeScore;
    return [
      { w: '1', score: Math.max(0, base - 20 + Math.random() * 10) },
      { w: '2', score: Math.max(0, base - 10 + Math.random() * 10) },
      { w: '3', score: Math.max(0, base - 5 + Math.random() * 5) },
      { w: '4', score: base },
    ].map(d => ({ ...d, score: Math.round(d.score) }));
  }, [lifeScore]);

  const L = {
    title: lang === 'ru' ? 'Аналитика' : lang === 'en' ? 'Analytics' : 'Statistika',
    desc: lang === 'ru' ? 'Обзор вашей продуктивности' : lang === 'en' ? 'Your productivity overview' : 'Samaradorlik tahlili',
    lifeScore: 'Life Score',
    tasks: lang === 'ru' ? 'Задачи' : lang === 'en' ? 'Tasks' : 'Vazifalar',
    completed: lang === 'ru' ? 'Выполнено' : lang === 'en' ? 'Completed' : 'Bajarildi',
    failed: lang === 'ru' ? 'Не выполнено' : lang === 'en' ? 'Failed' : 'Bajarilmadi',
    streaks: lang === 'ru' ? 'Серии' : lang === 'en' ? 'Streaks' : 'Streak',
    goals: lang === 'ru' ? 'Цели' : lang === 'en' ? 'Goals' : 'Maqsadlar',
    weekly: lang === 'ru' ? 'Задачи за неделю' : lang === 'en' ? 'Weekly Tasks' : 'Haftalik vazifalar',
    monthly: lang === 'ru' ? 'Life Score (месяц)' : lang === 'en' ? 'Life Score (month)' : 'Life Score (oylik)',
    categories: lang === 'ru' ? 'По категориям' : lang === 'en' ? 'By Category' : 'Kategoriyalar',
    habitStreaks: lang === 'ru' ? 'Серии привычек' : lang === 'en' ? 'Habit Streaks' : 'Odat streak\'lari',
    goalsProgress: lang === 'ru' ? 'Прогресс целей' : lang === 'en' ? 'Goals Progress' : 'Maqsadlar progressi',
    days: lang === 'ru' ? 'дн' : lang === 'en' ? 'd' : 'kun',
    today: lang === 'ru' ? 'сегодня' : lang === 'en' ? 'today' : 'bugun',
    ofTotal: lang === 'ru' ? 'из' : lang === 'en' ? 'of' : 'dan',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{L.title}</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.desc}</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard icon={Activity} iconColor="#3b82f6" label={L.lifeScore} value={`${lifeScore}%`}
          sub={lifeScore >= 70 ? '● Ajoyib' : lifeScore >= 40 ? '● O\'rtacha' : '● Yaxshilang'}
          trend={lifeScore > 50 ? 8 : -12} trendUp={lifeScore > 50} />
        <MetricCard icon={CheckCircle2} iconColor="#22c55e" label={L.completed} value={completedTasks}
          sub={`${completionRate}% ${L.ofTotal} ${totalTasks}`}
          trend={completionRate} trendUp={completionRate >= 50} />
        <MetricCard icon={XCircle} iconColor="#ef4444" label={L.failed} value={failedTasks}
          sub={`${100 - completionRate}%`}
          trend={100 - completionRate} trendUp={false} />
        <MetricCard icon={Flame} iconColor="#f97316" label={L.streaks} value={totalStreaks}
          sub={`Max: ${maxStreak} ${L.days}`}
          trend={habitRate} trendUp={habitRate >= 50} />
        <MetricCard icon={Target} iconColor="#8b5cf6" label={L.goals} value={`${goalProgress}%`}
          sub={`${goalsCompleted}/${goals.length} ✓`}
          trend={goalProgress} trendUp={goalProgress >= 30} />
        <MetricCard icon={Calendar} iconColor="#06b6d4" label={L.today} value={`${habitsToday}/${habits.length}`}
          sub={`${habitRate}% ${L.today}`}
          trend={habitRate} trendUp={habitRate >= 50} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Bar Chart */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>{L.weekly}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} name={L.completed} />
              <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} name={L.failed} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Life Score Area */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>{L.monthly}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis dataKey="w" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fill="url(#scoreGradient)" dot={{ fill: '#3b82f6', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Categories Pie */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>{L.categories}</h3>
          {categoryData.length === 0 ? (
            <p className="text-center text-xs py-8" style={{ color: 'var(--text-secondary)' }}>—</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {categoryData.map((c, i) => (
              <span key={i} className="text-[9px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></span>
                {c.name}: {c.value}
              </span>
            ))}
          </div>
        </div>

        {/* Goals Progress */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>{L.goalsProgress}</h3>
          {goals.length === 0 ? (
            <p className="text-center text-xs py-8" style={{ color: 'var(--text-secondary)' }}>—</p>
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 6).map((g, i) => (
                <div key={g.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium truncate max-w-[70%]" style={{ color: 'var(--text-primary)' }}>{g.title}</span>
                    <span className="text-[10px] font-bold" style={{ color: COLORS[i % COLORS.length] }}>{g.progress || 0}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${g.progress || 0}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Habit Streaks */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>{L.habitStreaks}</h3>
          {sortedHabits.length === 0 ? (
            <p className="text-center text-xs py-8" style={{ color: 'var(--text-secondary)' }}>—</p>
          ) : (
            <div className="space-y-3">
              {sortedHabits.slice(0, 6).map((h, i) => (
                <div key={h.id} className="flex items-center gap-2">
                  <span className="text-base w-6">{h.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{h.name}</span>
                      <span className="text-[10px] font-bold" style={{ color: COLORS[i % COLORS.length] }}>🔥{h.streak || 0}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min((h.streak || 0) * 3, 100)}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
