import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle } from 'lucide-react';

export default function Analytics() {
  const { tasks, habits, goals, calculateLifeScore } = useApp();
  const lifeScore = calculateLifeScore();

  const completedTasks = tasks.filter(t => t.completed);
  const failedTasks = tasks.filter(t => !t.completed);

  const weeklyData = [
    { day: 'Dush', completed: tasks.filter(t => t.day === 'monday' && t.completed).length, total: tasks.filter(t => t.day === 'monday').length },
    { day: 'Sesh', completed: tasks.filter(t => t.day === 'tuesday' && t.completed).length, total: tasks.filter(t => t.day === 'tuesday').length },
    { day: 'Chor', completed: tasks.filter(t => t.day === 'wednesday' && t.completed).length, total: tasks.filter(t => t.day === 'wednesday').length },
    { day: 'Pay', completed: tasks.filter(t => t.day === 'thursday' && t.completed).length, total: tasks.filter(t => t.day === 'thursday').length },
    { day: 'Jum', completed: tasks.filter(t => t.day === 'friday' && t.completed).length, total: tasks.filter(t => t.day === 'friday').length },
    { day: 'Shan', completed: tasks.filter(t => t.day === 'saturday' && t.completed).length, total: tasks.filter(t => t.day === 'saturday').length },
    { day: 'Yak', completed: tasks.filter(t => t.day === 'sunday' && t.completed).length, total: tasks.filter(t => t.day === 'sunday').length },
  ];

  const monthlyData = [
    { week: '1-hafta', score: 72 }, { week: '2-hafta', score: 78 }, { week: '3-hafta', score: 85 }, { week: '4-hafta', score: lifeScore },
  ];

  const goalData = goals.map(g => ({ name: g.title.length > 18 ? g.title.substring(0, 18) + '...' : g.title, progress: g.progress }));
  const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];

  const pieData = [
    { name: 'Bajarildi', value: completedTasks.length },
    { name: 'Bajarilmadi', value: failedTasks.length },
  ];

  // Category breakdown
  const categories = ['personal', 'education', 'health', 'work', 'finance'];
  const categoryData = categories.map(cat => ({
    category: cat,
    completed: tasks.filter(t => t.category === cat && t.completed).length,
    failed: tasks.filter(t => t.category === cat && !t.completed).length,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Statistikalar va hisobotlar</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{lifeScore}%</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Life Score</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-500">{completedTasks.length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Bajarilgan</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-red-500">{failedTasks.length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Bajarilmagan</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-orange-500">{habits.reduce((a, h) => a + h.streak, 0)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Jami streak</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-500">{goals.length > 0 ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0}%</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Maqsadlar</p>
        </div>
      </div>

      {/* Failed Tasks Warning */}
      {failedTasks.length > 0 && (
        <div className="card flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
          <AlertTriangle size={20} className="text-red-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-600 dark:text-red-400">Bajarilmagan vazifalar: {failedTasks.length} ta</h4>
            <div className="mt-2 space-y-1">
              {failedTasks.slice(0, 5).map(t => (
                <p key={t.id} className="text-sm" style={{ color: 'var(--text-secondary)' }}>• {t.title} ({t.day}, {t.time})</p>
              ))}
              {failedTasks.length > 5 && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>va yana {failedTasks.length - 5} ta...</p>}
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Haftalik vazifalar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} name="Bajarildi" />
              <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Jami" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Oylik Life Score</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Vazifalar holati</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                <Cell fill="#22c55e" /><Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Maqsadlar progressi</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={goalData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="progress" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Habit Streaks */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Odat streak'lari</h3>
        <div className="space-y-3">
          {habits.map((habit, idx) => (
            <div key={habit.id} className="flex items-center gap-3">
              <span className="text-lg w-8">{habit.icon}</span>
              <span className="text-sm font-medium w-28 truncate" style={{ color: 'var(--text-primary)' }}>{habit.name}</span>
              <div className="flex-1 h-3 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-3 rounded-full transition-all" style={{ width: `${Math.min(habit.streak * 2, 100)}%`, background: COLORS[idx % COLORS.length] }}></div>
              </div>
              <span className="text-sm font-bold" style={{ color: COLORS[idx % COLORS.length] }}>{habit.streak} kun</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
