import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun } from 'lucide-react';

export default function SleepTracker() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const today = new Date().toISOString().split('T')[0];
  const [records, setRecords] = useState(() => { const s = localStorage.getItem('flowly-sleep'); return s ? JSON.parse(s) : []; });
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  useEffect(() => { localStorage.setItem('flowly-sleep', JSON.stringify(records)); }, [records]);
  const calcHours = (bed, wake) => { const [bh, bm] = bed.split(':').map(Number); const [wh, wm] = wake.split(':').map(Number); let diff = (wh * 60 + wm) - (bh * 60 + bm); if (diff < 0) diff += 24 * 60; return (diff / 60).toFixed(1); };
  const addRecord = () => { const hours = parseFloat(calcHours(bedTime, wakeTime)); setRecords(prev => [{ id: Date.now(), date: today, bedTime, wakeTime, hours }, ...prev.filter(r => r.date !== today)]); };
  const todayRecord = records.find(r => r.date === today);
  const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); const k = d.toISOString().split('T')[0]; const r = records.find(rec => rec.date === k); return { day: d.toLocaleDateString(lang === 'ru' ? 'ru' : 'en', { weekday: 'short' }), hours: r ? r.hours : 0 }; });
  const avgSleep = records.length > 0 ? (records.slice(0, 7).reduce((a, r) => a + r.hours, 0) / Math.min(records.length, 7)).toFixed(1) : 0;
  const getQuality = (h) => h >= 7 ? { label: '😊 Ajoyib', color: 'text-green-500' } : h >= 5 ? { label: '😐 Normal', color: 'text-yellow-500' } : { label: '😴 Kam', color: 'text-red-500' };
  const L = { title: lang==='ru'?'Трекер сна':lang==='en'?'Sleep Tracker':'Uyqu Tracker', bed: lang==='ru'?'Лёг':lang==='en'?'Bedtime':'Yotish', wake: lang==='ru'?'Встал':lang==='en'?'Wake':'Turish', save: lang==='ru'?'Сохранить':lang==='en'?'Save':'Saqlash', avg: lang==='ru'?'Среднее':lang==='en'?'Average':'O\'rtacha', h: lang==='ru'?'ч':lang==='en'?'h':'s' };
  return (
    <div className="max-w-lg mx-auto space-y-6 text-center">
      <div><h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>💤 {L.title}</h1></div>
      {todayRecord ? (<div className="card" style={{ borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.03)' }}><p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{todayRecord.hours}{L.h}</p><p className={`text-sm mt-1 ${getQuality(todayRecord.hours).color}`}>{getQuality(todayRecord.hours).label}</p><p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>{todayRecord.bedTime} → {todayRecord.wakeTime}</p></div>
      ) : (<div className="card space-y-4"><div className="grid grid-cols-2 gap-4"><div className="text-center"><Moon size={24} className="text-blue-500 mx-auto mb-2" /><label className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>{L.bed}</label><input type="time" value={bedTime} onChange={e => setBedTime(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-center text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} /></div><div className="text-center"><Sun size={24} className="text-yellow-500 mx-auto mb-2" /><label className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>{L.wake}</label><input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-center text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} /></div></div><div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}><span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{calcHours(bedTime, wakeTime)}{L.h}</span></div><button onClick={addRecord} className="btn-primary w-full">{L.save}</button></div>)}
      <div className="grid grid-cols-2 gap-4"><div className="card text-center"><p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{avgSleep}{L.h}</p><p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{L.avg}</p></div><div className="card text-center"><p className="text-2xl font-bold text-purple-500">{records.length}</p><p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang==='ru'?'Записей':'Yozuvlar'}</p></div></div>
      <div className="card"><h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{lang==='ru'?'Неделя':lang==='en'?'Week':'Hafta'}</h4><div className="flex justify-between items-end gap-2">{last7.map((d, i) => (<div key={i} className="flex-1 text-center"><div className="relative mx-auto w-6 h-20 rounded-full overflow-hidden mb-1" style={{ background: 'var(--bg-secondary)' }}><div className={`absolute bottom-0 w-full rounded-full transition-all ${d.hours >= 7 ? 'bg-gradient-to-t from-green-500 to-emerald-400' : d.hours >= 5 ? 'bg-gradient-to-t from-yellow-500 to-yellow-400' : 'bg-gradient-to-t from-red-500 to-red-400'}`} style={{ height: `${Math.min((d.hours / 10) * 100, 100)}%` }}></div></div><span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{d.day}</span></div>))}</div></div>
    </div>
  );
}
