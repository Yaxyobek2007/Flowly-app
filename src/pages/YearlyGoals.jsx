import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Target, CheckCircle2, ChevronDown, ChevronRight, Trash2, Edit2, Save, X } from 'lucide-react';

export default function YearlyGoals() {
  const { goals, addGoal, deleteGoal, editGoal, updateGoalProgress } = useApp();
  const { t } = useAuth();
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', deadline: '', steps: '' });

  const handleSubmit = () => {
    if (!form.title || !form.deadline) return;
    const steps = form.steps.split('\n').filter(s => s.trim());
    if (editId) {
      editGoal(editId, { title: form.title, deadline: form.deadline, steps: steps.length > 0 ? steps : ['Birinchi qadam'] });
      setEditId(null);
    } else {
      addGoal({ title: form.title, deadline: form.deadline, steps: steps.length > 0 ? steps : ['Birinchi qadam'] });
    }
    setForm({ title: '', deadline: '', steps: '' });
    setShowForm(false);
  };

  const handleEdit = (goal) => {
    setForm({ title: goal.title, deadline: goal.deadline, steps: goal.steps.join('\n') });
    setEditId(goal.id);
    setShowForm(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Yearly Goals</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Yillik maqsadlar va ularning bosqichlari</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', deadline: '', steps: '' }); }}>
          <Plus size={18} /> Yangi maqsad
        </button>
      </div>

      {/* Overall Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Umumiy progress</span>
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
            {goals.length > 0 ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
          <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
            style={{ width: `${goals.length > 0 ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0}%` }}></div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{editId ? t('edit') : t('newGoal')}</h3>
          <div className="space-y-3">
            <input type="text" placeholder={t('goalName')} value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <textarea placeholder="Bosqichlar (har bir qator — yangi bosqich)" value={form.steps} onChange={e => setForm({...form, steps: e.target.value})} rows={4}
              className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary flex items-center gap-1" onClick={handleSubmit}><Save size={16} /> {editId ? t('save') : t('add')}</button>
            <button className="px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => { setShowForm(false); setEditId(null); }}>{t('cancel')}</button>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, idx) => (
          <div key={goal.id} className="card animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-center gap-3">
              <div className="cursor-pointer flex-1 flex items-center gap-3" onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}>
                <div className={`p-2 rounded-xl ${goal.progress === 100 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                  <Target size={20} className={goal.progress === 100 ? 'text-green-500' : 'text-blue-500'} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{goal.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Deadline: {goal.deadline}</p>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{goal.progress}%</span>
                {expandedGoal === goal.id ? <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }} /> : <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />}
              </div>
              <button onClick={() => handleEdit(goal)} className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <Edit2 size={15} className="text-blue-500" />
              </button>
              <button onClick={() => deleteGoal(goal.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 size={15} className="text-red-400" />
              </button>
            </div>

            <div className="mt-3 w-full h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
              <div className={`h-2 rounded-full transition-all ${goal.progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-blue-400'}`}
                style={{ width: `${goal.progress}%` }}></div>
            </div>

            {expandedGoal === goal.id && (
              <div className="mt-4 pl-4 space-y-2 animate-in border-l-2" style={{ borderColor: 'var(--accent)' }}>
                {goal.steps.map((step, stepIdx) => (
                  <div key={stepIdx} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    onClick={() => updateGoalProgress(goal.id, stepIdx)}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      goal.completedSteps.includes(stepIdx) ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}>
                      {goal.completedSteps.includes(stepIdx) && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm ${goal.completedSteps.includes(stepIdx) ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
