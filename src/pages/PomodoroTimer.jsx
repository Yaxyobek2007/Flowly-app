import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Play, Pause, RotateCcw, Coffee, Brain, Volume2, VolumeX, Plus, Minus, Edit2, Save } from 'lucide-react';

export default function PomodoroTimer() {
  const { language, addPoints } = useAuth();
  const lang = language || 'uz';
  const [mode, setMode] = useState('work');
  const [workTime, setWorkTime] = useState(() => parseInt(localStorage.getItem('flowly-pomo-work') || '25'));
  const [breakTime, setBreakTime] = useState(() => parseInt(localStorage.getItem('flowly-pomo-break') || '5'));
  const [longBreakTime, setLongBreakTime] = useState(() => parseInt(localStorage.getItem('flowly-pomo-long') || '15'));
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(() => parseInt(localStorage.getItem('flowly-pomo-sessions') || '0'));
  const [totalFocusTime, setTotalFocusTime] = useState(() => parseInt(localStorage.getItem('flowly-focus-total') || '0'));
  const [soundOn, setSoundOn] = useState(true);
  const [editing, setEditing] = useState(false);
  const [todaySessions, setTodaySessions] = useState(() => { const s = localStorage.getItem('flowly-pomo-today'); const d = localStorage.getItem('flowly-pomo-today-date'); return d === new Date().toISOString().split('T')[0] ? parseInt(s || '0') : 0; });
  const intervalRef = useRef(null);

  const getModeTime = (m) => m === 'work' ? workTime : m === 'break' ? breakTime : longBreakTime;

  useEffect(() => { localStorage.setItem('flowly-pomo-work', workTime); localStorage.setItem('flowly-pomo-break', breakTime); localStorage.setItem('flowly-pomo-long', longBreakTime); }, [workTime, breakTime, longBreakTime]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) { handleComplete(); }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const playSound = () => {
    if (!soundOn) return;
    try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const g = ctx.createGain(); osc.connect(g); g.connect(ctx.destination); osc.frequency.setValueAtTime(800, ctx.currentTime); osc.frequency.setValueAtTime(1000, ctx.currentTime + 0.15); osc.frequency.setValueAtTime(800, ctx.currentTime + 0.3); g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5); osc.start(); osc.stop(ctx.currentTime + 0.5); } catch(e) {}
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
  };

  const handleComplete = () => {
    playSound(); setIsRunning(false);
    // Send browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Flowly Pomodoro ⏰', {
        body: mode === 'work' ? (lang === 'ru' ? 'Время отдыха!' : lang === 'en' ? 'Break time!' : 'Dam olish vaqti!') : (lang === 'ru' ? 'Время работать!' : lang === 'en' ? 'Work time!' : 'Ish vaqti!'),
        icon: '/favicon.svg',
      });
    }
    if (mode === 'work') {
      const n = sessions + 1; setSessions(n); localStorage.setItem('flowly-pomo-sessions', n.toString());
      const td = todaySessions + 1; setTodaySessions(td); localStorage.setItem('flowly-pomo-today', td.toString()); localStorage.setItem('flowly-pomo-today-date', new Date().toISOString().split('T')[0]);
      setTotalFocusTime(prev => { const v = prev + workTime; localStorage.setItem('flowly-focus-total', v.toString()); return v; });
      addPoints(1);
      if (n % 4 === 0) { setMode('longBreak'); setTimeLeft(longBreakTime * 60); }
      else { setMode('break'); setTimeLeft(breakTime * 60); }
    } else { setMode('work'); setTimeLeft(workTime * 60); }
  };

  const reset = () => { setIsRunning(false); setTimeLeft(getModeTime(mode) * 60); };
  const switchMode = (m) => { setIsRunning(false); setMode(m); setTimeLeft(getModeTime(m) * 60); };
  const adjustTime = (field, delta) => {
    if (field === 'work') setWorkTime(v => Math.max(5, Math.min(90, v + delta)));
    if (field === 'break') setBreakTime(v => Math.max(1, Math.min(30, v + delta)));
    if (field === 'long') setLongBreakTime(v => Math.max(5, Math.min(45, v + delta)));
  };
  const saveSettings = () => { setEditing(false); setTimeLeft(getModeTime(mode) * 60); };

  const mins = Math.floor(timeLeft / 60); const secs = timeLeft % 60;
  const progress = 1 - (timeLeft / (getModeTime(mode) * 60));
  const circumference = 2 * Math.PI * 120;

  const L = { work: lang==='ru'?'Работа':lang==='en'?'Focus':'Fokus', brk: lang==='ru'?'Перерыв':lang==='en'?'Break':'Dam', lng: lang==='ru'?'Длинный':lang==='en'?'Long':'Uzun', edit: lang==='ru'?'Настроить':lang==='en'?'Settings':'Sozlash', save: lang==='ru'?'Сохранить':lang==='en'?'Save':'Saqlash', today: lang==='ru'?'Сегодня':lang==='en'?'Today':'Bugun', total: lang==='ru'?'Всего':lang==='en'?'Total':'Jami', pts: lang==='ru'?'Баллов':lang==='en'?'Points':'Ball', min: lang==='ru'?'мин':lang==='en'?'min':'daq' };

  return (
    <div className="max-w-lg mx-auto space-y-6 text-center">
      <div className="flex items-center justify-between">
        <div className="text-left"><h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>⏱️ Pomodoro</h1><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{workTime}{L.min} {L.work} + {breakTime}{L.min} {L.brk}</p></div>
        <button onClick={() => setEditing(!editing)} className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ border: '1px solid var(--border)', color: 'var(--accent)' }}><Edit2 size={14} className="inline mr-1" />{L.edit}</button>
      </div>

      {/* Settings Panel */}
      {editing && (
        <div className="card animate-in space-y-4" style={{ borderColor: 'var(--accent)' }}>
          {[
            { label: `🧠 ${L.work}`, field: 'work', value: workTime },
            { label: `☕ ${L.brk}`, field: 'break', value: breakTime },
            { label: `🌿 ${L.lng} ${L.brk}`, field: 'long', value: longBreakTime },
          ].map(item => (
            <div key={item.field} className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
              <div className="flex items-center gap-3">
                <button onClick={() => adjustTime(item.field, -5)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90" style={{ background: 'var(--bg-secondary)' }}><Minus size={14} style={{ color: 'var(--text-secondary)' }} /></button>
                <span className="text-lg font-bold w-10 text-center" style={{ color: 'var(--accent)' }}>{item.value}</span>
                <button onClick={() => adjustTime(item.field, 5)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90" style={{ background: 'var(--bg-secondary)' }}><Plus size={14} style={{ color: 'var(--text-secondary)' }} /></button>
              </div>
            </div>
          ))}
          <button onClick={saveSettings} className="btn-primary w-full flex items-center justify-center gap-2"><Save size={16} />{L.save}</button>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="flex gap-2 justify-center">
        <button onClick={() => switchMode('work')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'work' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' : ''}`} style={mode !== 'work' ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}><Brain size={14} className="inline mr-1" />{L.work}</button>
        <button onClick={() => switchMode('break')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'break' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' : ''}`} style={mode !== 'break' ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}><Coffee size={14} className="inline mr-1" />{L.brk}</button>
        <button onClick={() => switchMode('longBreak')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'longBreak' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : ''}`} style={mode !== 'longBreak' ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}><Coffee size={14} className="inline mr-1" />{L.lng}</button>
      </div>

      {/* Timer Circle */}
      <div className="relative inline-flex items-center justify-center">
        <svg width="280" height="280" className="transform -rotate-90">
          <circle cx="140" cy="140" r="120" fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle cx="140" cy="140" r="120" fill="none" strokeWidth="8" strokeLinecap="round" stroke={mode === 'work' ? '#ef4444' : mode === 'break' ? '#22c55e' : '#8b5cf6'} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
          <span className="text-sm font-medium mt-2" style={{ color: 'var(--text-secondary)' }}>{mode === 'work' ? L.work : mode === 'break' ? L.brk : L.lng}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={reset} className="p-3 rounded-2xl transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-90" style={{ border: '1px solid var(--border)' }}><RotateCcw size={20} style={{ color: 'var(--text-secondary)' }} /></button>
        <button onClick={() => setIsRunning(!isRunning)} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${isRunning ? 'bg-red-500 shadow-red-500/40' : mode === 'work' ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-green-500 to-emerald-500'}`}>
          {isRunning ? <Pause size={28} className="text-white" /> : <Play size={28} className="text-white ml-1" />}
        </button>
        <button onClick={() => setSoundOn(!soundOn)} className="p-3 rounded-2xl transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-90" style={{ border: '1px solid var(--border)' }}>{soundOn ? <Volume2 size={20} style={{ color: 'var(--text-secondary)' }} /> : <VolumeX size={20} className="text-red-400" />}</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="card text-center py-3"><p className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{todaySessions}</p><p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{L.today}</p></div>
        <div className="card text-center py-3"><p className="text-xl font-bold text-purple-500">{sessions}</p><p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{L.total}</p></div>
        <div className="card text-center py-3"><p className="text-xl font-bold text-green-500">{Math.floor(totalFocusTime / 60)}h</p><p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{L.total} {L.min}</p></div>
        <div className="card text-center py-3"><p className="text-xl font-bold text-orange-500">+{sessions}</p><p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{L.pts}</p></div>
      </div>
    </div>
  );
}
