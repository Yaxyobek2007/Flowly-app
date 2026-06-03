import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Plus, Clock } from 'lucide-react';

const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function WeeklyPlanner() {
  const { tasks, toggleTask, addTask } = useApp();
  const { t } = useAuth();
  const [editingDay, setEditingDay] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', time: '' });

  const dayLabels = {
    monday: t('monday'), tuesday: t('tuesday'), wednesday: t('wednesday'),
    thursday: t('thursday'), friday: t('friday'), saturday: t('saturday'), sunday: t('sunday')
  };

  const dayDates = ['02-Iyun', '03-Iyun', '04-Iyun', '05-Iyun', '06-Iyun', '07-Iyun', '08-Iyun'];
  const todayIdx = 1; // Tuesday = today (June 3)

  const handleAddToDay = (dayKey) => {
    if (newTask.title && newTask.time) {
      addTask({ title: newTask.title, time: newTask.time, priority: 'medium', day: dayKey, category: 'personal', completed: false });
      setNewTask({ title: '', time: '' });
      setEditingDay(null);
    }
  };

  // Calculate weekly totals
  const totalWeekTasks = tasks.length;
  const completedWeekTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('weeklyPlanner')}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>02–08 Iyun 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{completedWeekTasks}/{totalWeekTasks}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t('weeklyTasks')}</p>
          </div>
        </div>
      </div>

      {/* Weekly progress bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{t('weeklyTasks')} {t('progress')}</span>
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{totalWeekTasks > 0 ? Math.round((completedWeekTasks / totalWeekTasks) * 100) : 0}%</span>
        </div>
        <div className="w-full h-3 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
          <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
            style={{ width: `${totalWeekTasks > 0 ? (completedWeekTasks / totalWeekTasks) * 100 : 0}%` }}></div>
        </div>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {dayKeys.map((dayKey, idx) => {
          const dayTasks = tasks.filter(t => t.day === dayKey).sort((a, b) => a.time.localeCompare(b.time));
          const completed = dayTasks.filter(t => t.completed).length;
          const isToday = idx === todayIdx;

          return (
            <div key={dayKey} className={`card ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{dayLabels[dayKey]}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{dayDates[idx]}</p>
                </div>
                <div className="flex items-center gap-1">
                  {isToday && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium">{t('today')}</span>}
                  <button onClick={() => setEditingDay(editingDay === dayKey ? null : dayKey)}
                    className="p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Plus size={14} className="text-blue-500" />
                  </button>
                </div>
              </div>

              {/* Add form */}
              {editingDay === dayKey && (
                <div className="mb-3 p-2 rounded-lg animate-in" style={{ background: 'var(--bg-secondary)' }}>
                  <input type="text" placeholder={t('taskName')} value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-2 py-1 mb-1 rounded border text-xs outline-none"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  <div className="flex gap-1">
                    <input type="time" value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})}
                      className="flex-1 px-2 py-1 rounded border text-xs outline-none"
                      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    <button onClick={() => handleAddToDay(dayKey)} className="px-2 py-1 rounded bg-blue-500 text-white text-xs">+</button>
                    <button onClick={() => setEditingDay(null)} className="px-2 py-1 rounded border text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>✕</button>
                  </div>
                </div>
              )}

              {/* Tasks from daily planner automatically appear here */}
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
                    <div className="flex items-center gap-1">
                      <Clock size={9} style={{ color: 'var(--text-secondary)' }} />
                      <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>{task.time}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-center py-4" style={{ color: 'var(--text-secondary)' }}>{t('noTasks')}</p>
                )}
              </div>

              {/* Day progress */}
              {dayTasks.length > 0 && (
                <div className="mt-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                      style={{ width: `${(completed / dayTasks.length) * 100}%` }}></div>
                  </div>
                  <p className="text-[10px] mt-1 text-center" style={{ color: 'var(--text-secondary)' }}>{completed}/{dayTasks.length} {t('completed')}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
