import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, CheckCircle2, BookOpen, MapPin, Navigation } from 'lucide-react';

export default function SmartBreakdown() {
  const { language } = useAuth();
  const { addTask } = useApp();
  const lang = language || 'uz';
  const [items, setItems] = useState(() => { const s = localStorage.getItem('flowly-breakdown'); return s ? JSON.parse(s) : []; });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'book', title: '', total: '', unit: '', days: '', time: '', location: '', locationAddress: '' });
  useEffect(() => { localStorage.setItem('flowly-breakdown', JSON.stringify(items)); }, [items]);

  const types = [
    { key: 'book', icon: '📚', label: lang==='ru'?'Книга':'Kitob' },
    { key: 'course', icon: '💻', label: lang==='ru'?'Курс':'Kurs' },
    { key: 'words', icon: '🗣️', label: lang==='ru'?'Слова':'So\'z' },
    { key: 'travel', icon: '📍', label: lang==='ru'?'Место':'Joy' },
    { key: 'project', icon: '🎯', label: lang==='ru'?'Проект':'Loyiha' },
    { key: 'custom', icon: '✨', label: lang==='ru'?'Другое':'Boshqa' },
  ];

  const handleAdd = () => {
    if (!form.title) return;
    const total = parseInt(form.total) || 1;
    const days = parseInt(form.days) || 7;
    const daily = Math.ceil(total / days);
    const unitLabel = form.unit || (form.type==='book'?'bet':form.type==='course'?'dars':form.type==='words'?'so\'z':'ta');
    const newItem = { id: Date.now(), ...form, total, days, daily, unit: unitLabel, completedDays: [], createdAt: new Date().toISOString().split('T')[0] };
    setItems([...items, newItem]);

    // Auto-create daily tasks for today
    if (form.time) {
      const dayKeys = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
      addTask({ title: `${types.find(t=>t.key===form.type)?.icon||'📋'} ${form.title}: ${daily} ${unitLabel}`, time: form.time, priority: 'medium', day: dayKeys[new Date().getDay()], category: 'education', completed: false, location: form.location || '' });
    }
    setForm({ type: 'book', title: '', total: '', unit: '', days: '', time: '', location: '', locationAddress: '' });
    setShowForm(false);
  };

  const toggleDay = (id, day) => { setItems(items.map(item => item.id === id ? { ...item, completedDays: item.completedDays.includes(day) ? item.completedDays.filter(d=>d!==day) : [...item.completedDays, day] } : item)); };
  const getProgress = (item) => Math.round((item.completedDays.length / item.days) * 100);
  const getCurrentDay = (item) => { const diff = Math.floor((new Date() - new Date(item.createdAt)) / 86400000) + 1; return Math.min(Math.max(diff, 1), item.days); };

  const L = { title: lang==='ru'?'Умная разбивка':lang==='en'?'Smart Breakdown':'Aqlli bo\'lish', desc: lang==='ru'?'Разбейте задачу на дни':lang==='en'?'Break task into days':'Vazifani kunlarga bo\'ling', add: lang==='ru'?'Новый':lang==='en'?'New':'Yangi', name: lang==='ru'?'Название':lang==='en'?'Name':'Nomi', total: lang==='ru'?'Всего':lang==='en'?'Total':'Jami', days: lang==='ru'?'Дней':lang==='en'?'Days':'Kun', time: lang==='ru'?'Время':lang==='en'?'Time':'Soat', loc: lang==='ru'?'Место':lang==='en'?'Location':'Manzil', today: lang==='ru'?'Сегодня':lang==='en'?'Today':'Bugun', daily: lang==='ru'?'/день':lang==='en'?'/day':'/kun' };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold" style={{color:'var(--text-primary)'}}>{L.title}</h1><p className="text-sm" style={{color:'var(--text-secondary)'}}>{L.desc}</p></div>
        <button className="btn-primary flex items-center gap-2" onClick={()=>setShowForm(!showForm)}><Plus size={18}/>{L.add}</button>
      </div>

      {showForm && (
        <div className="card animate-in space-y-4" style={{borderColor:'var(--accent)'}}>
          {/* Type selector */}
          <div className="flex flex-wrap gap-2">{types.map(t=>(
            <button key={t.key} onClick={()=>setForm({...form,type:t.key})} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${form.type===t.key?'bg-blue-500 text-white shadow-lg':''}`} style={form.type!==t.key?{background:'var(--bg-secondary)',color:'var(--text-secondary)'}:{}}>{t.icon} {t.label}</button>
          ))}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder={L.name} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{background:'var(--bg-secondary)',borderColor:'var(--border)',color:'var(--text-primary)'}} />
            <input type="number" placeholder={`${L.total} (300 bet, 50 dars...)`} value={form.total} onChange={e=>setForm({...form,total:e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{background:'var(--bg-secondary)',borderColor:'var(--border)',color:'var(--text-primary)'}} />
            <input type="text" placeholder="Birlik (bet, dars, so'z...)" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{background:'var(--bg-secondary)',borderColor:'var(--border)',color:'var(--text-primary)'}} />
            <input type="number" placeholder={`${L.days} (15, 30...)`} value={form.days} onChange={e=>setForm({...form,days:e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{background:'var(--bg-secondary)',borderColor:'var(--border)',color:'var(--text-primary)'}} />
            <input type="time" placeholder={L.time} value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{background:'var(--bg-secondary)',borderColor:'var(--border)',color:'var(--text-primary)'}} />
            <input type="text" placeholder={`📍 ${L.loc} (ixtiyoriy)`} value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{background:'var(--bg-secondary)',borderColor:'var(--border)',color:'var(--text-primary)'}} />
          </div>
          {form.total && form.days && <div className="p-4 rounded-xl text-center" style={{background:'rgba(59,130,246,0.05)',border:'1px solid rgba(59,130,246,0.2)'}}><p className="text-lg font-bold" style={{color:'var(--accent)'}}>{Math.ceil(parseInt(form.total)/parseInt(form.days))} {form.unit||'ta'}{L.daily}</p><p className="text-xs mt-1" style={{color:'var(--text-secondary)'}}>Jami: {form.total} {form.unit} ÷ {form.days} kun</p></div>}
          <button onClick={handleAdd} className="btn-primary w-full">{L.add}</button>
        </div>
      )}

      {items.length === 0 && !showForm && <div className="card text-center py-12"><BookOpen size={48} className="text-blue-300 mx-auto mb-4"/><p style={{color:'var(--text-secondary)'}}>{lang==='ru'?'Добавьте задачу':'Vazifa qo\'shing'}</p></div>}

      <div className="space-y-4">{items.map((item, idx) => {
        const pct = getProgress(item); const curDay = getCurrentDay(item); const done = pct >= 100;
        const start = (curDay-1)*item.daily + 1; const end = Math.min(curDay*item.daily, item.total);
        return (
          <div key={item.id} className={`card animate-in ${done?'ring-2 ring-green-500':''}`} style={{animationDelay:`${idx*50}ms`}}>
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${done?'bg-green-100 dark:bg-green-900/20':'bg-blue-50 dark:bg-blue-900/20'}`}>{types.find(t=>t.key===item.type)?.icon||'📋'}</div>
              <div className="flex-1">
                <h3 className="font-bold" style={{color:'var(--text-primary)'}}>{item.title}</h3>
                <p className="text-xs" style={{color:'var(--text-secondary)'}}>{item.total} {item.unit} • {item.days} kun • {item.daily}{item.unit}{L.daily}</p>
                {item.location && <p className="text-xs mt-0.5 flex items-center gap-1" style={{color:'var(--accent)'}}><MapPin size={10}/><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`} target="_blank" className="hover:underline">{item.location}</a><Navigation size={10}/></p>}
              </div>
              <button onClick={()=>setItems(items.filter(x=>x.id!==item.id))} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={15} className="text-red-400"/></button>
            </div>

            {/* Progress */}
            <div className="w-full h-3 rounded-full mb-2" style={{background:'var(--bg-secondary)'}}><div className={`h-3 rounded-full transition-all ${done?'bg-green-500':'bg-gradient-to-r from-blue-500 to-purple-500'}`} style={{width:`${pct}%`}}/></div>
            <div className="flex justify-between text-xs mb-3"><span style={{color:'var(--text-secondary)'}}>Kun {curDay}/{item.days}</span><span className="font-bold" style={{color:done?'#22c55e':'var(--accent)'}}>{pct}%</span></div>

            {/* Today's task */}
            {!done && <div className="p-3 rounded-xl flex items-center justify-between" style={{background:'var(--bg-secondary)'}}>
              <div className="flex items-center gap-3">
                <button onClick={()=>toggleDay(item.id,curDay)} className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${item.completedDays.includes(curDay)?'bg-green-500 border-green-500':'border-gray-300 hover:border-blue-500'}`}>{item.completedDays.includes(curDay)&&<CheckCircle2 size={14} className="text-white"/>}</button>
                <div><p className="text-sm font-medium" style={{color:'var(--text-primary)'}}>{L.today}: {start}–{end} {item.unit}</p>{item.time&&<p className="text-[10px]" style={{color:'var(--text-secondary)'}}>⏰ {item.time}</p>}</div>
              </div>
            </div>}
            {done && <p className="text-center text-green-500 font-bold py-2">🏆 {lang==='ru'?'Завершено!':'Tugallandi!'}</p>}

            {/* Day grid */}
            <div className="flex flex-wrap gap-1 mt-3">{Array.from({length:item.days},(_,i)=>{const d=i+1;const isDone=item.completedDays.includes(d);const isCur=d===curDay;const isPast=d<curDay&&!isDone;return(<button key={d} onClick={()=>toggleDay(item.id,d)} className={`w-6 h-6 rounded text-[8px] font-bold flex items-center justify-center transition-all ${isDone?'bg-green-500 text-white':isCur?'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20':isPast?'bg-red-100 dark:bg-red-900/20 text-red-500':''}`} style={!isDone&&!isCur&&!isPast?{background:'var(--bg-secondary)',color:'var(--text-secondary)'}:{}}>{isDone?'✓':d}</button>);})}</div>
          </div>
        );
      })}</div>
    </div>
  );
}
