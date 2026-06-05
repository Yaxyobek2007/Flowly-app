import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ClipboardList, Save, Star } from 'lucide-react';

export default function WeeklyReview() {
  const { language } = useAuth();
  const { tasks, habits, goals } = useApp();
  const lang = language || 'uz';
  const [reviews, setReviews] = useState(() => { const s = localStorage.getItem('flowly-reviews'); return s ? JSON.parse(s) : []; });
  const [form, setForm] = useState({ wins: '', lessons: '', nextWeek: '', rating: 3 });
  const thisWeek = new Date().toISOString().split('T')[0].slice(0, 10);
  const existingReview = reviews.find(r => r.week === thisWeek);
  useEffect(() => { localStorage.setItem('flowly-reviews', JSON.stringify(reviews)); }, [reviews]);
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const activeHabits = habits.filter(h => h.todayDone).length;
  const avgGoals = goals.length > 0 ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0;
  const saveReview = () => { if (!form.wins && !form.lessons) return; setReviews(prev => [{ id: Date.now(), week: thisWeek, date: new Date().toISOString(), ...form, stats: { completedTasks, totalTasks, activeHabits, totalHabits: habits.length, avgGoals } }, ...prev.filter(r => r.week !== thisWeek)]); };
  const L = { title: lang==='ru'?'Обзор недели':lang==='en'?'Weekly Review':'Haftalik sharh', wins: lang==='ru'?'Что получилось хорошо?':lang==='en'?'What went well?':'Nima yaxshi bo\'ldi?', lessons: lang==='ru'?'Что можно улучшить?':lang==='en'?'What to improve?':'Nimani yaxshilash kerak?', next: lang==='ru'?'Планы на следующую неделю':lang==='en'?'Plans for next week':'Keyingi hafta rejalari', rate: lang==='ru'?'Оценка недели':lang==='en'?'Rate this week':'Haftani baholang', save: lang==='ru'?'Сохранить':lang==='en'?'Save':'Saqlash', stats: lang==='ru'?'Статистика':lang==='en'?'Stats':'Statistika' };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>📋 {L.title}</h1></div>
      <div className="grid grid-cols-4 gap-3"><div className="card text-center py-3"><p className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{completedTasks}/{totalTasks}</p><p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{lang==='ru'?'Задач':lang==='en'?'Tasks':'Vazifa'}</p></div><div className="card text-center py-3"><p className="text-xl font-bold text-orange-500">{activeHabits}/{habits.length}</p><p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{lang==='ru'?'Привычек':lang==='en'?'Habits':'Odat'}</p></div><div className="card text-center py-3"><p className="text-xl font-bold text-green-500">{avgGoals}%</p><p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{lang==='ru'?'Цели':lang==='en'?'Goals':'Maqsad'}</p></div><div className="card text-center py-3"><p className="text-xl font-bold text-purple-500">{parseInt(localStorage.getItem('flowly-pomo-sessions')||'0')}</p><p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>Pomodoro</p></div></div>
      <div className="card space-y-4">
        <div><label className="text-sm font-medium block mb-1" style={{ color: 'var(--text-primary)' }}>✅ {L.wins}</label><textarea value={form.wins} onChange={e => setForm({...form, wins: e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-green-500 text-sm" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} /></div>
        <div><label className="text-sm font-medium block mb-1" style={{ color: 'var(--text-primary)' }}>📈 {L.lessons}</label><textarea value={form.lessons} onChange={e => setForm({...form, lessons: e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-yellow-500 text-sm" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} /></div>
        <div><label className="text-sm font-medium block mb-1" style={{ color: 'var(--text-primary)' }}>🎯 {L.next}</label><textarea value={form.nextWeek} onChange={e => setForm({...form, nextWeek: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-sm" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} /></div>
        <div><label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>{L.rate}</label><div className="flex gap-2 justify-center">{[1,2,3,4,5].map(n => (<button key={n} onClick={() => setForm({...form, rating: n})} className={`w-10 h-10 rounded-xl text-lg transition-all ${form.rating >= n ? 'bg-yellow-400 shadow-lg scale-105' : ''}`} style={form.rating < n ? { background: 'var(--bg-secondary)' } : {}}>⭐</button>))}</div></div>
        <button onClick={saveReview} className="btn-primary w-full flex items-center justify-center gap-2"><Save size={16} />{L.save}</button>
      </div>
      {reviews.length > 0 && <div className="space-y-3">{reviews.slice(0, 5).map(r => (<div key={r.id} className="card"><div className="flex items-center justify-between mb-2"><span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{r.week}</span><span className="text-sm">{'⭐'.repeat(r.rating)}</span></div>{r.wins && <p className="text-xs mb-1" style={{ color: 'var(--text-primary)' }}>✅ {r.wins}</p>}{r.lessons && <p className="text-xs mb-1" style={{ color: 'var(--text-primary)' }}>📈 {r.lessons}</p>}{r.nextWeek && <p className="text-xs" style={{ color: 'var(--text-primary)' }}>🎯 {r.nextWeek}</p>}</div>))}</div>}
    </div>
  );
}
