import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Tag, Filter, Plus, X, CheckCircle2, Clock } from 'lucide-react';

const defaultTags = ['#muhim', '#ish', '#shaxsiy', '#sport', '#moliya', '#talim', '#loyiha', '#zudlik'];

export default function TagsFilters() {
  const { tasks } = useApp();
  const { language } = useAuth();
  const lang = language || 'uz';
  const [customTags, setCustomTags] = useState(() => { const s = localStorage.getItem('flowly-tags'); return s ? JSON.parse(s) : defaultTags; });
  const [activeTag, setActiveTag] = useState(null);
  const [newTag, setNewTag] = useState('');

  const addTag = () => { if (!newTag.trim()) return; const tag = newTag.startsWith('#') ? newTag.toLowerCase() : '#' + newTag.toLowerCase(); if (!customTags.includes(tag)) { const updated = [...customTags, tag]; setCustomTags(updated); localStorage.setItem('flowly-tags', JSON.stringify(updated)); } setNewTag(''); };
  const removeTag = (tag) => { const updated = customTags.filter(t => t !== tag); setCustomTags(updated); localStorage.setItem('flowly-tags', JSON.stringify(updated)); if (activeTag === tag) setActiveTag(null); };

  const filteredTasks = activeTag ? tasks.filter(t => t.title.toLowerCase().includes(activeTag.replace('#', ''))) : tasks;
  const completedCount = filteredTasks.filter(t => t.completed).length;

  const L = { title: lang === 'ru' ? 'Теги и фильтры' : lang === 'en' ? 'Tags & Filters' : 'Teglar va Filterlar', desc: lang === 'ru' ? 'Группируйте задачи' : lang === 'en' ? 'Group and filter' : 'Vazifalarni guruhlang', all: lang === 'ru' ? 'Все' : lang === 'en' ? 'All' : 'Barchasi', addTag: lang === 'ru' ? 'Новый тег...' : lang === 'en' ? 'New tag...' : 'Yangi teg...', results: lang === 'ru' ? 'Результаты' : lang === 'en' ? 'Results' : 'Natijalar', noResults: lang === 'ru' ? 'Нет задач' : lang === 'en' ? 'No tasks' : 'Vazifa yo\'q', tip: lang === 'ru' ? '💡 Добавьте тег в название задачи' : lang === 'en' ? '💡 Add tag to task title' : '💡 Vazifa nomiga teg qo\'shing (#ish #muhim)' };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>🏷️ {L.title}</h1><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.desc}</p></div>
      <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', color: 'var(--text-secondary)' }}>{L.tip}</div>
      <div className="card">
        <div className="flex items-center gap-2 mb-4"><Tag size={18} style={{ color: 'var(--accent)' }} /><h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Tags</h3></div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setActiveTag(null)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!activeTag ? 'bg-blue-500 text-white shadow-lg' : ''}`} style={activeTag ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>{L.all} ({tasks.length})</button>
          {customTags.map(tag => (<div key={tag} className="flex items-center gap-0.5"><button onClick={() => setActiveTag(activeTag === tag ? null : tag)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeTag === tag ? 'bg-purple-500 text-white shadow-lg' : ''}`} style={activeTag !== tag ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>{tag}</button><button onClick={() => removeTag(tag)} className="p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"><X size={10} className="text-red-400" /></button></div>))}
        </div>
        <div className="flex gap-2"><input type="text" placeholder={L.addTag} value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-purple-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} /><button onClick={addTag} className="btn-primary px-3"><Plus size={16} /></button></div>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><Filter size={18} style={{ color: 'var(--accent)' }} /><h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{L.results}</h3>{activeTag && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">{activeTag}</span>}</div><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{completedCount}/{filteredTasks.length}</span></div>
        {filteredTasks.length === 0 ? (<p className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>{L.noResults}</p>) : (<div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">{filteredTasks.map(task => (<div key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}><div className={`w-4 h-4 rounded-full flex-shrink-0 ${task.completed ? 'bg-green-500' : 'border-2 border-gray-300'}`}></div><div className="flex-1 min-w-0"><p className={`text-sm truncate ${task.completed ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>{task.title}</p><p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{task.day} • {task.time}</p></div><span className={`text-[9px] px-1.5 py-0.5 rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-600'}`}>{task.priority}</span></div>))}</div>)}
      </div>
    </div>
  );
}
