import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, FileText, Edit2, Save, X } from 'lucide-react';

export default function Notes() {
  const { notes, addNote, editNote, deleteNote } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'general' });
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'Barchasi' },
    { key: 'finance', label: 'Moliya' },
    { key: 'business', label: 'Biznes' },
    { key: 'tech', label: 'Texnologiya' },
    { key: 'personal', label: 'Shaxsiy' },
    { key: 'general', label: 'Umumiy' },
  ];

  const filteredNotes = activeCategory === 'all' ? notes : notes.filter(n => n.category === activeCategory);

  const handleSubmit = () => {
    if (!form.title || !form.content) return;
    if (editId) {
      editNote(editId, form);
      setEditId(null);
    } else {
      addNote(form);
    }
    setForm({ title: '', content: '', category: 'general' });
    setShowForm(false);
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content, category: note.category });
    setEditId(note.id);
    setShowForm(true);
  };

  const categoryColors = {
    finance: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    business: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    tech: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    personal: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    general: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Notes</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Muhim yozuvlar va g'oyalar</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', content: '', category: 'general' }); }}>
          <Plus size={18} /> Yangi yozuv
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeCategory === cat.key ? 'bg-blue-500 text-white' : ''}`}
            style={activeCategory !== cat.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{editId ? 'Tahrirlash' : 'Yangi yozuv'}</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Sarlavha" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <textarea placeholder="Matn..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={5}
              className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="general">Umumiy</option><option value="finance">Moliya</option><option value="business">Biznes</option><option value="tech">Texnologiya</option><option value="personal">Shaxsiy</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary flex items-center gap-1" onClick={handleSubmit}><Save size={16} /> {editId ? 'Saqlash' : 'Qo\'shish'}</button>
            <button className="px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => { setShowForm(false); setEditId(null); }}>Bekor</button>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note, idx) => (
          <div key={note.id} className="card animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText size={16} style={{ color: 'var(--accent)' }} />
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{note.title}</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(note)} className="p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Edit2 size={13} className="text-blue-500" />
                </button>
                <button onClick={() => deleteNote(note.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
            </div>
            <p className="text-sm whitespace-pre-line mb-3" style={{ color: 'var(--text-secondary)' }}>{note.content}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[note.category] || categoryColors.general}`}>{note.category}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{note.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
