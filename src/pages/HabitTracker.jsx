import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Flame, Edit2, Trash2, Save, X } from 'lucide-react';

const ICONS = ['💪','📚','🇺🇸','📈','⏰','🧘','💻','🏃','💧','🎯','🎨','🎵','✍️','🧠','🌱','🏋️','🚴','🧹','📝','😴'];

export default function HabitTracker() {
  const { habits, toggleHabit, addHabit, editHabit, deleteHabit } = useApp();
  const { t } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', icon: '✅', dailyTarget: 1 });
  const [customIcon, setCustomIcon] = useState('');
  const [hoveredHabit, setHoveredHabit] = useState(null);

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

  const daysInMonth = 30;
  const today = new Date().getDate();

  // Calculate streak percentage (streak / 30 days target * 100)
  const getStreakPercent = (streak) => Math.min(Math.round((streak / 30) * 100), 100);
  const getStreakColor = (percent) => {
    if (percent >= 80) return { bar: '#22c55e', text: 'text-green-500', bg: 'bg-green-500' };
    if (percent >= 50) return { bar: '#eab308', text: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { bar: '#ef4444', text: 'text-red-500', bg: 'bg-red-500' };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('habitTracker')}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('monthlyView')}</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', icon: '✅', dailyTarget: 1 }); setCustomIcon(''); }}>
          <Plus size={18} /> {t('newHabit')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{completedToday}/{totalHabits}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{t('completedToday')}</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-orange-500">{Math.max(...habits.map(h => h.streak), 0)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{t('longestStreak')}</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-500">{totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0}%</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{t('todayPercent')}</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{editId ? t('edit') : t('newHabit')}</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <input type="text" placeholder={t('habitName')} value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="flex-1 px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              <input type="number" placeholder={t('dailyTarget')} value={form.dailyTarget} min={1} max={10}
                onChange={e => setForm({...form, dailyTarget: parseInt(e.target.value) || 1})}
                className="w-24 px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 text-center"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{t('selectIcon')}:</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {ICONS.map(icon => (
                  <button key={icon} onClick={() => { setForm({...form, icon}); setCustomIcon(''); }}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${form.icon === icon && !customIcon ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    style={{ background: form.icon === icon && !customIcon ? undefined : 'var(--bg-secondary)' }}>
                    {icon}
                  </button>
                ))}
              </div>
              <input type="text" placeholder={t('customIcon')} value={customIcon}
                onChange={e => setCustomIcon(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary flex items-center gap-1" onClick={handleSubmit}><Save size={16} /> {editId ? t('save') : t('add')}</button>
            <button className="px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => { setShowForm(false); setEditId(null); }}>{t('cancel')}</button>
          </div>
        </div>
      )}

      {/* Habits with streak progress bars */}
      {habits.length === 0 && !showForm && (
        <div className="card text-center py-12">
          <Flame size={40} className="text-orange-300 mx-auto mb-3" />
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {t('newHabit')}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Kunlik odatlar qo'shing — streak'lar motivatsiya beradi!
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4">
            <Plus size={16} className="inline mr-1" /> {t('add')}
          </button>
        </div>
      )}
      <div className="space-y-4">
        {habits.map((habit, idx) => {
          const percent = getStreakPercent(habit.streak);
          const colors = getStreakColor(percent);
          const isHovered = hoveredHabit === habit.id;

          return (
            <div key={habit.id} className="card animate-in" style={{ animationDelay: `${idx * 50}ms` }}
              onMouseEnter={() => setHoveredHabit(habit.id)}
              onMouseLeave={() => setHoveredHabit(null)}>
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

                {/* Today checkmark - 1 ptichka = 1 kun */}
                <button onClick={() => toggleHabit(habit.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${habit.todayDone ? 'bg-green-500' : 'border-2 border-gray-300'}`}
                  title={habit.todayDone ? '✓ Bugun bajarildi' : 'Bosing = 1 kun'}>
                  {habit.todayDone && <span className="text-white text-sm">✓</span>}
                </button>
                <button onClick={() => handleEdit(habit)} className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Edit2 size={15} className="text-blue-500" />
                </button>
                <button onClick={() => deleteHabit(habit.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 size={15} className="text-red-400" />
                </button>
              </div>

              {/* Streak progress bar with hover percentage */}
              <div className="relative mb-3">
                <div className="w-full h-3 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, background: colors.bar }}></div>
                </div>
                {/* Percentage tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg shadow-lg text-xs font-bold text-white animate-in"
                    style={{ background: colors.bar }}>
                    {percent}%
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" style={{ background: colors.bar }}></div>
                  </div>
                )}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>0</span>
                  <span className={`text-[10px] font-bold ${colors.text}`}>{percent}% ({habit.streak}/30 kun)</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>30</span>
                </div>
              </div>

              {/* Mini monthly calendar - each day = 1 ptichka */}
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const done = habit.completedDays.includes(day);
                  const isFuture = day > today;
                  return (
                    <div key={day} className={`w-5 h-5 rounded text-[9px] flex items-center justify-center font-medium transition-all ${
                      isFuture ? 'opacity-30' : done ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                    }`} style={{ color: done ? undefined : 'var(--text-secondary)' }}
                      title={`${day}-kun: ${done ? '✓' : '✗'}`}>
                      {done ? '✓' : day}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
