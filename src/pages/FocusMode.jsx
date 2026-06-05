import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, X } from 'lucide-react';

export default function FocusMode() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const [active, setActive] = useState(false);
  const [minutes, setMinutes] = useState(30);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessions, setSessions] = useState(() => parseInt(localStorage.getItem('flowly-focus-sessions') || '0'));

  useEffect(() => {
    if (!active || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { setActive(false); setSessions(s => { const n = s+1; localStorage.setItem('flowly-focus-sessions', n.toString()); return n; }); if('vibrate' in navigator) navigator.vibrate([300,100,300]); return 0; } return p-1; }), 1000);
    return () => clearInterval(t);
  }, [active, timeLeft]);

  const start = () => { setActive(true); setTimeLeft(minutes * 60); };
  const stop = () => { setActive(false); setTimeLeft(0); };
  const m = Math.floor(timeLeft/60); const s = timeLeft%60;

  const L = {
    title: lang==='ru'?'Режим фокуса':lang==='en'?'Focus Mode':'Fokus rejimi',
    desc: lang==='ru'?'Отключите всё и сосредоточьтесь':lang==='en'?'Block everything and concentrate':'Hammasini o\'chiring va diqqatni jamlang',
    start: lang==='ru'?'Начать фокус':lang==='en'?'Start Focus':'Fokusni boshlash',
    stop: lang==='ru'?'Остановить':lang==='en'?'Stop':'To\'xtatish',
    total: lang==='ru'?'Сессий':lang==='en'?'Sessions':'Sessiyalar',
  };

  if (active) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: '#0a0a1a' }}>
        <div className="text-center">
          <Shield size={48} className="text-blue-400 mx-auto mb-6 animate-pulse" />
          <p className="text-7xl font-bold font-mono text-white mb-8">{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}</p>
          <button onClick={stop} className="px-8 py-3 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400 font-medium">{L.stop}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 text-center">
      <div><h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>🔒 {L.title}</h1><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.desc}</p></div>
      <div className="card space-y-6 py-8">
        <Shield size={56} className="text-blue-500 mx-auto" />
        <div className="flex items-center justify-center gap-4">
          {[15,25,30,45,60].map(t => (
            <button key={t} onClick={() => setMinutes(t)} className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all ${minutes===t?'bg-blue-500 text-white shadow-lg scale-110':''}`} style={minutes!==t?{background:'var(--bg-secondary)',color:'var(--text-secondary)'}:{}}>{t}</button>
          ))}
        </div>
        <button onClick={start} className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">{L.start}</button>
      </div>
      <div className="card"><p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{sessions}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{L.total}</p></div>
    </div>
  );
}
