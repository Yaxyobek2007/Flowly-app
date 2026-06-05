import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Droplets, Plus, Minus, Trophy } from 'lucide-react';

export default function WaterTracker() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const today = new Date().toISOString().split('T')[0];
  const [goal, setGoal] = useState(() => parseInt(localStorage.getItem('flowly-water-goal') || '8'));
  const [history, setHistory] = useState(() => { const s = localStorage.getItem('flowly-water-history'); return s ? JSON.parse(s) : {}; });
  const todayCount = history[today] || 0;
  const percent = Math.min(Math.round((todayCount / goal) * 100), 100);
  useEffect(() => { localStorage.setItem('flowly-water-history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('flowly-water-goal', goal.toString()); }, [goal]);
  const addWater = () => setHistory(prev => ({ ...prev, [today]: (prev[today] || 0) + 1 }));
  const removeWater = () => setHistory(prev => ({ ...prev, [today]: Math.max((prev[today] || 0) - 1, 0) }));
  const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); const k = d.toISOString().split('T')[0]; return { day: d.toLocaleDateString(lang === 'ru' ? 'ru' : 'en', { weekday: 'short' }), count: history[k] || 0 }; });
  const L = { title: lang==='ru'?'Трекер воды':lang==='en'?'Water Tracker':'Suv Tracker', goal: lang==='ru'?'Цель':lang==='en'?'Goal':'Maqsad', glasses: lang==='ru'?'стаканов':lang==='en'?'glasses':'stakan', done: lang==='ru'?'Цель достигнута! 🎉':lang==='en'?'Goal reached! 🎉':'Maqsadga erishdingiz! 🎉', week: lang==='ru'?'Неделя':lang==='en'?'Week':'Hafta' };
  return (
    <div className="max-w-lg mx-auto space-y-6 text-center">
      <div><h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>💧 {L.title}</h1><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.goal}: {goal} {L.glasses}</p></div>
      <div className="relative inline-flex items-center justify-center"><svg width="240" height="240"><circle cx="120" cy="120" r="100" fill="none" stroke="var(--border)" strokeWidth="12" /><circle cx="120" cy="120" r="100" fill="none" strokeWidth="12" strokeLinecap="round" stroke={percent >= 100 ? '#22c55e' : '#3b82f6'} strokeDasharray={628} strokeDashoffset={628 * (1 - percent / 100)} className="transition-all duration-700 -rotate-90 origin-center" /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><Droplets size={32} className={percent >= 100 ? 'text-green-500' : 'text-blue-500'} /><span className="text-4xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{todayCount}</span><span className="text-sm" style={{ color: 'var(--text-secondary)' }}>/ {goal}</span></div></div>
      {percent >= 100 && <div className="flex items-center justify-center gap-2 text-green-500 font-bold animate-bounce"><Trophy size={20} />{L.done}</div>}
      <div className="flex items-center justify-center gap-6"><button onClick={removeWater} className="w-14 h-14 rounded-2xl flex items-center justify-center active:scale-90 shadow-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}><Minus size={24} style={{ color: 'var(--text-secondary)' }} /></button><button onClick={addWater} className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/40 active:scale-90 hover:scale-105 transition-all"><Plus size={32} className="text-white" /></button><button onClick={() => setGoal(g => Math.min(g + 1, 20))} className="w-14 h-14 rounded-2xl flex items-center justify-center active:scale-90 shadow-lg text-xs font-bold" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>+🎯</button></div>
      <div className="card"><h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{L.week}</h4><div className="flex justify-between items-end gap-2">{last7.map((d, i) => (<div key={i} className="flex-1 text-center"><div className="relative mx-auto w-6 h-20 rounded-full overflow-hidden mb-1" style={{ background: 'var(--bg-secondary)' }}><div className="absolute bottom-0 w-full rounded-full bg-gradient-to-t from-blue-500 to-cyan-400 transition-all" style={{ height: `${Math.min((d.count / goal) * 100, 100)}%` }}></div></div><span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{d.day}</span></div>))}</div></div>
    </div>
  );
}
