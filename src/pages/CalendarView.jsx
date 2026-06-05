import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const dayOfWeekToKey = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

export default function CalendarView() {
  const { tasks } = useApp();
  const { language } = useAuth();
  const lang = language || 'uz';
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (currentWeekOffset * 7));
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(startOfWeek); d.setDate(startOfWeek.getDate() + i); return d; });
  const hours = Array.from({ length: 16 }, (_, i) => i + 6);
  const dayNames = lang === 'ru' ? ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'] : lang === 'en' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : ['Du','Se','Ch','Pa','Ju','Sh','Ya'];
  const getTasksForDayHour = (date, hour) => { const dk = dayOfWeekToKey[date.getDay()]; const h = String(hour).padStart(2,'0'); return tasks.filter(t => t.day === dk && t.time && t.time.startsWith(h)); };
  const isToday = (d) => d.toDateString() === today.toDateString();
  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>📅 {lang==='ru'?'Календарь':lang==='en'?'Calendar':'Kalendar'}</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentWeekOffset(p=>p-1)} className="p-2 rounded-xl" style={{ background: 'var(--bg-secondary)' }}><ChevronLeft size={18} style={{ color: 'var(--text-secondary)' }} /></button>
          <button onClick={() => setCurrentWeekOffset(0)} className="px-3 py-1.5 rounded-xl text-xs font-medium" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{lang==='ru'?'Эта неделя':lang==='en'?'This week':'Bu hafta'}</button>
          <button onClick={() => setCurrentWeekOffset(p=>p+1)} className="p-2 rounded-xl" style={{ background: 'var(--bg-secondary)' }}><ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} /></button>
        </div>
      </div>
      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[700px]">
          <thead><tr><th className="w-14 p-2 text-[10px]" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}></th>
            {weekDays.map((d,i) => (<th key={i} className={`p-2 text-center ${isToday(d)?'bg-blue-50 dark:bg-blue-900/10':''}`} style={{ borderBottom: '1px solid var(--border)' }}><p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{dayNames[i]}</p><p className={`text-base font-bold ${isToday(d)?'text-blue-500':''}`} style={!isToday(d)?{color:'var(--text-primary)'}:{}}>{d.getDate()}</p></th>))}
          </tr></thead>
          <tbody>{hours.map(h => (<tr key={h}><td className="p-1 text-[9px] text-right pr-2 font-mono" style={{ color: 'var(--text-secondary)', borderRight: '1px solid var(--border)' }}>{String(h).padStart(2,'0')}:00</td>
            {weekDays.map((d,i) => { const dt = getTasksForDayHour(d,h); return (<td key={i} className={`p-0.5 h-8 align-top ${isToday(d)?'bg-blue-50/30 dark:bg-blue-900/5':''}`} style={{ borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
              {dt.map(t => (<div key={t.id} className={`text-[8px] px-1 py-0.5 rounded mb-0.5 truncate ${t.completed?'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 line-through':'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'}`}>{t.title}</div>))}
            </td>); })}
          </tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
