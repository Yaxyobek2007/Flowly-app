import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MonthlyPlanner() {
  const { events, addEvent } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1)); // June 2026
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'event', icon: '📍' });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const handleAdd = () => {
    if (newEvent.title && newEvent.date) {
      addEvent(newEvent);
      setNewEvent({ title: '', date: '', type: 'event', icon: '📍' });
      setShowForm(false);
    }
  };

  const today = new Date();
  const isToday = (day) => today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const weekDays = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Monthly Planner</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Oylik kalendar</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Voqea qo'shish</button>
      </div>

      {/* Add Event Form */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Yangi voqea</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="text" placeholder="Voqea nomi" value={newEvent.title}
              onChange={e => setNewEvent({...newEvent, title: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="date" value={newEvent.date}
              onChange={e => setNewEvent({...newEvent, date: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <select value={newEvent.type}
              onChange={e => setNewEvent({...newEvent, type: e.target.value, icon: e.target.value === 'birthday' ? '🎂' : e.target.value === 'exam' ? '📚' : e.target.value === 'meeting' ? '💼' : '📍'})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="event">Tadbir</option>
              <option value="birthday">Tug'ilgan kun</option>
              <option value="exam">Imtihon</option>
              <option value="meeting">Uchrashuv</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary" onClick={handleAdd}>Qo'shish</button>
            <button className="px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => setShowForm(false)}>Bekor qilish</button>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <ChevronLeft size={20} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <h2 className="text-lg font-bold capitalize" style={{ color: 'var(--text-primary)' }}>{monthName}</h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(d => (
            <div key={d} className="text-center py-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{d}</span>
            </div>
          ))}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="p-2 min-h-[80px]"></div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            return (
              <div key={day}
                className={`p-2 min-h-[80px] rounded-lg border transition-colors ${
                  isToday(day) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                style={{ borderColor: 'var(--border)' }}>
                <span className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : ''}`} style={{ color: isToday(day) ? undefined : 'var(--text-primary)' }}>{day}</span>
                <div className="mt-1 space-y-1">
                  {dayEvents.map(ev => (
                    <div key={ev.id} className="text-xs truncate" title={ev.title}>
                      <span>{ev.icon} {ev.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
