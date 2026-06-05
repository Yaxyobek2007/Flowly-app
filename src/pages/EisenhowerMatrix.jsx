import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Clock, Users, Trash2 } from 'lucide-react';

export default function EisenhowerMatrix() {
  const { tasks } = useApp();
  const { language } = useAuth();
  const lang = language || 'uz';

  // Categorize tasks into 4 quadrants based on priority
  const urgent_important = tasks.filter(t => t.priority === 'high' && !t.completed);
  const not_urgent_important = tasks.filter(t => t.priority === 'medium' && !t.completed);
  const urgent_not_important = tasks.filter(t => t.priority === 'low' && !t.completed);
  const completed = tasks.filter(t => t.completed);

  const quadrants = [
    {
      title: lang === 'ru' ? '🔴 Сделать сейчас' : lang === 'en' ? '🔴 Do Now' : '🔴 HOZIR qil',
      desc: lang === 'ru' ? 'Важно + Срочно' : lang === 'en' ? 'Important + Urgent' : 'Muhim + Shoshilinch',
      items: urgent_important,
      color: 'border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-900/5',
    },
    {
      title: lang === 'ru' ? '🟡 Запланировать' : lang === 'en' ? '🟡 Schedule' : '🟡 REJALASHTIR',
      desc: lang === 'ru' ? 'Важно + Не срочно' : lang === 'en' ? 'Important + Not Urgent' : 'Muhim + Shoshilmas',
      items: not_urgent_important,
      color: 'border-yellow-300 dark:border-yellow-800 bg-yellow-50/30 dark:bg-yellow-900/5',
    },
    {
      title: lang === 'ru' ? '🔵 Делегировать' : lang === 'en' ? '🔵 Delegate' : '🔵 TOPSHIR',
      desc: lang === 'ru' ? 'Не важно + Срочно' : lang === 'en' ? 'Not Important + Urgent' : 'Muhimsiz + Shoshilinch',
      items: urgent_not_important,
      color: 'border-blue-300 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/5',
    },
    {
      title: lang === 'ru' ? '⚪ Удалить' : lang === 'en' ? '⚪ Delete' : "⚪ O'CHIR",
      desc: lang === 'ru' ? 'Выполнено ✓' : lang === 'en' ? 'Completed ✓' : 'Bajarildi ✓',
      items: completed.slice(0, 10),
      color: 'border-green-300 dark:border-green-800 bg-green-50/30 dark:bg-green-900/5',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>🧠 Eisenhower Matrix</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Приоритизация задач по важности и срочности' : lang === 'en' ? 'Prioritize tasks by importance and urgency' : 'Vazifalarni muhimlik va shoshilinchlik bo\'yicha tartiblash'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((q, idx) => (
          <div key={idx} className={`card border-2 ${q.color}`}>
            <div className="mb-3">
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{q.title}</h3>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{q.desc}</p>
            </div>
            <div className="space-y-2 min-h-[80px]">
              {q.items.length === 0 ? (
                <p className="text-xs text-center py-4" style={{ color: 'var(--text-secondary)' }}>—</p>
              ) : q.items.map(task => (
                <div key={task.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
                  <span className={`text-xs flex-1 ${task.completed ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>{task.title}</span>
                  <span className="text-[9px] font-mono" style={{ color: 'var(--text-secondary)' }}>{task.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] font-bold" style={{ color: 'var(--text-secondary)' }}>{q.items.length} ta</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
