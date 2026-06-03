import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, CheckCircle2, Clock, MapPin } from 'lucide-react';

export default function DailyPlanner() {
  const { tasks, toggleTask, addTask, deleteTask } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', time: '', priority: 'medium', day: 'monday', category: 'personal' });

  const todayTasks = tasks.filter(t => t.day === 'monday').sort((a, b) => a.time.localeCompare(b.time));
  const completed = todayTasks.filter(t => t.completed).length;
  const total = todayTasks.length;

  const handleAdd = () => {
    if (newTask.title && newTask.time) {
      addTask({ ...newTask, completed: false });
      setNewTask({ title: '', time: '', priority: 'medium', day: 'monday', category: 'personal' });
      setShowForm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Daily Planner</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Kunlik rejalashtirish — Dushanba</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Yangi vazifa
        </button>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Bugungi progress</span>
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{completed}/{total}</span>
        </div>
        <div className="w-full h-3 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
          <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}></div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Yangi vazifa qo'shish</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Vazifa nomi" value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="time" value={newTask.time}
              onChange={e => setNewTask({...newTask, time: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <select value={newTask.priority}
              onChange={e => setNewTask({...newTask, priority: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="high">Yuqori</option>
              <option value="medium">O'rtacha</option>
              <option value="low">Past</option>
            </select>
            <select value={newTask.category}
              onChange={e => setNewTask({...newTask, category: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="personal">Shaxsiy</option>
              <option value="education">Ta'lim</option>
              <option value="health">Sog'liq</option>
              <option value="work">Ish</option>
              <option value="finance">Moliya</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="btn-primary" onClick={handleAdd}>Qo'shish</button>
            <button className="px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => setShowForm(false)}>Bekor qilish</button>
          </div>
        </div>
      )}

      {/* Tasks Timeline */}
      <div className="space-y-3">
        {todayTasks.map((task, idx) => (
          <div key={task.id} className="card flex items-center gap-4 animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
            <button onClick={() => toggleTask(task.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-blue-500'
              }`}>
              {task.completed && <CheckCircle2 size={14} className="text-white" />}
            </button>
            <div className="flex items-center gap-2 min-w-[70px]">
              <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
              <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{task.time}</span>
            </div>
            <div className="flex-1">
              <p className={`font-medium ${task.completed ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>{task.title}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{task.category}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
            }`}>{task.priority}</span>
            <button onClick={() => deleteTask(task.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={16} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
