import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Flame } from 'lucide-react';

export default function HabitTracker() {
  const { habits, toggleHabit, addHabit } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', icon: '✅' });

  const handleAdd = () => {
    if (newHabit.name) {
      addHabit(newHabit);
      setNewHabit({ name: '', icon: '✅' });
      setShowForm(false);
    }
  };

  const completedToday = habits.filter(h => h.todayDone).length;
  const totalHabits = habits.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Habit Tracker</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Odatlarni nazorat qilish</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Yangi odat
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{completedToday}/{totalHabits}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Bugun bajarildi</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-orange-500">{Math.max(...habits.map(h => h.streak))}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Eng uzun streak</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-500">{Math.round((completedToday / totalHabits) * 100)}%</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Bugungi foiz</p>
        </div>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Bugungi progress</span>
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{Math.round((completedToday / totalHabits) * 100)}%</span>
        </div>
        <div className="w-full h-3 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
          <div className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
            style={{ width: `${(completedToday / totalHabits) * 100}%` }}></div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Yangi odat qo'shish</h3>
          <div className="flex gap-3">
            <select value={newHabit.icon} onChange={e => setNewHabit({...newHabit, icon: e.target.value})}
              className="px-3 py-2 rounded-lg border text-xl"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              <option value="✅">✅</option>
              <option value="💪">💪</option>
              <option value="📚">📚</option>
              <option value="🇬🇧">🇬🇧</option>
              <option value="📈">📈</option>
              <option value="⏰">⏰</option>
              <option value="🧘">🧘</option>
              <option value="💻">💻</option>
              <option value="🏃">🏃</option>
              <option value="💧">💧</option>
            </select>
            <input type="text" placeholder="Odat nomi" value={newHabit.name}
              onChange={e => setNewHabit({...newHabit, name: e.target.value})}
              className="flex-1 px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <button className="btn-primary" onClick={handleAdd}>Qo'shish</button>
          </div>
        </div>
      )}

      {/* Habits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {habits.map((habit, idx) => (
          <div key={habit.id} className="card flex items-center gap-4 animate-in cursor-pointer"
            style={{ animationDelay: `${idx * 50}ms` }}
            onClick={() => toggleHabit(habit.id)}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${
              habit.todayDone ? 'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-500' : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              {habit.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{habit.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Flame size={14} className="text-orange-500" />
                <span className="text-sm font-medium text-orange-500">{habit.streak} kun</span>
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              habit.todayDone ? 'bg-green-500' : 'border-2 border-gray-300'
            }`}>
              {habit.todayDone && <span className="text-white text-sm">✓</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
