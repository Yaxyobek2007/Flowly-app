import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Flame, Edit2, Trash2, Save, X } from 'lucide-react';

const ICONS = ['💪','📚','🇬🇧','📈','⏰','🧘','💻','🏃','💧','🎯','🎨','🎵','✍️','🧠','🌱','🏋️','🚴','🧹','📝','😴'];

export default function HabitTracker() {
  const { habits, toggleHabit, addHabit, editHabit, deleteHabit } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', icon: '✅', dailyTarget: 1 });
  const [customIcon, setCustomIcon] = useState('');

  const handleSubmit = () => {
    if (!form.name) return;
    const icon = customIcon || form.icon;
    if (editId) {
      editHabit(editId, { name: form.name, icon, dailyTarget: form.dailyTarget });
      setEditId(null);
    } else {
      addHabit({ name: form.name, icon, dailyTarget: form.dailyTarget });
    }
    setForm({ name: '', icon: '✅', dailyTarget: 1 });
    setCustomIcon('');
    setShowForm(false);
  };

  const handleEdit = (habit) => {
    setForm({ name: habit.name, icon: habit.icon, dailyTarget: habit.dailyTarget || 1 });
    setEditId(habit.id);
    setShowForm(true);
  };

  const completedToday = habits.filter(h => h.todayDone).length;
  const totalHabits = habits.length;

  // Monthly view data (simulated for current month)
  const daysInMonth = 30;
  const today = new Date().getDate();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Habit Tracker</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Odatlarni nazorat qilish — Oylik ko'rinish</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', icon: '✅', dailyTarget: 1 }); setCustomIcon(''); }}>
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
          <p className="text-3xl font-bold text-orange-500">{Math.max(...habits.map(h => h.streak), 0)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Eng uzun streak</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-500">{totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0}%</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Bugungi foiz</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{editId ? 'Tahrirlash' : 'Yangi odat'}</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <input type="text" placeholder="Odat nomi" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="flex-1 px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              <input type="number" placeholder="Kunlik maqsad" value={form.dailyTarget} min={1} max={10}
                onChange={e => setForm({...form, dailyTarget: parseInt(e.target.value) || 1})}
                className="w-24 px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 text-center"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Icon tanlang yoki o'zingiz yozing:</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {ICONS.map(icon => (
                  <button key={icon} onClick={() => { setForm({...form, icon}); setCustomIcon(''); }}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${form.icon === icon && !customIcon ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    style={{ background: form.icon === icon && !customIcon ? undefined : 'var(--bg-secondary)' }}>
                    {icon}
                  </button>
                ))}
              </div>
              <input type="text" placeholder="Yoki o'z emoji/rasm URL kiriting" value={customIcon}
                onChange={e => setCustomIcon(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary flex items-center gap-1" onClick={handleSubmit}><Save size={16} /> {editId ? 'Saqlash' : 'Qo\'shish'}</button>
            <button className="px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => { setShowForm(false); setEditId(null); }}>Bekor</button>
          </div>
        </div>
      )}

      {/* Habits Grid with Monthly View */}
      <div className="space-y-4">
        {habits.map((habit, idx) => (
          <div key={habit.id} className="card animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                habit.todayDone ? 'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-500' : 'bg-gray-100 dark:bg-gray-800'
              }`} onClick={() => toggleHabit(habit.id)}>
                {habit.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{habit.name}</h3>
                <div className="flex items-center gap-2">
                  <Flame size={14} className="text-orange-500" />
                  <span className="text-sm font-medium text-orange-500">{habit.streak} kun</span>
                  {habit.dailyTarget > 1 && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{habit.dailyTarget}x/kun</span>}
                </div>
              </div>
              <button onClick={() => toggleHabit(habit.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${habit.todayDone ? 'bg-green-500' : 'border-2 border-gray-300'}`}>
                {habit.todayDone && <span className="text-white text-sm">✓</span>}
              </button>
              <button onClick={() => handleEdit(habit)} className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <Edit2 size={15} className="text-blue-500" />
              </button>
              <button onClick={() => deleteHabit(habit.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 size={15} className="text-red-400" />
              </button>
            </div>
            {/* Mini monthly calendar */}
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const done = habit.completedDays.includes(day);
                const isFuture = day > today;
                return (
                  <div key={day} className={`w-5 h-5 rounded text-[9px] flex items-center justify-center font-medium ${
                    isFuture ? 'opacity-30' : done ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`} style={{ color: done ? undefined : 'var(--text-secondary)' }} title={`Kun ${day}`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
