import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Play, Pause, RotateCcw, Coffee, Brain, Volume2, VolumeX } from 'lucide-react';

export default function PomodoroTimer() {
  const { language, addPoints } = useAuth();
  const lang = language || 'uz';
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(() => parseInt(localStorage.getItem('flowly-focus-total') || '0'));
  const [soundOn, setSoundOn] = useState(true);
  const intervalRef = useRef(null);

  const modes = {
    work: { time: 25 * 60, label: lang === 'ru' ? 'Работа' : lang === 'en' ? 'Focus' : 'Fokus', color: 'from-red-500 to-orange-500' },
    break: { time: 5 * 60, label: lang === 'ru' ? 'Перерыв' : lang === 'en' ? 'Break' : 'Dam', color: 'from-green-500 to-emerald-500' },
    longBreak: { time: 15 * 60, label: lang === 'ru' ? 'Длинный перерыв' : lang === 'en' ? 'Long Break' : 'Uzun dam', color: 'from-blue-500 to-purple-500' },
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) { handleComplete(); }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const playSound = () => {
    if (!soundOn) return;
    try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const g = ctx.createGain(); osc.connect(g); g.connect(ctx.destination); osc.frequency.setValueAtTime(800, ctx.currentTime); osc.frequency.setValueAtTime(1000, ctx.currentTime + 0.15); osc.frequency.setValueAtTime(800, ctx.currentTime + 0.3); g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5); osc.start(); osc.stop(ctx.currentTime + 0.5); } catch(e) {}
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
  };

  const handleComplete = () => {
    playSound(); setIsRunning(false);
    if (mode === 'work') {
      const n = sessions + 1; setSessions(n);
      setTotalFocusTime(prev => { const v = prev + 25; localStorage.setItem('flowly-focus-total', v.toString()); return v; });
      addPoints(1);
      if (n % 4 === 0) { setMode('longBreak'); setTimeLeft(15 * 60); }
      else { setMode('break'); setTimeLeft(5 * 60); }
    } else { setMode('work'); setTimeLeft(25 * 60); }
  };

  const reset = () => { setIsRunning(false); setTimeLeft(modes[mode].time); };
  const switchMode = (m) => { setIsRunning(false); setMode(m); setTimeLeft(modes[m].time); };
  const mins = Math.floor(timeLeft / 60); const secs = timeLeft % 60;
  const progress = 1 - (timeLeft / modes[mode].time);
  const circumference = 2 * Math.PI * 120;

  return (
    <div className="max-w-lg mx-auto space-y-6 text-center">
      <div><h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>⏱️ Pomodoro Timer</h1><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? '25 мин фокус + 5 мин отдых' : lang === 'en' ? '25 min focus + 5 min rest' : '25 daq fokus + 5 daq dam'}</p></div>
      <div className="flex gap-2 justify-center">
        {Object.entries(modes).map(([key, m]) => (
          <button key={key} onClick={() => switchMode(key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === key ? `bg-gradient-to-r ${m.color} text-white shadow-lg` : ''}`} style={mode !== key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
            {key === 'work' ? <Brain size={14} className="inline mr-1" /> : <Coffee size={14} className="inline mr-1" />}{m.label}
          </button>
        ))}
      </div>
      <div className="relative inline-flex items-center justify-center">
        <svg width="280" height="280" className="transform -rotate-90">
          <circle cx="140" cy="140" r="120" fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle cx="140" cy="140" r="120" fill="none" strokeWidth="8" strokeLinecap="round" stroke={mode === 'work' ? '#ef4444' : mode === 'break' ? '#22c55e' : '#8b5cf6'} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
          <span className="text-sm font-medium mt-2" style={{ color: 'var(--text-secondary)' }}>{modes[mode].label}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button onClick={reset} className="p-3 rounded-2xl transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-90" style={{ border: '1px solid var(--border)' }}><RotateCcw size={20} style={{ color: 'var(--text-secondary)' }} /></button>
        <button onClick={() => setIsRunning(!isRunning)} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${isRunning ? 'bg-red-500 shadow-red-500/40' : `bg-gradient-to-br ${modes[mode].color}`}`}>
          {isRunning ? <Pause size={28} className="text-white" /> : <Play size={28} className="text-white ml-1" />}
        </button>
        <button onClick={() => setSoundOn(!soundOn)} className="p-3 rounded-2xl transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-90" style={{ border: '1px solid var(--border)' }}>{soundOn ? <Volume2 size={20} style={{ color: 'var(--text-secondary)' }} /> : <VolumeX size={20} className="text-red-400" />}</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center py-4"><p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{sessions}</p><p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Сессий' : lang === 'en' ? 'Sessions' : 'Sessiya'}</p></div>
        <div className="card text-center py-4"><p className="text-2xl font-bold text-green-500">{Math.floor(totalFocusTime / 60)}h{totalFocusTime % 60}m</p><p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Всего' : lang === 'en' ? 'Total' : 'Jami'}</p></div>
        <div className="card text-center py-4"><p className="text-2xl font-bold text-orange-500">+{sessions}</p><p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Баллов' : lang === 'en' ? 'Points' : 'Ball'}</p></div>
      </div>
    </div>
  );
}
