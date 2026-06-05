import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Repeat, CheckCircle2 } from 'lucide-react';
import DevBadge from '../components/DevBadge';

const dayKeys = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

export default function RecurringTasks() {
  const { language, t } = useAuth();
  const { addTask } = useApp();
  const lang = language || 'uz';
  const dayLabels = lang === 'ru' ? ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'] : lang === 'en' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : ['Du','Se','Ch','Pa','Ju','Sh','Ya'];
  const [recurring, setRecurring] = useState(() => { const s = localStorage.getItem('flowly-recurring'); return s ? JSON.parse(s) : []; });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', time: '', days: [], category: 'personal' });

  useEffect(() => { localStorage.setItem('flowly-recurring', JSON.stringify(recurring)); }, [recurring]);

  // Generate tasks for selected days
  const handleAdd = () => {
    if (!form.title || !form.time || form.days.length === 0) return;
    const newRecurring = { id: Date.now(), ...form };
    setRecurring(prev => [...prev, newRecurring]);
    // Add task for each selected day
    form.days.forEach(day => { addTask({ title: form.title, time: form.time, priority: 'medium', day, category: form.category, completed: false }); });
    setForm({ title: '', time: '', days: [], category: 'personal' });
    setShowForm(false);
  };

  const toggleDay = (day) => { setForm(f => ({ ...f, days: f.days.includes(day) ? f.days.filter(d => d !== day) : [...f.days, day] })); };
  const deleteRecurring = (id) => { setRecurring(recurring.filter(r => r.id !== id)); };

  const L = {
    title: lang==='ru'?'Повторяющиеся задачи':lang==='en'?'Recurring Tasks':'Takrorlanuvchi vazifalar',
    desc: lang==='ru'?'Одна задача — автоматически на несколько дней':lang==='en'?'One task — automatically on multiple days':'Bitta vazifa — avtomatik bir necha kunga',
    add: lang==='ru'?'Новая':lang==='en'?'New':'Yangi',
    name: lang==='ru'?'Название':lang==='en'?'Task name':'Vazifa nomi',
    selectDays: lang==='ru'?'Выберите дни:':lang==='en'?'Select days:':'Kunlarni tanlang:',
    empty: lang==='ru'?'Нет повторяющихся задач':lang==='en'?'No recurring tasks':'Takrorlanuvchi vazifa yo\'q',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>🔄 {L.title}</h1><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.desc}</p></div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}><Plus size={18} />{L.add}</button>
      </div>

      {showForm && (
        <div className="card animate-in space-y-4" style={{ borderColor: 'var(--accent)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder={L.name} value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{L.selectDays}</p>
            <div className="flex gap-2">{dayKeys.map((day, i) => (
              <button key={day} onClick={() => toggleDay(day)} className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${form.days.includes(day) ? 'bg-blue-500 text-white shadow-lg scale-105' : ''}`} style={!form.days.includes(day) ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>{dayLabels[i]}</button>
            ))}</div>
          </div>
          <button className="btn-primary w-full" onClick={handleAdd}>{t('add')}</button>
        </div>
      )}

      {recurring.length === 0 && !showForm && <div className="card text-center py-12"><Repeat size={48} className="text-blue-300 mx-auto mb-4" /><p style={{ color: 'var(--text-secondary)' }}>{L.empty}</p></div>}

      <div className="space-y-3">{recurring.map((r, idx) => (
        <div key={r.id} className="card flex items-center gap-4 animate-in" style={{ animationDelay: `${idx*50}ms` }}>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"><Repeat size={20} className="text-blue-500" /></div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.title}</h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{r.time} • {r.days.map((d,i) => dayLabels[dayKeys.indexOf(d)]).join(', ')}</p>
          </div>
          <button onClick={() => deleteRecurring(r.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={15} className="text-red-400" /></button>
        </div>
      ))}</div>
    </div>
  );
}
