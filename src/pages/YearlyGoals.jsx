import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Target, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';

export default function YearlyGoals() {
  const { goals, addGoal, updateGoalProgress } = useApp();
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', deadline: '', steps: '' });

  const handleAdd = () => {
    if (newGoal.title && newGoal.deadline) {
      const steps = newGoal.steps.split('\n').filter(s => s.trim());
      addGoal({ title: newGoal.title, deadline: newGoal.deadline, steps: steps.length > 0 ? steps : ['Birinchi qadam'] });
      setNewGoal({ title: '', deadline: '', steps: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Yearly Goals</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Yillik maqsadlar va ularning bosqichlari</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Yangi maqsad
        </button>
      </div>

      {/* Overall Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Umumiy progress</span>
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
            {Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
          <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
            style={{ width: `${Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)}%` }}></div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Yangi maqsad qo'shish</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Maqsad nomi" value={newGoal.title}
              onChange={e => setNewGoal({...newGoal, title: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="date" value={newGoal.deadline}
              onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <textarea placeholder="Bosqichlar (har bir qator — yangi bosqich)" value={newGoal.steps}
              onChange={e => setNewGoal({...newGoal, steps: e.target.value})} rows={4}
              className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary" onClick={handleAdd}>Qo'shish</button>
            <button className="px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => setShowForm(false)}>Bekor qilish</button>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, idx) => (
          <div key={goal.id} className="card animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}>
              <div className={`p-2 rounded-xl ${goal.progress === 100 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                <Target size={20} className={goal.progress === 100 ? 'text-green-500' : 'text-blue-500'} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{goal.title}</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Deadline: {goal.deadline}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{goal.progress}%</span>
                </div>
                {expandedGoal === goal.id ? <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }} /> : <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 w-full h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
              <div className={`h-2 rounded-full transition-all ${goal.progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-blue-400'}`}
                style={{ width: `${goal.progress}%` }}></div>
            </div>

            {/* Expanded Steps */}
            {expandedGoal === goal.id && (
              <div className="mt-4 pl-4 space-y-2 animate-in border-l-2" style={{ borderColor: 'var(--accent)' }}>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Bosqichlar:</p>
                {goal.steps.map((step, stepIdx) => (
                  <div key={stepIdx} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    onClick={(e) => { e.stopPropagation(); updateGoalProgress(goal.id, stepIdx); }}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      goal.completedSteps.includes(stepIdx) ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}>
                      {goal.completedSteps.includes(stepIdx) && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm ${goal.completedSteps.includes(stepIdx) ? 'line-through opacity-50' : ''}`}
                      style={{ color: 'var(--text-primary)' }}>{step}</span>
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
