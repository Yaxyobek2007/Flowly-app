import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Smile, Meh, Frown, Heart, Sparkles } from 'lucide-react';
import DevBadge from '../components/DevBadge';

const moods = [
  { emoji: '😄', label: 'Ajoyib', color: 'bg-green-500' },
  { emoji: '🙂', label: 'Yaxshi', color: 'bg-blue-500' },
  { emoji: '😐', label: 'Normal', color: 'bg-yellow-500' },
  { emoji: '😔', label: 'Yomon', color: 'bg-orange-500' },
  { emoji: '😢', label: 'Juda yomon', color: 'bg-red-500' },
];

export default function Journal() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const [entries, setEntries] = useState(() => { const s = localStorage.getItem('flowly-journal'); return s ? JSON.parse(s) : []; });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ mood: 2, text: '', gratitude: '' });
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { localStorage.setItem('flowly-journal', JSON.stringify(entries)); }, [entries]);

  const todayEntry = entries.find(e => e.date === today);
  const L = {
    title: lang === 'ru' ? 'Дневник' : lang === 'en' ? 'Journal' : 'Kundalik',
    desc: lang === 'ru' ? 'Записывайте мысли и отслеживайте настроение' : lang === 'en' ? 'Write thoughts and track mood' : "Fikrlarni yozing va kayfiyatni kuzating",
    howWas: lang === 'ru' ? 'Как прошёл день?' : lang === 'en' ? 'How was your day?' : 'Bugun qanday kun bo\'ldi?',
    grateful: lang === 'ru' ? 'За что благодарны?' : lang === 'en' ? 'What are you grateful for?' : 'Nimaga shukr qilasiz?',
    write: lang === 'ru' ? 'Мысли, события, уроки...' : lang === 'en' ? 'Thoughts, events, lessons...' : 'Fikrlar, voqealar, darslar...',
    save: lang === 'ru' ? 'Сохранить' : lang === 'en' ? 'Save' : 'Saqlash',
    empty: lang === 'ru' ? 'Начните вести дневник!' : lang === 'en' ? 'Start journaling!' : 'Kundalik yozishni boshlang!',
    already: lang === 'ru' ? 'Запись на сегодня уже есть ✓' : lang === 'en' ? "Today's entry exists ✓" : 'Bugungi yozuv mavjud ✓',
  };

  const handleSave = () => {
    if (!form.text) return;
    const entry = { id: Date.now(), date: today, mood: form.mood, text: form.text, gratitude: form.gratitude, time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) };
    setEntries(prev => [entry, ...prev.filter(e => e.date !== today)]);
    setForm({ mood: 2, text: '', gratitude: '' });
    setShowForm(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>📓 {L.title}</h1><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.desc}</p></div>
        {!todayEntry && <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}><Plus size={18} />{L.save}</button>}
      </div>

      {todayEntry && !showForm && <div className="card" style={{ borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.03)' }}><p className="text-sm text-green-600 dark:text-green-400 font-medium">{L.already}</p></div>}

      {showForm && (
        <div className="card animate-in space-y-4" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{L.howWas}</h3>
          <div className="flex gap-3 justify-center">{moods.map((m, i) => (
            <button key={i} onClick={() => setForm({...form, mood: i})} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${form.mood === i ? 'ring-4 ring-blue-500 scale-110' : ''}`} style={{ background: 'var(--bg-secondary)' }}>{m.emoji}</button>
          ))}</div>
          <textarea placeholder={L.write} value={form.text} onChange={e => setForm({...form, text: e.target.value})} rows={4}
            className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <input type="text" placeholder={`🙏 ${L.grateful}`} value={form.gratitude} onChange={e => setForm({...form, gratitude: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <button className="btn-primary w-full" onClick={handleSave}>{L.save}</button>
        </div>
      )}

      {entries.length === 0 && !showForm && <div className="card text-center py-12"><Sparkles size={48} className="text-blue-300 mx-auto mb-4" /><p style={{ color: 'var(--text-secondary)' }}>{L.empty}</p></div>}

      <div className="space-y-3">{entries.slice(0, 30).map((entry, idx) => (
        <div key={entry.id} className="card animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><span className="text-xl">{moods[entry.mood]?.emoji}</span><span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{entry.date}</span><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{entry.time}</span></div>
            <button onClick={() => setEntries(entries.filter(e => e.id !== entry.id))} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={14} className="text-red-400" /></button>
          </div>
          <p className="text-sm whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>{entry.text}</p>
          {entry.gratitude && <p className="text-xs mt-2 italic" style={{ color: 'var(--text-secondary)' }}>🙏 {entry.gratitude}</p>}
        </div>
      ))}</div>
    </div>
  );
}
