import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Plus, Trash2, ExternalLink, Calendar, Edit2, Save, X } from 'lucide-react';

export default function Certificates() {
  const { t } = useAuth();
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('flowly-certificates');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "IELTS 7.0", issuer: "British Council", date: "2026-03-15", category: "language", description: "Ingliz tili bilimi", link: "" },
      { id: 2, title: "React Developer Certificate", issuer: "Meta", date: "2026-01-20", category: "tech", description: "Frontend development", link: "" },
    ];
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', issuer: '', date: '', category: 'tech', description: '', link: '' });

  const saveCerts = (certs) => {
    setCertificates(certs);
    localStorage.setItem('flowly-certificates', JSON.stringify(certs));
  };

  const handleAdd = () => {
    if (!form.title || !form.issuer) return;
    if (editId) {
      saveCerts(certificates.map(c => c.id === editId ? { ...c, ...form } : c));
      setEditId(null);
    } else {
      saveCerts([...certificates, { ...form, id: Date.now() }]);
    }
    setForm({ title: '', issuer: '', date: '', category: 'tech', description: '', link: '' });
    setShowForm(false);
  };

  const handleEdit = (cert) => {
    setForm({ title: cert.title, issuer: cert.issuer, date: cert.date, category: cert.category, description: cert.description, link: cert.link || '' });
    setEditId(cert.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    saveCerts(certificates.filter(c => c.id !== id));
  };

  const categoryColors = {
    tech: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    language: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    business: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    sport: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    education: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    other: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Sertifikatlar va Yutuqlar</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Diplomlar, mukofotlar, erishgan natijalatingiz</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', issuer: '', date: '', category: 'tech', description: '', link: '' }); }}>
          <Plus size={18} /> {t('add')}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{editId ? t('edit') : t('add')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Nomi" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="text" placeholder="Kim bergan (tashkilot)" value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="tech">Texnologiya</option>
              <option value="language">Til</option>
              <option value="business">Biznes</option>
              <option value="sport">Sport</option>
              <option value="education">Ta'lim</option>
              <option value="other">Boshqa</option>
            </select>
            <input type="text" placeholder="Tavsif" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="url" placeholder="Havola (ixtiyoriy)" value={form.link} onChange={e => setForm({...form, link: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary flex items-center gap-1" onClick={handleAdd}>
              <Save size={16} /> {editId ? t('save') : t('add')}
            </button>
            <button className="px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => { setShowForm(false); setEditId(null); }}>{t('cancel')}</button>
          </div>
        </div>
      )}

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certificates.map((cert, idx) => (
          <div key={cert.id} className="card animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                  <Award size={24} className="text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{cert.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{cert.issuer}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(cert)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Edit2 size={14} className="text-blue-500" />
                </button>
                <button onClick={() => handleDelete(cert.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            </div>
            {cert.description && <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{cert.description}</p>}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Calendar size={12} style={{ color: 'var(--text-secondary)' }} />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{cert.date}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[cert.category] || categoryColors.other}`}>{cert.category}</span>
            </div>
            {cert.link && (
              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 mt-2 text-xs text-blue-500 hover:text-blue-600">
                <ExternalLink size={12} /> Ko'rish
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
