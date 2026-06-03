import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  const { tasks, habits, goals, calculateLifeScore } = useApp();
  const lifeScore = calculateLifeScore();

  const weeklyData = [
    { day: 'Dush', completed: 5, total: 7 },
    { day: 'Sesh', completed: 3, total: 5 },
    { day: 'Chor', completed: 4, total: 6 },
    { day: 'Pay', completed: 2, total: 4 },
    { day: 'Jum', completed: 6, total: 7 },
    { day: 'Shan', completed: 3, total: 4 },
    { day: 'Yak', completed: 1, total: 2 },
  ];

  const monthlyData = [
    { week: '1-hafta', score: 72 },
    { week: '2-hafta', score: 78 },
    { week: '3-hafta', score: 85 },
    { week: '4-hafta', score: lifeScore },
  ];

  const habitData = habits.map(h => ({
    name: h.name,
    streak: h.streak,
    icon: h.icon,
  }));

  const goalData = goals.map(g => ({
    name: g.title.substring(0, 20) + '...',
    progress: g.progress,
  }));

  const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];

  const pieData = [
    { name: 'Bajarildi', value: tasks.filter(t => t.completed).length },
    { name: 'Qoldi', value: tasks.filter(t => !t.completed).length },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Statistikalar va hisobotlar</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{lifeScore}%</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Life Score</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-500">{tasks.filter(t => t.completed).length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Bajarilgan vazifalar</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-orange-500">{habits.reduce((a, h) => a + h.streak, 0)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Jami streak kunlar</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-purple-500">{Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)}%</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Maqsadlar progressi</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Tasks */}
        <div className="card">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Haftalik vazifalar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Bajarildi" />
              <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Jami" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Progress */}
        <div className="card">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Oylik Life Score</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} name="Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Task Distribution */}
        <div className="card">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Vazifalar holati</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Goals Progress */}
        <div className="card">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Maqsadlar progressi</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={goalData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="progress" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Progress" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Habit Streaks */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Odat streak'lari</h3>
        <div className="space-y-3">
          {habitData.map((habit, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-lg w-8">{habit.icon}</span>
              <span className="text-sm font-medium w-28" style={{ color: 'var(--text-primary)' }}>{habit.name}</span>
              <div className="flex-1 h-3 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(habit.streak * 2, 100)}%`, background: COLORS[idx % COLORS.length] }}></div>
              </div>
              <span className="text-sm font-bold" style={{ color: COLORS[idx % COLORS.length] }}>{habit.streak} kun</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
