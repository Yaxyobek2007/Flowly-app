import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Shield, Star, Key, AtSign, Camera } from 'lucide-react';

export default function Profile() {
  const { currentUser, updateProfile, t, language, changeLogin, canChangeLogin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showLoginChange, setShowLoginChange] = useState(false);
  const [newLogin, setNewLogin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    surname: currentUser?.surname || '',
    age: currentUser?.age || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    email: currentUser?.email || '',
    login: currentUser?.login || '',
  });

  const lang = language || 'uz';

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateProfile({ avatar: ev.target.result });
    };
    reader.readAsDataURL(file);
  };

  if (!currentUser) return null;

  const fields = [
    { key: 'name', icon: User, label: lang === 'ru' ? 'Имя' : lang === 'en' ? 'First Name' : 'Ism', type: 'text' },
    { key: 'surname', icon: User, label: lang === 'ru' ? 'Фамилия' : lang === 'en' ? 'Last Name' : 'Familya', type: 'text' },
    { key: 'login', icon: AtSign, label: 'Login', type: 'text', readonly: true },
    { key: 'email', icon: Mail, label: 'Email', type: 'email' },
    { key: 'phone', icon: Phone, label: lang === 'ru' ? 'Телефон' : lang === 'en' ? 'Phone' : 'Telefon', type: 'tel' },
    { key: 'age', icon: Calendar, label: lang === 'ru' ? 'Возраст' : lang === 'en' ? 'Age' : 'Yosh', type: 'number' },
    { key: 'address', icon: MapPin, label: lang === 'ru' ? 'Адрес' : lang === 'en' ? 'Address' : 'Manzil', type: 'text' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('profileTitle')}</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-primary flex items-center gap-2">
            <Edit2 size={16} /> {t('edit')}
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary flex items-center gap-2">
              <Save size={16} /> {t('save')}
            </button>
            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl border flex items-center gap-2" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <X size={16} /> {t('cancel')}
            </button>
          </div>
        )}
      </div>

      {/* Avatar & Name Card */}
      <div className="card relative overflow-hidden">
        {/* Gradient background effect */}
        <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)' }}></div>
        <div className="relative flex flex-col items-center py-8">
          <div className="relative">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-xl ring-4 ring-white/20" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-xl shadow-purple-500/30 ring-4 ring-white/20">
                <span className="text-white font-bold text-3xl">{(currentUser.name?.[0] || 'U').toUpperCase()}{(currentUser.surname?.[0] || '').toUpperCase()}</span>
              </div>
            )}
            {/* Upload button */}
            <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-600 transition-colors">
              <Camera size={14} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <h2 className="text-xl font-bold mt-4" style={{ color: 'var(--text-primary)' }}>{currentUser.name} {currentUser.surname}</h2>
          <p className="text-sm flex items-center gap-1 mt-1" style={{ color: 'var(--text-secondary)' }}>
            <AtSign size={14} /> {currentUser.login}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 font-medium uppercase flex items-center gap-1">
              <Shield size={12} /> {currentUser.plan}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 font-medium flex items-center gap-1">
              <Star size={12} /> {currentUser.points} {t('points')}
            </span>
          </div>
        </div>
      </div>

      {/* Login Info */}
      <div className="card" style={{ borderColor: 'rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.03)' }}>
        <div className="flex items-center gap-3">
          <Key size={20} className="text-blue-500" />
          <div className="flex-1">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'ru' ? 'Ваш уникальный логин' : lang === 'en' ? 'Your unique login' : 'Sizning loginigiz'}
            </p>
            <p className="font-bold text-lg text-blue-600 dark:text-blue-400">@{currentUser.login}</p>
          </div>
          <button onClick={() => setShowLoginChange(!showLoginChange)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20"
            style={{ border: '1px solid var(--border)', color: 'var(--accent)' }}>
            {lang === 'ru' ? 'Изменить' : lang === 'en' ? 'Change' : "O'zgartirish"}
          </button>
        </div>

        {showLoginChange && (
          <div className="mt-3 pt-3 border-t animate-in space-y-2" style={{ borderColor: 'var(--border)' }}>
            {(() => {
              const { canFree, canWithPoints, daysSinceJoin } = canChangeLogin();
              return (
                <>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {canFree
                      ? (lang === 'ru' ? '✓ Можно изменить бесплатно (прошло 7+ дней)' : lang === 'en' ? '✓ Can change for free (7+ days passed)' : "✓ Bepul o'zgartirish mumkin (7+ kun o'tdi)")
                      : (lang === 'ru' ? `⏳ ${7 - daysSinceJoin} дней до бесплатной смены. Или 100 баллов` : lang === 'en' ? `⏳ ${7 - daysSinceJoin} days until free change. Or 100 points` : `⏳ Bepul o'zgartishga ${7 - daysSinceJoin} kun qoldi. Yoki 100 ball`)
                    }
                  </p>
                  <div className="flex gap-2">
                    <input type="text" placeholder={lang === 'ru' ? 'Новый логин' : lang === 'en' ? 'New login' : 'Yangi login'} value={newLogin}
                      onChange={e => setNewLogin(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    <button onClick={() => {
                      const result = changeLogin(newLogin);
                      if (result.success) { setLoginSuccess(true); setLoginError(''); setShowLoginChange(false); setNewLogin(''); }
                      else setLoginError(result.error);
                    }} disabled={!newLogin || newLogin.length < 3}
                      className="btn-primary text-sm px-4 disabled:opacity-50">{t('save')}</button>
                  </div>
                  {loginError && <p className="text-xs text-red-500">{loginError}</p>}
                </>
              );
            })()}
          </div>
        )}

        <p className="text-[10px] mt-2" style={{ color: 'var(--text-secondary)' }}>
          {lang === 'ru' ? '⚠️ Этот логин уникален. Другой пользователь не может его использовать.' : lang === 'en' ? '⚠️ This login is unique. No other user can use it.' : "⚠️ Bu login faqat sizniki. Boshqa foydalanuvchi bu logindan foydalana olmaydi."}
        </p>
      </div>

      {/* Profile Fields */}
      <div className="card space-y-4">
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('personalInfo')}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(field => (
            <div key={field.key} className={`relative p-3 rounded-xl transition-all ${editing && !field.readonly ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}
              style={{ background: 'var(--bg-secondary)' }}>
              {/* Edit indicator */}
              {editing && !field.readonly && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
              )}
              <div className="flex items-center gap-3">
                <field.icon size={18} style={{ color: 'var(--accent)' }} />
                {editing && !field.readonly ? (
                  <div className="flex-1">
                    <label className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>{field.label}</label>
                    <input type={field.type} value={form[field.key]}
                      onChange={e => setForm({...form, [field.key]: e.target.value})}
                      className="w-full bg-transparent outline-none font-medium mt-0.5"
                      style={{ color: 'var(--text-primary)' }} placeholder={field.label} />
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{field.label}</p>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{currentUser[field.key] || '—'}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Stats */}
      <div className="card space-y-3">
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('accountInfo')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t('plan')}</p>
            <p className="font-bold text-sm text-purple-500">{currentUser.plan?.toUpperCase()}</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t('points')}</p>
            <p className="font-bold text-sm text-orange-500">{currentUser.points}</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t('memberSince')}</p>
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{currentUser.joinedAt}</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>🔥 Streak</p>
            <p className="font-bold text-sm text-orange-500">{currentUser.loginStreak || 0} {lang === 'ru' ? 'дн' : lang === 'en' ? 'days' : 'kun'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
