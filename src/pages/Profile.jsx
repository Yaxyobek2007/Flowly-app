import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Award, Edit2, Save, X } from 'lucide-react';

export default function Profile() {
  const { currentUser, updateProfile, t } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    surname: currentUser?.surname || '',
    age: currentUser?.age || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    email: currentUser?.email || '',
  });

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Profil</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-primary flex items-center gap-2">
            <Edit2 size={16} /> Tahrirlash
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary flex items-center gap-2">
              <Save size={16} /> Saqlash
            </button>
            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl border flex items-center gap-2" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <X size={16} /> Bekor
            </button>
          </div>
        )}
      </div>

      {/* Avatar & Name */}
      <div className="card flex flex-col items-center py-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-xl">
          <span className="text-white font-bold text-3xl">{(currentUser.name?.[0] || 'U').toUpperCase()}{(currentUser.surname?.[0] || '').toUpperCase()}</span>
        </div>
        <h2 className="text-xl font-bold mt-4" style={{ color: 'var(--text-primary)' }}>{currentUser.name} {currentUser.surname}</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{currentUser.email}</p>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium uppercase">{currentUser.plan}</span>
          <span className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 font-medium">⭐ {currentUser.points} ball</span>
        </div>
      </div>

      {/* Profile Fields */}
      <div className="card space-y-4">
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Shaxsiy ma'lumotlar</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <User size={18} style={{ color: 'var(--accent)' }} />
            {editing ? (
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="flex-1 bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} placeholder="Ism" />
            ) : (
              <div><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Ism</p><p className="font-medium" style={{ color: 'var(--text-primary)' }}>{currentUser.name || '—'}</p></div>
            )}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <User size={18} style={{ color: 'var(--accent)' }} />
            {editing ? (
              <input type="text" value={form.surname} onChange={e => setForm({...form, surname: e.target.value})}
                className="flex-1 bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} placeholder="Familya" />
            ) : (
              <div><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Familya</p><p className="font-medium" style={{ color: 'var(--text-primary)' }}>{currentUser.surname || '—'}</p></div>
            )}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <Mail size={18} style={{ color: 'var(--accent)' }} />
            {editing ? (
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="flex-1 bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} placeholder="Email" />
            ) : (
              <div><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Email</p><p className="font-medium" style={{ color: 'var(--text-primary)' }}>{currentUser.email || '—'}</p></div>
            )}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <Phone size={18} style={{ color: 'var(--accent)' }} />
            {editing ? (
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="flex-1 bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} placeholder="Telefon" />
            ) : (
              <div><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Telefon</p><p className="font-medium" style={{ color: 'var(--text-primary)' }}>{currentUser.phone || '—'}</p></div>
            )}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <Calendar size={18} style={{ color: 'var(--accent)' }} />
            {editing ? (
              <input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})}
                className="flex-1 bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} placeholder="Yosh" />
            ) : (
              <div><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Yosh</p><p className="font-medium" style={{ color: 'var(--text-primary)' }}>{currentUser.age || '—'}</p></div>
            )}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <MapPin size={18} style={{ color: 'var(--accent)' }} />
            {editing ? (
              <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                className="flex-1 bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} placeholder="Manzil" />
            ) : (
              <div><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Manzil</p><p className="font-medium" style={{ color: 'var(--text-primary)' }}>{currentUser.address || '—'}</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="card space-y-3">
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Akkaunt ma'lumotlari</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Plan</p>
            <p className="font-bold text-sm text-blue-500">{currentUser.plan?.toUpperCase()}</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Ballar</p>
            <p className="font-bold text-sm text-orange-500">{currentUser.points}</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>A'zo bo'lgan</p>
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{currentUser.joinedAt}</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Referral</p>
            <p className="font-bold text-sm text-green-500">{currentUser.referralCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
