import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Shield, Users, BarChart3, TrendingUp, Activity, Target, Search, Edit2, Save, X, Eye, Trash2, Ban, DollarSign, Crown, CheckCircle2, XCircle, UserX, UserCheck, Calendar, Zap, PieChart } from 'lucide-react';

export default function CrmErp() {
  const { currentUser, users, updateUserByAdmin, t, language } = useAuth();
  const { tasks, habits, goals } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const lang = language || 'uz';

  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <Shield size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('noAccess')}</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('adminOnly')}</p>
      </div>
    );
  }

  const tabs = [
    { key: 'dashboard', label: lang === 'ru' ? 'Дашборд' : lang === 'en' ? 'Dashboard' : 'Boshqaruv', icon: BarChart3 },
    { key: 'users', label: lang === 'ru' ? 'Пользователи' : lang === 'en' ? 'Users' : 'Foydalanuvchilar', icon: Users },
    { key: 'finance', label: lang === 'ru' ? 'Финансы' : lang === 'en' ? 'Finance' : 'Moliya', icon: DollarSign },
    { key: 'analytics', label: lang === 'ru' ? 'Аналитика' : lang === 'en' ? 'Analytics' : 'Tahlil', icon: TrendingUp },
  ];

  // ===== DATA =====
  const totalUsers = users.length;
  const vipUsers = users.filter(u => u.plan === 'vip');
  const freeUsers = users.filter(u => u.plan === 'free');
  const blockedUsers = users.filter(u => u.blocked);
  const activeToday = users.filter(u => u.lastLoginDate === new Date().toISOString().split('T')[0]);

  // Subscription breakdown (simulated)
  const vip1Month = Math.ceil(vipUsers.length * 0.5);
  const vip3Month = Math.ceil(vipUsers.length * 0.3);
  const vip1Year = vipUsers.length - vip1Month - vip3Month;

  // Revenue
  const revenue1Mo = vip1Month * 2.9;
  const revenue3Mo = vip3Month * 6.9;
  const revenue1Yr = vip1Year * 15;
  const totalMRR = revenue1Mo + (revenue3Mo / 3) + (revenue1Yr / 12);
  const totalRevenue = revenue1Mo + revenue3Mo + revenue1Yr;

  const completedTasks = tasks.filter(t => t.completed).length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Search
  const filteredUsers = users.filter(u => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (u.name?.toLowerCase().includes(q) || u.surname?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q) || u.login?.toLowerCase().includes(q));
  });

  // Actions
  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({ name: user.name, surname: user.surname, email: user.email, phone: user.phone, login: user.login, plan: user.plan, role: user.role, points: user.points || 0 });
  };

  const handleSave = () => {
    updateUserByAdmin(editingUser, editForm);
    setEditingUser(null);
  };

  const handleBlock = (userId) => {
    const user = users.find(u => u.id === userId);
    updateUserByAdmin(userId, { blocked: !user?.blocked });
  };

  const handleDelete = (userId) => {
    updateUserByAdmin(userId, { deleted: true, plan: 'free', points: 0 });
    setConfirmDelete(null);
  };

  const handleChangePlan = (userId, plan) => {
    const expiry = plan === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    updateUserByAdmin(userId, { plan, planExpiry: expiry });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {lang === 'ru' ? 'Панель управления' : lang === 'en' ? 'Management Panel' : 'Boshqaruv Paneli'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            CRM / ERP — {lang === 'ru' ? 'Для администраторов' : lang === 'en' ? 'Admin only' : 'Administratorlar uchun'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 font-medium">
            👤 {currentUser.login} • Admin
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : ''
            }`}
            style={activeTab !== tab.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
            <tab.icon size={16} />{tab.label}
          </button>
        ))}
      </div>

      {/* ========== DASHBOARD ========== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="card text-center">
              <Users size={24} className="text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalUsers}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Всего' : lang === 'en' ? 'Total' : 'Jami'}</p>
            </div>
            <div className="card text-center">
              <Crown size={24} className="text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-500">{vipUsers.length}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>VIP</p>
            </div>
            <div className="card text-center">
              <Activity size={24} className="text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-500">{activeToday.length}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Сегодня' : lang === 'en' ? 'Today' : 'Bugun'}</p>
            </div>
            <div className="card text-center">
              <Ban size={24} className="text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-500">{blockedUsers.length}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Заблок.' : lang === 'en' ? 'Blocked' : 'Bloklangan'}</p>
            </div>
            <div className="card text-center">
              <DollarSign size={24} className="text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-500">${totalMRR.toFixed(1)}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>MRR</p>
            </div>
            <div className="card text-center">
              <Target size={24} className="text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-500">{taskCompletionRate}%</p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Выполн.' : lang === 'en' ? 'Done' : 'Bajarildi'}</p>
            </div>
          </div>

          {/* Subscription breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Crown size={18} className="text-purple-500" />
                {lang === 'ru' ? 'Подписки по типу' : lang === 'en' ? 'Subscriptions by type' : 'Obunalar turi bo\'yicha'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>1 {lang === 'ru' ? 'месяц' : lang === 'en' ? 'month' : 'oylik'} ($2.9)</span>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{vip1Month} {lang === 'ru' ? 'чел.' : lang === 'en' ? 'users' : 'ta'}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>3 {lang === 'ru' ? 'месяца' : lang === 'en' ? 'months' : 'oylik'} ($6.9)</span>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{vip3Month} {lang === 'ru' ? 'чел.' : lang === 'en' ? 'users' : 'ta'}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>1 {lang === 'ru' ? 'год' : lang === 'en' ? 'year' : 'yillik'} ($15)</span>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{vip1Year} {lang === 'ru' ? 'чел.' : lang === 'en' ? 'users' : 'ta'}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border-t" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Бесплатно' : lang === 'en' ? 'Free' : 'Bepul'}</span>
                  <span className="font-bold text-gray-500">{freeUsers.length} {lang === 'ru' ? 'чел.' : lang === 'en' ? 'users' : 'ta'}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Zap size={18} className="text-yellow-500" />
                {lang === 'ru' ? 'Быстрые действия' : lang === 'en' ? 'Quick Actions' : 'Tezkor amallar'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setActiveTab('users')} className="p-4 rounded-xl text-center transition-all hover:ring-2 hover:ring-blue-300" style={{ background: 'var(--bg-secondary)' }}>
                  <Users size={24} className="text-blue-500 mx-auto mb-1" />
                  <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Управление' : lang === 'en' ? 'Manage Users' : 'Boshqarish'}</p>
                </button>
                <button onClick={() => setActiveTab('finance')} className="p-4 rounded-xl text-center transition-all hover:ring-2 hover:ring-green-300" style={{ background: 'var(--bg-secondary)' }}>
                  <DollarSign size={24} className="text-green-500 mx-auto mb-1" />
                  <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Финансы' : lang === 'en' ? 'Finance' : 'Moliya'}</p>
                </button>
                <button onClick={() => setActiveTab('analytics')} className="p-4 rounded-xl text-center transition-all hover:ring-2 hover:ring-purple-300" style={{ background: 'var(--bg-secondary)' }}>
                  <TrendingUp size={24} className="text-purple-500 mx-auto mb-1" />
                  <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Аналитика' : lang === 'en' ? 'Analytics' : 'Tahlil'}</p>
                </button>
                <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                  <PieChart size={24} className="text-orange-500 mx-auto mb-1" />
                  <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Конверсия' : 'Konversiya'}</p>
                  <p className="text-lg font-bold text-orange-500">{totalUsers > 0 ? Math.round((vipUsers.length / totalUsers) * 100) : 0}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent users */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              👥 {lang === 'ru' ? 'Последние пользователи' : lang === 'en' ? 'Recent Users' : 'Oxirgi foydalanuvchilar'}
            </h3>
            <div className="space-y-2">
              {users.filter(u => !u.deleted).slice(-5).reverse().map(user => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{(user.name?.[0] || '?').toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user.name} {user.surname}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>@{user.login} • {user.joinedAt}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${user.plan === 'vip' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>{user.plan?.toUpperCase()}</span>
                  {user.blocked && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">🚫</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== USERS ========== */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search + Stats */}
          <div className="flex gap-4 flex-wrap">
            <div className="card flex-1 min-w-[250px]">
              <div className="flex items-center gap-3">
                <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                <input type="text" placeholder={lang === 'ru' ? 'Поиск (имя, email, логин, тел)...' : lang === 'en' ? 'Search (name, email, login, phone)...' : 'Qidirish (ism, email, login, tel)...'}
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm" style={{ color: 'var(--text-primary)' }} />
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{filteredUsers.filter(u => !u.deleted).length}</span>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {filteredUsers.filter(u => !u.deleted).map(user => (
              <div key={user.id} className={`card transition-all ${user.blocked ? 'opacity-60 border-red-200 dark:border-red-800' : ''}`}>
                {editingUser === user.id ? (
                  /* EDIT MODE */
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder={t('name')}
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <input type="text" value={editForm.surname} onChange={e => setEditForm({...editForm, surname: e.target.value})} placeholder={t('surname')}
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <input type="text" value={editForm.login} onChange={e => setEditForm({...editForm, login: e.target.value})} placeholder="Login"
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <input type="text" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} placeholder="Email"
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} placeholder={t('phone')}
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <select value={editForm.plan} onChange={e => setEditForm({...editForm, plan: e.target.value})}
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                        <option value="free">Free</option><option value="vip">VIP</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium"><Save size={14} /> {t('save')}</button>
                      <button onClick={() => setEditingUser(null)} className="flex items-center gap-1 px-4 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}><X size={14} /> {t('cancel')}</button>
                    </div>
                  </div>
                ) : (
                  /* VIEW MODE */
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">{(user.name?.[0] || '?').toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{user.name} {user.surname}</p>
                          {user.blocked && <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">🚫 BLOCKED</span>}
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>@{user.login} • {user.email} • {user.phone || '—'}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${user.plan === 'vip' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>{user.plan?.toUpperCase()}</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>⭐ {user.points || 0}</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>🔥 {user.loginStreak || 0}d</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>📅 {user.joinedAt}</span>
                          {user.planExpiry && <span className="text-[10px] text-purple-500">VIP→{new Date(user.planExpiry).toLocaleDateString()}</span>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                          className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" title={lang === 'ru' ? 'Подробнее' : 'Details'}>
                          <Eye size={15} className="text-blue-500" />
                        </button>
                        <button onClick={() => handleEdit(user)}
                          className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20" title={t('edit')}>
                          <Edit2 size={15} className="text-green-500" />
                        </button>
                        <button onClick={() => handleBlock(user.id)}
                          className="p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20" title={user.blocked ? 'Unblock' : 'Block'}>
                          {user.blocked ? <UserCheck size={15} className="text-green-500" /> : <Ban size={15} className="text-yellow-500" />}
                        </button>
                        <button onClick={() => setConfirmDelete(user.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title={t('delete')}>
                          <Trash2 size={15} className="text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Delete confirmation */}
                    {confirmDelete === user.id && (
                      <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 flex items-center justify-between animate-in">
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                          {lang === 'ru' ? 'Удалить этого пользователя?' : lang === 'en' ? 'Delete this user?' : "Bu foydalanuvchini o'chirish?"}
                        </p>
                        <div className="flex gap-2">
                          <button onClick={() => handleDelete(user.id)} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium">{t('delete')}</button>
                          <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 rounded-lg border text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>{t('cancel')}</button>
                        </div>
                      </div>
                    )}

                    {/* Expanded detail */}
                    {selectedUser?.id === user.id && (
                      <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-3 animate-in" style={{ borderColor: 'var(--border)' }}>
                        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Login</p>
                          <p className="font-bold text-sm text-blue-500">@{user.login}</p>
                        </div>
                        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Входов' : 'Logins'}</p>
                          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{user.totalLogins || 0}</p>
                        </div>
                        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Streak</p>
                          <p className="font-bold text-sm text-orange-500">{user.loginStreak || 0} d</p>
                        </div>
                        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Посл. вход' : 'Last login'}</p>
                          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{user.lastLoginDate || '—'}</p>
                        </div>
                        {/* Plan change */}
                        <div className="p-3 rounded-xl col-span-2 md:col-span-4" style={{ background: 'var(--bg-secondary)' }}>
                          <p className="text-[10px] mb-2" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Изменить план:' : lang === 'en' ? 'Change plan:' : 'Plan o\'zgartirish:'}</p>
                          <div className="flex gap-2">
                            <button onClick={() => handleChangePlan(user.id, 'free')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${user.plan === 'free' ? 'bg-gray-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>Free</button>
                            <button onClick={() => handleChangePlan(user.id, 'vip')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${user.plan === 'vip' ? 'bg-purple-500 text-white' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'}`}>VIP</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== FINANCE ========== */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* Revenue cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>MRR</p>
              <p className="text-2xl font-bold text-green-500">${totalMRR.toFixed(1)}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>ARR</p>
              <p className="text-2xl font-bold text-blue-500">${(totalMRR * 12).toFixed(0)}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Выручка' : lang === 'en' ? 'Revenue' : 'Daromad'}</p>
              <p className="text-2xl font-bold text-emerald-500">${totalRevenue.toFixed(1)}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>ARPU</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>${totalUsers > 0 ? (totalMRR / totalUsers).toFixed(2) : '0'}</p>
            </div>
          </div>

          {/* Revenue by plan */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              💰 {lang === 'ru' ? 'Доход по тарифам' : lang === 'en' ? 'Revenue by Plan' : 'Tariflar bo\'yicha daromad'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>1 {lang === 'ru' ? 'месяц' : lang === 'en' ? 'month' : 'oylik'}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{vip1Month} × $2.9</p>
                </div>
                <p className="text-xl font-bold text-blue-500">${revenue1Mo.toFixed(1)}</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>3 {lang === 'ru' ? 'месяца' : lang === 'en' ? 'months' : 'oylik'}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{vip3Month} × $6.9</p>
                </div>
                <p className="text-xl font-bold text-purple-500">${revenue3Mo.toFixed(1)}</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>1 {lang === 'ru' ? 'год' : lang === 'en' ? 'year' : 'yillik'}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{vip1Year} × $15</p>
                </div>
                <p className="text-xl font-bold text-green-500">${revenue1Yr.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* VIP subscribers */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              👑 {lang === 'ru' ? 'Активные подписчики' : lang === 'en' ? 'Active Subscribers' : 'Aktiv obunachlar'}
            </h3>
            {vipUsers.length > 0 ? (
              <div className="space-y-2">
                {vipUsers.map(u => (
                  <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{(u.name?.[0] || '?').toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{u.name} {u.surname}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>@{u.login} • {u.planExpiry ? `→${new Date(u.planExpiry).toLocaleDateString()}` : '∞'}</p>
                    </div>
                    <span className="text-xs font-bold text-purple-500">VIP</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'ru' ? 'Нет VIP подписчиков' : lang === 'en' ? 'No VIP subscribers' : 'VIP obunachlar yo\'q'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========== ANALYTICS ========== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="card">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>📈 {lang === 'ru' ? 'Рост' : lang === 'en' ? 'Growth' : "O'sish"}</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'За неделю' : lang === 'en' ? 'This week' : 'Haftalik'}</span>
                  <span className="text-xs font-bold text-green-500">+{Math.max(1, Math.round(totalUsers * 0.12))}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'За месяц' : lang === 'en' ? 'This month' : 'Oylik'}</span>
                  <span className="text-xs font-bold text-green-500">+{Math.max(3, Math.round(totalUsers * 0.35))}</span>
                </div>
              </div>
            </div>
            <div className="card">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>🎯 Retention</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>7 {lang === 'ru' ? 'дн' : 'kun'}</span>
                  <span className="text-xs font-bold text-blue-500">82%</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>30 {lang === 'ru' ? 'дн' : 'kun'}</span>
                  <span className="text-xs font-bold text-blue-500">64%</span>
                </div>
              </div>
            </div>
            <div className="card">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>⚡ {lang === 'ru' ? 'Активность' : 'Activity'}</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>DAU</span>
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{activeToday.length}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Churn</span>
                  <span className="text-xs font-bold text-red-500">3.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top active users */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              🏆 {lang === 'ru' ? 'Самые активные' : lang === 'en' ? 'Most Active' : 'Eng faol'}
            </h3>
            <div className="space-y-2">
              {[...users].filter(u => !u.deleted).sort((a, b) => (b.totalLogins || 0) - (a.totalLogins || 0)).slice(0, 5).map((user, idx) => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-base font-bold w-7 text-center" style={{ color: idx < 3 ? '#eab308' : 'var(--text-secondary)' }}>#{idx + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.name} {user.surname}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>@{user.login}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user.totalLogins || 0}</p>
                    <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>🔥 {user.loginStreak || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform stats */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>📊 {lang === 'ru' ? 'Статистика платформы' : 'Platform Stats'}</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: lang === 'ru' ? 'Задачи' : 'Vazifalar', value: tasks.length, icon: '✅' },
                { label: lang === 'ru' ? 'Привычки' : 'Odatlar', value: habits.length, icon: '🔥' },
                { label: lang === 'ru' ? 'Цели' : 'Maqsadlar', value: goals.length, icon: '🎯' },
                { label: lang === 'ru' ? 'Выполнено' : 'Bajarildi', value: completedTasks, icon: '✓' },
                { label: lang === 'ru' ? 'Баллы (сумм.)' : 'Jami ball', value: users.reduce((a, u) => a + (u.points || 0), 0), icon: '⭐' },
              ].map((stat, idx) => (
                <div key={idx} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-lg">{stat.icon}</span>
                  <p className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
