import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Search, Edit2, Save, X, Shield, Crown, Trash2 } from 'lucide-react';

export default function AdminPanel() {
  const { currentUser, users, updateUserByAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <Shield size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Ruxsat yo'q</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bu bo'lim faqat admin uchun ochiq</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (u.name?.toLowerCase().includes(q) || u.surname?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q));
  });

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({ name: user.name, surname: user.surname, email: user.email, phone: user.phone, plan: user.plan, role: user.role, points: user.points });
  };

  const handleSave = () => {
    updateUserByAdmin(editingUser, editForm);
    setEditingUser(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Panel</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Foydalanuvchilarni boshqarish</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30">
          <Crown size={14} className="text-purple-500" />
          <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Admin</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{users.length}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Jami foydalanuvchilar</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-500">{users.filter(u => u.plan !== 'free').length}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Premium</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-blue-500">{users.filter(u => u.plan === 'free').length}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Bepul</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-500">{users.filter(u => u.role === 'admin').length}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Adminlar</p>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-3 p-1">
          <Search size={20} style={{ color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Foydalanuvchi qidirish (ism, email, telefon)..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} />
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
              <th className="text-left py-3 px-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Foydalanuvchi</th>
              <th className="text-left py-3 px-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Email</th>
              <th className="text-left py-3 px-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Telefon</th>
              <th className="text-left py-3 px-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Plan</th>
              <th className="text-left py-3 px-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Ball</th>
              <th className="text-left py-3 px-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                {editingUser === user.id ? (
                  <>
                    <td className="py-2 px-2">
                      <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="px-2 py-1 rounded border text-sm w-full" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    </td>
                    <td className="py-2 px-2">
                      <input type="text" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})}
                        className="px-2 py-1 rounded border text-sm w-full" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    </td>
                    <td className="py-2 px-2">
                      <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}
                        className="px-2 py-1 rounded border text-sm w-full" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    </td>
                    <td className="py-2 px-2">
                      <select value={editForm.plan} onChange={e => setEditForm({...editForm, plan: e.target.value})}
                        className="px-2 py-1 rounded border text-sm" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="pro_plus">Pro+</option>
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      <input type="number" value={editForm.points} onChange={e => setEditForm({...editForm, points: parseInt(e.target.value) || 0})}
                        className="px-2 py-1 rounded border text-sm w-16" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    </td>
                    <td className="py-2 px-2 flex gap-1">
                      <button onClick={handleSave} className="p-1.5 rounded bg-green-100 dark:bg-green-900/30"><Save size={14} className="text-green-600" /></button>
                      <button onClick={() => setEditingUser(null)} className="p-1.5 rounded bg-red-100 dark:bg-red-900/30"><X size={14} className="text-red-500" /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{(user.name?.[0] || 'U').toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.name} {user.surname}</p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm" style={{ color: 'var(--text-primary)' }}>{user.email}</td>
                    <td className="py-3 px-2 text-sm" style={{ color: 'var(--text-primary)' }}>{user.phone}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${user.plan === 'pro_plus' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : user.plan === 'pro' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.points}</td>
                    <td className="py-3 px-2">
                      <button onClick={() => handleEdit(user)} className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Edit2 size={14} className="text-blue-500" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
