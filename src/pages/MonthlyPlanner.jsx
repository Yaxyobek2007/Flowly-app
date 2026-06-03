import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, X, Plus, Trash2, MapPin, CheckCircle2, Clock } from 'lucide-react';

// Map day-of-week (0=Sun..6=Sat) to our keys
const dayOfWeekToKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function MonthlyPlanner() {
  const { events, addEvent, deleteEvent, tasks, toggleTask } = useApp();
  const { t } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'event', icon: '📍', location: '', time: '' });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = {
    uz: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr'],
    ru: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  };
  const monthName = `${year} — ${monthNames[language]?.[month] || monthNames.en[month]}`;

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  // Get tasks for a specific calendar day based on day-of-week
  const getTasksForDay = (day) => {
    const date = new Date(year, month, day);
    const dayKey = dayOfWeekToKey[date.getDay()];
    return tasks.filter(t => t.day === dayKey).sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    addEvent(newEvent);
    setNewEvent({ title: '', date: '', type: 'event', icon: '📍', location: '', time: '' });
    setShowAddForm(false);
  };

  const handleDayClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const date = new Date(year, month, day);
    const dayKey = dayOfWeekToKey[date.getDay()];
    setSelectedDay({
      day,
      date: dateStr,
      dayKey,
      events: getEventsForDay(day),
      tasks: getTasksForDay(day),
    });
  };

  const today = new Date();
  const isToday = (day) => today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  const weekDays = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('monthlyPlanner')}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{monthName}</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} /> {t('addEvent')}
        </button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{t('addEvent')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder={t('eventName')} value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="time" placeholder={t('time')} value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="text" placeholder={t('locationLabel')} value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <select value={newEvent.type}
              onChange={e => setNewEvent({...newEvent, type: e.target.value, icon: e.target.value === 'birthday' ? '🎂' : e.target.value === 'exam' ? '📚' : e.target.value === 'meeting' ? '💼' : '📍'})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="event">{t('event')}</option><option value="birthday">{t('birthday')}</option><option value="exam">{t('exam')}</option><option value="meeting">{t('meeting')}</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary" onClick={handleAddEvent}>{t('add')}</button>
            <button className="px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => setShowAddForm(false)}>{t('cancel')}</button>
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
            const dayTasks = getTasksForDay(day);
            const taskCount = dayTasks.length;
            const completedCount = dayTasks.filter(t => t.completed).length;

            return (
              <div key={day} onClick={() => handleDayClick(day)}
                className={`p-1.5 min-h-[80px] rounded-lg border cursor-pointer transition-all hover:ring-2 hover:ring-blue-300 ${isToday(day) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : ''}`} style={{ color: isToday(day) ? undefined : 'var(--text-primary)' }}>{day}</span>
                  {taskCount > 0 && (
                    <span className={`text-[9px] px-1 rounded ${completedCount === taskCount ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {completedCount}/{taskCount}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 space-y-0.5">
                  {dayEvents.slice(0, 2).map(ev => (
                    <div key={ev.id} className="text-[9px] truncate rounded px-0.5"
                      style={{ background: ev.type === 'birthday' ? 'rgba(234,179,8,0.2)' : ev.type === 'exam' ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)' }}>
                      {ev.icon} {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <span className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>+{dayEvents.length - 2}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Detail Modal - shows BOTH events AND tasks from weekly planner */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDay(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl p-6 animate-in" onClick={e => e.stopPropagation()}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4 sticky top-0 pb-2" style={{ background: 'var(--bg-card)' }}>
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{selectedDay.day} — {monthName}</h3>
                <p className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>{t(selectedDay.dayKey)}</p>
              </div>
              <button onClick={() => setSelectedDay(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={20} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            {/* Events section */}
            {selectedDay.events.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  📅 {t('upcomingEvents')} ({selectedDay.events.length})
                </h4>
                <div className="space-y-2">
                  {selectedDay.events.map(ev => (
                    <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <span className="text-xl">{ev.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{ev.title}</p>
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
              </div>
            )}

            {/* Tasks section - from the weekly planner for this day-of-week */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                ✅ {t('dailyTasks')} ({selectedDay.tasks.length})
              </h4>
              {selectedDay.tasks.length > 0 ? (
                <div className="space-y-2">
                  {selectedDay.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <button onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-blue-500'
                        }`}>
                        {task.completed && <CheckCircle2 size={12} className="text-white" />}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${task.completed ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{task.category}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} style={{ color: 'var(--text-secondary)' }} />
                        <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{task.time}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      }`}>{task.priority}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{t('noTasks')}</p>
              )}
            </div>

            {/* No events message */}
            {selectedDay.events.length === 0 && selectedDay.tasks.length === 0 && (
              <p className="text-center py-6" style={{ color: 'var(--text-secondary)' }}>{t('noEventsDay')}</p>
            )}

            {/* Add event button */}
            <button onClick={() => { setShowAddForm(true); setNewEvent({...newEvent, date: selectedDay.date}); setSelectedDay(null); }}
              className="w-full mt-2 btn-primary flex items-center justify-center gap-2">
              <Plus size={16} /> {t('addEvent')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
