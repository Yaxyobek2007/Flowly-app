import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, CheckCircle2, Clock, Edit2, Save, X, AlertTriangle, Mic } from 'lucide-react';

const dayOfWeekToKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const dayLabelsUz = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

export default function DailyPlanner() {
  const { tasks, toggleTask, addTask, editTask, deleteTask } = useApp();
  const { t, language } = useAuth();
  const lang = language || 'uz';
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Real time - Toshkent
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const tashkent = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tashkent" }));
  const todayDow = tashkent.getDay(); // 0=Sun
  const todayKey = dayOfWeekToKey[todayDow];
  const todayLabel = dayLabelsUz[todayDow];
  const currentTimeStr = `${String(tashkent.getHours()).padStart(2, '0')}:${String(tashkent.getMinutes()).padStart(2, '0')}`;

  const [newTask, setNewTask] = useState({ title: '', time: '', priority: 'medium', day: todayKey, category: 'personal', location: '' });

  // Filter tasks for today
  const todayTasks = tasks.filter(t => t.day === todayKey).sort((a, b) => a.time.localeCompare(b.time));
  const completed = todayTasks.filter(t => t.completed).length;
  const total = todayTasks.length;

  // Check if a task's time has passed
  const isTaskPast = (task) => {
    if (!task.time) return false;
    return task.time < currentTimeStr;
  };

  // A task is "missed" if its time has passed and it's not completed
  const isTaskMissed = (task) => isTaskPast(task) && !task.completed;

  // After day passes, tasks from previous days cannot be edited
  // For today's tasks: can only edit if time hasn't passed yet
  const canEditTask = (task) => {
    if (task.day !== todayKey) return false; // past day tasks can't be edited
    if (isTaskPast(task)) return false; // time already passed
    return true;
  };

  const handleAdd = () => {
    if (newTask.title && newTask.time) {
      addTask({ ...newTask, day: todayKey, completed: false });
      setNewTask({ title: '', time: '', priority: 'medium', day: todayKey, category: 'personal' });
      setShowForm(false);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditForm({ title: task.title, time: task.time, priority: task.priority, category: task.category });
  };

  const handleSaveEdit = () => {
    editTask(editingId, editForm);
    setEditingId(null);
  };

  // Count missed tasks
  const missedCount = todayTasks.filter(t => isTaskMissed(t)).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('dailyPlanner')}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{todayLabel} — {tashkent.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold font-mono" style={{ color: 'var(--accent)' }}>{currentTimeStr}</span>
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> {t('newTask')}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{t('todayProgress')}</span>
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{completed}/{total}</span>
        </div>
        <div className="w-full h-3 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
          <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}></div>
        </div>
      </div>

      {/* Missed tasks warning */}
      {missedCount > 0 && (
        <div className="card flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.3)' }}>
          <AlertTriangle size={20} className="text-red-500" />
          <div>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">{missedCount} {lang === 'ru' ? 'задач просрочено!' : lang === 'en' ? 'tasks missed!' : 'ta vazifa vaqti o\'tib ketdi!'}</p>
            <p className="text-xs text-red-500/70">{lang === 'ru' ? 'Эти задачи нельзя редактировать' : lang === 'en' ? 'These tasks can no longer be edited' : 'Bu vazifalarni endi tahrirlash mumkin emas'}</p>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t('addTask')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder={t('taskName')} value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="time" value={newTask.time}
              onChange={e => setNewTask({...newTask, time: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="high">{t('high')}</option><option value="medium">{t('medium')}</option><option value="low">{t('low')}</option>
            </select>
            <select value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="personal">{t('personal')}</option><option value="education">{t('education')}</option><option value="health">{t('health')}</option><option value="work">{t('work')}</option><option value="finance">{t('finance')}</option>
            </select>
            <input type="text" placeholder={lang === 'ru' ? '📍 Место (необяз.)' : lang === 'en' ? '📍 Location (optional)' : "📍 Joy/Manzil (ixtiyoriy)"}
              value={newTask.location} onChange={e => setNewTask({...newTask, location: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div className="flex gap-2 mt-4">
            <button className="btn-primary" onClick={handleAdd}>{t('add')}</button>
            <button className="px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => setShowForm(false)}>{t('cancel')}</button>
          </div>
        </div>
      )}

      {/* Tasks Timeline */}
      <div className="space-y-3">
        {todayTasks.map((task, idx) => {
          const missed = isTaskMissed(task);
          const past = isTaskPast(task);
          const editable = canEditTask(task);

          return (
            <div key={task.id}
              className={`card animate-in transition-all ${missed ? 'border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-900/5' : task.completed ? 'border-green-300 dark:border-green-800 bg-green-50/30 dark:bg-green-900/5' : ''}`}
              style={{ animationDelay: `${idx * 50}ms` }}>
              {editingId === task.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})}
                      className="px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    <input type="time" value={editForm.time} onChange={e => setEditForm({...editForm, time: e.target.value})}
                      className="px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    <select value={editForm.priority} onChange={e => setEditForm({...editForm, priority: e.target.value})}
                      className="px-3 py-2 rounded-lg border outline-none"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                      <option value="high">{t('high')}</option><option value="medium">{t('medium')}</option><option value="low">{t('low')}</option>
                    </select>
                    <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}
                      className="px-3 py-2 rounded-lg border outline-none"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                      <option value="personal">{t('personal')}</option><option value="education">{t('education')}</option><option value="health">{t('health')}</option><option value="work">{t('work')}</option><option value="finance">{t('finance')}</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveEdit} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm"><Save size={14} /> {t('save')}</button>
                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}><X size={14} /> {t('cancel')}</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button onClick={() => !past || !task.completed ? toggleTask(task.id) : null}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      task.completed ? 'bg-green-500 border-green-500' :
                      missed ? 'bg-red-500 border-red-500' :
                      'border-gray-300 hover:border-blue-500'
                    }`}>
                    {task.completed && <CheckCircle2 size={14} className="text-white" />}
                    {missed && !task.completed && <X size={12} className="text-white" />}
                  </button>
                  <div className="flex items-center gap-2 min-w-[70px]">
                    <Clock size={14} className={missed ? 'text-red-400' : ''} style={missed ? {} : { color: 'var(--text-secondary)' }} />
                    <span className={`text-sm font-mono ${missed ? 'text-red-500' : ''}`} style={missed ? {} : { color: 'var(--text-secondary)' }}>{task.time}</span>
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through opacity-50 text-green-600 dark:text-green-400' : missed ? 'text-red-600 dark:text-red-400' : ''}`}
                      style={!task.completed && !missed ? { color: 'var(--text-primary)' } : {}}>
                      {task.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {task.category}
                      {task.location && <span className="ml-2">📍 <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{task.location}</a></span>}
                      {missed && <span className="ml-2 text-red-500 font-medium">⚠️ O'tib ketdi</span>}
                      {task.completed && <span className="ml-2 text-green-500 font-medium">✓ Bajarildi</span>}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  }`}>{task.priority}</span>

                  {/* Edit only if time hasn't passed */}
                  {editable && (
                    <button onClick={() => handleEdit(task)} className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Edit2 size={15} className="text-blue-500" />
                    </button>
                  )}
                  {/* Delete always available */}
                  <button onClick={() => deleteTask(task.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 size={15} className="text-red-400" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {todayTasks.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>🎉 {t('noTasks')}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Добавьте задачу!' : lang === 'en' ? 'Add a new task!' : "Yangi vazifa qo'shing!"}</p>
        </div>
      )}
    </div>
  );
}
