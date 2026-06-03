import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Plus, Edit2, Save, X } from 'lucide-react';

const days = [
  { key: 'monday', label: 'Dushanba', date: '02-Iyun' },
  { key: 'tuesday', label: 'Seshanba', date: '03-Iyun' },
  { key: 'wednesday', label: 'Chorshanba', date: '04-Iyun' },
  { key: 'thursday', label: 'Payshanba', date: '05-Iyun' },
  { key: 'friday', label: 'Juma', date: '06-Iyun' },
  { key: 'saturday', label: 'Shanba', date: '07-Iyun' },
  { key: 'sunday', label: 'Yakshanba', date: '08-Iyun' },
];

export default function WeeklyPlanner() {
  const { tasks, toggleTask, addTask, editTask, deleteTask } = useApp();
  const [editingDay, setEditingDay] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', time: '' });

  const handleAddToDay = (dayKey) => {
    if (newTask.title && newTask.time) {
      addTask({ title: newTask.title, time: newTask.time, priority: 'medium', day: dayKey, category: 'personal', completed: false });
      setNewTask({ title: '', time: '' });
      setEditingDay(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Weekly Planner</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Haftalik kalendar — 02–08 Iyun 2026</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {days.map((day, idx) => {
          const dayTasks = tasks.filter(t => t.day === day.key).sort((a, b) => a.time.localeCompare(b.time));
          const completed = dayTasks.filter(t => t.completed).length;
          const isToday = idx === 1; // Seshanba = bugun (June 3)

          return (
            <div key={day.key} className={`card ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{day.label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{day.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  {isToday && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium">Bugun</span>}
                  <button onClick={() => setEditingDay(editingDay === day.key ? null : day.key)}
                    className="p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Plus size={14} className="text-blue-500" />
                  </button>
                </div>
              </div>

              {/* Add task form for this day */}
              {editingDay === day.key && (
                <div className="mb-3 p-2 rounded-lg animate-in" style={{ background: 'var(--bg-secondary)' }}>
                  <input type="text" placeholder="Vazifa" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-2 py-1 mb-1 rounded border text-xs outline-none"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  <div className="flex gap-1">
                    <input type="time" value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})}
                      className="flex-1 px-2 py-1 rounded border text-xs outline-none"
                      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    <button onClick={() => handleAddToDay(day.key)} className="px-2 py-1 rounded bg-blue-500 text-white text-xs">+</button>
                    <button onClick={() => setEditingDay(null)} className="px-2 py-1 rounded border text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>✕</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {dayTasks.length > 0 ? dayTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                    <button onClick={() => toggleTask(task.id)}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}>
                      {task.completed && <CheckCircle2 size={10} className="text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${task.completed ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                    </div>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{task.time}</span>
                  </div>
                )) : (
                  <p className="text-xs text-center py-4" style={{ color: 'var(--text-secondary)' }}>Vazifa yo'q</p>
                )}
              </div>
              {dayTasks.length > 0 && (
                <div className="mt-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                      style={{ width: `${(completed / dayTasks.length) * 100}%` }}></div>
                  </div>
                  <p className="text-xs mt-1 text-center" style={{ color: 'var(--text-secondary)' }}>{completed}/{dayTasks.length}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
