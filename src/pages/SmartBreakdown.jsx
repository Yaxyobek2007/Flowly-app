import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, CheckCircle2, BookOpen, MapPin, Navigation, Clock, Calendar } from 'lucide-react';

const dayOfWeekToKey = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

export default function SmartBreakdown() {
  const { language } = useAuth();
  const { addTask } = useApp();
  const lang = language || 'uz';
  const [items, setItems] = useState(() => { const s = localStorage.getItem('flowly-breakdown'); return s ? JSON.parse(s) : []; });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'book', title: '', total: '', unit: '', days: '', time: '', location: '' });
  useEffect(() => { localStorage.setItem('flowly-breakdown', JSON.stringify(items)); }, [items]);

  const types = [
    { key: 'book', icon: '📚', uz: 'Kitob', ru: 'Книга', en: 'Book' },
    { key: 'course', icon: '💻', uz: 'Kurs', ru: 'Курс', en: 'Course' },
    { key: 'words', icon: '🗣️', uz: 'So\'z', ru: 'Слова', en: 'Words' },
    { key: 'travel', icon: '📍', uz: 'Joy', ru: 'Место', en: 'Place' },
    { key: 'project', icon: '🎯', uz: 'Loyiha', ru: 'Проект', en: 'Project' },
    { key: 'custom', icon: '✨', uz: 'Boshqa', ru: 'Другое', en: 'Other' },
  ];

  const handleAdd = () => {
    if (!form.title) return;
    const total = parseInt(form.total) || 1;
    const days = parseInt(form.days) || 7;
    const daily = Math.ceil(total / days);
    const unitLabel = form.unit || (form.type === 'book' ? 'bet' : form.type === 'course' ? 'dars' : form.type === 'words' ? "so'z" : 'ta');
    const newItem = { id: Date.now(), ...form, total, days, daily, unit: unitLabel, completedDays: [], createdAt: new Date().toISOString().split('T')[0] };
    setItems([...items, newItem]);

    // Auto-create daily tasks for ALL days
    if (form.time) {
      const typeIcon = types.find(t => t.key === form.type)?.icon || '📋';
      for (let i = 0; i < Math.min(days, 7); i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dayKey = dayOfWeekToKey[date.getDay()];
        const start = i * daily + 1;
        const end = Math.min((i + 1) * daily, total);
        addTask({
          title: `${typeIcon} ${form.title}: ${start}-${end} ${unitLabel}`,
          time: form.time,
          priority: 'medium',
          day: dayKey,
          category: 'education',
          completed: false,
          location: form.location || '',
        });
      }
    }

    setForm({ type: 'book', title: '', total: '', unit: '', days: '', time: '', location: '' });
    setShowForm(false);
  };

  const toggleDay = (id, day) => {
    setItems(items.map(item => item.id === id ? {
      ...item,
      completedDays: item.completedDays.includes(day)
        ? item.completedDays.filter(d => d !== day)
        : [...item.completedDays, day]
    } : item));
  };

  const getProgress = (item) => Math.round((item.completedDays.length / item.days) * 100);
  const getCurrentDay = (item) => {
    const diff = Math.floor((new Date() - new Date(item.createdAt)) / 86400000) + 1;
    return Math.min(Math.max(diff, 1), item.days);
  };

  const L = {
    title: lang === 'ru' ? 'Умная разбивка' : lang === 'en' ? 'Smart Breakdown' : 'Aqlli bo\'lish',
    desc: lang === 'ru' ? 'Разбейте задачу на ежедневные шаги' : lang === 'en' ? 'Break tasks into daily steps' : 'Vazifani kunlarga bo\'ling — avtomatik rejaga tushadi',
    add: lang === 'ru' ? 'Новый' : lang === 'en' ? 'New' : 'Yangi',
    name: lang === 'ru' ? 'Название' : lang === 'en' ? 'Name' : 'Nomi',
    total: lang === 'ru' ? 'Всего' : lang === 'en' ? 'Total' : 'Jami',
    daysL: lang === 'ru' ? 'Дней' : lang === 'en' ? 'Days' : 'Kun',
    time: lang === 'ru' ? 'Время каждый день' : lang === 'en' ? 'Daily time' : 'Har kuni soat',
    loc: lang === 'ru' ? 'Место' : lang === 'en' ? 'Location' : 'Manzil',
    today: lang === 'ru' ? 'Сегодня' : lang === 'en' ? 'Today' : 'Bugun',
    daily: lang === 'ru' ? '/день' : lang === 'en' ? '/day' : '/kun',
    autoTask: lang === 'ru' ? '→ Автоматически добавляется в Ежедневный план!' : lang === 'en' ? '→ Auto-added to Daily Plan!' : '→ Kunlik rejaga avtomatik qo\'shiladi!',
    example: lang === 'ru' ? 'Пример: "Atomic Habits" 300 стр ÷ 15 дней = 20 стр/день ⏰ 19:00 📍 Библиотека' : lang === 'en' ? 'Example: "Atomic Habits" 300 pages ÷ 15 days = 20 pages/day ⏰ 19:00 📍 Library' : 'Misol: "Atomic Habits" 300 bet ÷ 15 kun = 20 bet/kun ⏰ 19:00 📍 Kutubxona',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>📐 {L.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.desc}</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />{L.add}
        </button>
      </div>

      {/* Example hint */}
      {items.length === 0 && !showForm && (
        <div className="card text-center py-10 space-y-4">
          <BookOpen size={48} className="text-blue-300 mx-auto" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.example}</p>
          <p className="text-xs font-medium text-green-500">{L.autoTask}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card animate-in space-y-4" style={{ borderColor: 'var(--accent)' }}>
          {/* Type selector */}
          <div className="flex flex-wrap gap-2">
            {types.map(t => (
              <button key={t.key} onClick={() => setForm({ ...form, type: t.key })}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${form.type === t.key ? 'bg-blue-500 text-white shadow-lg' : ''}`}
                style={form.type !== t.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
                {t.icon} {t[lang]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder={L.name} value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="number" placeholder={`${L.total} (300 bet, 50 dars...)`} value={form.total}
              onChange={e => setForm({ ...form, total: e.target.value })}
              className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="text" placeholder="Birlik (bet, dars, so'z...)" value={form.unit}
              onChange={e => setForm({ ...form, unit: e.target.value })}
              className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="number" placeholder={`${L.daysL} (15, 30...)`} value={form.days}
              onChange={e => setForm({ ...form, days: e.target.value })}
              className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <div className="relative">
              <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input type="time" placeholder={L.time} value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input type="text" placeholder={`${L.loc} (ixtiyoriy)`} value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          {/* Preview */}
          {form.total && form.days && (
            <div className="p-4 rounded-xl text-center space-y-2" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
                {Math.ceil(parseInt(form.total) / parseInt(form.days))} {form.unit || 'ta'}{L.daily}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {form.total} {form.unit || 'ta'} ÷ {form.days} kun
                {form.time && <span> • ⏰ {form.time}</span>}
                {form.location && <span> • 📍 {form.location}</span>}
              </p>
              <p className="text-xs font-medium text-green-500 mt-2">✨ {L.autoTask}</p>
            </div>
          )}

          <button onClick={handleAdd} className="btn-primary w-full">{L.add}</button>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-4">
        {items.map((item, idx) => {
          const pct = getProgress(item);
          const curDay = getCurrentDay(item);
          const done = pct >= 100;
          const start = (curDay - 1) * item.daily + 1;
          const end = Math.min(curDay * item.daily, item.total);
          const typeIcon = types.find(t => t.key === item.type)?.icon || '📋';

          return (
            <div key={item.id} className={`card animate-in ${done ? 'ring-2 ring-green-500' : ''}`} style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${done ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                  {done ? '🏆' : typeIcon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {item.total} {item.unit} • {item.days} kun • {item.daily} {item.unit}{L.daily}
                  </p>
                  {item.location && (
                    <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                      <MapPin size={10} />
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                        target="_blank" rel="noopener noreferrer" className="hover:underline">{item.location}</a>
                      <Navigation size={10} />
                    </p>
                  )}
                  {item.time && (
                    <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      <Clock size={10} /> Har kuni {item.time}
                    </p>
                  )}
                </div>
                <button onClick={() => setItems(items.filter(x => x.id !== item.id))}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 size={15} className="text-red-400" />
                </button>
              </div>

              {/* Progress */}
              <div className="w-full h-3 rounded-full mb-2" style={{ background: 'var(--bg-secondary)' }}>
                <div className={`h-3 rounded-full transition-all ${done ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
                  style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-xs mb-3">
                <span style={{ color: 'var(--text-secondary)' }}>
                  <Calendar size={10} className="inline mr-1" />Kun {curDay}/{item.days}
                </span>
                <span className="font-bold" style={{ color: done ? '#22c55e' : 'var(--accent)' }}>{pct}%</span>
              </div>

              {/* Today's task */}
              {!done && (
                <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleDay(item.id, curDay)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        item.completedDays.includes(curDay) ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-blue-500'
                      }`}>
                      {item.completedDays.includes(curDay) && <CheckCircle2 size={14} className="text-white" />}
                    </button>
                    <div>
                      <p className={`text-sm font-medium ${item.completedDays.includes(curDay) ? 'line-through opacity-50' : ''}`}
                        style={{ color: 'var(--text-primary)' }}>
                        {L.today}: {start}–{end} {item.unit}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                        {item.daily} {item.unit}{L.daily}
                        {item.time && ` • ⏰ ${item.time}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {done && <p className="text-center font-bold text-green-500 py-2">🏆 Tugallandi!</p>}

              {/* Day grid */}
              <div className="flex flex-wrap gap-1 mt-3">
                {Array.from({ length: item.days }, (_, i) => {
                  const d = i + 1;
                  const isDone = item.completedDays.includes(d);
                  const isCur = d === curDay;
                  const isPast = d < curDay && !isDone;
                  return (
                    <button key={d} onClick={() => toggleDay(item.id, d)}
                      className={`w-6 h-6 rounded text-[8px] font-bold flex items-center justify-center transition-all ${
                        isDone ? 'bg-green-500 text-white' :
                        isCur ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                        isPast ? 'bg-red-100 dark:bg-red-900/20 text-red-500' : ''
                      }`}
                      style={!isDone && !isCur && !isPast ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
                      {isDone ? '✓' : d}
                    </button>
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
