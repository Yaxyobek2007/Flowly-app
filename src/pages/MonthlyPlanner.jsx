import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, X, Plus, Trash2, MapPin } from 'lucide-react';

export default function MonthlyPlanner() {
  const { events, addEvent, deleteEvent } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'event', icon: '📍', location: '', time: '' });

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

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    addEvent(newEvent);
    setNewEvent({ title: '', date: '', type: 'event', icon: '📍', location: '', time: '' });
    setShowAddForm(false);
  };

  const handleDayClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDay({ day, date: dateStr, events: getEventsForDay(day) });
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
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} /> Voqea qo'shish
        </button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Yangi voqea</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Voqea nomi" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="time" placeholder="Vaqt" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="text" placeholder="Lokatsiya" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <select value={newEvent.type}
              onChange={e => setNewEvent({...newEvent, type: e.target.value, icon: e.target.value === 'birthday' ? '🎂' : e.target.value === 'exam' ? '📚' : e.target.value === 'meeting' ? '💼' : '📍'})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="event">Tadbir</option><option value="birthday">Tug'ilgan kun</option><option value="exam">Imtihon</option><option value="meeting">Uchrashuv</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary" onClick={handleAddEvent}>Qo'shish</button>
            <button className="px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => setShowAddForm(false)}>Bekor</button>
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
            <div key={d} className="text-center py-2"><span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{d}</span></div>
          ))}
          {Array.from({ length: firstDay }, (_, i) => (<div key={`e-${i}`} className="p-2 min-h-[80px]"></div>))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            return (
              <div key={day} onClick={() => handleDayClick(day)}
                className={`p-2 min-h-[80px] rounded-lg border cursor-pointer transition-all hover:ring-2 hover:ring-blue-300 ${isToday(day) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                style={{ borderColor: 'var(--border)' }}>
                <span className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : ''}`} style={{ color: isToday(day) ? undefined : 'var(--text-primary)' }}>{day}</span>
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map(ev => (
                    <div key={ev.id} className="text-[10px] truncate rounded px-1" style={{ background: ev.type === 'birthday' ? 'rgba(234,179,8,0.2)' : ev.type === 'exam' ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)' }}>
                      {ev.icon} {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>+{dayEvents.length - 2}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDay(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in" onClick={e => e.stopPropagation()}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{selectedDay.day}-{monthName}</h3>
              <button onClick={() => setSelectedDay(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={20} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
            {selectedDay.events.length > 0 ? (
              <div className="space-y-3">
                {selectedDay.events.map(ev => (
                  <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <span className="text-2xl">{ev.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{ev.title}</p>
                      {ev.time && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>🕒 {ev.time}</p>}
                      {ev.location && <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}><MapPin size={10} /> {ev.location}</p>}
                    </div>
                    <button onClick={() => { deleteEvent(ev.id); setSelectedDay({...selectedDay, events: selectedDay.events.filter(e => e.id !== ev.id)}); }}
                      className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6" style={{ color: 'var(--text-secondary)' }}>Bu kunda voqealar yo'q</p>
            )}
            <button onClick={() => { setShowAddForm(true); setNewEvent({...newEvent, date: selectedDay.date}); setSelectedDay(null); }}
              className="w-full mt-4 btn-primary flex items-center justify-center gap-2">
              <Plus size={16} /> Voqea qo'shish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
